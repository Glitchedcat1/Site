// Constants
const TIMER_KEY = "countdown_timer";
const DISABLE_KEY = "timer_disabled";
const DISABLE_CODE = "1234"; // Replace with your desired code
const THREE_HOURS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

// Helper Functions
function formatTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// Timer Logic
let timerEndTime = getCookie(TIMER_KEY) || Date.now() + THREE_HOURS;
let timerDisabled = getCookie(DISABLE_KEY) === getTodayKey();

function updateTimer() {
  if (timerDisabled) {
    document.getElementById("timer").textContent = "Timer Disabled for Today";
    return;
  }

  const remainingTime = timerEndTime - Date.now();
  if (remainingTime <= 0) {
    document.getElementById("timer").textContent = "00:00:00";
    return;
  }

  document.getElementById("timer").textContent = formatTime(remainingTime);
  requestAnimationFrame(updateTimer);
}

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

// Event Listeners
document.getElementById("disableTimer").addEventListener("click", () => {
  const code = prompt("Enter the disable code:");
  if (code === DISABLE_CODE) {
    timerDisabled = true;
    setCookie(DISABLE_KEY, getTodayKey(), 1); // Set cookie for 1 day
    document.getElementById("timer").textContent = "Timer Disabled for Today";
  } else {
    alert("Incorrect code!");
  }
});

// Initialize Timer
if (!timerDisabled) {
  updateTimer();
}

// Save Timer State on Page Unload
window.addEventListener("beforeunload", () => {
  setCookie(TIMER_KEY, timerEndTime, 1); // Save timer end time in cookie for 1 day
});
