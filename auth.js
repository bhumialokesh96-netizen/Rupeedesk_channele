// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyCkeKgtfVDq2RrBPY4o495-8uFz1y4cASU",
    authDomain: "rupeedesk-135aa.firebaseapp.com",
    projectId: "rupeedesk-135aa",
    storageBucket: "rupeedesk-135aa.firebasestorage.app",
    messagingSenderId: "977708454299",
    appId: "1:977708454299:web:a57efa90527a10a662513e",
    measurementId: "G-L5S0WG796F"
};

// --- Firebase Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- App Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- DOM Elements ---
const loginForm = document.getElementById('login-form'), signupForm = document.getElementById('signup-form');
const loginToggle = document.getElementById('login-toggle'), signupToggle = document.getElementById('signup-toggle');
const errorMessage = document.getElementById('error-message');

// --- Device ID Logic ---
function getDeviceId() {
    let deviceId = localStorage.getItem('deviceGuid');
    if (!deviceId) { deviceId = crypto.randomUUID(); localStorage.setItem('deviceGuid', deviceId); }
    return deviceId;
}
document.getElementById('device-id-display').textContent = `Device ID: ${getDeviceId()}`;

// --- Redirect if already logged in ---
onAuthStateChanged(auth, user => { if (user) window.location.href = 'index.html'; });

// --- Form Toggling ---
loginToggle.addEventListener('click', () => {
    loginForm.classList.add('active'); signupForm.classList.remove('active');
    loginToggle.classList.add('active'); signupToggle.classList.remove('active');
});
signupToggle.addEventListener('click', () => {
    signupForm.classList.add('active'); loginForm.classList.remove('active');
    signupToggle.classList.add('active'); loginToggle.classList.remove('active');
});

// --- Auth Logic ---
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value, password = document.getElementById('login-password').value;
    signInWithEmailAndPassword(auth, email, password)
        .catch(error => { errorMessage.textContent = "Invalid email or password."; console.error(error); });
});

document.getElementById('signup-btn').addEventListener('click', () => {
    const email = document.getElementById('signup-email').value, password = document.getElementById('signup-password').value;
    const referralCode = document.getElementById('referral-code').value.trim().toUpperCase();

    if (referralCode) {
        sessionStorage.setItem('referralCode', referralCode);
    } else {
        sessionStorage.removeItem('referralCode');
    }

    createUserWithEmailAndPassword(auth, email, password)
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') errorMessage.textContent = 'This email is already registered.';
            else errorMessage.textContent = 'Could not create account. Please try again.';
            console.error(error);
        });
});


