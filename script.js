// Infinity Learning JavaScript

// Welcome message (only once)
window.onload = function () {
    alert("Welcome to Infinity Learning!");
    showGreeting();
};

// Display greeting based on time
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

// Explore Courses Button
let exploreButton = document.querySelector(".hero button");

if (exploreButton) {
    exploreButton.addEventListener("click", function () {
        alert("Explore our amazing courses!");

        let courseSection = document.querySelector(".courses");

        if (courseSection) {
            courseSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}

// Enroll Buttons
let enrollButtons = document.querySelectorAll(".course-card button");

enrollButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        alert("🎉 Congratulations!\nYou have successfully enrolled.");
    });
});

// Footer Year
let year = new Date().getFullYear();
console.log("Current Year: " + year);
// Live Class Button

function joinClass() {
    alert("Live Class will start soon!\nMeeting link will be available here.");
}
// Watch Video Function
function watchVideo(courseName) {
    alert("Now Playing: " + courseName + " Course");
}
// Register Function

function registerUser(event){

event.preventDefault();

let password=document.getElementById("password").value;
let confirm=document.getElementById("confirm").value;

if(password!==confirm){

alert("Passwords do not match!");
return;

}

alert("Registration Successful!");

window.location.href="login.html";

}