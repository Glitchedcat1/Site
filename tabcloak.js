document.getElementById("unlock-btn").addEventListener("click", function () {
  const password = prompt("Enter password to unlock features:");
  if (password === "lexia123") {
    document.getElementById("cloak-controls").style.display = "block";
  } else {
    alert("Incorrect password!");
  }
});

document.getElementById("tabcloak-btn").addEventListener("click", function () {
  document.title = "Lexia Core 5";

  let favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }
  favicon.href = "lexia-favicon.png";
});
