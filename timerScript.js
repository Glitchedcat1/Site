// Constants
const TIMER_KEY = "timerEndTime";
const DISABLED_KEY = "timerDisabled";
const RESET_DATE_KEY = "resetDate";
const TIMER_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const CODE = "1234"; // Code to disable the timer

// DOM Elements
const timerElement = document.getElementById("timer");

// Utility Functions
function formatTime(ms) {
    const hours = String(Math.floor(ms / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    const seconds = String(Math.floor((ms % (1000 * 60)) / 1000)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function closeTab() {
    alert("You need to exit the page.");
    window.close();
}

// Timer Logic
function startTimer() {
    const now = Date.now();
    const resetDate = localStorage.getItem(RESET_DATE_KEY);
    const today = new Date().toISOString().split("T")[0];

    // Reset timer if it's a new day
    if (resetDate !== today) {
        localStorage.setItem(RESET_DATE_KEY, today);
        localStorage.removeItem(TIMER_KEY);
        localStorage.removeItem(DISABLED_KEY);
    }

    // Check if the timer is disabled
    if (localStorage.getItem(DISABLED_KEY) === "true") {
        timerElement.textContent = "Timer Disabled";
        return;
    }

    // Check if the timer has expired
    const timerEndTime = localStorage.getItem(TIMER_KEY);
    if (timerEndTime && now > parseInt(timerEndTime)) {
        closeTab();
        return;
    }

    // Start or continue the timer
    const endTime = timerEndTime ? parseInt(timerEndTime) : now + TIMER_DURATION;
    localStorage.setItem(TIMER_KEY, endTime);

    const interval = setInterval(() => {
        const remainingTime = endTime - Date.now();

        if (remainingTime <= 0) {
            clearInterval(interval);
            closeTab();
        } else {
            timerElement.textContent = formatTime(remainingTime);
        }
    }, 1000);
}

// Disable Timer Logic
timerElement.addEventListener("click", () => {
    const userCode = prompt("Enter the code to disable the timer:");
    if (userCode === CODE) {
        localStorage.setItem(DISABLED_KEY, "true");
        timerElement.textContent = "Timer Disabled";
        alert("Timer has been disabled for the rest of the day.");
    } else {
        alert("Incorrect code.");
    }
});

// Initialize Timer
startTimer();
