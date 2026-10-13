/*function loginAlert() {
    alert("Login to learner dashboard successful!");
    window.location.href = "learner-dashboard.html";
}
*/
/*
const loginBtn = document.getElementById("loginBtn");
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

const form = document.getElementById('authForm');

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    const roleSelect = document.getElementById('role');

    const emailError = document.getElementById('emailError');
    const passError = document.getElementById('passError');
    const usernameError = document.getElementById('usernameError');
    const roleError = document.getElementById('roleError');

    let isValid = true;


    [emailError, passError, usernameError, roleError].forEach(err => {
      if (err) {
        err.textContent = '';
        err.style.display = 'none';
      }
    });

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === '') {
      emailError.textContent = 'Email is required';
      emailError.style.display = 'block';
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      emailError.textContent = 'Enter valid email like name@example.com';
      emailError.style.display = 'block';
      isValid = false;
    }

    if (passwordValue === '') {
      passError.textContent = 'Password is required';
      passError.style.display = 'block';
      isValid = false;
    } else if (usernameInput) {
      // CREATE ACCOUNT - strong password
      if (passwordValue.length < 8) {
        passError.textContent = 'Password must be at least 8 characters';
        passError.style.display = 'block';
        isValid = false;
      } else if (!/[A-Z]/.test(passwordValue)) {
        passError.textContent = 'Password needs 1 capital letter';
        passError.style.display = 'block';
        isValid = false;
      } else if (!/[0-9]/.test(passwordValue)) {
        passError.textContent = 'Password needs 1 number';
        passError.style.display = 'block';
        isValid = false;
      }
    } else {
      if (passwordValue.length < 6) {
        passError.textContent = 'Password must be at least 6 characters';
        passError.style.display = 'block';
        isValid = false;
      }
    }

    if (usernameInput) {
      const usernameValue = usernameInput.value.trim();
      if (usernameValue === '') {
        usernameError.textContent = 'Username is required';
        usernameError.style.display = 'block';
        isValid = false;
      } else if (usernameValue.length < 3) {
        usernameError.textContent = 'Username min 3 characters';
        usernameError.style.display = 'block';
        isValid = false;
      }

      if (roleSelect && roleSelect.value === '') {
        roleError.textContent = 'Please select a role';
        roleError.style.display = 'block';
        isValid = false;
      }
    }

    if (isValid) {
      const btn = document.getElementById('submitBtn');
      const isCreate = !!usernameInput;

      btn.textContent = isCreate ? 'Creating...' : 'Logging in...';
      btn.disabled = true;

      console.log(isCreate ? 'CREATE' : 'LOGIN', {
        username: usernameInput ? usernameInput.value : 'N/A',
        email: emailValue,
        password: passwordValue,
        role: roleSelect ? roleSelect.value : 'N/A'
      });

      setTimeout(() => {
        if (isCreate) {
          const role = String(roleSelect?.value || '').toLowerCase();
          const accountName = String(usernameInput?.value || '').trim() || 'User';
          const newUser = {
            uid: `local-${Date.now()}`,
            name: accountName,
            email: emailValue,
            password: passwordValue,
            role,
            createdAt: new Date().toISOString()
          };

          const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const users = Array.isArray(storedUsers) ? storedUsers : [];
          const existingIndex = users.findIndex((user) => String(user.email || '').toLowerCase() === emailValue.toLowerCase());
          if (existingIndex >= 0) {
            users[existingIndex] = newUser;
          } else {
            users.push(newUser);
          }
          localStorage.setItem('registeredUsers', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          localStorage.setItem('selectedRole', role);
          localStorage.setItem('username', accountName);

          const redirectUrl = role === 'assessor'
            ? 'assessor-dashboard.html?role=assessor'
            : 'learner-dashboard.html?role=learner';

          alert('Account created successfully!');
          window.location.href = redirectUrl;
          btn.disabled = false;
          btn.textContent = 'Create Account';
          return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const matchedUser = Array.isArray(storedUsers)
          ? storedUsers.find((user) => String(user.email || '').toLowerCase() === emailValue.toLowerCase() && String(user.password || '') === passwordValue)
          : null;

        if (matchedUser) {
          const accountRole = String(matchedUser.role || '').toLowerCase();
          const userProfile = {
            uid: matchedUser.uid || `${Date.now()}`,
            name: matchedUser.name || 'User',
            email: matchedUser.email,
            role: accountRole,
            createdAt: matchedUser.createdAt || new Date().toISOString()
          };

          localStorage.setItem('currentUser', JSON.stringify(userProfile));
          localStorage.setItem('selectedRole', accountRole);
          localStorage.setItem('username', userProfile.name);
          localStorage.setItem('accountPreferences', JSON.stringify({ name: userProfile.name, email: userProfile.email, theme: localStorage.getItem('portalTheme') || 'light' }));
          localStorage.setItem('Account Preferences', JSON.stringify({ name: userProfile.name, email: userProfile.email, theme: localStorage.getItem('portalTheme') || 'light' }));

          const redirectUrl = accountRole === 'assessor'
            ? 'assessor-dashboard.html?role=assessor'
            : 'learner-dashboard.html?role=learner';

          alert('Login successful!');
          window.location.href = redirectUrl;
        } else {
          alert('Invalid email or password.');
        }

        btn.disabled = false;
        btn.textContent = isCreate ? 'Create Account' : 'Login';
      }, 800);
    }
  });

  document.getElementById('email')?.addEventListener('input', () => {
    document.getElementById('emailError').style.display = 'none';
  });
  document.getElementById('password')?.addEventListener('input', () => {
    document.getElementById('passError').style.display = 'none';
  });
  document.getElementById('username')?.addEventListener('input', () => {
    document.getElementById('usernameError').style.display = 'none';
  });
  document.getElementById('role')?.addEventListener('change', () => {
    document.getElementById('roleError').style.display = 'none';
  });
}