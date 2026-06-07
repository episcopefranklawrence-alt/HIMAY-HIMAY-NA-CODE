/* ═══════════════════════════════════════════════
   EDUGRAM · Teacher Profile Interface Logic Engine
═══════════════════════════════════════════════ */
'use strict';

// Active User Session Profile Simulation Context
let state = {
  currentUser: { id: 'u2', email: 'teacher@edugram.edu', password: 'teacher123', role: 'teacher', firstName: 'Prof. Juan', lastName: 'Dela Cruz', employeeId: 'FAC-2024-001' }
};

// Document Mounted Initialization Lifecycle Trigger
document.addEventListener('DOMContentLoaded', () => {
  populateProfile();
  document.getElementById('save-profile-btn').addEventListener('click', saveTeacherProfile);
});

// Dynamic Profile Data Field Synchronizer
function populateProfile() {
  if (!state.currentUser) return;
  const u = state.currentUser;

  // Sync inputs values
  document.getElementById('profile-first').value = u.firstName;
  document.getElementById('profile-last').value = u.lastName;
  document.getElementById('profile-email-display').value = u.email;
  document.getElementById('profile-empid-display').value = u.employeeId || 'N/A';
  document.getElementById('profile-pass').value = '';

  // Synchronize layout preview parameters text indicators
  document.getElementById('tp-avatar-display').textContent = (u.firstName[0] + (u.lastName?.[0] || '')).toUpperCase();
  document.getElementById('tp-fullname-display').textContent = `${u.firstName} ${u.lastName}`;
  document.getElementById('tp-email-display').textContent = u.email;
}

// Persist Field Modifications into Cache Memory Session
function saveTeacherProfile() {
  if (!state.currentUser) return;

  const first = document.getElementById('profile-first').value.trim();
  const last = document.getElementById('profile-last').value.trim();
  const pass = document.getElementById('profile-pass').value;

  if (!first || !last) {
    alert('First Name and Last Name inputs cannot be left blank.');
    return;
  }
  
  if (pass && pass.length < 8) {
    alert('New password string constraint length must be at least 8 characters long.');
    return;
  }

  // Mutate data objects properties inside cache
  state.currentUser.firstName = first;
  state.currentUser.lastName = last;
  if (pass) state.currentUser.password = pass;

  // Redraw layout strings elements parameters
  populateProfile();
  document.getElementById('profile-pass').value = '';

  // Flash validation success notification callout element
  const toast = document.getElementById('profile-toast');
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}