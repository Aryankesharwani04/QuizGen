"""
Django management command to test email configuration and Gmail connection.
Usage: python manage.py test_email
"""

from django.core.mail import send_mail
from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Test email configuration and Gmail SMTP connection'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=== Email Configuration Test ===\n'))
        
        # Display current settings
        self.stdout.write(f'EMAIL_BACKEND: {settings.EMAIL_BACKEND}')
        self.stdout.write(f'EMAIL_HOST: {settings.EMAIL_HOST}')
        self.stdout.write(f'EMAIL_PORT: {settings.EMAIL_PORT}')
        self.stdout.write(f'EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}')
        self.stdout.write(f'EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}')
        self.stdout.write(f'DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}\n')
        
        # Determine if using SMTP or console
        if 'console' in settings.EMAIL_BACKEND:
            self.stdout.write(self.style.WARNING(
                'Using CONSOLE backend - emails will print to terminal, not sent via Gmail'
            ))
            self.stdout.write(self.style.WARNING(
                'To use Gmail SMTP: Set EMAIL_USE_SMTP=True in .env and restart Django\n'
            ))
        elif 'smtp' in settings.EMAIL_BACKEND.lower():
            self.stdout.write(self.style.SUCCESS('Using SMTP backend - attempting to send test email...\n'))
            
            try:
                send_mail(
                    subject='Test Email from Quiz Gen',
                    message='This is a test email to verify Gmail SMTP configuration is working correctly.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
                self.stdout.write(self.style.SUCCESS('✓ Test email sent successfully to Gmail!'))
                self.stdout.write(self.style.SUCCESS(f'✓ Check your inbox at: {settings.EMAIL_HOST_USER}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'✗ Failed to send email: {str(e)}'))
                self.stdout.write(self.style.ERROR('\nPossible issues:'))
                self.stdout.write(self.style.ERROR('1. App Password is incorrect (check for spaces, use without spaces)'))
                self.stdout.write(self.style.ERROR('2. 2-Factor Authentication not enabled on Gmail'))
                self.stdout.write(self.style.ERROR('3. Gmail account security settings blocking less secure apps'))
                self.stdout.write(self.style.ERROR('4. Internet connection issue or firewall blocking SMTP port 587'))
        else:
            self.stdout.write(self.style.WARNING(
                f'Unknown email backend: {settings.EMAIL_BACKEND}'
            ))
