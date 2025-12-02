from django.urls import path
from .views import (
    CreateQuizConfigView, 
    StartQuizView, 
    MockQuizListView, 
    SubmitQuizView, 
    QuizHistoryView,
    DeleteQuizHistoryView
)

urlpatterns = [
    path('create-config/', CreateQuizConfigView.as_view(), name='create-quiz-config'),
    path('start/<str:quiz_id>/', StartQuizView.as_view(), name='start-quiz'),
    path('mock-list/', MockQuizListView.as_view(), name='mock-quiz-list'),
    path('submit/<int:attempt_id>/', SubmitQuizView.as_view(), name='submit-quiz'),
    path('history/', QuizHistoryView.as_view(), name='quiz-history'),
    path('history/delete/', DeleteQuizHistoryView.as_view(), name='delete-quiz-history'),
]
