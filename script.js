// Infinity Learning JavaScript

const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHTML(value) {
    return String(value || '').replace(/[&<>\"'`=\/]/g, function (char) {
        return entityMap[char];
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isSecurePassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}

function sanitizeText(value) {
    return String(value || '').trim();
}

function loadUsers() {
    let users = localStorage.getItem("infinityLearningUsers");
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem("infinityLearningUsers", JSON.stringify(users));
}

function loadCurrentUser() {
    let user = localStorage.getItem("infinityLearningCurrentUser");
    return user ? JSON.parse(user) : null;
}

function saveUserState() {
    if (!currentUser) return;
    let existing = getUserByEmail(currentUser.email);
    if (existing) {
        Object.assign(existing, currentUser);
    } else {
        users.push(currentUser);
    }
    saveUsers(users);
}

function saveCurrentUser() {
    if (!currentUser) return;
    localStorage.setItem("infinityLearningCurrentUser", JSON.stringify(currentUser));
    saveUserState();
}

function clearCurrentUser() {
    currentUser = null;
    localStorage.removeItem("infinityLearningCurrentUser");
}

function getUserByEmail(email) {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function ensureUserDefaults(user) {
    user.enrolledCourses = user.enrolledCourses || [];
    user.watchHistory = user.watchHistory || [];
    user.memberSince = user.memberSince || new Date().toLocaleDateString();
    return user;
}

let currentUser = null;
let users = loadUsers();

function showGreeting() {
    let hour = new Date().getHours();
    let message = "";

    if (hour < 12) {
        message = "🌞 Good Morning!";
    } else if (hour < 18) {
        message = "☀️ Good Afternoon!";
    } else {
        message = "🌙 Good Evening!";
    }

    console.log(message);
}

function handleDataAction(event) {
    let actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;

    let action = actionElement.dataset.action;
    switch (action) {
        case "switch-login-type":
            switchLoginType(actionElement.dataset.loginType);
            break;
        case "upload-course":
            uploadCourse();
            break;
        case "upload-recorded-class":
            uploadRecordedClass();
            break;
        case "schedule-live-class":
            scheduleLiveClass();
            break;
        case "create-quiz":
            createQuiz();
            break;
        case "teacher-logout":
            teacherLogout();
            break;
        case "student-logout":
            studentLogout();
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
        case "go-to-contact-details":
            goToContactDetails();
            break;
        case "go-to-student-dashboard":
            goToStudentDashboard();
            break;
        case "join-class":
            joinClass(actionElement.dataset.className);
            break;
        case "watch-video":
            watchVideo(actionElement.dataset.courseName);
            break;
        case "enroll-course":
            enrollInCourse(actionElement.dataset.courseName);
            break;
        case "start-quiz":
            startQuiz(actionElement.dataset.quizName);
            break;
        case "edit-profile":
            alert("Edit Profile feature coming soon!");
            break;
        case "download-certificate":
            alert("Download Certificate feature coming soon!");
            break;
        case "submit-quiz-answer":
            submitQuizAnswer(actionElement.dataset.quizTitle, Number(actionElement.dataset.questionIndex));
            break;
        case "end-quiz":
            endQuiz();
            break;
    }
}

function handleSubmitEvent(event) {
    let form = event.target;
    if (!form || !form.dataset || !form.dataset.action) return;

    let action = form.dataset.action;
    event.preventDefault();

    switch (action) {
        case "send-contact-message":
            sendContactMessage(event);
            break;
        case "register-user":
            registerUser(event);
            break;
        case "send-message":
            sendMessage(event);
            break;
    }
}

function initPage() {
    let studentForm = document.getElementById("studentForm");
    let teacherForm = document.getElementById("teacherForm");
    let registerForm = document.getElementById("registerForm");
    let contactForm = document.getElementById("contactForm");

    if (studentForm) {
        studentForm.addEventListener("submit", studentLogin);
    }
    if (teacherForm) {
        teacherForm.addEventListener("submit", teacherLogin);
    }
    if (registerForm) {
        registerForm.addEventListener("submit", registerUser);
    }
    if (contactForm) {
        contactForm.addEventListener("submit", sendMessage);
    }

    currentUser = loadCurrentUser();
    users = loadUsers();
    if (currentUser && document.getElementById("studentDashboard")) {
        document.getElementById("studentForm").classList.add("login-hidden");
        document.getElementById("teacherForm").classList.add("login-hidden");
        document.querySelector(".login-tabs").classList.add("login-hidden");
        let registerLink = document.querySelector(".register-link");
        if (registerLink) {
            registerLink.classList.add("login-hidden");
        }
        document.getElementById("studentDashboard").classList.remove("login-hidden");
    }
    document.body.addEventListener("click", handleDataAction);
    document.body.addEventListener("submit", handleSubmitEvent);
    showGreeting();
}

window.addEventListener("DOMContentLoaded", initPage);

// Switch Login Type (Student/Teacher)
function switchLoginType(type) {
    let studentForm = document.getElementById("studentForm");
    let teacherForm = document.getElementById("teacherForm");
    let tabButtons = document.querySelectorAll(".tab-button");

    if (type === "student") {
        studentForm.classList.remove("login-hidden");
        teacherForm.classList.add("login-hidden");
        tabButtons[0].classList.add("active");
        tabButtons[1].classList.remove("active");
    } else if (type === "teacher") {
        studentForm.classList.add("login-hidden");
        teacherForm.classList.remove("login-hidden");
        tabButtons[0].classList.remove("active");
        tabButtons[1].classList.add("active");
    }
}

// Footer Year
let year = new Date().getFullYear();
console.log("Current Year: " + year);
// Live Class Button

function joinClass() {
    alert("Live Class will start soon!\nMeeting link will be available here.");
}
// Watch Video Function
function watchVideo(courseName) {
    if (!currentUser) {
        alert("Please login to watch videos and track your history.");
        return;
    }

    currentUser.watchHistory = currentUser.watchHistory || [];
    currentUser.watchHistory.unshift({
        title: courseName,
        watchedAt: new Date().toLocaleString()
    });
    saveCurrentUser();

    alert("Now Playing: " + courseName + " Course\nYour watch history has been updated.");
}

function enrollInCourse(courseName) {
    if (!currentUser) {
        alert("Please login first to enroll in courses.");
        return;
    }

    currentUser.enrolledCourses = currentUser.enrolledCourses || [];
    if (!currentUser.enrolledCourses.includes(courseName)) {
        currentUser.enrolledCourses.push(courseName);
        saveCurrentUser();
        alert("✅ Enrolled successfully in " + courseName + "!");
    } else {
        alert("You are already enrolled in " + courseName + ".");
    }
}
// Register Function

function registerUser(event){

    event.preventDefault();

    let name = sanitizeText(document.getElementById("name").value);
    let email = sanitizeText(document.getElementById("email").value);
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;

    if(name === "" || email === "" || password === ""){
        alert("All fields are required!");
        return;
    }

    if(!isValidEmail(email)){
        alert("Please enter a valid email address.");
        return;
    }

    if(password !== confirm){
        alert("Passwords do not match!");
        return;
    }

    if(password.length < 6){
        alert("Password must be at least 6 characters long!");
        return;
    }

    if(getUserByEmail(email)){
        alert("An account with this email already exists. Please log in.");
        return;
    }

    let newUser = ensureUserDefaults({
        name: name,
        email: email,
        password: password,
        memberSince: new Date().toLocaleDateString(),
        enrolledCourses: [],
        watchHistory: []
    });

    users.push(newUser);
    saveUsers(users);

    alert("Registration Successful!");
    window.location.href = "login.html";
}

// Teacher Login Function
function teacherLogin(event) {
    event.preventDefault();
    
    let email = document.querySelector("#teacherForm input[type='email']").value;
    let password = document.querySelector("#teacherForm input[type='password']").value;
    
    if(email === "" || password === "") {
        alert("Please enter both email and password!");
        return;
    }
    
    // Simulate teacher login
    alert("🎓 Welcome Teacher!\nLogged in successfully.");
    
    // Hide login form and show dashboard
    document.getElementById("teacherForm").classList.add("login-hidden");
    document.getElementById("studentForm").classList.add("login-hidden");
    document.querySelector(".login-tabs").classList.add("login-hidden");
    let registerLink = document.querySelector(".register-link");
    if(registerLink) {
        registerLink.classList.add("login-hidden");
    }
    document.getElementById("teacherDashboard").classList.remove("login-hidden");
}

// Teacher Logout Function
function teacherLogout() {
    alert("Thank you for using Infinity Learning!\nYou have been logged out.");
    
    // Show login form and hide dashboard
    document.getElementById("teacherForm").classList.remove("login-hidden");
    document.getElementById("studentForm").classList.remove("login-hidden");
    document.querySelector(".login-tabs").classList.remove("login-hidden");
    let registerLink = document.querySelector(".register-link");
    if(registerLink) {
        registerLink.classList.remove("login-hidden");
    }
    document.getElementById("teacherDashboard").classList.add("login-hidden");
    
    // Clear form fields
    document.getElementById("teacherForm").reset();
}

// Upload Recorded Class Function (for teachers)
function uploadRecordedClass() {
    let videoFile = document.getElementById("recordedVideo").value;
    let classTitle = document.getElementById("recordedClassTitle").value;
    let subject = document.getElementById("recordedClassSubject").value;
    let duration = document.getElementById("recordedDuration").value;
    let description = document.getElementById("recordedDescription").value;
    
    if(videoFile === "" || classTitle === "" || subject === "" || duration === "") {
        alert("Please fill in all required fields!");
        return;
    }
    
    // Store recorded class
    recordedClasses.push({
        title: classTitle,
        subject: subject,
        duration: duration,
        description: description,
        instructor: "Teacher",
        uploadedDate: new Date().toLocaleDateString()
    });
    
    alert("✅ Recorded class uploaded successfully!\nTitle: " + classTitle + "\nSubject: " + subject);
    
    // Clear inputs
    document.getElementById("recordedVideo").value = "";
    document.getElementById("recordedClassTitle").value = "";
    document.getElementById("recordedClassSubject").value = "";
    document.getElementById("recordedDuration").value = "";
    document.getElementById("recordedDescription").value = "";
}

// Schedule Live Class Function (for teachers)
function scheduleLiveClass() {
    let className = document.getElementById("liveClassName").value;
    let subject = document.getElementById("liveClassSubject").value;
    let date = document.getElementById("liveScheduleDate").value;
    let time = document.getElementById("liveScheduleTime").value;
    let duration = document.getElementById("liveScheduleDuration").value;
    let topic = document.getElementById("liveClassTopic").value;
    
    if(className === "" || subject === "" || date === "" || time === "" || duration === "Select Duration" || topic === "") {
        alert("Please fill in all required fields!");
        return;
    }
    
    // Store live class
    liveClasses.push({
        name: className,
        subject: subject,
        instructor: "Teacher",
        date: date,
        time: time,
        duration: duration,
        topic: topic
    });
    
    alert("✅ Live class scheduled successfully!\nClass: " + className + "\nDate: " + date + " at " + time);
    
    // Clear inputs
    document.getElementById("liveClassName").value = "";
    document.getElementById("liveClassSubject").value = "";
    document.getElementById("liveScheduleDate").value = "";
    document.getElementById("liveScheduleTime").value = "";
    document.getElementById("liveScheduleDuration").value = "Select Duration";
    document.getElementById("liveClassTopic").value = "";
}

// Student Login Function
function studentLogin(event) {
    event.preventDefault();
    
    let email = sanitizeText(document.getElementById("studentEmail").value);
    let password = document.getElementById("studentPassword").value;
    
    if(email === "" || password === "") {
        alert("Please enter both email and password!");
        return;
    }

    let user = getUserByEmail(email);
    if(!user || user.password !== password) {
        alert("Invalid email or password. Please try again.");
        return;
    }

    currentUser = ensureUserDefaults(Object.assign({}, user));
    saveCurrentUser();

    alert("✅ Welcome " + currentUser.name + "!\nLogged in successfully.");
    
    document.getElementById("studentForm").classList.add("login-hidden");
    document.getElementById("teacherForm").classList.add("login-hidden");
    document.querySelector(".login-tabs").classList.add("login-hidden");
    let registerLink = document.querySelector(".register-link");
    if(registerLink) {
        registerLink.classList.add("login-hidden");
    }
    document.getElementById("studentDashboard").classList.remove("login-hidden");
}

// Student Logout Function
function studentLogout() {
    alert("Thank you for learning with us!\nYou have been logged out.");
    clearCurrentUser();
    
    document.getElementById("studentForm").classList.remove("login-hidden");
    document.getElementById("teacherForm").classList.remove("login-hidden");
    document.querySelector(".login-tabs").classList.remove("login-hidden");
    let registerLink = document.querySelector(".register-link");
    if(registerLink) {
        registerLink.classList.remove("login-hidden");
    }
    document.getElementById("studentDashboard").classList.add("login-hidden");
    document.getElementById("studentQuizSection").classList.add("login-hidden");
    
    document.getElementById("studentForm").reset();
}

// Navigate to Student Dashboard
function goToStudentDashboard() {
    document.getElementById("studentQuizSection").classList.add("login-hidden");
    document.getElementById("studentDashboard").classList.remove("login-hidden");
}

// Navigate to Home
function goToHome() {
    let content = document.getElementById("dashboardContent");
    
    let homeHTML = `
        <div class="home-section">
            <h3>Welcome to Infinity Learning</h3>
            <p>Learn Without Limits - Empower yourself through quality education</p>
            
            <div class="dashboard-cards-grid" style="margin-top: 30px;">
                <div class="dashboard-card" data-action="go-to-courses" style="cursor: pointer;">
                    <h4>📚 Courses</h4>
                    <p>${courses.length} courses available</p>
                    <small>Click to view all courses</small>
                </div>
                
                <div class="dashboard-card" data-action="go-to-live-classes" style="cursor: pointer;">
                    <h4>🎥 Live Classes</h4>
                    <p>${liveClasses.length} classes scheduled</p>
                    <small>Click to view schedules</small>
                </div>
                
                <div class="dashboard-card" data-action="go-to-recorded-classes" style="cursor: pointer;">
                    <h4>📹 Recorded Classes</h4>
                    <p>${recordedClasses.length} classes available</p>
                    <small>Click to watch videos</small>
                </div>
                
                <div class="dashboard-card" data-action="go-to-student-profile" style="cursor: pointer;">
                    <h4>👤 My Profile</h4>
                    <p>View your details</p>
                    <small>Click to view profile</small>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = homeHTML;
}

// Upload Course Function (for teachers)
function uploadCourse() {
    let courseName = document.getElementById("courseName").value;
    let courseDescription = document.getElementById("courseDescription").value;
    let courseDetails = document.getElementById("courseDetails").value;
    
    if(courseName === "" || courseDescription === "") {
        alert("Please fill in course name and description!");
        return;
    }
    
    // Store course
    courses.push({
        name: courseName,
        description: courseDescription,
        details: courseDetails,
        uploadedBy: "Teacher",
        uploadedDate: new Date().toLocaleDateString()
    });
    
    alert("✅ Course uploaded successfully!\nCourse: " + courseName);
    
    // Clear inputs
    document.getElementById("courseName").value = "";
    document.getElementById("courseDescription").value = "";
    document.getElementById("courseDetails").value = "";
}

// Navigate to Courses
function goToCourses() {
    let content = document.getElementById("dashboardContent");
    
    if(courses.length === 0) {
        content.innerHTML = `
            <div class="courses-section">
                <h3>Available Courses</h3>
                <p style="color: #666; margin-top: 20px;">No courses available yet. Please check back later when teachers upload courses!</p>
            </div>
        `;
        return;
    }
    
    let coursesHTML = `
        <div class="courses-section">
            <h3>Available Courses</h3>
            <div class="courses-list">
    `;
    
    courses.forEach((course) => {
        coursesHTML += `
            <div class="course-item">
                <h4>📚 ${course.name}</h4>
                <p>${course.description}</p>
                <p style="font-size: 14px; color: #666; margin-top: 10px;">${course.details}</p>
                <p style="font-size: 12px; color: #999; margin-top: 8px;">Uploaded: ${course.uploadedDate}</p>
                <button type="button" data-action="enroll-course" data-course-name="${escapeHTML(course.name)}">Enroll Now</button>
            </div>
        `;
    });
    
    coursesHTML += `
            </div>
        </div>
    `;
    
    content.innerHTML = coursesHTML;
}

// Navigate to Live Classes
function goToLiveClasses() {
    let content = document.getElementById("dashboardContent");
    
    if(liveClasses.length === 0) {
        content.innerHTML = `
            <div class="live-classes-section">
                <h3>Live Classes</h3>
                <p style="color: #666; margin-top: 20px;">No live classes scheduled yet. Please check back later!</p>
            </div>
        `;
        return;
    }
    
    let liveHTML = `
        <div class="live-classes-section">
            <h3>Live Classes</h3>
            <div class="live-list">
    `;
    
    liveClasses.forEach((liveClass) => {
        liveHTML += `
            <div class="live-item">
                <h4>🎥 ${liveClass.name}</h4>
                <p><strong>Subject:</strong> ${liveClass.subject}</p>
                <p><strong>Instructor:</strong> ${liveClass.instructor}</p>
                <p><strong>Date:</strong> ${liveClass.date}</p>
                <p><strong>Time:</strong> ${liveClass.time}</p>
                <p><strong>Duration:</strong> ${liveClass.duration}</p>
                <p><strong>Topic:</strong> ${liveClass.topic}</p>
                <button type="button" data-action="join-class" data-class-name="${escapeHTML(liveClass.name)}">Join Class</button>
            </div>
        `;
    });
    
    liveHTML += `
            </div>
        </div>
    `;
    
    content.innerHTML = liveHTML;
}

// Navigate to Recorded Classes
function goToRecordedClasses() {
    let content = document.getElementById("dashboardContent");
    
    if(recordedClasses.length === 0) {
        content.innerHTML = `
            <div class="recorded-classes-section">
                <h3>Recorded Classes</h3>
                <p style="color: #666; margin-top: 20px;">No recorded classes available yet. Please check back later!</p>
            </div>
        `;
        return;
    }
    
    let recordedHTML = `
        <div class="recorded-classes-section">
            <h3>Recorded Classes</h3>
            <div class="recorded-list">
    `;
    
    recordedClasses.forEach((recordedClass) => {
        recordedHTML += `
            <div class="recorded-item">
                <h4>📹 ${recordedClass.title}</h4>
                <p><strong>Subject:</strong> ${recordedClass.subject}</p>
                <p><strong>Instructor:</strong> ${recordedClass.instructor}</p>
                <p><strong>Duration:</strong> ${recordedClass.duration} minutes</p>
                <p><strong>Uploaded:</strong> ${recordedClass.uploadedDate}</p>
                <p>${recordedClass.description}</p>
                <button type="button" data-action="watch-video" data-course-name="${escapeHTML(recordedClass.title)}">Watch Now</button>
            </div>
        `;
    });
    
    recordedHTML += `
            </div>
        </div>
    `;
    
    content.innerHTML = recordedHTML;
}

// Navigate to Quiz
function goToQuiz() {
    document.getElementById("studentDashboard").classList.add("login-hidden");
    document.getElementById("studentQuizSection").classList.remove("login-hidden");
}

// Navigate to Contact Details
function goToContactDetails() {
    let content = document.getElementById("dashboardContent");
    content.innerHTML = `
        <div class="contact-section">
            <h3>Contact Us</h3>
            <div class="contact-info">
                <div class="contact-item">
                    <h4>📧 Email</h4>
                    <p>ajaychichuchil@gmail.com</p>
                    <p style="font-size: 14px; color: #666;">For inquiries and support</p>
                </div>
                <div class="contact-item">
                    <h4>📞 Phone</h4>
                    <p>+91 7416679400</p>
                    <p style="font-size: 14px; color: #666;">Available Monday to Friday, 9AM-6PM</p>
                </div>
                <div class="contact-item">
                    <h4>📍 Location</h4>
                    <p>Andhra Pradesh, India</p>
                    <p style="font-size: 14px; color: #666;">Our main office</p>
                </div>
            </div>
            
            <div class="contact-form-section" style="margin-top: 30px;">
                <h4>Send us a Message</h4>
                <form id="contactMessageForm" data-action="send-contact-message">
                    <input type="text" id="contactName" placeholder="Your Name" required>
                    <input type="email" id="contactEmail" placeholder="Your Email" required>
                    <textarea id="contactMessage" placeholder="Your Message" rows="5" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
    `;
}

// Send Contact Message
function sendContactMessage(event) {
    event.preventDefault();
    
    let name = document.getElementById("contactName").value;
    let email = document.getElementById("contactEmail").value;
    let message = document.getElementById("contactMessage").value;
    
    if(name === "" || email === "" || message === "") {
        alert("Please fill in all fields!");
        return;
    }
    
    alert("✅ Message Sent Successfully!\n\nThank you " + name + "!\nWe will get back to you soon at " + email);
    
    // Clear form
    document.getElementById("contactMessageForm").reset();
}

// Navigate to Student Profile
function goToStudentProfile() {
    if (!currentUser) {
        alert("Please login first to view your profile.");
        return;
    }

    let content = document.getElementById("dashboardContent");
    let enrolledList = currentUser.enrolledCourses.length > 0 ? currentUser.enrolledCourses.map((course) => `<li>${escapeHTML(course)}</li>`).join("") : "<li>No courses enrolled yet.</li>";
    let watchList = currentUser.watchHistory.length > 0 ? currentUser.watchHistory.map((entry) => `<li>${escapeHTML(entry.title)} <span class=\"history-time\">(${escapeHTML(entry.watchedAt)})</span></li>`).join("") : "<li>No videos watched yet.</li>";

    content.innerHTML = `
        <div class="profile-section">
            <h3>👤 Student Profile</h3>
            
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">👨‍🎓</div>
                    <div class="profile-info">
                        <h4>${escapeHTML(currentUser.name)}</h4>
                        <p>${escapeHTML(currentUser.email)}</p>
                    </div>
                </div>
                
                <div class="profile-stats">
                    <div class="stat-item">
                        <h5>Enrolled Courses</h5>
                        <p class="stat-number">${currentUser.enrolledCourses.length}</p>
                    </div>
                    <div class="stat-item">
                        <h5>Watch History</h5>
                        <p class="stat-number">${currentUser.watchHistory.length}</p>
                    </div>
                    <div class="stat-item">
                        <h5>Member Since</h5>
                        <p class="stat-number">${escapeHTML(currentUser.memberSince)}</p>
                    </div>
                </div>
                
                <div class="profile-details">
                    <h5>Profile Information</h5>
                    <p><strong>Name:</strong> ${escapeHTML(currentUser.name)}</p>
                    <p><strong>Email:</strong> ${escapeHTML(currentUser.email)}</p>
                    <p><strong>Status:</strong> Active Learner</p>
                </div>
                
                <div class="profile-details">
                    <h5>Enrolled Courses</h5>
                    <ul class="profile-list">${enrolledList}</ul>
                </div>
                
                <div class="profile-details">
                    <h5>Watch History</h5>
                    <ul class="profile-list">${watchList}</ul>
                </div>
                
                <div class="profile-action">
                    <button type="button" data-action="edit-profile">Edit Profile</button>
                    <button type="button" data-action="download-certificate">Download Certificate</button>
                </div>
            </div>
        </div>
    `;
}

// Data storage (in-memory for now, can be enhanced with backend)
let quizzes = [];
let recordedClasses = [];
let liveClasses = [];
let courses = [];

// Create Quiz Function (for teachers)
function createQuiz() {
    let quizTitle = document.getElementById("quizTitle").value;
    let quizQuestion = document.getElementById("quizQuestion").value;
    let option1 = document.getElementById("quizOption1").value;
    let option2 = document.getElementById("quizOption2").value;
    let option3 = document.getElementById("quizOption3").value;
    let option4 = document.getElementById("quizOption4").value;
    let correctAnswer = document.getElementById("correctAnswer").value;
    
    if(quizTitle === "" || quizQuestion === "" || correctAnswer === "Select Correct Answer") {
        alert("Please fill in all fields!");
        return;
    }
    
    if(option1 === "" || option2 === "" || option3 === "" || option4 === "") {
        alert("Please enter all four options!");
        return;
    }
    
    // Store quiz question
    if(!quizzes[quizTitle]) {
        quizzes[quizTitle] = [];
    }
    
    quizzes[quizTitle].push({
        question: quizQuestion,
        options: [option1, option2, option3, option4],
        correctAnswer: correctAnswer
    });
    
    alert("✅ Question added to quiz: " + quizTitle + "\n\nTotal questions: " + quizzes[quizTitle].length);
    
    // Clear inputs
    document.getElementById("quizTitle").value = "";
    document.getElementById("quizQuestion").value = "";
    document.getElementById("quizOption1").value = "";
    document.getElementById("quizOption2").value = "";
    document.getElementById("quizOption3").value = "";
    document.getElementById("quizOption4").value = "";
    document.getElementById("correctAnswer").value = "Select Correct Answer";
}

// Start Quiz Function (for students)
function startQuiz(quizName) {
    let quizzes_array = Object.keys(quizzes);
    
    if(quizzes_array.length === 0) {
        alert("No quizzes available yet. Please wait for your teacher to create quizzes.");
        return;
    }
    
    // For now, use the first available quiz
    let currentQuizTitle = quizzes_array[0];
    let currentQuiz = quizzes[currentQuizTitle];
    
    if(!currentQuiz || currentQuiz.length === 0) {
        alert("No questions in this quiz yet.");
        return;
    }
    
    // Display first question
    displayQuizQuestion(currentQuizTitle, 0);
}

// Display Quiz Question
function displayQuizQuestion(quizTitle, questionIndex) {
    let currentQuiz = quizzes[quizTitle];
    let question = currentQuiz[questionIndex];
    
    let quizHTML = `
        <div class="quiz-container">
            <h3>${quizTitle}</h3>
            <p>Question ${questionIndex + 1} of ${currentQuiz.length}</p>
            <p><strong>${question.question}</strong></p>
            <div class="quiz-options">
    `;
    
    question.options.forEach((option, index) => {
        quizHTML += `
            <label>
                <input type="radio" name="quizOption" value="${option}">
                ${option}
            </label><br>
        `;
    });
    
    quizHTML += `
            </div>
            <button type="button" data-action="submit-quiz-answer" data-quiz-title="${escapeHTML(quizTitle)}" data-question-index="${questionIndex}">Next Question</button>
            <button type="button" data-action="end-quiz">End Quiz</button>
        </div>
    `;
    
    // Replace quiz list with quiz interface
    document.getElementById("quizList").innerHTML = quizHTML;
}

// Submit Quiz Answer
function submitQuizAnswer(quizTitle, questionIndex) {
    let selectedOption = document.querySelector("input[name='quizOption']:checked");
    
    if(!selectedOption) {
        alert("Please select an answer!");
        return;
    }
    
    let currentQuiz = quizzes[quizTitle];
    let question = currentQuiz[questionIndex];
    let nextIndex = questionIndex + 1;
    
    if(nextIndex < currentQuiz.length) {
        displayQuizQuestion(quizTitle, nextIndex);
    } else {
        alert("✅ Quiz Completed!\n\nThank you for taking the quiz. Your answers have been recorded.");
        document.getElementById("studentQuizSection").classList.add("login-hidden");
        document.getElementById("studentForm").classList.remove("login-hidden");
    }
}

// End Quiz
function endQuiz() {
    alert("Quiz ended. Your progress has been saved.");
    document.getElementById("quizList").innerHTML = `
        <div class="quiz-card">
            <h3>Sample Quiz</h3>
            <p>Math - Basic Arithmetic</p>
            <button type="button" data-action="start-quiz" data-quiz-name="sample">Start Quiz</button>
        </div>
    `;
}

// Contact Form Handler
function sendMessage(event) {
    event.preventDefault();
    
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    
    if(name === "" || email === "" || message === "") {
        alert("Please fill in all fields!");
        return;
    }
    
    if(!email.includes("@")) {
        alert("Please enter a valid email address!");
        return;
    }
    
    alert("✅ Message Sent Successfully!\n\nThank you " + name + "!\nWe will get back to you soon at " + email);
    
    // Clear form
    document.getElementById("contactForm").reset();
}