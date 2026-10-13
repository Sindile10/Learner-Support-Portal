import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js';
import { auth, database } from '../HTML/firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('#authForm, #signupForm');

    if (!signupForm) return;

    const usernameInput = document.querySelector('#username');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const roleInput = document.querySelector('#role');
    const submitBtn = document.querySelector('#submitBtn');
    const passwordToggle = document.querySelector('.password-toggle');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
            passwordToggle.innerHTML = isHidden
                ? '<ion-icon name="eye-outline"></ion-icon>'
                : '<ion-icon name="eye-off-outline"></ion-icon>';
        });
    }

    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = usernameInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value.trim() || '';
        const role = roleInput?.value || '';

        if (!name || !email || !password) {
            alert('Please complete all fields before creating an account.');
            return;
        }

        if (!role) {
            alert('Please select whether you are an Assessor or a Learner.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const newUser = {
                uid,
                name,
                email,
                password,
                role,
                createdAt: new Date().toISOString()
            };

            const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const sanitizedUsers = Array.isArray(storedUsers) ? storedUsers : [];
            const existingIndex = sanitizedUsers.findIndex((user) => String(user.email || '').toLowerCase() === email.toLowerCase());
            if (existingIndex >= 0) {
                sanitizedUsers[existingIndex] = newUser;
            } else {
                sanitizedUsers.push(newUser);
            }
            localStorage.setItem('registeredUsers', JSON.stringify(sanitizedUsers));

            let profileSaved = false;
            try {
                await set(ref(database, `users/${uid}`), newUser);
                profileSaved = true;
            } catch (profileError) {
                console.warn('Profile sync failed, but account was created successfully:', profileError);
            }

            localStorage.setItem('currentUser', JSON.stringify(newUser));
            localStorage.setItem('selectedRole', role);
            localStorage.setItem('username', name);
            localStorage.setItem('accountPreferences', JSON.stringify({ name, email, theme: 'light' }));
            localStorage.setItem('Account Preferences', JSON.stringify({ name, email, theme: 'light' }));
            localStorage.setItem('portalTheme', 'light');

            const redirectUrl = role === 'assessor'
                ? 'assessor-dashboard.html?role=assessor'
                : 'learner-dashboard.html?role=learner';

            alert(profileSaved ? 'Account created successfully!' : 'Account created successfully. Your profile will sync when the connection is available.');
            window.location.href = redirectUrl;
        } catch (error) {
            console.error('Account creation failed:', error);

            if (error.code === 'auth/email-already-in-use') {
                alert('This email is already registered. Please log in or use a different email.');
            } else if (error.code === 'auth/weak-password') {
                alert('Password is too weak. Please use at least 6 characters.');
            } else if (error.code === 'auth/invalid-email') {
                alert('Please enter a valid email address.');
            } else {
                alert('Account creation failed. Please try again later.');
            }

            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });
});

