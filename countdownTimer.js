// Constants
const TIMER_KEY = "countdown_timer";
const THIRTY_SECONDS = 30 * 1000; // 30 seconds in milliseconds

// Helper Functions
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    return `${seconds.toString().padStart(2, "0")}`; // Display only seconds
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
let timerEndTime = parseInt(getCookie(TIMER_KEY)) || Date.now() + THIRTY_SECONDS;

function updateTimer() {
    const now = Date.now();
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

// Save Timer State on Page Unload
window.addEventListener("beforeunload", () => {
    setCookie(TIMER_KEY, timerEndTime, 1); // Save timer end time in cookie for 1 day
});

// Start the timer
updateTimer();
