// get started page logic - human made

const getStartedBtn = document.getElementById('getStartedBtn');
const learnerCard = document.getElementById('learnerCard');
const assessorCard = document.getElementById('assessorCard');

// main button animation
getStartedBtn.addEventListener('mouseenter', () => {
  getStartedBtn.textContent = 'Lets Go →';
});

getStartedBtn.addEventListener('mouseleave', () => {
  getStartedBtn.textContent = 'Get Started';
});

// if user picks learner
learnerCard.addEventListener('click', () => {
  localStorage.setItem('selectedRole', 'learner');
  console.log('Role selected: learner');
  window.location.href = 'create-account.html?role=learner';
});

// if user picks assessor
assessorCard.addEventListener('click', () => {
  localStorage.setItem('selectedRole', 'assessor');
  console.log('Role selected: assessor');
  window.location.href = 'create-account.html?role=assessor';
});

// small fade in on load
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = '0.5s';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

document.addEventListener("DOMContentLoaded", () => {
  // Target Buttons
  const navLoginBtn = document.getElementById("navLoginBtn");
  const navRegisterBtn = document.getElementById("navCreateAccountBtn");
  const getStartedBtn = document.getElementById("getStartedBtn");
  const learnMoreBtn = document.getElementById("learnMoreBtn");

  if (navLoginBtn) {
    navLoginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  if (navRegisterBtn) {
    navRegisterBtn.addEventListener("click", () => {
      window.location.href = "create-account.html";
    });
  }

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      window.location.href = "register.html";
    });
  }

  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", () => {
      window.location.href = "about.html";
    });
  }
});
