// 1. Sidebar Functionality: Toggle Collapse/Expand
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// 2. Sidebar Navigation: Switch Active Page View
function switchView(viewName, clickedElement) {
  if (clickedElement) {
    let navItems = document.querySelectorAll(".nav-item");
    for (let i = 0; i < navItems.length; i++) {
      navItems[i].classList.remove("active");
    }
    clickedElement.classList.add("active");
  }

  alert("Navigating to: " + viewName);
}

// 3. User Logout Action
function handleLogout() {
  let confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    alert("Logged out successfully!");
  }
}

// 4. View Details Action
function viewDetails() {
  alert("Displaying upcoming support session details.");
}

// 5. Cancel Upcoming Booking Action
function cancelUpcomingBooking() {
  let confirmCancel = confirm("Are you sure you want to cancel your upcoming booking?");
  if (confirmCancel) {
    alert("Booking cancelled successfully.");
  }
}

// 6. Handle Completed Dropdown Change (Pending / Done)
function updateRowStatus(selectElement) {
  let selectedValue = selectElement.value;
  alert("Updated Completed Status to: " + selectedValue);
}

// 7. Handle Cancelled Dropdown Change (Pending / Cancel)
function updateCancelStatus(selectElement) {
  let selectedValue = selectElement.value;
  alert("Updated Cancel Status to: " + selectedValue);
}

// 8. Add Book Support Action
function addBookSupport() {
  let topic = prompt("Enter support topic:", "JavaScript Arrays");
  if (topic) {
    alert("Book support request created for: " + topic);
  }
}
