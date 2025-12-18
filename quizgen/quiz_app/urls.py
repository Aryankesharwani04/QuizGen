from django.urls import path
from .views import (
    CreateQuizView, 
    QuizListView, 
    QuizQuestionsView,
    GetQuizzesByCategoryView,
    CountQuizzesByCategoryView,
    GetQuizQuestionsByIdView,
    GetQuizDetailView,
)
from .leaderboard_view import GetGlobalLeaderboardView

urlpatterns = [
    path('create/', CreateQuizView.as_view(), name='create-quiz'),
    path('list/', QuizListView.as_view(), name='quiz-list'),
    path('<str:quiz_id>/questions/', QuizQuestionsView.as_view(), name='quiz-questions'),
    
    # New APIs for fetching from CSV
    path('by-category/', GetQuizzesByCategoryView.as_view(), name='quizzes-by-category'),
    path('count-by-category/', CountQuizzesByCategoryView.as_view(), name='count-quizzes-by-category'),
    path('csv/<str:quiz_id>/questions/', GetQuizQuestionsByIdView.as_view(), name='csv-quiz-questions'),
    path('detail/<str:quiz_id>/', GetQuizDetailView.as_view(), name='quiz-detail'),
    
    # Leaderboard endpoints
    path('leaderboard/global/', GetGlobalLeaderboardView.as_view(), name='global-leaderboard'),
    path('leaderboard/', GetGlobalLeaderboardView.as_view(), name='leaderboard'),  # Backward compatibility
]

