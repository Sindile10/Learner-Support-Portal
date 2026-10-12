// 1. Sidebar Toggle Open/Close Function
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// 2. Switch Sidebar Active Option
function selectMenuItem(element) {
  let items = document.querySelectorAll(".menu-item");
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }
  element.classList.add("active");
}

// 3. Open Setting Detail Panel
function openSettingPanel(settingType) {
  let panel = document.getElementById("detailPanel");
  let panelTitle = document.getElementById("panelTitle");
  let panelBody = document.getElementById("panelBody");

  panel.style.display = "block";
  panelTitle.textContent = settingType + " Preferences";

  if (settingType === "Account") {
    panelBody.innerHTML = `
      <label>Full Name</label>
      <input type="text" id="userName" value="ze'Khethelo Dlamini">
      <label>Email Address</label>
      <input type="email" id="userEmail" value="khethelo@example.com">
      <button class="btn-save" onclick="saveSettings('Account')">Save Account Details</button>
    `;
  } else if (settingType === "Notifications") {
    panelBody.innerHTML = `
      <label>Email Notifications</label>
      <select id="emailNotif">
        <option value="enabled" selected>Enabled</option>
        <option value="disabled">Disabled</option>
      </select>
      <label>SMS Alerts</label>
      <select id="smsNotif">
        <option value="disabled" selected>Disabled</option>
        <option value="enabled">Enabled</option>
      </select>
      <button class="btn-save" onclick="saveSettings('Notifications')">Save Notification Settings</button>
    `;
  } else if (settingType === "Appearance") {
    panelBody.innerHTML = `
      <label>Portal Theme</label>
      <select id="themeSelect">
        <option value="light" selected>Light Mode</option>
        <option value="dark">Dark Mode</option>
      </select>
      <button class="btn-save" onclick="saveSettings('Appearance')">Apply Theme</button>
    `;
  } else if (settingType === "Privacy & Security") {
    panelBody.innerHTML = `
      <label>Current Password</label>
      <input type="password" placeholder="Enter current password">
      <label>New Password</label>
      <input type="password" placeholder="Enter new password">
      <button class="btn-save" onclick="saveSettings('Privacy & Security')">Update Password</button>
    `;
  }
}

// 4. Save Settings Notification
function saveSettings(category) {
  alert(category + " settings saved successfully!");
}
