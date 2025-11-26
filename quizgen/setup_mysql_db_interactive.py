#!/usr/bin/env python3
"""
Interactive MySQL Database Setup for QuizGen
Provides guided setup with password input
"""

import pymysql
import sys
import getpass
from pathlib import Path

def create_mysql_database_interactive():
    """Interactive MySQL database setup"""
    
    print("=" * 70)
    print("QuizGen MySQL Database Setup - Interactive Mode")
    print("=" * 70)
    
    # Get connection details
    print("\nMySQL Server Connection Details:")
    host = input("  MySQL Host [127.0.0.1]: ").strip() or '127.0.0.1'
    port_str = input("  MySQL Port [3306]: ").strip() or '3306'
    port = int(port_str)
    root_user = input("  MySQL Root User [root]: ").strip() or 'root'
    root_password = getpass.getpass(f"  MySQL {root_user} Password: ")
    
    print("\nQuizGen Database User Details (will be created):")
    db_user = input("  QuizGen Database User [quizgen_user]: ").strip() or 'quizgen_user'
    db_password = getpass.getpass("  QuizGen User Password: ")
    if not db_password:
        db_password = "quizgen_password_123"
        print(f"  Using default password: {db_password}")
    
    db_name = input("  Database Name [quizgen_prod]: ").strip() or 'quizgen_prod'
    
    print("\n" + "=" * 70)
    print("Summary:")
    print(f"  Host: {host}:{port}")
    print(f"  Root User: {root_user}")
    print(f"  Database: {db_name}")
    print(f"  QuizGen User: {db_user}")
    print("=" * 70)
    
    response = input("\nProceed with setup? (y/n): ").strip().lower()
    if response != 'y':
        print("Aborting setup.")
        return False
    
    try:
        # Connect to MySQL as root
        print(f"\n[1/5] Connecting to MySQL as '{root_user}' on {host}:{port}...")
        connection = pymysql.connect(
            host=host,
            port=port,
            user=root_user,
            password=root_password,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        print("✓ Connected to MySQL")
        
        cursor = connection.cursor()
        
        # Create database with utf8mb4 charset
        print(f"\n[2/5] Creating database '{db_name}' with utf8mb4 charset...")
        try:
            cursor.execute(f"DROP DATABASE IF EXISTS {db_name}")
            print(f"  (Dropped existing {db_name})")
        except:
            pass
        
        cursor.execute(f"""
            CREATE DATABASE {db_name}
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci
        """)
        print(f"✓ Database '{db_name}' created")
        
        # Create user
        print(f"\n[3/5] Creating database user '{db_user}'...")
        try:
            cursor.execute(f"DROP USER IF EXISTS '{db_user}'@'{host}'")
            print(f"  (Dropped existing user)")
        except:
            pass
        
        cursor.execute(f"""
            CREATE USER '{db_user}'@'{host}' 
            IDENTIFIED BY '{db_password}'
        """)
        print(f"✓ User '{db_user}' created")
        
        # Grant privileges
        print(f"\n[4/5] Granting privileges...")
        cursor.execute(f"""
            GRANT ALL PRIVILEGES ON {db_name}.* 
            TO '{db_user}'@'{host}'
        """)
        cursor.execute("FLUSH PRIVILEGES")
        print(f"✓ All privileges granted to '{db_user}'")
        
        # Verify setup
        print(f"\n[5/5] Verifying setup...")
        cursor.execute(f"SHOW GRANTS FOR '{db_user}'@'{host}'")
        grants = cursor.fetchall()
        for grant in grants:
            grant_str = list(grant.values())[0]
            print(f"  ✓ {grant_str}")
        
        cursor.close()
        connection.commit()
        connection.close()
        
        # Save credentials to .env
        env_file = Path(__file__).parent / '.env'
        print(f"\n[6/6] Updating .env file...")
        
        env_content = f"""# Django Settings
DEBUG=True
SECRET_KEY=django-insecure-your-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
USE_MYSQL=True

# MySQL Database Configuration
DB_ENGINE=django.db.backends.mysql
DB_NAME={db_name}
DB_USER={db_user}
DB_PASSWORD={db_password}
DB_HOST={host}
DB_PORT={port}

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000

# Session Configuration
SESSION_COOKIE_AGE=1209600
SESSION_COOKIE_SECURE=False
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Lax
"""
        
        with open(env_file, 'w') as f:
            f.write(env_content)
        print(f"✓ .env file updated with MySQL credentials")
        
        print("\n" + "=" * 70)
        print("✓ MySQL database setup completed successfully!")
        print("=" * 70)
        print("\nNext steps:")
        print("  1. Verify .env file has correct settings")
        print("  2. Run: python manage.py migrate")
        print("  3. Run: python manage.py loaddata backups/data.json")
        print("  4. Run: python manage.py runserver")
        print("=" * 70)
        
        return True
        
    except pymysql.Error as e:
        print(f"\n✗ MySQL Error: {e}")
        print("\nTroubleshooting:")
        print("  1. Ensure MySQL server is running")
        print("  2. Check that credentials are correct")
        print("  3. Verify MySQL user has CREATE privilege")
        return False
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = create_mysql_database_interactive()
    sys.exit(0 if success else 1)
