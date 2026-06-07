/* ═══════════════════════════════════════════════
   EDUGRAM · Submission History Engine Logics
═══════════════════════════════════════════════ */
'use strict';

// Active Runtime Session State Proxy
let state = {
  currentUser: { id: 'u1', email: 'student@edugram.edu', role: 'student', firstName: 'Maria', lastName: 'Santos' }
};

// System Assignment Registry
const ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change' },
  { id: 'a2', title: 'Analytical Essay: Social Media' },
  { id: 'a3', title: 'Book Report: To Kill a Mockingbird' },
  { id: 'a4', title: 'Argumentative Essay: Technology in Education' }
];

// System Submission Database Collections
let SUBMISSIONS = [
  { id: 's1', assignmentId: 'a3', studentId: 'u1', studentName: 'Maria Santos', content: 'To Kill a Mockingbird by Harper Lee is a profound novel set in the American South during the 1930s. The story is narrated by Scout Finch...', submittedAt: '2025-07-04T14:32:00Z', version: 2, status: 'graded', feedback: 'Excellent work, Maria!', grade: '92/100', feedbackAt: '2025-07-06T09:15:00Z' },
  { id: 's2', assignmentId: 'a4', studentId: 'u1', studentName: 'Maria Santos', content: 'Technology has become an inseparable part of modern education, and its integration into Philippine classrooms...', submittedAt: '2025-07-01T16:45:00Z', version: 1, status: 'pending', feedback: null, grade: null, feedbackAt: null }
];

// Document Mounting Hook Lifecycle
document.addEventListener('DOMContentLoaded', () => {
  renderSubmissionHistory();
});

// Dynamic Row Generator Function
function renderSubmissionHistory() {
  const tbody = document.getElementById('history-tbody');
  if (!tbody || !state.currentUser) return;

  // Filter lists based on the active user configuration profile
  const mySubs = SUBMISSIONS.filter(s => s.studentId === state.currentUser.id);

  if (mySubs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color:var(--gray-400); font-style:italic; padding:2rem">
          No submission files records stored yet.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = mySubs.map(s => {
    const a = ASSIGNMENTS.find(x => x.id === s.assignmentId);
    const dt = new Date(s.submittedAt).toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const statusHtml = s.status === 'graded'
      ? `<span class="ac-badge badge-graded">Graded · ${s.grade}</span>`
      : `<span class="ac-badge badge-submitted">Awaiting Review</span>`;
    return `
      <tr>
        <td><strong>${a ? a.title : 'Unknown Scope Assignment'}</strong></td>
        <td>v${s.version}</td>
        <td>${dt}</td>
        <td>${statusHtml}</td>
        <td><button class="ac-action view-btn" data-sid="${s.id}">View Details</button></td>
      </tr>`;
  }).join('');

  // Attach execution click routers onto dynamic table rows
  tbody.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      previewSubmission(btn.dataset.sid);
    });
  });
}

function previewSubmission(id) {
  const s = SUBMISSIONS.find(x => x.id === id);
  if (!s) return;
  alert(`Submission Snapshot Dialog Viewer\n\nStatus: ${s.status.toUpperCase()}\nText Content Fragment:\n\n"${s.content.substring(0, 250)}..."`);
}