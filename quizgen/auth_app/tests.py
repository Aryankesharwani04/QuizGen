from django.test import TestCase
from django.contrib.auth.models import User
from auth_app.models import UserProfile
from auth_app.serializers import UserRegistrationSerializer, UserLoginSerializer


class UserProfileModelTest(TestCase):
    """Test UserProfile model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser@example.com',
            email='testuser@example.com',
            password='testpass123'
        )
        # UserProfile is automatically created by signal
        self.profile = self.user.profile
    
    def test_user_profile_creation(self):
        """Test UserProfile is created successfully"""
        self.assertIsNotNone(self.profile)
        self.assertEqual(self.profile.user.email, 'testuser@example.com')
    
    def test_user_profile_string_representation(self):
        """Test UserProfile string representation"""
        # The profile full_name is set to username by signal in setUp
        expected_str = f"{self.profile.full_name} - {self.user.email}"
        self.assertEqual(str(self.profile), expected_str)


class UserRegistrationSerializerTest(TestCase):
    """Test UserRegistrationSerializer"""
    
    def test_valid_registration_data(self):
        """Test serializer with valid data"""
        data = {
            'full_name': 'John Doe',
            'email': 'john@example.com',
            'password': 'securepass123',
            'password_confirm': 'securepass123'
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_invalid_email_duplicate(self):
        """Test serializer rejects duplicate email"""
        User.objects.create_user(
            username='existing@example.com',
            email='existing@example.com',
            password='pass123'
        )
        
        data = {
            'full_name': 'Another User',
            'email': 'existing@example.com',
            'password': 'securepass123',
            'password_confirm': 'securepass123'
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
    
    def test_password_mismatch(self):
        """Test serializer rejects mismatched passwords"""
        data = {
            'full_name': 'John Doe',
            'email': 'john@example.com',
            'password': 'securepass123',
            'password_confirm': 'differentpass123'
        }
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())


class UserLoginSerializerTest(TestCase):
    """Test UserLoginSerializer"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser@example.com',
            email='testuser@example.com',
            password='testpass123'
        )
    
    def test_valid_login_credentials(self):
        """Test serializer with valid credentials"""
        data = {
            'email': 'testuser@example.com',
            'password': 'testpass123'
        }
        serializer = UserLoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_invalid_email(self):
        """Test serializer with non-existent email"""
        data = {
            'email': 'nonexistent@example.com',
            'password': 'testpass123'
        }
        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
    
    def test_invalid_password(self):
        """Test serializer with wrong password"""
        data = {
            'email': 'testuser@example.com',
            'password': 'wrongpassword'
        }
        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
