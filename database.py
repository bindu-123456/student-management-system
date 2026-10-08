import sqlite3


# =========================
# DATABASE CONNECTION
# =========================

def get_db_connection():

    connection = sqlite3.connect("students.db")

    connection.row_factory = sqlite3.Row

    return connection


# =========================
# CREATE DATABASE
# =========================

def create_database():

    connection = sqlite3.connect("students.db")

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            usn TEXT NOT NULL UNIQUE,

            department TEXT NOT NULL,

            semester INTEGER NOT NULL

        )
    """)

    connection.commit()

    connection.close()


# =========================
# CREATE DATABASE WHEN RUN
# =========================

if __name__ == "__main__":

    create_database()

    print("Database created successfully!")