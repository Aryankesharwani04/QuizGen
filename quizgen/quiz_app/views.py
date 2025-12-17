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


@method_decorator(csrf_exempt, name='dispatch')
class CreateQuizView(APIView):
    """
    Create a new quiz with AI-generated questions.
    Saves to CSV file for dataset collection.
    """
    permission_classes = [permissions.AllowAny]  # Dashboard is protected, so user is already logged in

    def post(self, request):
        # Get quiz details from request
        category = request.data.get('category')
        title = request.data.get('title')
        level = request.data.get('level', 'easy')
        num_questions = request.data.get('num_questions', 10)
        duration_seconds = request.data.get('duration_seconds', 600)
        additional_instructions = request.data.get('additional_instructions', '')
        
        # Validate required fields
        if not category or not title:
            return Response(
                {"error": "Category and title are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Step 1: Generate unique quiz_id
            logger.info(f"Generating quiz: {title} - {category}")
            quiz_id = generate_unique_quiz_id()
            logger.info(f"Generated quiz_id: {quiz_id}")
            
            # Step 2: Generate questions using Gemini
            logger.info(f"Calling Gemini API for {num_questions} questions")
            questions_data, error_msg = generate_quiz_questions(
                category=category,
                title=title,
                level=level,
                num_questions=num_questions,
                additional_instructions=additional_instructions
            )
            
            if not questions_data:
                logger.error(f"Gemini API failed: {error_msg}")
                return Response(
                    {"error": "Failed to generate questions", "details": error_msg},
                    status=status.HTTP_502_BAD_GATEWAY
                )
            
            logger.info(f"Successfully generated {len(questions_data)} questions")
            
            # Step 3: Create Quiz and Question objects for CSV
            with transaction.atomic():
                # Create quiz
                quiz = Quiz.objects.create(
                    quiz_id=quiz_id,
                    category=category,
                    title=title,
                    topic=category,
                    level=level,
                    difficulty_level=level,
                    num_questions=num_questions,
                    duration_seconds=duration_seconds,
                    duration_minutes=duration_seconds // 60,
                    created_by=request.user if request.user.is_authenticated else None,
                    is_mock=False
                )
                
                # Create question objects
                question_objects = []
                for idx, q_data in enumerate(questions_data, start=1):
                    question = Question(
                        quiz=quiz,
                        order=idx,
                        text=q_data['text'],
                        question_text=q_data['text'],
                        options=q_data['options'],
                        correct_answer=q_data['correct_answer'],
                        metadata={}
                    )
                    question_objects.append(question)
                
                # Save to database
                Question.objects.bulk_create(question_objects)
                
                # Step 4: Append to CSV file
                csv_success = append_quiz_to_csv(quiz, question_objects)
                if not csv_success:
                    logger.warning(f"CSV append failed for quiz {quiz_id}")
                else:
                    logger.info(f"Successfully saved quiz {quiz_id} to CSV")
            
            # Step 5: Return success response
            return Response({
                "success": True,
                "message": "Quiz created successfully",
                "quiz_id": quiz.quiz_id,
                "num_questions": len(question_objects),
                "category": quiz.category,
                "title": quiz.title,
                "level": quiz.level
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error creating quiz: {str(e)}")
            return Response(
                {"error": "Failed to create quiz", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class QuizListView(APIView):
    """
    Get list of all available quizzes with basic details.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            quizzes = Quiz.objects.all().order_by('-created_at')
            
            quiz_list = []
            for quiz in quizzes:
                quiz_list.append({
                    'quiz_id': quiz.quiz_id,
                    'title': quiz.title,
                    'category': quiz.category or quiz.topic,
                    'level': quiz.level or quiz.difficulty_level,
                    'num_questions': quiz.num_questions,
                    'duration_seconds': quiz.duration_seconds or (quiz.duration_minutes * 60 if quiz.duration_minutes else 600),
                })
            
            logger.info(f"Returning {len(quiz_list)} quizzes")
            return Response({
                'success': True,
                'quizzes': quiz_list,
                'count': len(quiz_list)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching quizzes: {str(e)}")
            return Response(
                {"error": "Failed to fetch quizzes", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class QuizQuestionsView(APIView):
    """
    Get all questions for a specific quiz by quiz_id.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, quiz_id):
        try:
            # Get quiz by quiz_id
            quiz = Quiz.objects.filter(quiz_id=quiz_id).first()
            
            if not quiz:
                return Response(
                    {"error": "Quiz not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Get all questions for this quiz
            questions = Question.objects.filter(quiz=quiz).order_by('order')
            
            questions_list = []
            for q in questions:
                questions_list.append({
                    'id': q.id,
                    'order': q.order,
                    'text': q.text or q.question_text,
                    'options': q.options,
                    'correct_answer': q.correct_answer
                })
            
            logger.info(f"Returning {len(questions_list)} questions for quiz {quiz_id}")
            return Response({
                'success': True,
                'quiz_id': quiz.quiz_id,
                'title': quiz.title,
                'category': quiz.category or quiz.topic,
                'level': quiz.level or quiz.difficulty_level,
                'duration_seconds': quiz.duration_seconds or (quiz.duration_minutes * 60 if quiz.duration_minutes else 600),
                'questions': questions_list,
                'total_questions': len(questions_list)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching quiz questions: {str(e)}")
            return Response(
                {"error": "Failed to fetch quiz questions", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetQuizzesByCategoryView(APIView):
    """
    Fetch unique quizzes by category and subtopic from categoryQuizzes.csv.
    Returns list of unique quiz_id with title and level.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        import csv
        import os
        from collections import OrderedDict
        
        category = request.query_params.get('category')
        subtopic = request.query_params.get('subtopic')
        
        # Validate required parameters
        if not category or not subtopic:
            return Response(
                {"error": "Both category and subtopic are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Path to CSV file
            csv_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                'dataset',
                'categoryQuizzes.csv'
            )
            
            if not os.path.exists(csv_path):
                return Response(
                    {"error": "Quiz dataset not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Read CSV and collect unique quizzes
            unique_quizzes = OrderedDict()
            
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Match category and subtopic (case-insensitive)
                    if (row['Category'].strip().lower() == category.strip().lower() and 
                        row['Subtopic'].strip().lower() == subtopic.strip().lower()):
                        
                        quiz_id = row['QuizID']
                        
                        # Store unique quiz only once
                        if quiz_id not in unique_quizzes:
                            unique_quizzes[quiz_id] = {
                                'quiz_id': quiz_id,
                                'title': row['Title'],
                                'level': row['Level']
                            }
            
            # Convert to list
            quiz_list = list(unique_quizzes.values())
            
            logger.info(f"Found {len(quiz_list)} unique quizzes for {category}/{subtopic}")
            return Response({
                'success': True,
                'category': category,
                'subtopic': subtopic,
                'quizzes': quiz_list,
                'count': len(quiz_list)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching quizzes: {str(e)}")
            return Response(
                {"error": "Failed to fetch quizzes", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CountQuizzesByCategoryView(APIView):
    """
    Count unique quizzes by category and subtopic from categoryQuizzes.csv.
    Returns the number of unique quizzes.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        import csv
        import os
        
        category = request.query_params.get('category')
        subtopic = request.query_params.get('subtopic')
        
        # Validate required parameters
        if not category or not subtopic:
            return Response(
                {"error": "Both category and subtopic are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Path to CSV file
            csv_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                'dataset',
                'categoryQuizzes.csv'
            )
            
            if not os.path.exists(csv_path):
                return Response(
                    {"error": "Quiz dataset not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Read CSV and collect unique quiz IDs
            unique_quiz_ids = set()
            
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Match category and subtopic (case-insensitive)
                    if (row['Category'].strip().lower() == category.strip().lower() and 
                        row['Subtopic'].strip().lower() == subtopic.strip().lower()):
                        unique_quiz_ids.add(row['QuizID'])
            
            count = len(unique_quiz_ids)
            
            logger.info(f"Found {count} unique quizzes for {category}/{subtopic}")
            return Response({
                'success': True,
                'category': category,
                'subtopic': subtopic,
                'count': count
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error counting quizzes: {str(e)}")
            return Response(
                {"error": "Failed to count quizzes", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetQuizQuestionsByIdView(APIView):
    """
    Fetch quiz questions and answers by quiz_id from categoryQuizzes.csv.
    Returns all questions with their options and correct answers.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, quiz_id):
        import csv
        import os
        
        try:
            # Path to CSV file
            csv_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                'dataset',
                'categoryQuizzes.csv'
            )
            
            if not os.path.exists(csv_path):
                return Response(
                    {"error": "Quiz dataset not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Read CSV and collect all questions for this quiz_id
            questions = []
            quiz_info = None
            
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    if row['QuizID'] == str(quiz_id):
                        # Store quiz info from first row
                        if not quiz_info:
                            quiz_info = {
                                'quiz_id': row['QuizID'],
                                'category': row['Category'],
                                'subtopic': row['Subtopic'],
                                'title': row['Title'],
                                'level': row['Level'],
                                'duration_seconds': row['DurationSeconds']
                            }
                        
                        # Add question
                        questions.append({
                            'question_text': row['QuestionText'],
                            'options': {
                                'A': row['OptionA'],
                                'B': row['OptionB'],
                                'C': row['OptionC'],
                                'D': row['OptionD']
                            },
                            'correct_answer': row['CorrectAnswer']
                        })
            
            # Check if quiz was found
            if not quiz_info:
                return Response(
                    {"error": "Quiz not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            logger.info(f"Found {len(questions)} questions for quiz {quiz_id}")
            return Response({
                'success': True,
                'quiz_info': quiz_info,
                'questions': questions,
                'total_questions': len(questions)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching quiz questions: {str(e)}")
            return Response(
                {"error": "Failed to fetch quiz questions", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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