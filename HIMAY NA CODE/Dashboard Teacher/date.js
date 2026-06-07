/* ═══════════════════════════════════════════════
   EDUGRAM · Core Teacher Overview Runtime Script
═══════════════════════════════════════════════ */
'use strict';

// Active User Session Profile Snapshot Simulation Context
let state = {
  currentUser: { id: 'u2', email: 'teacher@edugram.edu', role: 'teacher', firstName: 'Prof. Juan', lastName: 'Dela Cruz', employeeId: 'FAC-2024-001' }
};

// Application Database Repositories
const USERS = [
  { id: 'u1', role: 'student', firstName: 'Maria', lastName: 'Santos' },
  { id: 'u2', role: 'teacher', firstName: 'Prof. Juan', lastName: 'Dela Cruz' },
  { id: 'u3', role: 'student', firstName: 'John', lastName: 'Reyes' }
];

let ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change' },
  { id: 'a2', title: 'Analytical Essay: Social Media' },
  { id: 'a3', title: 'Book Report: To Kill a Mockingbird' },
  { id: 'a4', title: 'Argumentative Essay: Technology in Education' }
];

let SUBMISSIONS = [
  { id: 's1', assignmentId: 'a3', studentId: 'u1', studentName: 'Maria Santos', submittedAt: '2025-07-04T14:32:00Z', version: 2, status: 'graded', grade: '92/100' },
  { id: 's2', assignmentId: 'a4', studentId: 'u1', studentName: 'Maria Santos', submittedAt: '2025-07-01T16:45:00Z', version: 1, status: 'pending', grade: null },
  { id: 's3', assignmentId: 'a1', studentId: 'u3', studentName: 'John Reyes', submittedAt: '2025-07-10T11:20:00Z', version: 1, status: 'pending', grade: null }
];

// Document Components Mounted Hook
document.addEventListener('DOMContentLoaded', () => {
  loadTeacherOverviewMetrics();
  renderRecentSubmissionsFeed();
});

// Dynamic Counters Synchronizer Engine
function loadTeacherOverviewMetrics() {
  if (!state.currentUser) return;
  const faculty = state.currentUser;

  // Render individual name configurations
  const nameEl = document.getElementById('teacher-welcome-name');
  if (nameEl) nameEl.textContent = faculty.firstName;

  // Evaluate structural table collections statistics parameters
  const pendingCount = SUBMISSIONS.filter(s => s.status === 'pending').length;
  const gradedCount = SUBMISSIONS.filter(s => s.status === 'graded').length;
  const totalStudents = USERS.filter(u => u.role === 'student').length;

  // Mount compiled telemetry metrics down onto DOM text wrappers
  const bannerPending = document.getElementById('t-pending-count');
  if (bannerPending) bannerPending.textContent = pendingCount;

  document.getElementById('t-total-students').textContent = totalStudents || 12; // Spec sample mapping default override
  document.getElementById('t-total-assignments').textContent = ASSIGNMENTS.length;
  document.getElementById('t-pending-review').textContent = pendingCount;
  document.getElementById('t-graded').textContent = gradedCount;
}

// Recent Submissions Queue Array Mapping Generator
function renderRecentSubmissionsFeed() {
  const container = document.getElementById('t-recent-submissions');
  if (!container) return;

  // Sort and isolate latest operations versions elements
  const sortedSubs = [...SUBMISSIONS].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 4);

  if (sortedSubs.length === 0) {
    container.innerHTML = '<p style="padding:1.5rem; color:var(--gray-400); font-style:italic; text-align:center;">No recent submissions found.</p>';
    return;
  }

  // Loop array maps into template strings
  container.innerHTML = sortedSubs.map(s => {
    const targetAssign = ASSIGNMENTS.find(x => x.id === s.assignmentId);
    const dateFormatted = new Date(s.submittedAt).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const initials = s.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const statusActionHtml = s.status === 'graded'
      ? `<span class="graded-badge">Graded · ${s.grade}</span>`
      : `<button class="review-btn" data-sid="${s.id}">Review</button>`;

    return `
      <div class="submission-card">
        <div class="submission-avatar">${initials}</div>
        <div class="submission-info">
          <div class="submission-student">${s.studentName}</div>
          <div class="submission-assignment">${targetAssign ? targetAssign.title : 'Academic Assignment Prompt Scope'}</div>
          <div class="submission-time">Submitted ${dateFormatted} · v${s.version}</div>
        </div>
        <div class="submission-actions">${statusActionHtml}</div>
      </div>`;
  }).join('');

  // Attach button event router links click handlers
  container.querySelectorAll('.review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert(`Feedback Modal Target Active!\nOpening assessment environment workspace routing for Submission: ID [${btn.dataset.sid}]`);
    });
  });

  // Global tab switch anchor click catchers
  document.addEventListener('click', e => {
    const navLink = e.target.closest('.t-nav-link');
    if (navLink) {
      e.preventDefault();
      alert(`Workspace navigation requested! Relocating primary view focus target parameter to panel: "${navLink.dataset.panel}"`);
    }
  });
}