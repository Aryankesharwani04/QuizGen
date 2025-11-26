"""
Custom middleware for authentication handling and session management.
"""

import json
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import decorator_from_middleware
from auth_app.utils import update_last_active, is_session_active, get_client_ip


class CsrfExemptMiddleware(MiddlewareMixin):
    """
    Middleware to exempt API endpoints from CSRF protection.
    Marks /api/ requests as CSRF-exempt.
    """
    def process_request(self, request):
        if request.path.startswith('/api/'):
            request.csrf_processing_done = True
        return None


class SessionHardeningMiddleware(MiddlewareMixin):
    """
    Middleware to enforce session validity and update activity timestamps.
    Rejects requests from inactive or revoked sessions.
    """
    
    # Endpoints that don't require session validation
    EXEMPT_PATHS = [
        '/api/auth/login/',
        '/api/auth/register/',
        '/api/auth/password-reset/',
        '/api/auth/password-reset/confirm/',
        '/api/auth/verify/',
        '/api/auth/send-verification/',
        '/admin/',
    ]
    
    def process_request(self, request):
        """Check session validity for authenticated requests"""
        # Skip exempt paths
        if any(request.path.startswith(path) for path in self.EXEMPT_PATHS):
            return None
        
        # Skip non-API requests
        if not request.path.startswith('/api/'):
            return None
        
        # Check authentication
        if request.user and request.user.is_authenticated:
            # Verify session is still active
            if not is_session_active(request.user):
                return JsonResponse({
                    'success': False,
                    'message': 'Session expired or user account inactive',
                    'errors': {'detail': 'Please login again'}
                }, status=401)
            
            # Update last activity
            update_last_active(request.user)
        
        return None


class AuthenticationMiddleware(MiddlewareMixin):
    """
    Custom middleware to handle authentication checks and clean request/response flow.
    Adds user context to requests and ensures proper API response headers.
    """
    
    def process_request(self, request):
        """
        Process incoming request.
        Add user information to request context if authenticated.
        """
        # Check if user exists and is authenticated
        if hasattr(request, 'user') and request.user and hasattr(request.user, 'is_authenticated'):
            if request.user.is_authenticated:
                request.user_id = request.user.id
                request.user_email = request.user.email
                # Store client IP for logging
                request.client_ip = get_client_ip(request)
        
        return None

    def process_response(self, request, response):
        """
        Process outgoing response.
        Ensures proper headers for API responses.
        """
        if 'application/json' in response.get('Content-Type', ''):
            response['X-Requested-With'] = 'XMLHttpRequest'
            response['X-Content-Type-Options'] = 'nosniff'
        
        return response


class RequestValidationMiddleware(MiddlewareMixin):
    """
    Middleware to validate incoming requests.
    Validates JSON content for POST/PUT/PATCH requests.
    """
    
    def process_request(self, request):
        """
        Validate request format and content.
        """
        if request.method in ['POST', 'PUT', 'PATCH']:
            content_type = request.META.get('CONTENT_TYPE', '')
            
            # Skip multipart requests (file uploads)
            if 'multipart/form-data' in content_type:
                return None
            
            if 'application/json' in content_type and request.body:
                try:
                    json.loads(request.body)
                except json.JSONDecodeError:
                    return JsonResponse({
                        'success': False,
                        'message': 'Invalid JSON in request body',
                        'errors': {}
                    }, status=400)
        
        return None
