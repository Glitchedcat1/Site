window.saveCurrentCloak = function () {
  const title = document.title;
  const icon = document.querySelector("link[rel~='icon']")?.href;
  const url = window.location.href;
  const entry = { title, icon, url };
  const all = JSON.parse(localStorage.getItem("tabFolder") || "[]");
  all.push(entry);
  localStorage.setItem("tabFolder", JSON.stringify(all));
  renderTabFolder();
};

function renderTabFolder() {
  const container = document.getElementById("savedTabs");
  container.innerHTML = "";
  const list = JSON.parse(localStorage.getItem("tabFolder") || "[]");
  list.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<button onclick="setCloak('${item.title}', '${item.icon}', '${item.url}')">
      <img src="${item.icon}" width="16" height="16" /> ${item.title}</button>`;
    container.appendChild(li);
  });
}

renderTabFolder();
