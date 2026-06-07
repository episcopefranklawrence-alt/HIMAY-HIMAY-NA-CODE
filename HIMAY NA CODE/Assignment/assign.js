/* ─── Core Engine Assignments Logics ─── */
'use strict';

// Mock Active User Session Context Snapshot
let state = {
  currentUser: { id: 'u1', firstName: 'Maria', lastName: 'Santos' }
};

// System Assignment Repository Data
const ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change', subject: 'English Composition', dueDate: '2025-07-15', minWords: 1200, type: 'research', description: 'Write a well-researched academic paper on the impacts of climate change on Philippine agriculture.' },
  { id: 'a2', title: 'Analytical Essay: Social Media', subject: 'Critical Thinking', dueDate: '2025-07-18', minWords: 800, type: 'essay', description: 'Critically analyze the positive and negative effects of social media on academic performance.' },
  { id: 'a3', title: 'Book Report: To Kill a Mockingbird', subject: 'Literature', dueDate: '2025-07-05', minWords: 600, type: 'report', description: 'Write a comprehensive book report on Harper Lee\'s "To Kill a Mockingbird".' },
  { id: 'a4', title: 'Argumentative Essay: Technology in Education', subject: 'English Composition', dueDate: '2025-07-01', minWords: 1000, type: 'essay', description: 'Write a persuasive essay arguing either for or against the extensive use of technology.' }
];

// System Submission Database Collections
let SUBMISSIONS = [
  { id: 's1', assignmentId: 'a3', studentId: 'u1', status: 'graded', grade: '92/100' },
  { id: 's2', assignmentId: 'a4', studentId: 'u1', status: 'pending', grade: null }
];

// Initialization Lifecycle Event Hook
document.addEventListener('DOMContentLoaded', () => {
  renderStudentAssignments('all');
  initAssignmentFilters();
});

function initAssignmentFilters() {
  document.querySelectorAll('#s-assignments .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#s-assignments .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderStudentAssignments(btn.dataset.filter);
    });
  });
}

function getStudentSubmission(assignmentId) {
  if (!state.currentUser) return null;
  return SUBMISSIONS.find(s => s.assignmentId === assignmentId && s.studentId === state.currentUser.id) || null;
}

// Resolves timeline constraints against runtime metadata state
function getAssignmentStatus(assignment) {
  const sub = getStudentSubmission(assignment.id);
  if (!sub) {
    const due = new Date(assignment.dueDate);
    if (due < new Date()) return 'overdue';
    return 'pending';
  }
  if (sub.status === 'graded') return 'graded';
  return 'submitted';
}

// Dynamic Grid DOM Mapping Loop Matrix
function renderStudentAssignments(filter = 'all') {
  const grid = document.getElementById('student-assignment-grid');
  if (!grid) return;

  let filteredAssignments = ASSIGNMENTS;
  if (filter !== 'all') {
    filteredAssignments = ASSIGNMENTS.filter(a => getAssignmentStatus(a) === filter);
  }

  if (filteredAssignments.length === 0) {
    grid.innerHTML = '<p style="color:var(--gray-400); font-style: italic; padding: 1.5rem; grid-column: 1/-1; text-align: center;">No assignments found matching this filter category.</p>';
    return;
  }

  grid.innerHTML = filteredAssignments.map(a => {
    const status = getAssignmentStatus(a);
    const badgeMap = { 
      pending: ['badge-pending', 'Pending'], 
      submitted: ['badge-submitted', 'Submitted'], 
      graded: ['badge-graded', 'Graded'], 
      overdue: ['badge-overdue', 'Overdue'] 
    };
    
    const [badgeClass, badgeLabel] = badgeMap[status] || ['badge-pending', 'Pending'];
    const dueFormatted = new Date(a.dueDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    const actionLabel = status === 'pending' ? 'Start Writing' : status === 'overdue' ? 'Late Submit' : 'View Submission';
    
    return `
      <div class="assignment-card">
        <div class="ac-header">
          <span class="ac-title">${a.title}</span>
          <span class="ac-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="ac-subject">${a.subject} · ${a.type.charAt(0).toUpperCase() + a.type.slice(1)}</div>
        <div class="ac-desc">${a.description}</div>
        <div class="ac-footer">
          <span class="ac-due">Due: <strong>${dueFormatted}</strong></span>
          <button class="ac-action open-editor" data-id="${a.id}">${actionLabel} →</button>
        </div>
      </div>`;
  }).join('');

  // Workspace Redirection Router Hook Trigger
  grid.querySelectorAll('.open-editor').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      alert(`Workspace routing system active! Loading text module engine for assignment reference ID: ["${btn.dataset.id}"]`);
    });
  });
}