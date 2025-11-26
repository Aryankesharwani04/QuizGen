"""
Quiz Application Models

This module defines the core database models for the quiz system including:
- Category and SubCategory for quiz organization
- QuizSession for tracking individual quiz attempts
- QuizQuestion for storing questions and answers
- UserScoreHistory for quick access to user statistics
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import json


class Category(models.Model):
    """
    Quiz category for organizing quizzes by subject area.
    
    Fields:
        name: Category name (e.g., "Science", "History")
        slug: URL-friendly identifier
        category_type: Type of category (Academic/Entertainment/GeneralKnowledge)
        description: Category description
        icon_url: Optional icon for frontend
        created_at: Timestamp of creation
        updated_at: Last update timestamp
    """
    
    CATEGORY_CHOICES = [
        ('academic', 'Academic'),
        ('entertainment', 'Entertainment'),
        ('general_knowledge', 'General Knowledge'),
    ]
    
    name = models.CharField(max_length=255, unique=True, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    category_type = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        db_index=True
    )
    description = models.TextField(blank=True, null=True)
    icon_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.get_category_type_display()})"


class SubCategory(models.Model):
    """
    Subcategory for further organizing quizzes within a category.
    
    Fields:
        name: Subcategory name (e.g., "Biology", "Physics")
        slug: URL-friendly identifier
        parent_category: Foreign key to Category
        description: Subcategory description
        difficulty_level: Difficulty of quizzes in this subcategory
        created_at: Timestamp of creation
        updated_at: Last update timestamp
    """
    
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
        ('mixed', 'Mixed'),
    ]
    
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, db_index=True)
    parent_category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='subcategories'
    )
    description = models.TextField(blank=True, null=True)
    difficulty_level = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='mixed'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'SubCategory'
        verbose_name_plural = 'SubCategories'
        unique_together = ('parent_category', 'slug')
        indexes = [
            models.Index(fields=['parent_category', 'slug']),
            models.Index(fields=['difficulty_level']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.parent_category.name} > {self.name}"


class QuizSession(models.Model):
    """
    Represents a single quiz attempt by a user.
    
    Fields:
        user: Foreign key to User
        category: Foreign key to Category
        subcategory: Foreign key to SubCategory
        total_questions: Number of questions in this session
        completed_questions: Number of questions answered
        score: Final score (0-100 or total points)
        status: Current status of the quiz
        started_at: When the quiz started
        completed_at: When the quiz was completed (nullable)
        time_spent_seconds: Total time spent on quiz
        metadata: JSON field for additional session metadata
    """
    
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
        ('abandoned', 'Abandoned'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='quiz_sessions'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='quiz_sessions'
    )
    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='quiz_sessions'
    )
    total_questions = models.IntegerField(
        default=10,
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )
    completed_questions = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )
    score = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='in_progress',
        db_index=True
    )
    started_at = models.DateTimeField(auto_now_add=True, db_index=True)
    completed_at = models.DateTimeField(blank=True, null=True, db_index=True)
    time_spent_seconds = models.IntegerField(default=0)
    metadata = models.TextField(
        default='{}',
        help_text='JSON field for additional metadata'
    )
    
    class Meta:
        verbose_name = 'Quiz Session'
        verbose_name_plural = 'Quiz Sessions'
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['category', 'subcategory']),
            models.Index(fields=['started_at']),
            models.Index(fields=['completed_at']),
            models.Index(fields=['user', 'started_at']),
        ]
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.category.name} ({self.get_status_display()})"
    
    def get_progress_percentage(self):
        """Calculate quiz completion percentage"""
        if self.total_questions == 0:
            return 0
        return int((self.completed_questions / self.total_questions) * 100)
    
    def get_metadata(self):
        """Parse and return metadata JSON"""
        try:
            return json.loads(self.metadata)
        except (json.JSONDecodeError, TypeError):
            return {}
    
    def set_metadata(self, data):
        """Set metadata as JSON string"""
        self.metadata = json.dumps(data)


class QuizQuestion(models.Model):
    """
    Stores individual questions within a quiz session.
    
    Fields:
        quiz_session: Foreign key to QuizSession
        question_text: The question content
        options: JSON field with question options
        correct_answer: The correct answer
        user_answer: User's answer (nullable if not answered)
        is_correct: Whether user's answer was correct
        ai_metadata: JSON metadata from AI generation
        created_at: When the question was created
    """
    
    quiz_session = models.ForeignKey(
        QuizSession,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    question_text = models.TextField()
    options = models.TextField(
        help_text='JSON array of answer options',
        default='[]'
    )
    correct_answer = models.CharField(max_length=500)
    user_answer = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )
    is_correct = models.BooleanField(default=False, db_index=True)
    ai_metadata = models.TextField(
        default='{}',
        help_text='JSON metadata from AI generation'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        verbose_name = 'Quiz Question'
        verbose_name_plural = 'Quiz Questions'
        indexes = [
            models.Index(fields=['quiz_session', 'is_correct']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['created_at']
    
    def __str__(self):
        return f"Q: {self.question_text[:50]}..."
    
    def get_options(self):
        """Parse and return options JSON"""
        try:
            return json.loads(self.options)
        except (json.JSONDecodeError, TypeError):
            return []
    
    def set_options(self, options_list):
        """Set options as JSON string"""
        self.options = json.dumps(options_list)
    
    def get_ai_metadata(self):
        """Parse and return AI metadata JSON"""
        try:
            return json.loads(self.ai_metadata)
        except (json.JSONDecodeError, TypeError):
            return {}
    
    def set_ai_metadata(self, metadata_dict):
        """Set AI metadata as JSON string"""
        self.ai_metadata = json.dumps(metadata_dict)


class UserScoreHistory(models.Model):
    """
    Summary statistics for user quiz performance.
    
    This model is updated automatically via signals when quiz sessions are completed.
    It provides quick access to user statistics without querying all quiz sessions.
    
    Fields:
        user: Foreign key to User (one-to-one)
        total_quizzes: Total number of quizzes completed
        total_questions_answered: Total questions across all quizzes
        correct_answers: Total correct answers
        average_score: Average score across all quizzes
        best_score: Highest score achieved
        worst_score: Lowest score achieved
        last_quiz_date: Date of most recent quiz
        last_updated: When this record was last updated
    """
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='score_history'
    )
    total_quizzes = models.IntegerField(default=0)
    total_questions_answered = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    best_score = models.IntegerField(default=0)
    worst_score = models.IntegerField(default=0)
    last_quiz_date = models.DateTimeField(blank=True, null=True, db_index=True)
    last_updated = models.DateTimeField(auto_now=True, db_index=True)
    
    class Meta:
        verbose_name = 'User Score History'
        verbose_name_plural = 'User Score Histories'
        indexes = [
            models.Index(fields=['average_score']),
            models.Index(fields=['best_score']),
            models.Index(fields=['last_updated']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - Avg: {self.average_score:.1f}, Best: {self.best_score}"
    
    def get_accuracy_percentage(self):
        """Calculate overall accuracy percentage"""
        if self.total_questions_answered == 0:
            return 0
        return (self.correct_answers / self.total_questions_answered) * 100


class CategoryStatistics(models.Model):
    """
    Aggregated statistics per category for analytics.
    
    Fields:
        category: Foreign key to Category
        subcategory: Optional foreign key to SubCategory
        total_quizzes_taken: How many times this category was attempted
        average_score: Average score in this category
        total_users: Number of unique users who took quizzes in this category
        last_updated: When statistics were last updated
    """
    
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='statistics'
    )
    subcategory = models.ForeignKey(
        SubCategory,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='statistics'
    )
    total_quizzes_taken = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    total_users = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True, db_index=True)
    
    class Meta:
        verbose_name = 'Category Statistics'
        verbose_name_plural = 'Category Statistics'
        unique_together = ('category', 'subcategory')
        indexes = [
            models.Index(fields=['category', 'subcategory']),
            models.Index(fields=['average_score']),
        ]
    
    def __str__(self):
        if self.subcategory:
            return f"{self.category.name} > {self.subcategory.name}"
        return f"{self.category.name} (All)"
