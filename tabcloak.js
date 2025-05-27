// Unlock cloak controls via unlock button or debug hotkey
document.getElementById("unlock-btn").addEventListener("click", requestUnlock);

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.shiftKey && e.key === "D") {
    requestUnlock();
  }
});

function requestUnlock() {
  const password = prompt("Enter password to unlock features:");
  if (password === "lexia123") {
    document.getElementById("cloak-controls").style.display = "block";
  } else {
    alert("Incorrect password!");
  }
}

// Store the original title and favicon to allow reset
const originalTitle = document.title;
const originalFavicon = document.querySelector("link[rel~='icon']").href;

function setCloak(newTitle, iconUrl) {
  document.title = newTitle;

  let favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  favicon.href = iconUrl;
}

function resetCloak() {
  document.title = originalTitle;

  let favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  favicon.href = originalFavicon;
}
