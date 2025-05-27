document.addEventListener("DOMContentLoaded", function () {
  const unlockBtn = document.getElementById("unlock-btn");
  const cloakPanel = document.getElementById("cloak-controls");
  const closePanelBtn = document.getElementById("close-cloak-panel");
  const originalTitle = document.title;
  const originalFavicon = document.querySelector("link[rel~='icon']")?.href || "";

  unlockBtn.addEventListener("click", requestUnlock);

  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      requestUnlock();
    }
  });

  closePanelBtn.addEventListener("click", function () {
    cloakPanel.style.display = "none";
  });

  function requestUnlock() {
    const password = prompt("Enter password to unlock features:");
    if (password === "lexia123") {
      cloakPanel.style.display = "block";
    } else {
      alert("Incorrect password!");
    }
  }

  window.setCloak = function (newTitle, iconUrl) {
    document.title = newTitle;

    let favicon = document.querySelector("link[rel~='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = iconUrl;
  };

  window.resetCloak = function () {
    document.title = originalTitle;

    let favicon = document.querySelector("link[rel~='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = originalFavicon;
  };
});
