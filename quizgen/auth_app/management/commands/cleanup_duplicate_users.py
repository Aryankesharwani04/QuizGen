from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db.models import Count
from auth_app.models import UserProfile


class Command(BaseCommand):
    help = 'Find and remove duplicate users by email, keeping the oldest account'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )
        parser.add_argument(
            '--email',
            type=str,
            help='Clean up duplicates for a specific email only',
        )

    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        specific_email = options.get('email')

        # Find emails with multiple users
        if specific_email:
            duplicates = User.objects.filter(email=specific_email)
        else:
            duplicate_emails = (
                User.objects
                .values('email')
                .annotate(count=Count('email'))
                .filter(count__gt=1)
                .order_by('-count')
            )
            
            if not duplicate_emails.exists():
                self.stdout.write(self.style.SUCCESS('No duplicate users found!'))
                return

            self.stdout.write(
                self.style.WARNING(
                    f'Found {len(duplicate_emails)} email(s) with duplicate accounts'
                )
            )

        # Process each duplicate email
        if specific_email:
            emails_to_process = [specific_email]
        else:
            emails_to_process = [item['email'] for item in duplicate_emails]

        total_deleted = 0
        
        for email in emails_to_process:
            users = User.objects.filter(email=email).order_by('date_joined')
            
            if users.count() > 1:
                self.stdout.write(f'\nEmail: {email}')
                self.stdout.write(f'  Found {users.count()} accounts:')
                
                # Keep the oldest, delete the rest
                keeper = users.first()
                to_delete = users.exclude(id=keeper.id)
                
                for user in to_delete:
                    self.stdout.write(
                        f'    - ID: {user.id}, Username: {user.username}, '
                        f'Joined: {user.date_joined}, '
                        f'Last Login: {user.last_login}'
                    )
                
                self.stdout.write(
                    self.style.SUCCESS(f'  ✓ Keeping: ID {keeper.id} (oldest, joined {keeper.date_joined})')
                )
                
                if not dry_run:
                    count = len(to_delete)
                    to_delete.delete()
                    total_deleted += count
                    self.stdout.write(
                        self.style.SUCCESS(f'  ✓ Deleted {count} duplicate account(s)')
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f'  [DRY RUN] Would delete {len(to_delete)} account(s)'
                        )
                    )

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    '\n[DRY RUN] No changes made. Run without --dry-run to actually delete duplicates.'
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'\n✓ Successfully deleted {total_deleted} duplicate account(s)'
                )
            )
