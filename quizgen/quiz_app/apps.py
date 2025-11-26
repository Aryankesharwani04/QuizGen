from django.apps import AppConfig


class QuizAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'quiz_app'

    def ready(self):
        """
        Import signal handlers when the app is ready.
        This ensures signals are registered and connected.
        """
        import quiz_app.signals  # noqa
