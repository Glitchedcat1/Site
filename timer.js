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
let timerEndTime;
let timerDisabled;

// Function to initialize the timer
function initializeTimer() {
    // Check if it's a new day
    if (isNewDay()) {
        timerEndTime = Date.now() + THREE_HOURS;
        timerDisabled = false;
        setLocalStorage(RESET_DATE_KEY, new Date().toISOString().split("T")[0]); // Save today's date
        setLocalStorage(DISABLED_KEY, false);
    } else {
        timerEndTime = getLocalStorage(TIMER_KEY) || Date.now() + THREE_HOURS;
        timerDisabled = getLocalStorage(DISABLED_KEY) || false;
    }

    updateTimer();
}

// Function to update the timer display
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

    // Save the timer end time to localStorage
    setLocalStorage(TIMER_KEY, timerEndTime);

    // Continue updating
    requestAnimationFrame(updateTimer);
}

// Function to handle file download
function downloadTimerState() {
    const timerState = {
        timerEndTime,
        timerDisabled,
        resetDate: getLocalStorage(RESET_DATE_KEY)
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timerState));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "timer_state.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Function to handle file upload
function uploadTimerState(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const timerState = JSON.parse(event.target.result);
            timerEndTime = timerState.timerEndTime;
            timerDisabled = timerState.timerDisabled;
            setLocalStorage(TIMER_KEY, timerEndTime);
            setLocalStorage(DISABLED_KEY, timerDisabled);
            setLocalStorage(RESET_DATE_KEY, timerState.resetDate);
            updateTimer();
        } catch (e) {
            alert("Invalid timer state file.");
        }
    };
    reader.readAsText(file);
}

// Prompt user to upload timer state on page load
window.addEventListener('load', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadTimerState(file);
        } else {
            alert("No file selected. Cannot proceed.");
        }
    });
    document.body.appendChild(fileInput);
    fileInput.click();
});

// Handle Timer Click to disable
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

// Save timer state and download on page unload
window.addEventListener('beforeunload', (event) => {
    downloadTimerState();
});
