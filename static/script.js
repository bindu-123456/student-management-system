// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(page) {

    // Hide all pages
    document.querySelectorAll(".page").forEach(function(section) {
        section.classList.remove("active");
    });

    // Show selected page
    const selectedPage = document.getElementById(page);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    // Remove active from menu buttons
    document.querySelectorAll(".menu button").forEach(function(button) {
        button.classList.remove("active");
    });

    // Change top title
    const pageTitle = document.getElementById("pageTitle");

    if (page === "dashboard") {

        pageTitle.textContent = "Dashboard";

        document.getElementById("dashboardButton")
            .classList.add("active");

    }

    else if (page === "add") {

        pageTitle.textContent = "Add Student";

        document.getElementById("addButton")
            .classList.add("active");

    }

    else if (page === "students") {

        pageTitle.textContent = "View Students";

        document.getElementById("viewButton")
            .classList.add("active");

        loadStudents();
    }
}


// ===============================
// ADD STUDENT
// ===============================

const studentForm = document.getElementById("studentForm");

studentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const usn =
        document.getElementById("usn").value.trim();

    const department =
        document.getElementById("department").value.trim();

    const semester =
        Number(document.getElementById("semester").value);


    try {

        const response = await fetch("/api/students", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                usn: usn,
                department: department,
                semester: semester
            })

        });


        const data = await response.json();


        if (!response.ok) {

            alert(data.error || "Failed to add student.");

            return;
        }


        alert("Student added successfully!");


        // Clear form
        studentForm.reset();


        // Go to View Students
        showPage("students");

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});


// ===============================
// LOAD STUDENTS
// ===============================

async function loadStudents() {

    const tableBody =
        document.getElementById("studentTableBody");


    try {

        const response =
            await fetch("/api/students");


        const students =
            await response.json();


        tableBody.innerHTML = "";


        if (students.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center; padding:30px;">
                        No students found.
                    </td>
                </tr>
            `;

            return;
        }


        students.forEach(function(student) {

            const row =
                document.createElement("tr");


            // ID
            const idCell =
                document.createElement("td");

            idCell.textContent = student.id;


            // Name
            const nameCell =
                document.createElement("td");

            nameCell.textContent = student.name;


            // USN
            const usnCell =
                document.createElement("td");

            usnCell.textContent = student.usn;


            // Department
            const departmentCell =
                document.createElement("td");

            departmentCell.textContent =
                student.department;


            // Semester
            const semesterCell =
                document.createElement("td");

            semesterCell.textContent =
                student.semester;


            // Actions
            const actionCell =
                document.createElement("td");


            // Edit button
            const editButton =
                document.createElement("button");

            editButton.textContent = "Edit";

            editButton.className =
                "edit-button";


            editButton.onclick = function() {

                editStudent(
                    student.id,
                    student.name,
                    student.usn,
                    student.department,
                    student.semester
                );

            };


            // Delete button
            const deleteButton =
                document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.className =
                "delete-button";


            deleteButton.onclick = function() {

                deleteStudent(student.id);

            };


            actionCell.appendChild(editButton);

            actionCell.appendChild(deleteButton);


            row.appendChild(idCell);

            row.appendChild(nameCell);

            row.appendChild(usnCell);

            row.appendChild(departmentCell);

            row.appendChild(semesterCell);

            row.appendChild(actionCell);


            tableBody.appendChild(row);

        });

    }

    catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6"
                    style="text-align:center; padding:30px;">
                    Unable to load students.
                </td>
            </tr>
        `;

    }

}


// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(id) {

    const answer =
        confirm("Are you sure you want to delete this student?");


    if (!answer) {
        return;
    }


    try {

        const response =
            await fetch(`/api/students/${id}`, {

                method: "DELETE"

            });


        const data =
            await response.json();


        alert(data.message || data.error);


        // Refresh student list
        loadStudents();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete student.");

    }

}


// ===============================
// UPDATE STUDENT
// ===============================

async function editStudent(
    id,
    oldName,
    oldUsn,
    oldDepartment,
    oldSemester
) {

    const name =
        prompt("Student Name:", oldName);


    if (name === null) {
        return;
    }


    const usn =
        prompt("USN:", oldUsn);


    if (usn === null) {
        return;
    }


    const department =
        prompt("Department:", oldDepartment);


    if (department === null) {
        return;
    }


    const semester =
        prompt("Semester:", oldSemester);


    if (semester === null) {
        return;
    }


    try {

        const response =
            await fetch(`/api/students/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name.trim(),

                    usn: usn.trim(),

                    department: department.trim(),

                    semester: Number(semester)

                })

            });


        const data =
            await response.json();


        alert(data.message || data.error);


        // Refresh table
        loadStudents();

    }

    catch (error) {

        console.error(error);

        alert("Unable to update student.");

    }

}


// ===============================
// LOGOUT
// ===============================

function logout() {

    showPage("dashboard");

    alert("You are back on the Dashboard.");

}


// ===============================
// INITIAL LOAD
// ===============================

loadStudents();