// 1. Sidebar Functionality: Toggle Collapse/Expand
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// 2. Navigate back to My Tasks page
function goToTasks() {
  window.location.href = "index.html";
}

// 3. Sidebar Navigation: Switch Active Page View
function switchView(viewName, clickedElement) {
  let navItems = document.querySelectorAll(".nav-item");
  for (let i = 0; i < navItems.length; i++) {
    navItems[i].classList.remove("active");
  }
  clickedElement.classList.add("active");

  alert("Navigating to: " + viewName);
}

// 4. User Logout Function
function handleLogout() {
  let confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    alert("Logged out successfully!");
  }
}

// 5. Save New Task to LocalStorage & Redirect to Tasks
function saveNewTask(event) {
  // Stop form from submitting/reloading the page
  event.preventDefault();

  // Get values from the input fields
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let status = document.getElementById("taskStatus").value;

  // Find which priority radio button is checked
  let priority = "Medium";
  let priorityRadios = document.getElementsByName("priority");
  for (let i = 0; i < priorityRadios.length; i++) {
    if (priorityRadios[i].checked) {
      priority = priorityRadios[i].value;
      break;
    }