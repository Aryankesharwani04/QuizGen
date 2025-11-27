"""
Django settings for quizgen project.

Database Configuration:
- Supports both SQLite (default) and MySQL (production)
- Set USE_MYSQL=True in .env to use MySQL
- MySQL requires: PyMySQL installed and credentials in .env
"""

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
# Supports both SQLite (development) and MySQL (production)
# Set USE_MYSQL=True in .env to enable MySQL
# Required for MySQL: PyMySQL must be installed
# ============================================================================

USE_MYSQL = config('USE_MYSQL', default=False, cast=bool)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

if USE_MYSQL:
    """
    MySQL Configuration for Production
    
    Environment Variables Required:
    - DB_ENGINE: django.db.backends.mysql
    - DB_NAME: quizgen_prod (database name)
    - DB_USER: quizgen_user (MySQL user)
    - DB_PASSWORD: MySQL password
    - DB_HOST: 127.0.0.1 (or your MySQL host)
    - DB_PORT: 3306 (default MySQL port)
    
    Charset: utf8mb4 (full Unicode support including emojis)
    Collation: utf8mb4_unicode_ci (case-insensitive Unicode collation)
    
    Connection pooling and timeouts are configured for production stability.
    CONN_MAX_AGE=600 keeps connections alive for 10 minutes to reduce overhead.
    """
    DATABASES['default'] = {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.mysql'),
        'NAME': config('DB_NAME', default='quizgen_prod'),
        'USER': config('DB_USER', default='quizgen_user'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default='127.0.0.1'),
        'PORT': config('DB_PORT', default='3306'),
        'CHARSET': 'utf8mb4',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'sql_mode': 'STRICT_TRANS_TABLES',
        },
        # Connection pooling
        'CONN_MAX_AGE': 600,  # Keep connections alive for 10 minutes
        'ATOMIC_REQUESTS': False,  # Use transaction per request only when needed
        'AUTOCOMMIT': True,
    }


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

STATIC_ROOT = BASE_DIR / "staticfiles"

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
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8000']

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://localhost:5173',
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

# Email configuration
# For development: Uses console backend (emails print to terminal)
# For production: Configure SMTP (Gmail, SendGrid, etc.)
# 
# Gmail Setup:
# 1. Enable 2FA on Gmail: https://myaccount.google.com/security
# 2. Create App Password: https://myaccount.google.com/apppasswords
# 3. Add to .env:
#    EMAIL_USE_SMTP=True
#    EMAIL_HOST=smtp.gmail.com
#    EMAIL_PORT=587
#    EMAIL_USE_TLS=True
#    EMAIL_HOST_USER=your-email@gmail.com
#    EMAIL_HOST_PASSWORD=your-app-password
#    DEFAULT_FROM_EMAIL=your-email@gmail.com

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
# For MySQL Production Deployment:
# 1. Set DEBUG = False
# 2. Set SESSION_COOKIE_SECURE = True (requires HTTPS)
# 3. Set CSRF_COOKIE_SECURE = True (requires HTTPS)
# 4. Set SECURE_SSL_REDIRECT = True (requires HTTPS setup)
# 5. Set ALLOWED_HOSTS to specific domain(s)
# 6. Set SECRET_KEY to a strong random value
# 7. Ensure MySQL user has strong password
# 8. Configure MySQL for SSL connections
#
# For immediate testing with MySQL:
# 1. Keep SESSION_COOKIE_SECURE = False for localhost testing
# 2. Set USE_MYSQL = True in .env
# 3. Ensure MySQL credentials are set in .env
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
