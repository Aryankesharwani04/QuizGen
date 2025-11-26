#!/usr/bin/env python3
"""
MySQL Connection Test & Migration Helper
This script verifies MySQL connectivity before running migrations
"""

import os
import sys
import django
from pathlib import Path

# Add the project directory to the path
project_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(project_dir))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection, connections
from django.db.backends.mysql.base import DatabaseWrapper

def test_mysql_connection():
    """Test MySQL connection from Django settings"""
    print("=" * 70)
    print("QuizGen MySQL Connection Test")
    print("=" * 70)
    
    try:
        # Get database configuration
        db_config = connections['default'].get_connection_params()
        print("\n✓ Database Configuration:")
        print(f"  Engine: {connections['default'].settings_dict['ENGINE']}")
        print(f"  Database: {connections['default'].settings_dict['NAME']}")
        print(f"  User: {connections['default'].settings_dict['USER']}")
        print(f"  Host: {connections['default'].settings_dict['HOST']}")
        print(f"  Port: {connections['default'].settings_dict['PORT']}")
        
        # Test connection
        print("\n✓ Testing connection...")
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"  MySQL Version: {version[0]}")
            
            cursor.execute("SELECT DATABASE()")
            db_name = cursor.fetchone()
            print(f"  Current Database: {db_name[0]}")
        
        print("\n" + "=" * 70)
        print("✓ MySQL connection successful!")
        print("=" * 70)
        print("\nNext steps:")
        print("  1. Run: python manage.py migrate")
        print("  2. Run: python manage.py loaddata backups/data.json")
        print("  3. Run: python manage.py test")
        print("=" * 70)
        
        return True
        
    except Exception as e:
        print(f"\n✗ Connection failed: {e}")
        print("\nTroubleshooting:")
        print("  1. Ensure MySQL server is running")
        print("  2. Run: python setup_mysql_db.py [host] [port] [root_user] [root_password]")
        print("  3. Verify .env file has correct credentials")
        print("  4. Check if database 'quizgen_prod' exists")
        return False

if __name__ == '__main__':
    success = test_mysql_connection()
    sys.exit(0 if success else 1)
