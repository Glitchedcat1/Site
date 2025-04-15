// timer.js
const TIMER_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const timerElement = document.getElementById("timer");
const END_TIME_KEY = "timerEndTime";
let interval = null;
const DISABLED_KEY = "timerDisabled";

// Utility function to format time
function formatTime(ms) {
    const hours = String(Math.floor(ms / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    const seconds = String(Math.floor((ms % (1000 * 60)) / 1000)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

// Function to start the timer
function startTimer() {
    const savedEndTime = localStorage.getItem(END_TIME_KEY);
    let endTime = savedEndTime ? parseInt(savedEndTime, 10) : Date.now() + TIMER_DURATION;

    // Save the end time in localStorage
    localStorage.setItem(END_TIME_KEY, endTime);

    interval = setInterval(() => {
        const remainingTime = endTime - Date.now();

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerElement.textContent = "00:00:00"; // Display zero when time is up
            alert("Time is up!");
            localStorage.removeItem(END_TIME_KEY); // Clear the saved end time
        } else {
            timerElement.textContent = formatTime(remainingTime);
        }
    }, 1000);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(interval);
}

// Function to disable the timer
function disableTimer() {
    localStorage.setItem(DISABLED_KEY, "true");
    stopTimer();
    timerElement.textContent = "Timer Disabled";
    alert("Timer has been disabled.");
}

// Event listener for tab visibility changes
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopTimer(); // Stop the timer when the tab is inactive
    } else {
        startTimer(); // Resume the timer when the tab is active
    }
});

// Event listener for the disable button
document.getElementById("disableButton").addEventListener("click", () => {
    const userCode = document.getElementById("disableCode").value;
    if (userCode === "1234") { // Replace "1234" with your actual code
        disableTimer();
    } else {
        alert("Incorrect code.");
    }
});

// Start the timer when the page loads
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem(DISABLED_KEY) !== "true") {
        startTimer();
    } else {
        timerElement.textContent = "Timer Disabled";
    }
});
