/*const loginBtn = document.getElementById("loginBtn");
loginBtn.onclick = function() {
    alert("Login to learner dashboard successful! Welcome to Learning Hub!");
};

window.addEventListener("load", () => { 

    let name = document.querySelector(".name");
    let intro = document.querySelector(".intro-loader");

    setTimeout(() =>{
        name.style.opacity='1'
        name.style.transform="translateY(0)"
    },300)

    setTimeout(() => {
        intro.style.top = "-100%";
    }, 1500);
    
});*/

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



