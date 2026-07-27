// Infinity Learning Engine - LocalStorage & Cross-Page Persistence

// Default Seed Data
const defaultCourses = [
    { id: 1, name: "Stateboard", description: "Learn Stateboard curriculum in detail.", details: "Comprehensive subjects covered." },
    { id: 2, name: "Govt Exams", description: "Prepare for competitive government exams.", details: "Syllabus and practice papers." },
    { id: 3, name: "EAPCET", description: "Learn EAPCET concepts and strategies.", details: "Math, Physics, Chemistry focus." },
    { id: 4, name: "JEE Mains", description: "Understand deep concepts for JEE Mains.", details: "Problem solving and mock test practice." },
    { id: 5, name: "Navodaya", description: "Learn Navodaya entrance material.", details: "Mental ability and language preparation." },
    { id: 6, name: "NEET", description: "Complete NEET preparatory courses.", details: "Biology, Chemistry, and Physics drills." }
];
// Custom Admin Credentials
const AUTHORIZED_ADMIN = {
    email: "umapathichichula@gmail.com",
    password: "AJAYKUMAR"
};
const defaultLiveClasses = [
    { id: 1, name: "EAPCET Physics Live", subject: "Physics", date: "2026-08-01", time: "10:00", duration: "1.5 hours", topic: "Mechanics & Wave Motion", instructor: "Prof. Sharma" },
    { id: 2, name: "JEE Mains Math Deep Dive", subject: "Mathematics", date: "2026-08-02", time: "14:00", duration: "2 hours", topic: "Calculus & Integration", instructor: "Dr. Rao" }
];

const defaultRecordedClasses = [
    { id: 1, title: "EAPCET & JEE Mains Overview", subject: "Mathematics", duration: "120", description: "Fundamental overview of exam patterns.", videoUrl: "" },
    { id: 2, title: "NEET Biology Essentials", subject: "Biology", duration: "180", description: "Cellular structures and genetics study.", videoUrl: "" }
];
const defaultNotes = [
    { id: 1, title: "Physics Mechanics Handbook", subject: "Physics", author: "Prof. Sharma", format: "PDF", link: "#" },
    { id: 2, title: "Organic Chemistry Revision Notes", subject: "Chemistry", author: "Dr. Rao", format: "PDF", link: "#" }
];

const defaultStudents = [
    { id: 101, name: "Rahul Kumar", email: "rahul@student.com", enrolled: ["EAPCET", "JEE Mains"] },
    { id: 102, name: "Priya Sharma", email: "priya@student.com", enrolled: ["NEET"] }
];

const defaultTeachers = [
    { id: 201, name: "Prof. Sharma", email: "sharma@teacher.com", subject: "Physics" },
    { id: 202, name: "Dr. Rao", email: "rao@teacher.com", subject: "Mathematics" }
];

// LocalStorage Persistence Helpers
function getData(key, fallback) {
    const stored = localStorage.getItem(key);
    if (!stored) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }
    return JSON.parse(stored);
}

function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Global Application State
let courses = getData("infinity_courses", defaultCourses);
let liveClasses = getData("infinity_live_classes", defaultLiveClasses);
let recordedClasses = getData("infinity_recorded_classes", defaultRecordedClasses);
let notesList = getData("infinity_notes", defaultNotes);
let studentsList = getData("infinity_students", defaultStudents);
let teachersList = getData("infinity_teachers", defaultTeachers);
let quizzes = getData("infinity_quizzes", {});
let users = getData("infinity_users", []);
let currentUser = getData("infinity_current_user", null);

// Helpers
function escapeHTML(value) {
    return String(value || '').replace(/[&<>"'`=\/]/g, char => {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;' };
        return map[char];
    });
}

function sanitizeText(value) {
    return String(value || '').trim();
}

// Page Initialization Engine
window.addEventListener("DOMContentLoaded", () => {
    initPage();
    renderCoursesPage();
    renderLiveClassesPage();
    renderRecordedClassesPage();
});

function initPage() {
    let studentForm = document.getElementById("studentForm");
    let teacherForm = document.getElementById("teacherForm");
    let adminForm = document.getElementById("adminForm");
    let registerForm = document.getElementById("registerForm");
    let contactForm = document.getElementById("contactForm");

    if (studentForm) studentForm.addEventListener("submit", studentLogin);
    if (teacherForm) teacherForm.addEventListener("submit", teacherLogin);
    if (adminForm) adminForm.addEventListener("submit", adminLogin); 
    if (registerForm) registerForm.addEventListener("submit", registerUser);
    if (contactForm) contactForm.addEventListener("submit", sendMessage);

    document.body.addEventListener("click", handleDataAction);

    if (currentUser && document.getElementById("studentDashboard")) {
        showStudentDashboardView();
    }
}

// Event Delegation Handler
function handleDataAction(event) {
    let target = event.target.closest("[data-action]");
    if (!target) return;

    let action = target.dataset.action;
    switch (action) {
        case "switch-login-type":
            switchLoginType(target.dataset.loginType);
            break;
        case "upload-course":
            uploadCourse();
            break;
        case "upload-recorded-class":
            uploadRecordedClass();
            break;
        case "upload-notes":
            uploadNotes();
            break;
        case "schedule-live-class":
            scheduleLiveClass();
            break;
        case "create-quiz":
            createQuiz();
            break;
        case "teacher-logout":
        case "student-logout":
        case "admin-logout":
            logoutUser();
            break;
        case "go-to-home":
            goToHome();
            break;
        case "go-to-courses":
            goToCourses();
            break;
        case "go-to-live-classes":
            goToLiveClasses();
            break;
        case "go-to-recorded-classes":
            goToRecordedClasses();
            break;
        case "go-to-student-profile":
            goToStudentProfile();
            break;
        case "join-class":
            joinClass(target.dataset.className);
            break;
        case "watch-video":
            watchVideo(target.dataset.courseName);
            break;
        case "enroll-course":
            enrollInCourse(target.dataset.courseName);
            break;
    }
}

// Login Switcher
function switchLoginType(type) {
    let studentForm = document.getElementById("studentForm");
    let teacherForm = document.getElementById("teacherForm");
    let adminForm = document.getElementById("adminForm");
    let tabButtons = document.querySelectorAll(".tab-button");
    studentForm.classList.add("login-hidden");
    teacherForm.classList.add("login-hidden");
    adminForm.classList.add("login-hidden");
    
    tabButtons.forEach(btn => btn.classList.remove("active"));
    if (type === "student") {
        studentForm.classList.remove("login-hidden");
        tabButtons[0].classList.add("active");
    } else if (type === "teacher") {
        teacherForm.classList.remove("login-hidden");
        tabButtons[1].classList.add("active");
    } else if (type === "admin") {
        adminForm.classList.remove("login-hidden");
        tabButtons[2].classList.add("active");
    }
}

// Dynamic Rendering for Pages

function renderCoursesPage() {
    const container = document.getElementById("coursesContainer");
    if (!container) return;

    container.innerHTML = "";
    courses.forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
            <h3>📚 ${escapeHTML(course.name)}</h3>
            <p>${escapeHTML(course.description)}</p>
            <small style="color:#64748b; display:block; margin-bottom:10px;">${escapeHTML(course.details || '')}</small>
            <button type="button" data-action="enroll-course" data-course-name="${escapeHTML(course.name)}">Enroll Now</button>
        `;
        container.appendChild(card);
    });
}

function renderLiveClassesPage() {
    const container = document.getElementById("liveClassesContainer");
    if (!container) return;

    container.innerHTML = "";
    liveClasses.forEach(item => {
        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
            <h3>🎥 ${escapeHTML(item.name || item.subject)}</h3>
            <p><strong>Subject:</strong> ${escapeHTML(item.subject)}</p>
            <p><strong>Date:</strong> ${escapeHTML(item.date)} | <strong>Time:</strong> ${escapeHTML(item.time)}</p>
            <p><strong>Topic:</strong> ${escapeHTML(item.topic || 'N/A')}</p>
            <button type="button" data-action="join-class" data-class-name="${escapeHTML(item.name || item.subject)}">Join Live Class</button>
        `;
        container.appendChild(card);
    });
}

function renderRecordedClassesPage() {
    const container = document.getElementById("recordedClassesContainer");
    if (!container) return;

    container.innerHTML = "";
    recordedClasses.forEach(item => {
        const card = document.createElement("div");
        card.className = "course-card";
        const videoElement = item.videoUrl ? `<video src="${item.videoUrl}" controls></video>` : `<div style="background:#e2e8f0; height:120px; display:flex; align-items:center; justify-content:center; border-radius:6px; margin-bottom:10px;">📹 Class Video</div>`;
        
        card.innerHTML = `
            ${videoElement}
            <h3>${escapeHTML(item.title)}</h3>
            <p><strong>Subject:</strong> ${escapeHTML(item.subject)} | <strong>Duration:</strong> ${escapeHTML(item.duration)} mins</p>
            <p>${escapeHTML(item.description)}</p>
            <button type="button" data-action="watch-video" data-course-name="${escapeHTML(item.title)}">Watch Class</button>
        `;
        container.appendChild(card);
    });
}

// Teacher Upload Actions
function uploadCourse() {
    let name = sanitizeText(document.getElementById("courseName").value);
    let description = sanitizeText(document.getElementById("courseDescription").value);
    let details = sanitizeText(document.getElementById("courseDetails").value);

    if (!name || !description) {
        alert("Please provide course name and description!");
        return;
    }

    const newCourse = { id: Date.now(), name, description, details };
    courses.push(newCourse);
    setData("infinity_courses", courses);

    alert("✅ Course uploaded successfully!");
    document.getElementById("courseName").value = "";
    document.getElementById("courseDescription").value = "";
    document.getElementById("courseDetails").value = "";
    
    renderCoursesPage();
}

function uploadRecordedClass() {
    let title = sanitizeText(document.getElementById("recordedClassTitle").value);
    let subject = sanitizeText(document.getElementById("recordedClassSubject").value);
    let duration = sanitizeText(document.getElementById("recordedDuration").value);
    let description = sanitizeText(document.getElementById("recordedDescription").value);
    let videoFileInput = document.getElementById("recordedVideo");

    if (!title || !subject || !duration) {
        alert("Please fill in all required class details!");
        return;
    }

    let videoUrl = "";
    if (videoFileInput && videoFileInput.files && videoFileInput.files[0]) {
        videoUrl = URL.createObjectURL(videoFileInput.files[0]);
    }

    const newRecord = { id: Date.now(), title, subject, duration, description, videoUrl };
    recordedClasses.push(newRecord);
    setData("infinity_recorded_classes", recordedClasses);

    alert("✅ Recorded class uploaded successfully!");
    document.getElementById("recordedClassTitle").value = "";
    document.getElementById("recordedClassSubject").value = "";
    document.getElementById("recordedDuration").value = "";
    document.getElementById("recordedDescription").value = "";

    renderRecordedClassesPage();
}
function uploadNotes() {
    let title = sanitizeText(document.getElementById("notesTitle").value);
    let subject = sanitizeText(document.getElementById("notesSubject").value);
    let author = sanitizeText(document.getElementById("notesAuthor").value);

    if (!title || !subject) {
        alert("Please specify Notes Title and Subject!");
        return;
    }

    const newNote = { id: Date.now(), title, subject, author: author || "Teacher", format: "PDF", link: "#" };
    notesList.push(newNote);
    setData("infinity_notes", notesList);

    alert("✅ Study notes uploaded successfully!");
    document.getElementById("notesTitle").value = "";
    document.getElementById("notesSubject").value = "";
    document.getElementById("notesAuthor").value = "";
}
function scheduleLiveClass() {
    let name = sanitizeText(document.getElementById("liveClassName").value);
    let subject = sanitizeText(document.getElementById("liveClassSubject").value);
    let date = document.getElementById("liveScheduleDate").value;
    let time = document.getElementById("liveScheduleTime").value;
    let duration = document.getElementById("liveScheduleDuration").value;
    let topic = sanitizeText(document.getElementById("liveClassTopic").value);

    if (!name || !subject || !date || !time) {
        alert("Please fill in all fields!");
        return;
    }

    const newLive = { id: Date.now(), name, subject, date, time, duration, topic };
    liveClasses.push(newLive);
    setData("infinity_live_classes", liveClasses);

    alert("✅ Live class scheduled successfully!");
    document.getElementById("liveClassName").value = "";
    document.getElementById("liveClassSubject").value = "";
    document.getElementById("liveClassTopic").value = "";

    renderLiveClassesPage();
}

function createQuiz() {
    let title = sanitizeText(document.getElementById("quizTitle").value);
    let question = sanitizeText(document.getElementById("quizQuestion").value);
    let opt1 = sanitizeText(document.getElementById("quizOption1").value);
    let opt2 = sanitizeText(document.getElementById("quizOption2").value);
    let opt3 = sanitizeText(document.getElementById("quizOption3").value);
    let opt4 = sanitizeText(document.getElementById("quizOption4").value);
    let correct = document.getElementById("correctAnswer").value;

    if (!title || !question || correct === "Select Correct Answer") {
        alert("Please complete the quiz question specifications!");
        return;
    }

    if (!quizzes[title]) quizzes[title] = [];
    quizzes[title].push({ question, options: [opt1, opt2, opt3, opt4], correct });
    setData("infinity_quizzes", quizzes);

    alert("✅ Quiz question added!");
    document.getElementById("quizTitle").value = "";
    document.getElementById("quizQuestion").value = "";
}

// Authentication Logic
function studentLogin(e) {
    e.preventDefault();
    let email = sanitizeText(document.getElementById("studentEmail").value);
    let password = document.getElementById("studentPassword").value;

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    currentUser = user;
    setData("infinity_current_user", currentUser);
    showStudentDashboardView();
}

function teacherLogin(e) {
    e.preventDefault();
    hideLoginFormElements();
    document.getElementById("teacherDashboard").classList.remove("login-hidden");
}

function adminLogin(e) {
    e.preventDefault();
    let inputEmail = sanitizeText(document.getElementById("adminEmail").value);
    let inputPassword = document.getElementById("adminPassword").value;

    if (inputEmail.toLowerCase() === AUTHORIZED_ADMIN.email.toLowerCase() && inputPassword === AUTHORIZED_ADMIN.password) {
        hideLoginFormElements();
        document.getElementById("adminDashboard").classList.remove("login-hidden");
        renderAdminTables();
    } else {
        alert("⛔ Access Denied: You are not authorized to access the Administrator Portal!");
    }
}

function hideLoginFormElements() {
    document.getElementById("studentForm").classList.add("login-hidden");
    document.getElementById("teacherForm").classList.add("login-hidden");
    document.getElementById("adminForm").classList.add("login-hidden");
    const tabs = document.querySelector(".login-tabs");
    const reg = document.querySelector(".register-link");
    if(tabs) tabs.classList.add("login-hidden");
    if(reg) reg.classList.add("login-hidden");
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem("infinity_current_user");
    location.reload();
}

function registerUser(e) {
    e.preventDefault();
    let name = sanitizeText(document.getElementById("name").value);
    let email = sanitizeText(document.getElementById("email").value);
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    const newStudent = { id: Date.now(), name, email, enrolled: ["General"] };
    users.push({ name, email, password, enrolled: [] });
    studentsList.push(newStudent);

    setData("infinity_users", users);
    setData("infinity_students", studentsList);

    alert("Registration Successful! Please login.");
    window.location.href = "login.html";
}

function showStudentDashboardView() {
    hideLoginFormElements();
    document.getElementById("studentDashboard").classList.remove("login-hidden");
    goToHome();
}

// Render Admin Control Dashboard Tables
function renderAdminTables() {
    // 1. Render Students Table
    const studentTableBody = document.querySelector("#adminStudentsTable tbody");
    if (studentTableBody) {
        studentTableBody.innerHTML = "";
        studentsList.forEach(st => {
            let row = `<tr>
                <td>${escapeHTML(st.id)}</td>
                <td>${escapeHTML(st.name)}</td>
                <td>${escapeHTML(st.email)}</td>
                <td>${escapeHTML(st.enrolled ? st.enrolled.join(", ") : 'None')}</td>
            </tr>`;
            studentTableBody.innerHTML += row;
        });
    }

    // 2. Render Teachers Table
    const teacherTableBody = document.querySelector("#adminTeachersTable tbody");
    if (teacherTableBody) {
        teacherTableBody.innerHTML = "";
        teachersList.forEach(tc => {
            let row = `<tr>
                <td>${escapeHTML(tc.id)}</td>
                <td>${escapeHTML(tc.name)}</td>
                <td>${escapeHTML(tc.email)}</td>
                <td>${escapeHTML(tc.subject)}</td>
            </tr>`;
            teacherTableBody.innerHTML += row;
        });
    }

    // 3. Render Recorded Classes Table
    const classesTableBody = document.querySelector("#adminClassesTable tbody");
    if (classesTableBody) {
        classesTableBody.innerHTML = "";
        recordedClasses.forEach(rc => {
            let row = `<tr>
                <td>${escapeHTML(rc.title)}</td>
                <td>${escapeHTML(rc.subject)}</td>
                <td>${escapeHTML(rc.duration)} mins</td>
                <td>${escapeHTML(rc.instructor || 'Staff')}</td>
            </tr>`;
            classesTableBody.innerHTML += row;
        });
    }

    // 4. Render Notes Table
    const notesTableBody = document.querySelector("#adminNotesTable tbody");
    if (notesTableBody) {
        notesTableBody.innerHTML = "";
        notesList.forEach(nt => {
            let row = `<tr>
                <td>${escapeHTML(nt.title)}</td>
                <td>${escapeHTML(nt.subject)}</td>
                <td>${escapeHTML(nt.author)}</td>
                <td>${escapeHTML(nt.format)}</td>
            </tr>`;
            notesTableBody.innerHTML += row;
        });
    }
}

// Student Dashboard Navigation Views
function goToHome() {
    let content = document.getElementById("dashboardContent");
    if(!content) return;
    content.innerHTML = `
        <h3>Welcome to Infinity Learning, ${currentUser ? currentUser.name : 'Student'}!</h3>
        <p>Access your study material, live sessions, and recorded videos below.</p>
        <div class="courses-grid" style="margin-top:20px;">
            <div class="course-card" onclick="goToCourses()" style="cursor:pointer;">
                <h4>📚 Enrolled Courses</h4>
                <p>Browse through available subject topics.</p>
            </div>
            <div class="course-card" onclick="goToLiveClasses()" style="cursor:pointer;">
                <h4>🎥 Live Sessions</h4>
                <p>Join active live classes scheduled by teachers.</p>
            </div>
            <div class="course-card" onclick="goToRecordedClasses()" style="cursor:pointer;">
                <h4>📹 Recorded Classes</h4>
                <p>Watch recorded sessions anytime.</p>
            </div>
        </div>
    `;
}

function goToCourses() {
    let content = document.getElementById("dashboardContent");
    if(!content) return;
    let html = `<h3>Available Courses</h3><div class="courses-grid">`;
    courses.forEach(c => {
        html += `
            <div class="course-card">
                <h4>${escapeHTML(c.name)}</h4>
                <p>${escapeHTML(c.description)}</p>
                <button type="button" data-action="enroll-course" data-course-name="${escapeHTML(c.name)}">Enroll</button>
            </div>
        `;
    });
    html += `</div>`;
    content.innerHTML = html;
}

function goToLiveClasses() {
    let content = document.getElementById("dashboardContent");
    if(!content) return;
    let html = `<h3>Scheduled Live Classes</h3><div class="courses-grid">`;
    liveClasses.forEach(l => {
        html += `
            <div class="course-card">
                <h4>${escapeHTML(l.name || l.subject)}</h4>
                <p>Date: ${escapeHTML(l.date)} | Time: ${escapeHTML(l.time)}</p>
                <button type="button" data-action="join-class" data-class-name="${escapeHTML(l.name || l.subject)}">Join Class</button>
            </div>
        `;
    });
    html += `</div>`;
    content.innerHTML = html;
}

function goToRecordedClasses() {
    let content = document.getElementById("dashboardContent");
    if(!content) return;
    let html = `<h3>Recorded Video Classes</h3><div class="courses-grid">`;
    recordedClasses.forEach(r => {
        const videoHtml = r.videoUrl ? `<video src="${r.videoUrl}" controls></video>` : '';
        html += `
            <div class="course-card">
                ${videoHtml}
                <h4>${escapeHTML(r.title)}</h4>
                <p>${escapeHTML(r.description)}</p>
                <button type="button" data-action="watch-video" data-course-name="${escapeHTML(r.title)}">Watch Video</button>
            </div>
        `;
    });
    html += `</div>`;
    content.innerHTML = html;
}

function goToStudentProfile() {
    let content = document.getElementById("dashboardContent");
    if(!content) return;
    content.innerHTML = `
        <h3>My Profile</h3>
        <p><strong>Name:</strong> ${escapeHTML(currentUser ? currentUser.name : 'Student')}</p>
        <p><strong>Email:</strong> ${escapeHTML(currentUser ? currentUser.email : 'N/A')}</p>
    `;
}

function joinClass(className) {
    alert("Joining Live Class: " + className + "\nMeeting link active!");
}

function watchVideo(courseName) {
    alert("Streaming video for: " + courseName);
}

function enrollInCourse(courseName) {
    alert("✅ Successfully enrolled in " + courseName);
}

function sendMessage(e) {
    e.preventDefault();
    alert("Message sent successfully!");
    e.target.reset();
}
