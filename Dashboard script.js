// 1. Sidebar Toggle Open/Collapsed Function
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// 2. Switch Views (Dashboard, Support Booking, Learner Task, Settings)
function switchView(viewName, menuElement) {
  // Update sidebar active menu highlight
  let items = document.querySelectorAll(".menu-item");
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }
  if (menuElement) {
    menuElement.classList.add("active");
  }

  let dashboardView = document.getElementById("view-Dashboard");
  let detailView = document.getElementById("view-Detail");

  if (viewName === "Dashboard") {
    dashboardView.style.display = "block";
    detailView.style.display = "none";
  } else {
    dashboardView.style.display = "none";
    detailView.style.display = "block";

    document.getElementById("detailTitle").textContent = viewName;
    document.getElementById("detailText").textContent = "You are currently viewing the " + viewName + " page.";
  }
}

// 3. Show Dashboard Shortcut
function showDashboard() {
  switchView('Dashboard', document.querySelectorAll(".menu-item")[0]);
}
