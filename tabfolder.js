function renderTabFolder() {
  const container = document.getElementById("savedTabs");
  container.innerHTML = "";
  const list = JSON.parse(localStorage.getItem("tabFolder") || "[]");

  list.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label style="display:flex;align-items:center;gap:5px;">
        <input type="checkbox" class="cloakCheckbox" data-index="${index}">
        <img src="${item.icon}" width="16" height="16" />
        <button onclick="setCloak('${item.title}', '${item.icon}', '${item.url}')">${item.title}</button>
      </label>
    `;
    container.appendChild(li);
  });
}

window.saveCurrentCloak = function () {
  const title = document.title;
  const icon = document.querySelector("link[rel~='icon']")?.href;
  const url = window.location.href;
  const entry = { title, icon, url };
  const all = JSON.parse(localStorage.getItem("tabFolder") || "[]");
  all.push(entry);
  localStorage.setItem("tabFolder", JSON.stringify(all));
  renderTabFolder();
  renderStoredSets();
};

window.exportCloaks = function () {
  const data = localStorage.getItem("tabFolder") || "[]";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cloaks.json";
  link.click();
};

window.downloadCustomCloaks = function () {
  const customOnly = (JSON.parse(localStorage.getItem("tabFolder") || "[]"))
    .filter(c => !c.url.includes("google.com") && !c.url.includes("khanacademy.org") && !c.url.includes("wikipedia.org") && !c.url.includes("calculator.com") && !c.url.includes("classroom.google.com") && !c.url.includes("lexialearning.com"));

  if (customOnly.length === 0) {
    alert("No custom cloaks found.");
    return;
  }

  const filename = prompt("Enter filename for your custom cloak export:", "my-custom-cloaks");
  if (!filename) return;

  const blob = new Blob([JSON.stringify(customOnly, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
};

window.importCloaks = function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      const existing = JSON.parse(localStorage.getItem("tabFolder") || "[]");
      const combined = [...existing, ...imported];
      localStorage.setItem("tabFolder", JSON.stringify(combined));
      renderTabFolder();
      renderStoredSets();
      alert("Cloaks imported successfully!");
    } catch (err) {
      alert("Failed to import file.");
    }
  };
  reader.readAsText(file);
};

window.deleteSelectedCloaks = function () {
  const all = JSON.parse(localStorage.getItem("tabFolder") || "[]");
  const checkboxes = document.querySelectorAll(".cloakCheckbox:checked");
  const indexesToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
  const filtered = all.filter((_, index) => !indexesToDelete.includes(index));
  localStorage.setItem("tabFolder", JSON.stringify(filtered));
  renderTabFolder();
  renderStoredSets();
};

window.storeCurrentCloaks = function () {
  const name = document.getElementById("cloakSetName").value.trim();
  if (!name) return alert("Name your set.");
  const data = localStorage.getItem("tabFolder") || "[]";
  const sets = JSON.parse(localStorage.getItem("cloakSets") || "{}");
  sets[name] = JSON.parse(data);
  localStorage.setItem("cloakSets", JSON.stringify(sets));
  renderStoredSets();
};

function renderStoredSets() {
  const list = document.getElementById("storedSets");
  list.innerHTML = "";
  const sets = JSON.parse(localStorage.getItem("cloakSets") || "{}");
  for (const [name, data] of Object.entries(sets)) {
    const li = document.createElement("li");
    li.innerHTML = `<button onclick='loadSet("${name}")'>📂 ${name}</button>`;
    list.appendChild(li);
  }
}

window.loadSet = function (name) {
  const sets = JSON.parse(localStorage.getItem("cloakSets") || "{}");
  if (sets[name]) {
    localStorage.setItem("tabFolder", JSON.stringify(sets[name]));
    renderTabFolder();
    alert(`Cloak set "${name}" loaded!`);
  }
};

renderTabFolder();
renderStoredSets();
