from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.conf import settings
from auth_app.models import UserProfile, PasswordReset
from auth_app.serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserDetailSerializer,
    ProfileUpdateSerializer,
    AvatarUploadSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    EmailVerificationSerializer,
)
from auth_app.utils import (
    generate_password_reset_token,
    generate_email_verification_token,
    verify_email_token,
    check_rate_limit,
    record_login_attempt,
    sanitize_profile_data,
    get_client_ip,
    send_password_reset_email,
    send_email_verification,
)
import json
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token


class ResponseFormatter:    
    @staticmethod
    def success(data=None, message="Success", status_code=200):
        return Response({
            'success': True,
            'message': message,
            'data': data
        }, status=status_code)

    @staticmethod
    def error(message="Error", errors=None, status_code=400):
        return Response({
            'success': False,
            'message': message,
            'errors': errors or {}
        }, status=status_code)


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Send verification email
            try:
                profile = user.profile
                token = generate_email_verification_token(profile)
                send_email_verification(user, token, request)
            except Exception as e:
                print(f"Failed to send verification email: {str(e)}")
            
            # Log the user in
            login(request, user)
            
            # Create or get profile (should be created by signal, but good to be safe)
            try:
                profile = user.profile
                # Initialize preferences if empty
                if not profile.preferences:
                    profile.preferences = {}
                    profile.save(update_fields=['preferences'])
            except UserProfile.DoesNotExist:
                profile = UserProfile.objects.create(user=user, preferences={})

            # Serialize profile data for frontend
            profile_serializer = UserProfileSerializer(profile, context={'request': request})

            return ResponseFormatter.success(
                data=profile_serializer.data,
                message="Registration successful",
                status_code=status.HTTP_201_CREATED
            )
        
        return ResponseFormatter.error(
            message="Registration failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Get client IP for rate limiting
        client_ip = get_client_ip(request)
        email = request.data.get('email', '')
        
        # Check rate limit
        auth_settings = getattr(settings, 'AUTH_SETTINGS', {})
        limit_attempts = auth_settings.get('LOGIN_ATTEMPT_LIMIT', 5)
        limit_window = auth_settings.get('LOGIN_ATTEMPT_WINDOW', 15)
        
        is_limited, attempts_remaining, retry_after = check_rate_limit(
            client_ip, 
            limit_type='login',
            attempts=limit_attempts,
            window_minutes=limit_window
        )
        
        if is_limited:
            return ResponseFormatter.error(
                message="Too many login attempts. Please try again later.",
                errors={'retry_after': retry_after},
                status_code=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Record successful login
            record_login_attempt(client_ip, email, success=True)
            
            # Update last_login
            try:
                profile = user.profile
                profile.last_login = timezone.now()
                profile.save(update_fields=['last_login'])
            except UserProfile.DoesNotExist:
                profile = UserProfile.objects.create(user=user)
            
            login(request, user)
            profile_serializer = UserProfileSerializer(profile, context={'request': request})
            
            return ResponseFormatter.success(
                data=profile_serializer.data,
                message="Login successful",
                status_code=status.HTTP_200_OK
            )
        
        # Record failed login
        record_login_attempt(client_ip, email, success=False)
        
        return ResponseFormatter.error(
            message="Login failed",
            errors=serializer.errors,
            status_code=status.HTTP_401_UNAUTHORIZED
        )


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            logout(request)
            return ResponseFormatter.success(
                message="Logout successful",
                status_code=status.HTTP_200_OK
            )
        except Exception as e:
            return ResponseFormatter.error(
                message="Logout failed",
                errors={'detail': str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile, context={'request': request})
            
            return ResponseFormatter.success(
                data=serializer.data,
                message="Profile retrieved successfully",
                status_code=status.HTTP_200_OK
            )
        except UserProfile.DoesNotExist:
            return ResponseFormatter.error(
                message="User profile not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return ResponseFormatter.error(
                message="Failed to retrieve profile",
                errors={'detail': str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )


@method_decorator(csrf_exempt, name='dispatch')
class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        try:
            profile = request.user.profile
            serializer = ProfileUpdateSerializer(data=request.data, partial=True)
            
            if serializer.is_valid():
                # Sanitize data before saving
                sanitized_data = sanitize_profile_data(serializer.validated_data)
                
                # Update profile fields
                for field, value in sanitized_data.items():
                    if value is not None:
                        setattr(profile, field, value)
                
                profile.save()
                result_serializer = UserProfileSerializer(profile, context={'request': request})
                
                return ResponseFormatter.success(
                    data=result_serializer.data,
                    message="Profile updated successfully",
                    status_code=status.HTTP_200_OK
                )
            
            return ResponseFormatter.error(
                message="Profile update failed",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        except UserProfile.DoesNotExist:
            return ResponseFormatter.error(
                message="User profile not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return ResponseFormatter.error(
                message="Failed to update profile",
                errors={'detail': str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )


class CheckAuthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Check if user is authenticated
        if request.user and request.user.is_authenticated:
            try:
                profile = UserProfile.objects.get(user=request.user)
                serializer = UserProfileSerializer(profile, context={'request': request})
                
                return ResponseFormatter.success(
                    data=serializer.data,
                    message="User is authenticated",
                    status_code=status.HTTP_200_OK
                )
            except UserProfile.DoesNotExist:
                return ResponseFormatter.success(
                    data=None,
                    message="User authenticated but profile not found",
                    status_code=status.HTTP_200_OK
                )
        else:
            # Return 401 for unauthenticated users
            return ResponseFormatter.error(
                message="User is not authenticated",
                status_code=status.HTTP_401_UNAUTHORIZED
            )


@method_decorator(csrf_exempt, name='dispatch')
class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            profile = request.user.profile
            serializer = AvatarUploadSerializer(profile, data=request.FILES, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                # Refresh profile from database to get updated avatar_file
                profile.refresh_from_db()
                result_serializer = UserProfileSerializer(profile, context={'request': request})
                
                return ResponseFormatter.success(
                    data=result_serializer.data,
                    message="Avatar uploaded successfully",
                    status_code=status.HTTP_200_OK
                )
            
            return ResponseFormatter.error(
                message="Avatar upload failed",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        except UserProfile.DoesNotExist:
            return ResponseFormatter.error(
                message="User profile not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return ResponseFormatter.error(
                message="Failed to upload avatar",
                errors={'detail': str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )
    
    def put(self, request):
        try:
            profile = request.user.profile
            serializer = AvatarUploadSerializer(profile, data=request.FILES, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                # Refresh profile from database to get updated avatar_file
                profile.refresh_from_db()
                result_serializer = UserProfileSerializer(profile, context={'request': request})
                
                return ResponseFormatter.success(
                    data=result_serializer.data,
                    message="Avatar uploaded successfully",
                    status_code=status.HTTP_200_OK
                )
            
            return ResponseFormatter.error(
                message="Avatar upload failed",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        except UserProfile.DoesNotExist:
            return ResponseFormatter.error(
                message="User profile not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return ResponseFormatter.error(
                message="Failed to upload avatar",
                errors={'detail': str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )


class ProfileHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            profile = request.user.profile
            data = {
                'last_login': profile.last_login,
                'last_active': profile.last_active,
                'created_at': profile.created_at,
                'email_verified': profile.email_verified,
                'is_active': profile.is_active,
                'session_valid': profile.is_session_valid(),
            }
            
            return ResponseFormatter.success(
                data=data,
                message="Activity history retrieved successfully",
                status_code=status.HTTP_200_OK
            )
        except UserProfile.DoesNotExist:
            return ResponseFormatter.error(
                message="User profile not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return ResponseFormatter.error(
                message="Failed to retrieve activity history",
                errors={'detail': str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )


@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        client_ip = get_client_ip(request)
        
        # Check rate limit
        auth_settings = getattr(settings, 'AUTH_SETTINGS', {})
        limit_attempts = auth_settings.get('PASSWORD_RESET_LIMIT', 3)
        limit_window = auth_settings.get('PASSWORD_RESET_WINDOW', 60)
        
        is_limited, attempts_remaining, retry_after = check_rate_limit(
            client_ip,
            limit_type='reset',
            attempts=limit_attempts,
            window_minutes=limit_window
        )
        
        if is_limited:
            return ResponseFormatter.error(
                message="Too many password reset requests. Please try again later.",
                errors={'retry_after': retry_after},
                status_code=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                token = generate_password_reset_token(user)
                
                # Send email with reset token
                email_sent, email_message = send_password_reset_email(user, token, request)
                
                if email_sent:
                    return ResponseFormatter.success(
                        data={
                            'email': email,
                            'message': 'Password reset link sent to your email'
                        },
                        message="Password reset email sent successfully",
                        status_code=status.HTTP_200_OK
                    )
                else:
                    # Email failed but don't reveal the error to user
                    print(f"Email send error: {email_message}")
                    return ResponseFormatter.success(
                        message="If this email exists, password reset link will be sent",
                        status_code=status.HTTP_200_OK
                    )
            except User.DoesNotExist:
                # Don't reveal if email exists
                return ResponseFormatter.success(
                    message="If this email exists, password reset link will be sent",
                    status_code=status.HTTP_200_OK
                )
        
        return ResponseFormatter.error(
            message="Password reset request failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid():
            reset = serializer.validated_data['reset']
            new_password = serializer.validated_data['password']
            
            # Update password
            user = reset.user
            user.set_password(new_password)
            user.save()
            
            # Mark token as used
            reset.is_used = True
            reset.used_at = timezone.now()
            reset.save()
            
            return ResponseFormatter.success(
                message="Password reset successfully",
                status_code=status.HTTP_200_OK
            )
        
        return ResponseFormatter.error(
            message="Password reset failed",
            errors=serializer.errors,
            status_code=status.HTTP_400_BAD_REQUEST
        )


@method_decorator(csrf_exempt, name='dispatch')
class SendEmailVerificationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            profile = request.user.profile
            
            if profile.email_verified:
                return ResponseFormatter.success(
                    message="Email already verified",
                    status_code=status.HTTP_200_OK
                )
            
            token = generate_email_verification_token(profile)
            
            # Send verification email
            email_sent, email_message = send_email_verification(request.user, token, request)
            
            if email_sent:
                return ResponseFormatter.success(
                    data={
                        'email': request.user.email,
                        'message': 'Verification link sent to your email'
                    },
                    message="Verification email sent successfully",
                    status_code=status.HTTP_200_OK
                )
            else:
                print(f"Email send error: {email_message}")
                return ResponseFormatter.error(
                    message="Failed to send verification email. Please try again.",
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        except UserProfile.DoesNotExist:
            return ResponseFormatter.error(
                message="User profile not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return ResponseFormatter.error(
                message="Failed to send verification email",
                errors={'detail': str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )


@method_decorator(csrf_exempt, name='dispatch')
class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        token = request.query_params.get('token')
        
        # Debug logging
        print(f"[EMAIL VERIFICATION] Received token: {token[:20] if token else 'None'}...")
        print(f"[EMAIL VERIFICATION] Full query params: {dict(request.query_params)}")
        
        if not token:
            print("[EMAIL VERIFICATION] Error: No token provided")
            return ResponseFormatter.error(
                message="Verification token required",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        success, message = verify_email_token(token)
        
        print(f"[EMAIL VERIFICATION] Result: success={success}, message={message}")
        
        if success:
            return ResponseFormatter.success(
                message=message,
                status_code=status.HTTP_200_OK
            )
        else:
            # Return 400 only for truly invalid/expired tokens, not for already verified
            status_code = status.HTTP_400_BAD_REQUEST if "already verified" not in message.lower() else status.HTTP_200_OK
            return ResponseFormatter.error(
                message=message,
                status_code=status_code
            )


@method_decorator(csrf_exempt, name='dispatch')
class GoogleSignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')

        if not token:
            return ResponseFormatter.error(
                message="Google token is required",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the token with Google
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # Extract user info
            google_id = idinfo['sub']
            email = idinfo['email']
            full_name = idinfo.get('name', '')
            avatar = idinfo.get('picture', '')
            email_verified = idinfo.get('email_verified', False)

            # Check if user exists
            try:
                user = User.objects.get(email=email)
                profile = user.profile
            except User.DoesNotExist:
                # Create new user
                username = email.split('@')[0]
                # Ensure username is unique
                base_username = username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}_{counter}"
                    counter += 1

                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=full_name.split(' ')[0] if full_name else '',
                    last_name=' '.join(full_name.split(' ')[1:]) if full_name and len(full_name.split(' ')) > 1 else ''
                )

                # Create profile
                profile = UserProfile.objects.create(
                    user=user,
                    full_name=full_name,
                    avatar=avatar,
                    google_id=google_id,
                    email_verified=email_verified
                )

            # Update profile with latest Google info
            profile.google_id = google_id
            profile.avatar = avatar
            profile.email_verified = email_verified
            if not profile.full_name and full_name:
                profile.full_name = full_name
            profile.last_login = timezone.now()
            profile.save()

            # Log the user in
            login(request, user)

            # Serialize profile data
            serializer = UserProfileSerializer(profile, context={'request': request})

            return ResponseFormatter.success(
                data=serializer.data,
                message="Google sign-in successful",
                status_code=status.HTTP_200_OK
            )

        except ValueError as e:
            return ResponseFormatter.error(
                message="Invalid Google token",
                errors={'detail': str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Google sign-in error: {str(e)}")
            return ResponseFormatter.error(
                message="Google sign-in failed",
                errors={'detail': str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )
