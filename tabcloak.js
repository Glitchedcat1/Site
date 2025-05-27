document.addEventListener("DOMContentLoaded", function () {
  const unlockBtn = document.getElementById("unlock-btn");
  const cloakPanel = document.getElementById("cloak-controls");
  const closePanelBtn = document.getElementById("close-cloak-panel");
  const sneakyCheckbox = document.getElementById("openRealTab");

  const originalTitle = document.title;
  const originalFavicon = document.querySelector("link[rel~='icon']")?.href || "";
  const originalURL = window.location.href;

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

  window.setCloak = function (newTitle, iconUrl, fakeUrl) {
    document.title = newTitle;

    let favicon = document.querySelector("link[rel~='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = iconUrl;

    // Update browser history (fake)
    if (fakeUrl) {
      window.history.pushState({}, "", fakeUrl);

      // Actually visit the site in a new tab if sneaky checkbox is checked
      if (sneakyCheckbox.checked) {
        window.open(fakeUrl, "_blank", "noopener,noreferrer");
      }
    }
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

    window.history.pushState({}, "", originalURL);
  };
});
