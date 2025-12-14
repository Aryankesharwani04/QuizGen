from pathlib import Path
import os
from decouple import config, Csv

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-your-secret-key-change-in-production')

DEBUG = config('DEBUG', default=True, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    'rest_framework',
    'corsheaders',
    
    'auth_app',
    'quiz_app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'auth_app.middleware.CsrfExemptMiddleware',  # Exempt /api/ paths from CSRF
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'auth_app.middleware.SessionHardeningMiddleware',  # Enforce session validity
    'auth_app.middleware.AuthenticationMiddleware',  # Add user context
    'auth_app.middleware.RequestValidationMiddleware',  # Validate requests
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================
# Supports both SQLite (development) and PostgreSQL (production)
# Set DATABASE_URL environment variable to use PostgreSQL
# For Render deployment: DATABASE_URL is automatically provided
# ============================================================================

import dj_database_url

# Default to SQLite for local development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Override with PostgreSQL if DATABASE_URL is set
DATABASE_URL = config('DATABASE_URL', default=None)

if DATABASE_URL:
    """
    PostgreSQL Configuration for Production
    
    Environment Variable Required:
    - DATABASE_URL: Full PostgreSQL connection string
      Format: postgresql://user:password@host:port/database
      
    Example:
      DATABASE_URL=postgresql://quizgen_user:password@localhost:5432/quizgen_prod
    
    For Render deployment:
      DATABASE_URL is automatically set from the linked PostgreSQL database.
      Use the "External Database URL" from Render PostgreSQL dashboard.
    
    Connection pooling is configured for production stability.
    CONN_MAX_AGE=600 keeps connections alive for 10 minutes to reduce overhead.
    """
    DATABASES['default'] = dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=600,
        conn_health_checks=True,
    )


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = '/static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Disable CSRF for REST API endpoints
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8000', 'http://localhost:8081']

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://localhost:5173',
    'http://localhost:8081',
    'http://localhost:8080'
]

SESSION_COOKIE_AGE = 1209600
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'

# Media files (for avatar uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Authentication settings
AUTH_SETTINGS = {
    'SESSION_TIMEOUT_MINUTES': 30,  # Default session timeout
    'PASSWORD_RESET_HOURS': 24,  # Token expiration for password reset
    'EMAIL_VERIFICATION_HOURS': 48,  # Token expiration for email verification
    'LOGIN_ATTEMPT_LIMIT': 5,  # Max login attempts in window
    'LOGIN_ATTEMPT_WINDOW': 15,  # Time window in minutes
    'PASSWORD_RESET_LIMIT': 3,  # Max reset requests in window
    'PASSWORD_RESET_WINDOW': 60,  # Time window in minutes
}

# Google OAuth settings
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='your-google-client-id')

USE_EMAIL_SMTP = config('EMAIL_USE_SMTP', default=False, cast=bool)

if USE_EMAIL_SMTP:
    # Production: Gmail SMTP configuration
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
    EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
    EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
    EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
    EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
else:
    # Development: Console backend (emails print to terminal)
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@quizgen.local')

# ============================================================================
# PRODUCTION SECURITY SETTINGS
# ============================================================================
# These settings are recommended for production use:
#
# For PostgreSQL Production Deployment (Render):
# 1. Set DEBUG = False
# 2. Set SESSION_COOKIE_SECURE = True (requires HTTPS)
# 3. Set CSRF_COOKIE_SECURE = True (requires HTTPS)
# 4. Set SECURE_SSL_REDIRECT = True (requires HTTPS setup)
# 5. Set ALLOWED_HOSTS to specific domain(s)
# 6. Set SECRET_KEY to a strong random value
# 7. Set DATABASE_URL from Render PostgreSQL (automatically provided)
# 8. Add your Render deployment URL to CORS_ALLOWED_ORIGINS and CSRF_TRUSTED_ORIGINS
#
# For immediate testing with PostgreSQL locally:
# 1. Install PostgreSQL locally
# 2. Create a database: createdb quizgen_dev
# 3. Set DATABASE_URL in .env:
#    DATABASE_URL=postgresql://username:password@localhost:5432/quizgen_dev
# 4. Run: python manage.py migrate
# 5. Run: python manage.py loaddata backups/data.json
# ============================================================================

if not DEBUG:
    # Production-only settings (uncomment when deploying)
    # SESSION_COOKIE_SECURE = True
    # CSRF_COOKIE_SECURE = True
    # SECURE_SSL_REDIRECT = True
    # SECURE_HSTS_SECONDS = 31536000
    # SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    pass
