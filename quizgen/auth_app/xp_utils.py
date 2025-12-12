from quiz_app.models import QuizHistory


def calculate_quiz_xp(quiz, score):
    """
    Calculate XP based on quiz difficulty and correct answers.
    
    XP Rates:
    - Easy: 5 XP per correct answer
    - Medium: 10 XP per correct answer
    - Hard: 15 XP per correct answer
    
    Args:
        quiz: Quiz object
        score: Number of correct answers
    
    Returns:
        int: Total XP earned
    """
    xp_per_question = {
        'easy': 5,
        'medium': 10,
        'hard': 15
    }
    
    # Get difficulty level from quiz
    difficulty = (quiz.level or quiz.difficulty_level or 'medium').lower()
    xp_rate = xp_per_question.get(difficulty, 10)
    
    return score * xp_rate


def update_user_xp(user, quiz, score):
    """
    Update user's XP score based on quiz completion.
    Only awards XP for the first attempt of each quiz.
    
    Args:
        user: User object
        quiz: Quiz object
        score: Number of correct answers
    
    Returns:
        int: XP earned (0 if not first attempt)
    """
    # Check if user has previously completed this quiz
    previous_attempts = QuizHistory.objects.filter(
        user=user,
        quiz=quiz,
        completed_at__isnull=False
    ).count()
    
    # Only award XP for first attempt
    if previous_attempts <= 1:  # Current attempt is the first
        xp_earned = calculate_quiz_xp(quiz, score)
        user.profile.xp_score += xp_earned
        user.profile.save()
        return xp_earned
    
    return 0  # No XP for subsequent attempts
