from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .utils import generate_unique_quiz_id, append_quiz_to_csv
from .gemini_utils import generate_quiz_questions
from .models import Quiz, Question
from django.db import transaction
from django.contrib.auth.models import User
from auth_app.models import UserProfile
from auth_app.xp_utils import calculate_level
import logging

logger = logging.getLogger(__name__)


class GetLeaderboardView(APIView):
    """
    Get global leaderboard ranked by XP score.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            # Get limit parameter (default 10, max 100)
            limit = min(int(request.GET.get('limit', 10)), 100)
            
            # Get all users with profiles, ordered by XP
            users_with_xp = []
            all_users = User.objects.select_related('profile').all()
            
            for user in all_users:
                try:
                    profile = user.profile
                    xp_score = profile.xp_score or 0
                    level = calculate_level(xp_score)
                    
                    users_with_xp.append({
                        'user_id': user.id,
                        'username': user.username,
                        'full_name': user.get_full_name() or user.username,
                        'xp_score': xp_score,
                        'level': level,
                        'avatar': profile.avatar_file if hasattr(profile, 'avatar_file') and profile.avatar_file else None
                    })
                except UserProfile.DoesNotExist:
                    # Skip users without profiles
                    continue
            
            # Sort by XP score descending
            users_with_xp.sort(key=lambda x: x['xp_score'], reverse=True)
            
            # Add ranks
            for idx, user_data in enumerate(users_with_xp, start=1):
                user_data['rank'] = idx
            
            # Get current user's rank if authenticated
            current_user_rank = None
            if request.user.is_authenticated:
                for user_data in users_with_xp:
                    if user_data['user_id'] == request.user.id:
                        current_user_rank = user_data['rank']
                        break
            
            # Return top N users
            top_users = users_with_xp[:limit]
            
            return Response({
                'success': True,
                'data': {
                    'leaderboard': top_users,
                    'total_users': len(users_with_xp),
                    'current_user_rank': current_user_rank
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching leaderboard: {str(e)}")
            return Response(
                {'error': 'Failed to fetch leaderboard', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
