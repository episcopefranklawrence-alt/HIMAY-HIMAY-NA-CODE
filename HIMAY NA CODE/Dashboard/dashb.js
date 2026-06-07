/* ═══════════════════════════════════════════════
   EDUGRAM · Standalone Overview Logic Bundle
═══════════════════════════════════════════════ */
'use strict';

// Active User session profile state initialization mock
let state = {
  currentUser: { id: 'u1', email: 'student@edugram.edu', role: 'student', firstName: 'Maria', lastName: 'Santos' }
};

// System Assignment Repositories matching spec variables
const ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change' },
  { id: 'a2', title: 'Analytical Essay: Social Media' },
  { id: 'a3', title: 'Book Report: To Kill a Mockingbird' },
  { id: 'a4', title: 'Argumentative Essay: Technology in Education' }
];

// System Submission collections database array
let SUBMISSIONS = [
  { id: 's1', assignmentId: 'a3', studentId: 'u1', status: 'graded', feedback: 'Excellent work!', grade: '92/100' },
  { id: 's2', assignmentId: 'a4', studentId: 'u1', status: 'pending', feedback: null }
];

// Content Initialization Mount
document.addEventListener('DOMContentLoaded', () => {
  loadOverviewTelemetry();
});

// Primary UI dynamic telemetry updater execution engine
function loadOverviewTelemetry() {
  if (!state.currentUser) return;
  const user = state.currentUser;

  // Sync identity greeting header strings
  const nameLabel = document.getElementById('student-welcome-name');
  if (nameLabel) nameLabel.textContent = user.firstName;

  // Cross-reference data collections to evaluate total records counts
  const mySubmissions = SUBMISSIONS.filter(s => s.studentId === user.id);
  const totalSubmitted = mySubmissions.length;
  const totalPending = ASSIGNMENTS.length - totalSubmitted;
  const feedbackItems = mySubmissions.filter(s => s.feedback).length;

  // Mount results directly onto the welcome banner context parameters
  const pendingCounter = document.getElementById('pending-count');
  const feedbackCounter = document.getElementById('feedback-count');
  
  if (pendingCounter) pendingCounter.textContent = Math.max(0, totalPending);
  if (feedbackCounter) feedbackCounter.textContent = feedbackItems;

  // Distribute counts down through the separate statistics card blocks rows
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length >= 4) {
    statNumbers[0].textContent = ASSIGNMENTS.length;       // Total Assignments Card
    statNumbers[1].textContent = totalSubmitted;           // Submitted Tasks Card
    statNumbers[2].textContent = Math.max(0, totalPending); // Pending Evaluation Card
    statNumbers[3].textContent = feedbackItems;            // New Feedback Received Card
  }

  // Bind click listener routing checks
  document.addEventListener('click', e => {
    const link = e.target.closest('.s-nav-link');
    if (link) {
      e.preventDefault();
      alert(`Navigation hook active! Relocating main dashboard workspace focus parameter to view panel ID: "${link.dataset.panel}"`);
    }
  });
}