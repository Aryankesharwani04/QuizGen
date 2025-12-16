from django.urls import path
from .views import (
    CreateQuizView, 
    QuizListView, 
    QuizQuestionsView,
    GetQuizzesByCategoryView,
    CountQuizzesByCategoryView,
    GetQuizQuestionsByIdView,
)

urlpatterns = [
    path('create/', CreateQuizView.as_view(), name='create-quiz'),
    path('list/', QuizListView.as_view(), name='quiz-list'),
    path('<str:quiz_id>/questions/', QuizQuestionsView.as_view(), name='quiz-questions'),
    
    # New APIs for fetching from CSV
    path('by-category/', GetQuizzesByCategoryView.as_view(), name='quizzes-by-category'),
    path('count-by-category/', CountQuizzesByCategoryView.as_view(), name='count-quizzes-by-category'),
    path('csv/<str:quiz_id>/questions/', GetQuizQuestionsByIdView.as_view(), name='csv-quiz-questions'),
]

