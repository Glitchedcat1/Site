// Constants
const TIMER_KEY = "countdown_timer";
const TIMER_PAUSED_KEY = "timer_paused";
const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

// Helper Functions
function formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

// Timer Logic
let timerEndTime = parseInt(getCookie(TIMER_KEY)) || Date.now() + THREE_HOURS;
let timerPausedTime = parseInt(getCookie(TIMER_PAUSED_KEY)) || null;

function updateTimer() {
    const now = Date.now();

    // If the timer is paused, show the paused time
    if (timerPausedTime) {
        document.getElementById("timer").textContent = formatTime(timerPausedTime - now);
        return;
    }

    // Calculate remaining time
    const remainingTime = timerEndTime - now;

    // If time is up, block access
    if (remainingTime <= 0) {
        document.body.innerHTML = "<h1 style='text-align: center; margin-top: 20%;'>Access Denied. Please come back tomorrow.</h1>";
        return;
    }

    // Update the timer display
    document.getElementById("timer").textContent = formatTime(remainingTime);

    // Continue updating
    requestAnimationFrame(updateTimer);
}

// Pause the timer when the user leaves the site
window.addEventListener("beforeunload", () => {
    const now = Date.now();
    const remainingTime = timerEndTime - now;

    // Save the remaining time in a cookie
    setCookie(TIMER_PAUSED_KEY, remainingTime, 1);
});

// Resume the timer when the user returns to the site
window.addEventListener("load", () => {
    const now = Date.now();

    // Check if the timer was paused
    if (timerPausedTime) {
        timerEndTime = now + timerPausedTime;
        setCookie(TIMER_KEY, timerEndTime, 1);
        setCookie(TIMER_PAUSED_KEY, "", -1); // Clear the paused time cookie
    }

    // Start the timer
    updateTimer();
});

