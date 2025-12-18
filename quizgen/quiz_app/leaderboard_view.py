from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from auth_app.models import UserProfile
from auth_app.xp_utils import calculate_level, get_weekly_xp_for_user
import logging

logger = logging.getLogger(__name__)


class GetGlobalLeaderboardView(APIView):
    """
    Get comprehensive global leaderboard with multiple rankings.
    Provides:
    - Total registered users count
    - Overall top 100 players (ranked by total XP)
    - Weekly top 10 players (ranked by XP earned in last 7 days)
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            # Get all users with profiles
            all_users = User.objects.select_related('profile').filter(
                profile__isnull=False
            )
            
            total_users = all_users.count()
            
            # ===== OVERALL TOP 100 =====
            # Get users sorted by total XP
            overall_rankings = []
            
            for user in all_users:
                try:
                    profile = user.profile
                    xp_score = profile.xp_score or 0
                    level = calculate_level(xp_score)
                    full_name = profile.full_name or user.username
                    
                    overall_rankings.append({
                        'user_id': user.id,
                        'username': user.username,
                        'full_name': full_name,
                        'xp_score': xp_score,
                        'level': level,
                        'avatar': profile.avatar_file.url if profile.avatar_file else None
                    })
                except Exception as e:
                    logger.warning(f"Error processing user {user.id}: {str(e)}")
                    continue
            
            # Sort by XP score descending
            overall_rankings.sort(key=lambda x: x['xp_score'], reverse=True)
            
            # Add ranks
            for idx, user_data in enumerate(overall_rankings, start=1):
                user_data['rank'] = idx
            
            # Get top 100
            overall_top_100 = overall_rankings[:100]
            
            # ===== WEEKLY TOP 10 =====
            # Calculate weekly XP for all users who have been active
            weekly_rankings = []
            
            for user in all_users:
                try:
                    weekly_xp, quiz_count = get_weekly_xp_for_user(user, days=7)
                    
                    # Only include users who completed at least one quiz this week
                    if quiz_count > 0:
                        profile = user.profile
                        total_xp = profile.xp_score or 0
                        full_name = profile.full_name or user.username
                        
                        weekly_rankings.append({
                            'user_id': user.id,
                            'username': user.username,
                            'full_name': full_name,
                            'weekly_xp': weekly_xp,
                            'total_xp': total_xp,
                            'quizzes_this_week': quiz_count,
                            'avatar': profile.avatar_file.url if profile.avatar_file else None
                        })
                except Exception as e:
                    logger.warning(f"Error calculating weekly XP for user {user.id}: {str(e)}")
                    continue
            
            # Sort by weekly XP descending
            weekly_rankings.sort(key=lambda x: x['weekly_xp'], reverse=True)
            
            # Add ranks
            for idx, user_data in enumerate(weekly_rankings, start=1):
                user_data['rank'] = idx
            
            # Get top 10
            weekly_top_10 = weekly_rankings[:10]
            
            # ===== CURRENT USER RANKS =====
            current_user_overall_rank = None
            current_user_weekly_rank = None
            
            if request.user.is_authenticated:
                # Find current user's overall rank
                for user_data in overall_rankings:
                    if user_data['user_id'] == request.user.id:
                        current_user_overall_rank = user_data['rank']
                        break
                
                # Find current user's weekly rank
                for user_data in weekly_rankings:
                    if user_data['user_id'] == request.user.id:
                        current_user_weekly_rank = user_data['rank']
                        break
            
            return Response({
                'success': True,
                'data': {
                    'total_users': total_users,
                    'overall_top_100': overall_top_100,
                    'weekly_top_10': weekly_top_10,
                    'current_user_overall_rank': current_user_overall_rank,
                    'current_user_weekly_rank': current_user_weekly_rank
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching global leaderboard: {str(e)}")
            return Response(
                {'error': 'Failed to fetch global leaderboard', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Keep the old view name as an alias for backward compatibility
GetLeaderboardView = GetGlobalLeaderboardView
