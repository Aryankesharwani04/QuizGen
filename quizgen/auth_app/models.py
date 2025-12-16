from django.db import models
from django.contrib.auth.models import User
from django.core.validators import EmailValidator
from django.utils import timezone
import uuid

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255, blank=True, help_text="User's full name")
    avatar = models.URLField(blank=True, null=True, help_text="URL to user's avatar image")
    avatar_file = models.FileField(upload_to='avatars/', blank=True, null=True, help_text="Uploaded avatar file")
    bio = models.TextField(blank=True, null=True, help_text="User biography")
    preferences = models.JSONField(default=dict, blank=True, help_text="Store user preferences as JSON")
    
    # Activity tracking
    last_active = models.DateTimeField(auto_now=True, help_text="Last activity timestamp")
    last_login = models.DateTimeField(blank=True, null=True, help_text="Last login timestamp")
    
    # Email verification
    email_verified = models.BooleanField(default=False, help_text="Email verification status")
    email_verification_token = models.CharField(max_length=255, blank=True, null=True)
    email_verification_sent_at = models.DateTimeField(blank=True, null=True)
    
    # Daily Streak Tracking
    current_streak = models.IntegerField(default=0, help_text="Current consecutive days streak")
    longest_streak = models.IntegerField(default=0, help_text="Longest streak ever achieved")
    last_activity_date = models.DateField(blank=True, null=True, help_text="Last quiz activity date (4am cutoff)")
    
    # XP System
    xp_score = models.IntegerField(default=0, help_text="Total experience points earned")
    
    # Quiz Creation Tracking
    created_quiz_ids = models.JSONField(default=list, blank=True, help_text="List of quiz IDs created by this user")
    
    # Account security
    is_active = models.BooleanField(default=True, help_text="Whether account is active")
    session_timeout_minutes = models.IntegerField(default=30, help_text="Session timeout in minutes")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
        indexes = [
            models.Index(fields=['user', 'email_verified']),
            models.Index(fields=['last_active']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.full_name or self.user.username} - {self.user.email}"
    
    def is_session_valid(self):
        if not self.is_active:
            return False
        
        time_since_active = timezone.now() - self.last_active
        timeout_delta = timezone.timedelta(minutes=self.session_timeout_minutes)
        
        return time_since_active < timeout_delta


class PasswordReset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_resets')
    token = models.CharField(max_length=255, unique=True, help_text="Unique reset token")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(help_text="Token expiration time")
    is_used = models.BooleanField(default=False, help_text="Whether token has been used")
    used_at = models.DateTimeField(blank=True, null=True, help_text="When token was used")
    
    class Meta:
        verbose_name = 'Password Reset'
        verbose_name_plural = 'Password Resets'
        indexes = [
            models.Index(fields=['token', 'is_used']),
            models.Index(fields=['user', 'expires_at']),
        ]

    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at
    
    def __str__(self):
        return f"Reset for {self.user.email} - {'Valid' if self.is_valid() else 'Expired/Used'}"


class LoginAttempt(models.Model):
    ip_address = models.GenericIPAddressField(help_text="IP address of login attempt")
    email = models.EmailField(help_text="Email attempting to login")
    success = models.BooleanField(default=False, help_text="Whether login was successful")
    attempted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Login Attempt'
        verbose_name_plural = 'Login Attempts'
        indexes = [
            models.Index(fields=['ip_address', 'attempted_at']),
            models.Index(fields=['email', 'attempted_at']),
        ]
    
    def __str__(self):
        return f"{self.email} from {self.ip_address} at {self.attempted_at}"
