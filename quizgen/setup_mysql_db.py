#!/usr/bin/env python3
"""
MySQL Database Setup Script for QuizGen
This script creates the MySQL database and user for QuizGen
"""

import pymysql
import sys
import os

def create_mysql_database(host='127.0.0.1', port=3306, root_user='root', root_password=''):
    """Create MySQL database and user for QuizGen"""
    
    print("=" * 60)
    print("QuizGen MySQL Database Setup")
    print("=" * 60)
    
    try:
        # Connect to MySQL as root
        print(f"\n[1/5] Connecting to MySQL as '{root_user}'...")
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
        print("\n[2/5] Creating database 'quizgen_prod' with utf8mb4 charset...")
        cursor.execute("""
            CREATE DATABASE IF NOT EXISTS quizgen_prod 
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci
        """)
        print("✓ Database created successfully")
        
        # Create user
        print("\n[3/5] Creating database user 'quizgen_user'...")
        cursor.execute("""
            CREATE USER IF NOT EXISTS 'quizgen_user'@'127.0.0.1' 
            IDENTIFIED BY 'quizgen_password_123'
        """)
        print("✓ User created successfully")
        
        # Grant privileges
        print("\n[4/5] Granting privileges to 'quizgen_user'...")
        cursor.execute("""
            GRANT ALL PRIVILEGES ON quizgen_prod.* 
            TO 'quizgen_user'@'127.0.0.1'
        """)
        cursor.execute("FLUSH PRIVILEGES")
        print("✓ Privileges granted successfully")
        
        # Verify setup
        print("\n[5/5] Verifying setup...")
        cursor.execute("""
            SELECT USER(), DATABASE() as current_db
        """)
        result = cursor.fetchone()
        print(f"✓ Current user: {result['USER()']}")
        
        cursor.execute("SHOW GRANTS FOR 'quizgen_user'@'127.0.0.1'")
        grants = cursor.fetchall()
        print("✓ User privileges:")
        for grant in grants:
            print(f"  - {list(grant.values())[0]}")
        
        cursor.close()
        connection.commit()
        connection.close()
        
        print("\n" + "=" * 60)
        print("✓ MySQL database setup completed successfully!")
        print("=" * 60)
        print("\nDatabase Details:")
        print("  Database: quizgen_prod")
        print("  User: quizgen_user")
        print("  Host: 127.0.0.1")
        print("  Port: 3306")
        print("  Charset: utf8mb4")
        print("  Collation: utf8mb4_unicode_ci")
        print("\nNext steps:")
        print("  1. Update .env file with: USE_MYSQL=True")
        print("  2. Update DB_PASSWORD in .env if you changed it")
        print("  3. Run: python manage.py migrate")
        print("  4. Run: python manage.py loaddata backups/data.json")
        print("=" * 60)
        
        return True
        
    except pymysql.Error as e:
        print(f"\n✗ MySQL Error: {e}")
        print("\nTroubleshooting:")
        print("  1. Make sure MySQL server is running")
        print("  2. Check that root password is correct")
        print("  3. Verify MySQL is listening on 127.0.0.1:3306")
        return False
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False

if __name__ == '__main__':
    # Get credentials from arguments or use defaults
    import getpass
    
    host = sys.argv[1] if len(sys.argv) > 1 else '127.0.0.1'
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 3306
    root_user = sys.argv[3] if len(sys.argv) > 3 else 'root'
    
    # If password not provided as argument, prompt for it
    if len(sys.argv) > 4:
        root_password = sys.argv[4]
    else:
        root_password = getpass.getpass(f"Enter MySQL {root_user} password: ")
    
    success = create_mysql_database(host, port, root_user, root_password)
    sys.exit(0 if success else 1)
