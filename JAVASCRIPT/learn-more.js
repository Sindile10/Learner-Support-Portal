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
      window.location.href = "learn-more.html";
    });
  }
});

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    // close others
    faqItems.forEach(other => {
      if (other !== item) {
        other.classList.remove('active');
        other.querySelector('.plus').textContent = '+';
      }
    });

    // toggle this one
    item.classList.toggle('active');
    const plus = item.querySelector('.plus');
    if (item.classList.contains('active')) {
      plus.textContent = '+';
    } else {
      plus.textContent = '+';
    }
  });
});

// small scroll effect
window.addEventListener('scroll', () => {
  const features = document.querySelector('.features');
  if (window.scrollY > 100) {
    features.style.opacity = '1';
  }
});
