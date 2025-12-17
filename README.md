# QuizGen

A full-stack Quiz Generator application with Django backend and React frontend.

## Features

- User authentication (Email/Password and Google OAuth)
- Email verification system
- Password reset functionality
- User profile management with avatar support
- Quiz generation and management
- RESTful API architecture

## Tech Stack

**Backend:**
- Django 4.x
- Django REST Framework
- PostgreSQL
- SMTP Email Service

**Frontend:**
- React 18
- Vite
- TailwindCSS
- React Router

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 16.x or higher
- PostgreSQL (or access to a PostgreSQL database)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Quiz-Gen
```

### 2. Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd quizgen
```

#### 2.2 Create and Activate Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### 2.4 Configure Environment Variables

Create a `.env` file in the `quizgen` directory with the following content:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000

# Session Configuration
SESSION_COOKIE_AGE=1209600
SESSION_COOKIE_SECURE=False
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Lax

# Email Configuration
EMAIL_USE_SMTP=True
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id

# Gemini Api Key
GEMINI_API_KEY=api-key-here

```

**Important Notes:**
- Generate a secure `SECRET_KEY` for production
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
- Get your Google Client ID from [Google Cloud Console](https://console.cloud.google.com/)
- Replace `DATABASE_URL` with your PostgreSQL connection string

#### 2.5 Run Database Migrations

```bash
python manage.py migrate
```

#### 2.6 Create a Superuser (Optional)

```bash
python manage.py createsuperuser
```

#### 2.7 Start the Backend Server

```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### 3.1 Navigate to Frontend Directory

Open a new terminal window and navigate to the frontend directory:

```bash
cd engage-hub
```

#### 3.2 Install Node Dependencies

```bash
npm install
```

#### 3.3 Configure Environment Variables

Create a `.env.local` file in the `frontend` directory with the following content:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SESSION_TIMEOUT=1440
VITE_ENV=development
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Important Notes:**
- `VITE_API_BASE_URL` should point to your backend API
- `VITE_SESSION_TIMEOUT` is in minutes (1440 = 24 hours)
- Use the same Google Client ID as in the backend

#### 3.4 Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:8081` or `http://localhost:8080` depending on Vite's configuration.

## Running the Application

1. **Start the Backend Server:**
   ```bash
   cd quizgen
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   python manage.py runserver
   ```

2. **Start the Frontend Server (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the URL shown in the terminal)

## Database Migrations

If you make changes to Django models, create and apply migrations:

```bash
# Create migration files
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

## Testing Email Functionality

To test email verification and password reset:

```bash
python manage.py test_email
```

## Project Structure

```
Quiz-Gen/
├── quizgen/              # Django backend
│   ├── auth_app/         # Authentication app
│   ├── quiz_app/         # Quiz functionality app
│   ├── core/             # Core project settings
│   ├── manage.py
│   └── requirements.txt
├── frontend/             # React frontend
│   ├── src/
│   │   ├── api/          # API service functions
│   │   ├── components/   # React components
│   │   ├── context/      # React context providers
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Common Issues and Solutions

### Backend Issues

**Issue: Database connection error**
- Make sure PostgreSQL is running
- Verify your `DATABASE_URL` is correct
- Check that the database exists

**Issue: Email not sending**
- Verify your Gmail App Password is correct
- Check that Less Secure Apps is enabled (if using regular password)
- Ensure `EMAIL_USE_TLS=True` and `EMAIL_PORT=587`

### Frontend Issues

**Issue: API calls failing**
- Ensure backend is running on port 8000
- Verify `VITE_API_BASE_URL` in `.env.local` is correct
- Check CORS settings in backend `.env`

**Issue: Hot reload not working**
- Delete `node_modules` and run `npm install` again
- Clear browser cache

## Environment Files Security

⚠️ **IMPORTANT:** Never commit `.env` or `.env.local` files to version control. These files contain sensitive information like passwords and API keys.

The `.gitignore` file should already include:
```
.env
.env.local
*.env
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue in the GitHub repository.

