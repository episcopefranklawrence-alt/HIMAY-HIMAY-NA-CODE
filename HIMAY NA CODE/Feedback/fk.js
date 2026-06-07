/* ═══════════════════════════════════════════════
   EDUGRAM · Student Feedback Interface Logic Engine
═══════════════════════════════════════════════ */
'use strict';

// Active User Session Profile Simulation Context
let state = {
  currentUser: { id: 'u1', email: 'student@edugram.edu', role: 'student', firstName: 'Maria', lastName: 'Santos' }
};

// Application Global Context Arrays
const ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change' },
  { id: 'a2', title: 'Analytical Essay: Social Media' },
  { id: 'a3', title: 'Book Report: To Kill a Mockingbird' },
  { id: 'a4', title: 'Argumentative Essay: Technology in Education' }
];

let SUBMISSIONS = [
  { 
    id: 's1', 
    assignmentId: 'a3', 
    studentId: 'u1', 
    studentName: 'Maria Santos', 
    content: 'To Kill a Mockingbird by Harper Lee is a profound novel set...', 
    submittedAt: '2025-07-04T14:32:00Z', 
    status: 'graded', 
    feedback: 'Excellent work, Maria! Your character analysis of Atticus is particularly insightful. The quote you selected is perfectly chosen. Consider expanding more on Scout\'s development as a narrator. Strong use of thematic language throughout.', 
    grade: '92/100', 
    feedbackAt: '2025-07-06T09:15:00Z' 
  },
  { 
    id: 's2', 
    assignmentId: 'a4', 
    studentId: 'u1', 
    studentName: 'Maria Santos', 
    content: 'Technology has become an inseparable part of modern education...', 
    submittedAt: '2025-07-01T16:45:00Z', 
    status: 'pending', 
    feedback: null, 
    grade: null, 
    feedbackAt: null 
  }
];

// Structural Component Lifecycle Setup Hook
document.addEventListener('DOMContentLoaded', () => {
  renderStudentFeedback();
});

// Primary HTML Dynamic Card Generator Loop
function renderStudentFeedback() {
  const list = document.getElementById('student-feedback-list');
  if (!list || !state.currentUser) return;

  // Filter records to find finalized instructor submissions matching student ID context
  const gradedSubmissions = SUBMISSIONS.filter(s => s.studentId === state.currentUser.id && s.status === 'graded');

  if (gradedSubmissions.length === 0) {
    list.innerHTML = `
      <div class="feedback-card" style="padding: 2.5rem 1.5rem; text-align: center; color: var(--gray-400); font-style: italic;">
        No teacher evaluation cards or feedback streams have been finalized yet.
      </div>`;
    return;
  }

  // Map elements securely onto structural container layout definitions
  list.innerHTML = gradedSubmissions.map(s => {
    const parentAssignment = ASSIGNMENTS.find(x => x.id === s.assignmentId);
    const dateFormatted = s.feedbackAt ? new Date(s.feedbackAt).toLocaleDateString('en-PH', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }) : 'Recent Date';

    return `
      <div class="feedback-card">
        <div class="feedback-card-header">
          <h4>${parentAssignment ? parentAssignment.title : 'Academic Assignment Scope'}</h4>
          <span class="feedback-grade">${s.grade}</span>
        </div>
        <div class="feedback-body">
          <div class="feedback-meta">From Faculty: Prof. Juan Dela Cruz · Published on ${dateFormatted}</div>
          <div class="feedback-text">${s.feedback}</div>
        </div>
      </div>`;
  }).join('');
}