// Function to generate dynamic time slots (from 8:00 AM to 5:00 PM)
function generateTimeOptions() {
  let timeSelect = document.getElementById("sessionTime");
  timeSelect.innerHTML = "";

  // Loop through hours 8 to 17 (8:00 AM to 5:00 PM)
  for (let hour = 8; hour <= 17; hour++) {
    for (let min of [0, 30]) {
      // Skip 5:30 PM
      if (hour === 17 && min === 30) break;

      let period = hour >= 12 ? "PM" : "AM";
      let displayHour = hour % 12;
      if (displayHour === 0) displayHour = 12;

      let formattedHour = displayHour < 10 ? "0" + displayHour : displayHour;
      let formattedMin = min === 0 ? "00" : min;

      let timeString = formattedHour + ":" + formattedMin + " " + period;

      let option = document.createElement("option");
      option.value = timeString;
      option.textContent = timeString;

      timeSelect.appendChild(option);
    }
  }
}

// Function to set today's date as default in the date input field
function setDefaultDate() {
  let today = new Date();
  let year = today.getFullYear();
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let day = String(today.getDate()).padStart(2, '0');

  document.getElementById("sessionDate").value = year + "-" + month + "-" + day;
}

// Function to handle booking submission
function bookSession() {
  let topic = document.getElementById("topicSelect").value;
  let problem = document.getElementById("problemDescription").value;
  let date = document.getElementById("sessionDate").value;
  let time = document.getElementById("sessionTime").value;

  alert("Session Booked Successfully!\n\n" +
        "Topic: " + topic + "\n" +
        "Date: " + date + "\n" +
        "Time: " + time + "\n" +
        (problem ? "Notes: " + problem : ""));
}

// Function to reset form fields
function clearForm() {
  document.getElementById("problemDescription").value = "";
  document.getElementById("topicSelect").selectedIndex = 0;
  setDefaultDate();
  document.getElementById("sessionTime").selectedIndex = 0;
}

// Run initial setups when page finishes loading
window.onload = function() {
  generateTimeOptions();
  setDefaultDate();
};
