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


class ResponseFormatter:
    """Helper class to format API responses consistently"""
    
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
    """
    API endpoint for user registration.
    POST: Create a new user account
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle user registration.
        Expected fields: name, email, password, password_confirm
        """
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
            
            return ResponseFormatter.success(
                data={
                    'id': user.id,
                    'email': user.email,
                    'message': 'User registered successfully. Check your email to verify.'
                },
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
    """
    API endpoint for user login.
    POST: Authenticate user and create session
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Handle user login.
        Expected fields: email, password
        Returns session token and user info
        """
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
    """
    API endpoint for user logout.
    POST: Terminate user session
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Handle user logout.
        Terminates the active session.
        """
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
    """
    API endpoint for fetching authenticated user profile.
    GET: Retrieve current authenticated user's profile
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Fetch the current authenticated user's profile.
        """
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
    """
    API endpoint for updating user profile.
    PUT: Update user profile information
    """
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        """
        Update the current authenticated user's profile.
        Expected fields: full_name (optional), avatar (optional), bio (optional), preferences (optional)
        """
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
    """
    API endpoint to check if user is authenticated.
    GET: Check authentication status
    """
    permission_classes = [AllowAny]

    def get(self, request):
        """
        Check if the current user is authenticated.
        Returns user profile if authenticated, empty data if not.
        Always returns 200 OK with authenticated flag.
        """
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
            # Return 200 OK for unauthenticated users, not 401
            return ResponseFormatter.success(
                data=None,
                message="User is not authenticated",
                status_code=status.HTTP_200_OK
            )


@method_decorator(csrf_exempt, name='dispatch')
class AvatarUploadView(APIView):
    """
    API endpoint for uploading user avatar.
    POST/PUT: Upload/update avatar file
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Upload or update user's avatar.
        Accepts multipart/form-data with 'avatar' field.
        """
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
        """
        Upload or update user's avatar.
        Accepts multipart/form-data with 'avatar_file' field.
        """
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
    """
    API endpoint for user activity/history.
    GET: Return basic activity information like last login, last_active
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Retrieve user activity information.
        """
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
    """
    API endpoint to request password reset.
    POST: Generate and send password reset token
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Request password reset.
        Expected fields: email
        """
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
    """
    API endpoint to confirm password reset with token.
    POST: Set new password using reset token
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Confirm password reset.
        Expected fields: token, password, password_confirm
        """
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
    """
    API endpoint to request email verification.
    POST: Send email verification link
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Request email verification.
        """
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
    """
    API endpoint to verify email with token.
    GET: Confirm email verification token
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        """
        Verify email with token.
        Expected query params: token
        """
        token = request.query_params.get('token')
        
        if not token:
            return ResponseFormatter.error(
                message="Verification token required",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        success, message = verify_email_token(token)
        
        if success:
            return ResponseFormatter.success(
                message=message,
                status_code=status.HTTP_200_OK
            )
        else:
            return ResponseFormatter.error(
                message=message,
                status_code=status.HTTP_400_BAD_REQUEST
            )
