"""
Signals for auth_app.
Automatically create UserProfile when a new User is created.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from auth_app.models import UserProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal handler to create a UserProfile instance when a new User is created.
    This ensures every user has an associated profile.
    """
    if created:
        if not UserProfile.objects.filter(user=instance).exists():
            UserProfile.objects.create(
                user=instance,
                full_name=instance.get_full_name() or instance.username,
                preferences={}
            )


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal handler to save UserProfile when User is saved.
    """
    if hasattr(instance, 'profile'):
        instance.profile.save()
