// Constants
const TIMER_KEY = "countdown_timer";
const DISABLED_KEY = "timer_disabled";
const RESET_DATE_KEY = "reset_date";
const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const DISABLE_CODE = "1234"; // Code to disable the timer

// Helper Functions
function formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function isNewDay() {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const lastResetDate = getLocalStorage(RESET_DATE_KEY);
    return today !== lastResetDate;
}

// Timer Logic
let timerEndTime = getLocalStorage(TIMER_KEY) || Date.now() + THREE_HOURS;
let timerDisabled = getLocalStorage(DISABLED_KEY) || false;

// Reset timer if it's a new day
if (isNewDay()) {
    timerEndTime = Date.now() + THREE_HOURS;
    timerDisabled = false;
    setLocalStorage(RESET_DATE_KEY, new Date().toISOString().split("T")[0]); // Save today's date
    setLocalStorage(DISABLED_KEY, false);
}

function updateTimer() {
    const now = Date.now();
    const remainingTime = timerEndTime - now;

    // If the timer is disabled, show a message
    if (timerDisabled) {
        document.getElementById("timer").textContent = "Timer Disabled for Today";
        return;
    }

    // If time is up, show "Access Denied" message
    if (remainingTime <= 0) {
        document.body.innerHTML = "<h1 style='text-align: center; margin-top: 20%;'>Access Denied. Please come back tomorrow.</h1>";
        return;
    }

    // Update the timer display
    document.getElementById("timer").textContent = formatTime(remainingTime);

    // Save the remaining time to localStorage
    setLocalStorage(TIMER_KEY, timerEndTime);

    // Continue updating
    requestAnimationFrame(updateTimer);
}

// Handle Timer Click
document.getElementById("timer").addEventListener("click", () => {
    const code = prompt("Enter the code to disable the timer:");
    if (code === DISABLE_CODE) {
        timerDisabled = true;
        setLocalStorage(DISABLED_KEY, true);
        document.getElementById("timer").textContent = "Timer Disabled for Today";
    } else {
        alert("Incorrect code. Try again.");
    }
});

// Start the timer
updateTimer();
