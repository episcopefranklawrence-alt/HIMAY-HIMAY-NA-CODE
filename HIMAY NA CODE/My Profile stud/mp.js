/* ═══════════════════════════════════════════════
   EDUGRAM · Core Profile Bundle Logic Engine
═══════════════════════════════════════════════ */
'use strict';

// Active User Session Profile Simulation Context
let state = {
  currentUser: { id: 'u1', email: 'student@edugram.edu', password: 'student123', role: 'student', firstName: 'Maria', lastName: 'Santos', studentId: '2024-00101' }
};

// System Assignment Repository Data
const ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change' },
  { id: 'a2', title: 'Analytical Essay: Social Media' },
  { id: 'a3', title: 'Book Report: To Kill a Mockingbird' },
  { id: 'a4', title: 'Argumentative Essay: Technology in Education' }
];

// System Submission Database Collections
let SUBMISSIONS = [
  { id: 's1', assignmentId: 'a3', studentId: 'u1', studentName: 'Maria Santos', status: 'graded', feedback: 'Excellent work!', grade: '92/100' },
  { id: 's2', assignmentId: 'a4', studentId: 'u1', studentName: 'Maria Santos', status: 'pending', feedback: null, grade: null }
];

// Component Initialization Lifecycle Trigger
document.addEventListener('DOMContentLoaded', () => {
  populateStudentProfile();
  document.getElementById('sp-save-btn').addEventListener('click', saveStudentProfile);
});

// Dynamic Field Data Sync Loader
function populateStudentProfile() {
  if (!state.currentUser) return;
  const u = state.currentUser;

  // Bind properties to text inputs
  document.getElementById('sp-first').value = u.firstName;
  document.getElementById('sp-last').value = u.lastName;
  document.getElementById('sp-email-input').value = u.email;
  document.getElementById('sp-id-input').value = u.studentId || 'N/A';
  document.getElementById('sp-pass').value = '';

  // Synchronize visual presentation headers text labels
  document.getElementById('sp-avatar-display').textContent = (u.firstName[0] + (u.lastName?.[0] || '')).toUpperCase();
  document.getElementById('sp-fullname-display').textContent = `${u.firstName} ${u.lastName}`;
  document.getElementById('sp-email-display').textContent = u.email;

  // Cross-reference data tables to compute real-time run metrics
  const mySubs = SUBMISSIONS.filter(s => s.studentId === u.id);
  const totalSubmitted = mySubs.length;
  const totalGraded = mySubs.filter(s => s.status === 'graded').length;
  const totalPending = mySubs.filter(s => s.status === 'pending').length;

  document.getElementById('spa-submitted').textContent = totalSubmitted;
  document.getElementById('spa-graded').textContent = totalGraded;
  document.getElementById('spa-pending').textContent = totalPending;
}

// Persist Input Event Listener Changes into Session Memory
function saveStudentProfile() {
  if (!state.currentUser) return;
  
  const first = document.getElementById('sp-first').value.trim();
  const last = document.getElementById('sp-last').value.trim();
  const pass = document.getElementById('sp-pass').value;
  
  if (!first || !last) { 
    alert('Name inputs cannot be left blank.'); 
    return; 
  }
  if (pass && pass.length < 8) { 
    alert('New password string length must be at least 8 characters.'); 
    return; 
  }

  // Commit mutations to application cache layer
  state.currentUser.firstName = first;
  state.currentUser.lastName = last;
  if (pass) state.currentUser.password = pass;

  // Re-evaluate display blocks with current data strings
  populateStudentProfile();
  document.getElementById('sp-pass').value = '';

  // Flash UI element notification confirmation indicator
  const toast = document.getElementById('sp-toast');
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}