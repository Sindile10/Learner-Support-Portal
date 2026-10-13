// ---------- Data ----------

var choices = ["rock", "paper", "scissors"];
var wins = 0;
var losses = 0;
var draws = 0;
var roundHistory = [];


// ---------- Helpers ----------

function $(id) {
  return document.getElementById(id);
}

// Makes "rock" look like "Rock"
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// The computer picks a random choice
function getComputerChoice() {
  var randomNumber = Math.floor(Math.random() * 3);
  return choices[randomNumber];
}

// Works out who won: returns "win", "lose" or "draw"
function getResult(player, computer) {
  if (player === computer) {
    return "draw";
  }

  if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    return "win";
  }

  return "lose";
}


// ---------- Screen updates ----------

// Updates the scoreboard, the win rate and the History badge
function showScores() {
  var rounds = wins + draws + losses;
  var winRate = rounds > 0 ? Math.round((wins / rounds) * 100) : 0;

  $("winsCount").textContent = wins;
  $("drawsCount").textContent = draws;
  $("lossesCount").textContent = losses;
  $("winRate").textContent = winRate + "%";
  $("historyBadge").textContent = rounds;
}

function showMessage(text, style) {
  $("message").textContent = text;
  $("message").className = "message " + style;
}

// Builds the list on the History page, newest round first
function showHistory() {
  var html = "";

  for (var i = roundHistory.length - 1; i >= 0; i--) {
    var round = roundHistory[i];
    html += '<div class="history-item">' +
      "<span>Round " + (i + 1) + ": " + capitalize(round.player) + " vs " + capitalize(round.computer) + "</span>" +
      '<strong class="' + round.result + '">' + capitalize(round.result) + "</strong>" +
      "</div>";
  }

  $("historyList").innerHTML = html || '<p class="empty-text">No rounds yet. Go play one!</p>';
}


// ---------- Sidebar pages ----------

// Shows one page (play, history or rules) and hides the others
function showView(name) {
  var views = document.querySelectorAll(".view");
  var links = document.querySelectorAll(".nav-link");
  var i;

  for (i = 0; i < views.length; i++) {
    views[i].classList.add("hidden");
  }
  $(name + "View").classList.remove("hidden");

  for (i = 0; i < links.length; i++) {
    links[i].classList.remove("active");
    if (links[i].getAttribute("data-view") === name) {
      links[i].classList.add("active");
    }
  }

  // close the menu on phones after picking a page
  $("sidebar").classList.remove("open");
}


// ---------- Playing a round ----------

function playRound(playerChoice) {
  var computerChoice = getComputerChoice();
  var result = getResult(playerChoice, computerChoice);

  $("playerPick").textContent = capitalize(playerChoice);
  $("computerPick").textContent = capitalize(computerChoice);

  if (result === "win") {
    wins++;
    showMessage("You win! " + capitalize(playerChoice) + " beats " + computerChoice + ".", "win");
  } else if (result === "lose") {
    losses++;
    showMessage("You lose. " + capitalize(computerChoice) + " beats " + playerChoice + ".", "lose");
  } else {
    draws++;
    showMessage("It's a draw. Go again!", "draw");
  }

  roundHistory.push({ player: playerChoice, computer: computerChoice, result: result });
  showScores();
  showHistory();
}

function resetGame() {
  wins = 0;
  losses = 0;
  draws = 0;
  roundHistory = [];

  $("playerPick").textContent = "-";
  $("computerPick").textContent = "-";
  showMessage("Your move!", "");
  showScores();
  showHistory();
}


// ---------- Events ----------

var choiceButtons = document.querySelectorAll(".choice");
for (var i = 0; i < choiceButtons.length; i++) {
  choiceButtons[i].addEventListener("click", function () {
    playRound(this.getAttribute("data-choice"));
  });
}

var navLinks = document.querySelectorAll(".nav-link");
for (var j = 0; j < navLinks.length; j++) {
  navLinks[j].addEventListener("click", function () {
    showView(this.getAttribute("data-view"));
  });
}

$("menuButton").addEventListener("click", function () {
  var sidebar = $("sidebar");
  sidebar.classList.toggle("collapsed");
  sidebar.classList.toggle("open");
});

$("resetButton").addEventListener("click", resetGame);

function getNotificationMessages() {
  try {
    const bookings = JSON.parse(localStorage.getItem('learner_support_bookings') || '[]');
    if (Array.isArray(bookings) && bookings.length) {
      return bookings.slice(-3).reverse().map((booking) => `Booked: ${booking.topic || 'Support'} on ${booking.date} at ${booking.time}.`);
    }
  } catch (error) {
    console.warn('Could not load support notifications.', error);
  }

  return [
    'Your support session reminder is ready.',
    'Two tasks still need your attention this week.',
    'Keep pushing your progress forward.'
  ];
}

function bindNotifications() {
  const btn = document.querySelector('.notification-btn');
  if (!btn) return;

  let popup = document.getElementById('notificationPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'notificationPopup';
    popup.className = 'notification-popup';
    document.body.appendChild(popup);
  }

  const dot = btn.querySelector('.notification-dot');
  btn.addEventListener('click', () => {
    popup.classList.toggle('show');
    if (dot) {
      dot.style.display = popup.classList.contains('show') ? 'none' : 'block';
    }
  });

  const items = getNotificationMessages();
  popup.innerHTML = '<h4>Notifications</h4>' + items.map((item) => '<div class="notification-item">' + item + '</div>').join('');
}

// ---------- Start ----------

bindNotifications();
showScores();
showHistory();
