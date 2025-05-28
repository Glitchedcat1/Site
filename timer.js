// --- Constants ---
const MAX_TIME = 3 * 60 * 60 * 1000; // 3 hours
const LIMIT_REQUIRE_UPLOAD = MAX_TIME - (1 * 60 * 60 * 1000 + 59 * 60 * 1000); // 1h 59m
const DISABLE_CODE = "1234";

// --- State Variables ---
let timerEnd = null;
let disabled = false;
let resetDate = null;

// --- Time Formatter ---
function format(ms) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// --- File I/O ---
function saveToFile() {
  const blob = new Blob([JSON.stringify({ timerEnd, disabled, resetDate })], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "timer_state.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function loadFromFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      timerEnd = data.timerEnd;
      disabled = data.disabled;
      resetDate = data.resetDate;
      startTimer();
    } catch {
      alert("Invalid file.");
    }
  };
  reader.readAsText(file);
}

// --- Reset Logic ---
function isNewDay() {
  const today = new Date().toISOString().split("T")[0];
  return today !== resetDate;
}

// --- Timer Loop ---
function updateTimer() {
  const now = Date.now();
  const remain = timerEnd - now;

  if (disabled) {
    document.getElementById("timer").textContent = "Timer Disabled";
    return;
  }

  if (remain <= 0) {
    document.body.innerHTML = "<h1 style='text-align:center;margin-top:20%;'>Access Denied. Please come back tomorrow.</h1>";
    const iframe = document.getElementById("mathIframe");
    if (iframe) iframe.style.display = "none";
    return;
  }

  document.getElementById("timer").textContent = format(remain);
  requestAnimationFrame(updateTimer);
}

// --- Timer Setup ---
function startTimer() {
  localStorage.setItem("timerEnd", timerEnd);
  localStorage.setItem("disabled", disabled);
  localStorage.setItem("resetDate", resetDate);
  updateTimer();
}

// --- Timer Click to Disable ---
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("timer");
  el.addEventListener("click", () => {
    const code = prompt("Enter code to disable:");
    if (code === DISABLE_CODE) {
      disabled = true;
      localStorage.setItem("disabled", true);
      el.textContent = "Timer Disabled";
    } else {
      alert("Wrong code.");
    }
  });

  window.addEventListener("beforeunload", saveToFile);

  // Restore if possible
  const savedEnd = localStorage.getItem("timerEnd");
  const savedDisabled = localStorage.getItem("disabled");
  const savedDate = localStorage.getItem("resetDate");
  const now = Date.now();

  if (savedEnd && savedDate && !isNewDay()) {
    timerEnd = parseInt(savedEnd);
    resetDate = savedDate;
    disabled = savedDisabled === "true";

    const timeLeft = timerEnd - now;
    if (timeLeft < LIMIT_REQUIRE_UPLOAD) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
      fileInput.style.display = "none";
      fileInput.addEventListener("change", e => loadFromFile(e.target.files[0]));
      document.body.appendChild(fileInput);
      fileInput.click();
    } else {
      startTimer();
    }
  } else {
    // Fresh day or missing data
    timerEnd = now + MAX_TIME;
    disabled = false;
    resetDate = new Date().toISOString().split("T")[0];
    startTimer();
  }
});
