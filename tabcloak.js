document.addEventListener("DOMContentLoaded", function () {
  const unlockBtn = document.getElementById("unlock-btn");
  const cloakPanel = document.getElementById("cloak-controls");
  const closePanelBtn = document.getElementById("close-cloak-panel");

  const originalTitle = document.title;
  const originalFavicon = document.querySelector("link[rel~='icon']")?.href || "";
  const originalURL = window.location.href;

  unlockBtn.addEventListener("click", requestUnlock);
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "D") requestUnlock();
  });

  closePanelBtn.addEventListener("click", () => cloakPanel.style.display = "none");

  function requestUnlock() {
    const password = prompt("Enter password to unlock features:");
    if (password === "lexia123") {
      cloakPanel.style.display = "block";
    } else {
      alert("Incorrect password.");
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

    if (fakeUrl) {
      window.history.pushState({ cloak: newTitle }, newTitle, fakeUrl);
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

  window.initCustomCloak = function () {
    const pass = prompt("Enter custom cloak password:");
    if (pass === "customcloak123") {
      document.getElementById("customCloakForm").style.display = "block";
    } else {
      alert("Access denied.");
    }
  };

  window.applyCustomCloak = function () {
    const title = document.getElementById("customTitle").value;
    const file = document.getElementById("customIcon").files[0];
    if (!title || !file) return alert("Title and image required.");

    const reader = new FileReader();
    reader.onload = function (e) {
      document.title = title;

      let favicon = document.querySelector("link[rel~='icon']");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      favicon.href = e.target.result;

      const pathName = `/customcloak/${title.toLowerCase().replace(/\s+/g, "-")}`;
      window.history.pushState({ cloak: title }, title, pathName);
      document.getElementById("customCloakForm").style.display = "none";
    };
    reader.readAsDataURL(file);
  };
});
