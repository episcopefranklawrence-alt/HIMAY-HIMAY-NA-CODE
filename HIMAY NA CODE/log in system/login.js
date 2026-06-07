'use strict';

/* Simulated User Database Container */
const USERS = [
  { id: 'u1', email: 'student@edugram.edu', password: 'student123', role: 'student', firstName: 'Maria', lastName: 'Santos', studentId: '2024-00101' },
  { id: 'u2', email: 'teacher@edugram.edu', password: 'teacher123', role: 'teacher', firstName: 'Prof. Juan', lastName: 'Dela Cruz', employeeId: 'FAC-2024-001' },
  { id: 'u3', email: 'john@edugram.edu', password: 'john1234', role: 'student', firstName: 'John', lastName: 'Reyes', studentId: '2024-00102' },
];

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

function initAuth() {
  // Handle toggling tabs between Sign In and Register windows
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab + '-form').classList.add('active');
    });
  });

  // Wire up Demo accounts automatic insertion
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('login-email').value = btn.dataset.email;
      document.getElementById('login-password').value = btn.dataset.pass;
      document.getElementById('role-select').value = btn.dataset.role;
    });
  });

  // Setup Form Triggers
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('login-password').addEventListener('keydown', e => { 
    if (e.key === 'Enter') handleLogin(); 
  });

  document.getElementById('register-btn').addEventListener('click', handleRegister);
}

function getActiveRole(formId) {
  const selectId = formId === 'login-form' ? 'role-select' : 'reg-role-select';
  return document.getElementById(selectId)?.value || '';
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const role = getActiveRole('login-form');
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');

  // Input Validation
  if (!email || !password) { showError(errEl, 'Please enter your email and password.'); return; }
  if (!role) { showError(errEl, 'Please select a role (Student or Teacher).'); return; }

  // Authenticate against internal storage array
  const user = USERS.find(u => u.email === email && u.password === password && u.role === role);
  if (!user) { showError(errEl, 'Invalid credentials or wrong role selected.'); return; }

  currentUser = user;
  alert(`Successfully Logged In! Welcome ${user.firstName} (${user.role}).`);
  // Route to structural dashboard functions here...
}

function handleRegister() {
  const first = document.getElementById('reg-first').value.trim();
  const last = document.getElementById('reg-last').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const id = document.getElementById('reg-id').value.trim();
  const pass = document.getElementById('reg-password').value;
  const role = getActiveRole('register-form');
  
  const errEl = document.getElementById('register-error');
  const succEl = document.getElementById('register-success');
  errEl.classList.add('hidden'); 
  succEl.classList.add('hidden');

  // Fields Check
  if (!first || !last || !email || !id || !pass) { showError(errEl, 'Please fill in all fields.'); return; }
  if (!role) { showError(errEl, 'Please select a role (Student or Teacher).'); return; }
  if (pass.length < 8) { showError(errEl, 'Password must be at least 8 characters.'); return; }
  if (USERS.find(u => u.email === email)) { showError(errEl, 'This email is already registered.'); return; }

  // Generate User and save locally inside global instance scope
  const newUser = {
    id: 'u' + Date.now(),
    email, password: pass, role,
    firstName: first, lastName: last,
    studentId: role === 'student' ? id : undefined,
    employeeId: role === 'teacher' ? id : undefined
  };
  USERS.push(newUser);

  succEl.textContent = `Account created for ${first}! You can now sign in.`;
  succEl.classList.remove('hidden');
  
  // Clean registry inputs and swap back perspective focus state to Sign-in panel after success delay
  setTimeout(() => {
    document.querySelectorAll('.auth-tab')[0].click();
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = '';
    succEl.classList.add('hidden');
  }, 2000);
}

function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}