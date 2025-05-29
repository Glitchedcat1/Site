// Constants
const TIMER_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const FILE_VALIDITY_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const FILE_GENERATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const STORAGE_KEYS = {
  LAST_GENERATION: 'lastGenerationTime'
};

// Elements
const timerDisplay = document.getElementById('timer');
const generateFileBtn = document.getElementById('generateFileBtn');
const fileInput = document.getElementById('fileInput');

// State
let timerEnd = null;
let timerInterval = null;

// Functions

// Format milliseconds into HH:MM:SS
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Update the timer display
function updateTimer() {
  const remaining = timerEnd - Date.now();
  if (remaining <= 0) {
    clearInterval(timerInterval);
    timerDisplay.textContent = 'Time is up!';
    return;
  }
  timerDisplay.textContent = formatTime(remaining);
}

// Start the timer
function startTimer(duration) {
  timerEnd = Date.now() + duration;
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

// Generate a new timer file
function generateTimerFile() {
  const lastGeneration = localStorage.getItem(STORAGE_KEYS.LAST_GENERATION);
  const now = Date.now();

  if (lastGeneration && now - parseInt(lastGeneration, 10) < FILE_GENERATION_INTERVAL) {
    alert('You can only generate a new file once every 24 hours.');
    return;
  }

  const timerData = {
    timerEnd: now + TIMER_DURATION,
    used: false,
    date: now
  };

  const blob = new Blob([JSON.stringify(timerData)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'timer_state.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  localStorage.setItem(STORAGE_KEYS.LAST_GENERATION, now.toString());
}

// Validate the uploaded timer file
function validateAndStartTimer(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);
      const now = Date.now();

      if (data.used) {
        alert('This file has already been used.');
        return;
      }

      if (now - data.date > FILE_VALIDITY_DURATION) {
        alert('This file is expired.');
        return;
      }

      // Mark the file as used
      data.used = true;

      // Start the timer
      timerEnd = data.timerEnd;
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);

      // Save the updated file
      const updatedBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const updatedUrl = URL.createObjectURL(updatedBlob);
      const a = document.createElement('a');
      a.href = updatedUrl;
      a.download = 'timer_state_used.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(updatedUrl);

    } catch (e) {
      alert('Invalid file format.');
    }
  };
  reader.readAsText(file);
}

// Event Listeners

// Generate file button
generateFileBtn.addEventListener('click', generateTimerFile);

// Prompt user to upload file on page load
window.addEventListener('load', () => {
  alert('Please upload your timer file to start.');
  fileInput.click();
});

// Handle file upload
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    validateAndStartTimer(file);
  }
});

// Save timer state on page unload
window.addEventListener('beforeunload', () => {
  if (timerEnd) {
    const timerData = {
      timerEnd: timerEnd,
      used: true,
      date: Date.now()
    };
    const blob = new Blob([JSON.stringify(timerData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timer_state_autosave.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
});
