// Constants
const TIMER_KEY = "countdown_timer";
const DISABLED_KEY = "timer_disabled";
const RESET_DATE_KEY = "reset_date";
const THREE_HOURS = 3 * 60 * 60 * 1000;
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
let timerEndTime;
let timerDisabled;
let resetDate;

// Timer update loop
function updateTimer() {
    const now = Date.now();
    const remainingTime = timerEndTime - now;

    if (timerDisabled) {
        document.getElementById("timer").textContent = "Timer Disabled for Today";
        return;
    }

    if (remainingTime <= 0) {
        document.body.innerHTML = "<h1 style='text-align:center; margin-top:20%;'>Access Denied. Please come back tomorrow.</h1>";
        return;
    }

    document.getElementById("timer").textContent = formatTime(remainingTime);
    setLocalStorage(TIMER_KEY, timerEndTime);
    requestAnimationFrame(updateTimer);
}

// Export timer state
function downloadTimerState() {
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
}

// Load timer state
function uploadTimerState(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const state = JSON.parse(e.target.result);
            timerEndTime = state.timerEndTime;
            timerDisabled = state.timerDisabled;
            resetDate = state.resetDate;

            if (isNewDay(resetDate)) {
                timerEndTime = Date.now() + THREE_HOURS;
                timerDisabled = false;
                resetDate = new Date().toISOString().split("T")[0];
            }

            setLocalStorage(TIMER_KEY, timerEndTime);
            setLocalStorage(DISABLED_KEY, timerDisabled);
            setLocalStorage(RESET_DATE_KEY, resetDate);

            startTimerUI();
        } catch {
            alert("Invalid file.");
        }
    };
    reader.readAsText(file);
}

// Show upload prompt
window.addEventListener("load", () => {
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
});

// Disable iframe on timeout
function startTimerUI() {
    const iframe = document.querySelector("iframe");
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

    window.addEventListener("beforeunload", downloadTimerState);
}
