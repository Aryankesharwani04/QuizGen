from django.urls import path
from .views import (
    CreateQuizView, 
    QuizListView, 
    QuizQuestionsView,
)

urlpatterns = [
    path('create/', CreateQuizView.as_view(), name='create-quiz'),
    path('list/', QuizListView.as_view(), name='quiz-list'),
    path('<str:quiz_id>/questions/', QuizQuestionsView.as_view(), name='quiz-questions'),
]
