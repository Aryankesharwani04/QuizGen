from django.urls import path
from auth_app.views import (
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    ProfileUpdateView,
    CheckAuthView,
    AvatarUploadView,
    ProfileHistoryView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    SendEmailVerificationView,
    VerifyEmailView,
    GoogleSignInView,
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check/', CheckAuthView.as_view(), name='check-auth'),
    
    # Profile management
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),
    path('profile/avatar/', AvatarUploadView.as_view(), name='avatar-upload'),
    path('profile/history/', ProfileHistoryView.as_view(), name='profile-history'),
    
    # Password reset
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Email verification
    path('send-verification/', SendEmailVerificationView.as_view(), name='send-verification'),
    path('verify/', VerifyEmailView.as_view(), name='verify-email'),
]
