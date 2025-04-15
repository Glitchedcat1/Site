// Constants
const TIMER_DURATION = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const CODE = "1234"; // Code to disable the timer
const TIMER_KEY = "timerEndTime";
const DISABLED_KEY = "timerDisabled";
const RESET_DATE_KEY = "resetDate";
const SYNC_URL_1 = "https://mathhelpog1.netlify.app/sync"; // URL to sync with the first website
const SYNC_URL_2 = "https://mathhelpog2.netlify.app/sync"; // URL to sync with the second website

// DOM Elements
const timerElement = document.getElementById("timer");

// Utility Functions
function formatTime(ms) {
    const hours = String(Math.floor(ms / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    const seconds = String(Math.floor((ms % (1000 * 60)) / 1000)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

// Cookie Functions
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
}

// Sync Timer State
async function syncTimerState(endTime, disabled) {
    const syncData = { endTime, disabled };

    // Sync with the first website
    await fetch(SYNC_URL_1, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(syncData)
    });

    // Sync with the second website
    await fetch(SYNC_URL_2, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(syncData)
    });
}

// Timer Logic
async function startTimer() {
    const now = Date.now();
    const resetDate = getCookie(RESET_DATE_KEY);
    const today = new Date().toISOString().split("T")[0];

    // Reset timer if it's a new day
    if (resetDate !== today) {
        setCookie(RESET_DATE_KEY, today, 1);
        setCookie(TIMER_KEY, '', -1); // Clear the timer cookie
        setCookie(DISABLED_KEY, '', -1); // Clear the disabled cookie
    }

    // Check if the timer is disabled
    if (getCookie(DISABLED_KEY) === "true") {
        timerElement.textContent = "Timer Disabled";
        return;
    }

    // Check if the timer has expired
    const timerEndTime = getCookie(TIMER_KEY);
    if (timerEndTime && now > parseInt(timerEndTime)) {
        closeTab();
        return;
    }

    // Start or continue the timer
    const endTime = timerEndTime ? parseInt(timerEndTime) : now + TIMER_DURATION;
    setCookie(TIMER_KEY, endTime, 1); // Set the timer cookie for 1 day

    // Sync the timer state with both websites
    await syncTimerState(endTime, getCookie(DISABLED_KEY) === "true");

    const interval = setInterval(() => {
        const remainingTime = endTime - Date.now();

        if (remainingTime <= 0) {
            clearInterval(interval);
            closeTab();
        } else {
            timerElement.textContent = formatTime(remainingTime);
        }
    }, 1000);

    // Save the interval ID so it can be cleared when the user exits the page
    window.timerInterval = interval;
}

// Disable Timer Logic
timerElement.addEventListener("click", () => {
    const userCode = prompt("Enter the code to disable the timer:");
    if (userCode === CODE) {
        setCookie(DISABLED_KEY, "true", 1); // Disable the timer for the rest of the day
        timerElement.textContent = "Timer Disabled";
        alert("Timer has been disabled for the rest of the day.");
    } else {
        alert("Incorrect code.");
    }
});

// Pause Timer on Exit
window.addEventListener("beforeunload", () => {
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }
});

// Resume Timer on Entry
window.addEventListener("load", () => {
    startTimer();
});
