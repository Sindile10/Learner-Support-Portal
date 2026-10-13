function getAccountPreferences() {
  try {
    const saved = localStorage.getItem('accountPreferences') || localStorage.getItem('Account Preferences') || '{}';
    return JSON.parse(saved) || {};
  } catch (error) {
    return {};
  }
}

function saveAccountPreferences(preferences) {
  const current = getAccountPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem('accountPreferences', JSON.stringify(updated));
  localStorage.setItem('Account Preferences', JSON.stringify(updated));
  return updated;
}

function applyTheme(theme) {
  const selectedTheme = theme === 'dark' ? 'dark' : 'light';
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add(selectedTheme === 'dark' ? 'theme-dark' : 'theme-light');
  localStorage.setItem('portalTheme', selectedTheme);
  return selectedTheme;
}

function loadSavedTheme() {
  const storedTheme = localStorage.getItem('portalTheme') || getAccountPreferences().theme || 'light';
  applyTheme(storedTheme);
}

function logoutAccount() {
  const shouldLogout = window.confirm('Are you sure you want to log out?');
  if (!shouldLogout) {
    return;
  }

  localStorage.removeItem('currentUser');
  localStorage.removeItem('selectedRole');
  localStorage.removeItem('username');

  window.location.assign('logout.html');
}

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

  const activePrefs = getAccountPreferences();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
  const accountName = activePrefs.name || currentUser.name || localStorage.getItem('username') || 'User';
  const accountEmail = activePrefs.email || currentUser.email || 'user@example.com';
  const selectedTheme = activePrefs.theme || localStorage.getItem('portalTheme') || 'light';

  if (settingType === "Account") {
    panelBody.innerHTML = `
      <label>Full Name</label>
      <input type="text" id="userName" value="${accountName}">
      <label>Email Address</label>
      <input type="email" id="userEmail" value="${accountEmail}">
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
        <option value="light" ${selectedTheme === 'light' ? 'selected' : ''}>Light Mode</option>
        <option value="dark" ${selectedTheme === 'dark' ? 'selected' : ''}>Dark Mode</option>
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
  if (category === 'Account') {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const updatedName = (nameInput ? nameInput.value.trim() : '') || 'User';
    const updatedEmail = (emailInput ? emailInput.value.trim() : '') || 'user@example.com';

    const preferences = saveAccountPreferences({
      name: updatedName,
      email: updatedEmail
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
    const updatedUser = { ...currentUser, name: updatedName, email: updatedEmail };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('username', updatedName);

    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (Array.isArray(storedUsers)) {
      const index = storedUsers.findIndex((user) => String(user.email || '').toLowerCase() === String(updatedEmail).toLowerCase());
      if (index >= 0) {
        storedUsers[index] = { ...storedUsers[index], ...updatedUser, name: updatedName, email: updatedEmail };
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
      }
    }

    if (typeof window !== 'undefined' && window.location.pathname.includes('learner-dashboard')) {
      const greeting = document.getElementById('dashboardWelcomeTitle');
      if (greeting) {
        greeting.textContent = `Welcome back, ${updatedName}!`;
      }
    }

    alert('Account preferences saved successfully!');
    return;
  }

  if (category === 'Appearance') {
    const themeSelect = document.getElementById('themeSelect');
    const selectedTheme = themeSelect ? themeSelect.value : 'light';
    saveAccountPreferences({ theme: selectedTheme });
    applyTheme(selectedTheme);
    alert('Theme updated successfully!');
    return;
  }

  alert(category + " settings saved successfully!");
}

window.addEventListener('DOMContentLoaded', loadSavedTheme);
