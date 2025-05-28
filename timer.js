// Constants
const TIMER_KEY = "countdown_timer";
const DISABLED_KEY = "timer_disabled";
const RESET_DATE_KEY = "reset_date";
const THREE_HOURS = 3 * 60 * 60 * 1000;
const REQUIRE_UPLOAD_THRESHOLD = THREE_HOURS - (1 * 60 * 60 * 1000 + 59 * 60 * 1000);
const DISABLE_CODE = "1234";

// Helpers
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
function isNewDay(lastResetDate) {
    const today = new Date().toISOString().split("T")[0];
    return today !== lastResetDate;
}

// Globals
let timerEndTime = getLocalStorage(TIMER_KEY);
let timerDisabled = getLocalStorage(DISABLED_KEY);
let resetDate = getLocalStorage(RESET_DATE_KEY);

// Reset logic
if (!timerEndTime || isNewDay(resetDate)) {
    timerEndTime = Date.now() + THREE_HOURS;
    timerDisabled = false;
    resetDate = new Date().toISOString().split("T")[0];
    setLocalStorage(TIMER_KEY, timerEndTime);
    setLocalStorage(DISABLED_KEY, timerDisabled);
    setLocalStorage(RESET_DATE_KEY, resetDate);
}

const timeRemaining = timerEndTime - Date.now();

// Handle file upload (if required)
function uploadTimerState(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const state = JSON.parse(e.target.result);
            timerEndTime = state.timerEndTime;
            timerDisabled = state.timerDisabled;
            resetDate = state.resetDate;

            setLocalStorage(TIMER_KEY, timerEndTime);
            setLocalStorage(DISABLED_KEY, timerDisabled);
            setLocalStorage(RESET_DATE_KEY, resetDate);

            startTimerUI();
        } catch {
            alert("Invalid timer file.");
        }
    };
    reader.readAsText(file);
}

// Start UI loop
function updateTimer() {
    const now = Date.now();
    const remainingTime = timerEndTime - now;

    if (timerDisabled) {
        document.getElementById("timer").textContent = "Timer Disabled for Today";
        return;
    }

    if (remainingTime <= 0) {
        document.body.innerHTML = "<h1 style='text-align:center; margin-top:20%;'>Access Denied. Please come back tomorrow.</h1>";
        const iframe = document.getElementById("mathIframe");
        if (iframe) iframe.style.display = "none";
        return;
    }

    document.getElementById("timer").textContent = formatTime(remainingTime);
    setLocalStorage(TIMER_KEY, timerEndTime);
    requestAnimationFrame(updateTimer);
}

// Timer interaction
function startTimerUI() {
    updateTimer();

    document.getElementById("timer").addEventListener("click", () => {
        const code = prompt("Enter code to disable timer:");
        if (code === DISABLE_CODE) {
            timerDisabled = true;
            setLocalStorage(DISABLED_KEY, true);
            document.getElementById("timer").textContent = "Timer Disabled for Today";
        } else {
            alert("Incorrect code.");
        }
    });

    window.addEventListener("beforeunload", () => {
        const timerState = {
            timerEndTime,
            timerDisabled,
            resetDate
        };
        const blob = new Blob([JSON.stringify(timerState)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "timer_state.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
    });
}

// Load conditionally based on remaining time
window.addEventListener("load", () => {
    if (timeRemaining > REQUIRE_UPLOAD_THRESHOLD) {
        startTimerUI();
    } else {
        const upload = document.createElement("input");
        upload.type = "file";
        upload.accept = ".json";
        upload.style.display = "none";
        upload.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadTimerState(file);
            } else {
                alert("Timer file required to continue.");
            }
        });
        document.body.appendChild(upload);
        upload.click();
    }
});
