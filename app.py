from flask import Flask, jsonify, request, render_template
from database import get_db_connection

app = Flask(__name__)


# =========================
# HOME PAGE
# =========================

@app.route("/")
def home():
    return render_template("index.html")


# =========================
# GET ALL STUDENTS
# =========================

@app.route("/api/students", methods=["GET"])
def get_students():

    connection = get_db_connection()

    students = connection.execute(
        "SELECT * FROM students"
    ).fetchall()

    connection.close()

    return jsonify([dict(student) for student in students])


# =========================
# ADD STUDENT
# =========================

@app.route("/api/students", methods=["POST"])
def add_student():

    data = request.get_json()

    name = data.get("name")
    usn = data.get("usn")
    department = data.get("department")
    semester = data.get("semester")

    if not name or not usn or not department or not semester:
        return jsonify({
            "error": "All fields are required"
        }), 400

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO students
            (name, usn, department, semester)
            VALUES (?, ?, ?, ?)
        """, (name, usn, department, semester))

        connection.commit()

        student_id = cursor.lastrowid

        connection.close()

        return jsonify({
            "message": "Student added successfully",
            "id": student_id
        }), 201

    except Exception as e:

        connection.close()

        return jsonify({
            "error": str(e)
        }), 400


# =========================
# UPDATE STUDENT
# =========================

@app.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):

    data = request.get_json()

    name = data.get("name")
    usn = data.get("usn")
    department = data.get("department")
    semester = data.get("semester")

    if not name or not usn or not department or not semester:
        return jsonify({
            "error": "All fields are required"
        }), 400

    connection = get_db_connection()

    connection.execute("""
        UPDATE students
        SET name = ?,
            usn = ?,
            department = ?,
            semester = ?
        WHERE id = ?
    """, (name, usn, department, semester, student_id))

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Student updated successfully"
    })


# =========================
# DELETE STUDENT
# =========================

@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):

    connection = get_db_connection()

    connection.execute(
        "DELETE FROM students WHERE id = ?",
        (student_id,)
    )

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Student deleted successfully"
    })


# =========================
# RUN APPLICATION
# =========================

if __name__ == "__main__":
    app.run(debug=True)