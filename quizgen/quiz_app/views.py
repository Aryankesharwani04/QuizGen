from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from django.shortcuts import get_object_or_404
from .models import Quiz, Question, QuizHistory
from .serializers import QuizSerializer, QuizGenerationSerializer, QuizHistorySerializer
from .gemini_utils import generate_quiz_content
import uuid
import random
import string

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Quiz, Question, QuizHistory
from .serializers import QuizSerializer, QuizGenerationSerializer, QuizHistorySerializer
from .gemini_utils import generate_quiz_content
import random
import string

class CreateQuizConfigView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = QuizGenerationSerializer(data=request.data)
        if serializer.is_valid():
            topic = serializer.validated_data['topic']
            difficulty = serializer.validated_data['difficulty']
            num_questions = serializer.validated_data['num_questions']

            # Check if a similar quiz config already exists
            existing_quiz = Quiz.objects.filter(
                topic=topic,
                difficulty_level=difficulty,
                num_questions=num_questions,
                is_mock=False
            ).first()

            if existing_quiz:
                return Response({
                    "quiz_id": existing_quiz.quiz_id,
                    "message": "Existing quiz configuration found",
                    "is_new": False
                }, status=status.HTTP_200_OK)

            # Generate unique 5-digit ID
            while True:
                quiz_id = ''.join(random.choices(string.digits, k=5))
                if not Quiz.objects.filter(quiz_id=quiz_id).exists():
                    break

            # Create Quiz (Config only, no questions yet)
            quiz = Quiz.objects.create(
                quiz_id=quiz_id,
                title=f"{topic} Quiz",
                topic=topic,
                difficulty_level=difficulty,
                num_questions=num_questions,
                duration_minutes=num_questions * 1,  # Assuming 1 min per question
                is_mock=False
            )

            return Response({
                "quiz_id": quiz.quiz_id,
                "message": "Quiz configuration created successfully",
                "is_new": True
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StartQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, quiz_id=quiz_id)
        
        # Check for existing incomplete attempt to resume
        existing_attempt = QuizHistory.objects.filter(
            user=request.user, 
            quiz=quiz, 
            completed_at__isnull=True
        ).first()

        if existing_attempt:
            return Response({
                "attempt_id": existing_attempt.id,
                "quiz_id": quiz.quiz_id,
                "title": quiz.title,
                "duration_minutes": quiz.duration_minutes,
                "questions": existing_attempt.questions
            }, status=status.HTTP_200_OK)
        
        # Generate questions at runtime using Gemini
        # User confirmed questions should only be generated when starting the quiz
        
        generated_data, error_msg = generate_quiz_content(
            quiz.topic, 
            quiz.difficulty_level, 
            quiz.num_questions
        )
        
        if not generated_data:
                return Response(
                {"error": f"Failed to generate questions: {error_msg}"}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
            
        questions_data = generated_data.get('questions', [])
        
        # Assign unique IDs to questions
        for q in questions_data:
            q['id'] = str(uuid.uuid4())

        # Create QuizHistory entry
        history = QuizHistory.objects.create(
            user=request.user,
            quiz=quiz,
            total_questions=len(questions_data),
            questions=questions_data,
            score=0, # Initial score
            started_at=timezone.now()
        )
        
        return Response({
            "attempt_id": history.id,
            "quiz_id": quiz.quiz_id,
            "title": quiz.title,
            "duration_minutes": quiz.duration_minutes,
            "questions": questions_data
        }, status=status.HTTP_201_CREATED)

class SubmitQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, attempt_id):
        history = get_object_or_404(QuizHistory, id=attempt_id, user=request.user)
        
        if history.completed_at:
             return Response(
                {"error": "This quiz attempt has already been submitted."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        score = request.data.get('score')
        user_answers = request.data.get('user_answers', [])

        if score is None:
            return Response(
                {"error": "Score is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        history.score = score
        history.user_answers = user_answers
        history.completed_at = timezone.now()
        history.save()

        return Response({"message": "Quiz result saved successfully"}, status=status.HTTP_200_OK)

class MockQuizListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Quiz.objects.filter(is_mock=True)


class QuizHistoryView(generics.ListAPIView):
    serializer_class = QuizHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizHistory.objects.filter(user=self.request.user)

class DeleteQuizHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        delete_all = request.data.get('delete_all', False)
        ids = request.data.get('ids', [])

        if delete_all:
            QuizHistory.objects.filter(user=request.user).delete()
            return Response({"message": "All history deleted successfully"}, status=status.HTTP_200_OK)
        
        if ids:
            QuizHistory.objects.filter(user=request.user, id__in=ids).delete()
            return Response({"message": "Selected history deleted successfully"}, status=status.HTTP_200_OK)

        return Response({"error": "No action specified"}, status=status.HTTP_400_BAD_REQUEST)
