// 1. Sidebar Toggle Open/Collapsed
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// 2. Switch Sidebar Active Menu Highlight
function switchView(viewName, menuElement) {
  let items = document.querySelectorAll(".menu-item");
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }
  if (menuElement) {
    menuElement.classList.add("active");
  }

  if (viewName !== "Support Booking") {
    alert("Navigating to " + viewName + " page.");
  }
}

// 3. Update Status Action
function updateBookingStatus() {
  let select = document.getElementById("statusSelect");
  let badge = document.getElementById("currentStatusBadge");

  let selectedValue = select.value;
  badge.textContent = selectedValue;

  if (selectedValue === "APPROVED") {
    select.style.backgroundColor = "#10b981"; // Green
    badge.style.backgroundColor = "#d1fae5";
    badge.style.color = "#065f46";
  } else if (selectedValue === "PENDING") {
    select.style.backgroundColor = "#f59e0b"; // Orange
    badge.style.backgroundColor = "#fef3c7";
    badge.style.color = "#92400e";
  } else if (selectedValue === "REJECTED") {
    select.style.backgroundColor = "#ef4444"; // Red
    badge.style.backgroundColor = "#fee2e2";
    badge.style.color = "#991b1b";
  }
}

// 4. Close Booking Action
function closeBooking() {
  let confirmClose = confirm("Are you sure you want to close this booking?");
  if (confirmClose) {
    let badge = document.getElementById("currentStatusBadge");
    badge.textContent = "Closed";
    badge.style.backgroundColor = "#e2e8f0";
    badge.style.color = "#475569";
    alert("Booking closed successfully!");
  }
}

// 5. View Learner Profile Action
function viewLearnerProfile() {
  alert("Opening Profile for Learner: SINDILE");
}
