import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(BASE_DIR, "../data.db")

# Check if the database file exists
if os.path.exists(DATABASE_FILE):
    print(f"Database file found at {DATABASE_FILE}")
else:
    print(f"Database file not found at {DATABASE_FILE}")


def get_db_connection():
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        conn.row_factory = sqlite3.Row  # Return rows as dictionaries
        print("Successfully connected to the database")
        return conn
    except sqlite3.Error as e:
        print(f"Failed to connect to the database: {e}")
        return None
