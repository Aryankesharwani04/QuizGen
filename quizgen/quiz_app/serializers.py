from rest_framework import serializers
from .models import Quiz, Question, QuizHistory

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options', 'correct_answer', 'order']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = [
            'quiz_id', 'title', 'topic', 'difficulty_level', 
            'image_link', 'num_questions', 'duration_minutes', 
            'created_at', 'questions'
        ]

class QuizHistorySerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    quiz_id = serializers.CharField(source='quiz.quiz_id', read_only=True)

    class Meta:
        model = QuizHistory
        fields = [
            'id', 'quiz_id', 'quiz_title', 'score', 
            'total_questions', 'completed_at', 'user_answers', 'questions'
        ]

class QuizGenerationSerializer(serializers.Serializer):
    topic = serializers.CharField(max_length=255, required=True)
    difficulty = serializers.ChoiceField(choices=['Easy', 'Medium', 'Hard', 'Mixed'], default='Mixed')
    num_questions = serializers.IntegerField(min_value=1, max_value=20, default=5)
