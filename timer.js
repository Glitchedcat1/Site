// timer.js
const TIMER_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const timerElement = document.getElementById("timer");
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
    // Check if the timer is disabled
    if (localStorage.getItem(DISABLED_KEY) === "true") {
        timerElement.textContent = "Timer Disabled";
        return;
    }

    let endTime = Date.now() + TIMER_DURATION;

    const interval = setInterval(() => {
        const remainingTime = endTime - Date.now();

        if (remainingTime <= 0) {
            clearInterval(interval);
            timerElement.textContent = "00:00:00"; // Display zero when time is up
            alert("Time is up!");
        } else {
            timerElement.textContent = formatTime(remainingTime);
        }
    }, 1000);
}

// Function to disable the timer
function disableTimer() {
    localStorage.setItem(DISABLED_KEY, "true");
    timerElement.textContent = "Timer Disabled";
    alert("Timer has been disabled for the rest of the day.");
}

// Event listener for disabling the timer
document.addEventListener("DOMContentLoaded", () => {
    startTimer();

    // Add a click event to disable the timer
    timerElement.addEventListener("click", () => {
        const userCode = prompt("Enter the code to disable the timer:");
        if (userCode === "1234") { // Replace "1234" with your actual code
            disableTimer();
        } else {
            alert("Incorrect code.");
        }
    });
});

