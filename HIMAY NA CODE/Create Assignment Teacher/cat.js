/* ═══════════════════════════════════════════════
   EDUGRAM · Create Assignment logic component module
═══════════════════════════════════════════════ */
'use strict';

// Active Authenticated Instructor Context State simulation proxy
let state = {
  currentUser: { id: 'u2', email: 'teacher@edugram.edu', role: 'teacher', firstName: 'Prof. Juan', lastName: 'Dela Cruz' }
};

// Main Data Storage Repository simulation cache
let ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change', subject: 'English Composition', dueDate: '2025-07-15', minWords: 1200, type: 'research', description: 'Write a well-researched academic paper on the impacts of climate change on Philippine agriculture.', rubric: 'Content (40%), Research Quality (30%)', teacherId: 'u2', createdAt: '2025-06-20T08:00:00Z' }
];

// Structural Document Component Ready entry hook
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('create-assignment-btn').addEventListener('click', createAssignment);
  document.getElementById('reset-assignment-btn').addEventListener('click', resetCreateForm);
});

// Dynamic Publishing Processing Controller function
function createAssignment() {
  const title = document.getElementById('new-assignment-title').value.trim();
  const subject = document.getElementById('new-assignment-subject').value.trim();
  const dueDate = document.getElementById('new-assignment-due').value;
  const minWords = parseInt(document.getElementById('new-assignment-words').value) || 0;
  const type = document.getElementById('new-assignment-type').value;
  const description = document.getElementById('new-assignment-desc').value.trim();
  const rubric = document.getElementById('new-assignment-rubric').value.trim();
  
  const errEl = document.getElementById('create-error');
  const succEl = document.getElementById('create-success');
  
  // Clear any existing visibility states
  errEl.classList.add('hidden'); 
  succEl.classList.add('hidden');

  // Input Parameter Integrity Verification Checks
  if (!title) { showValidationMessage(errEl, 'Assignment title is required.'); return; }
  if (!dueDate) { showValidationMessage(errEl, 'Due date is required.'); return; }
  if (!description) { showValidationMessage(errEl, 'Assignment description/prompt is required.'); return; }

  // Date Boundary Condition Evaluation
  if (new Date(dueDate) < new Date()) {
    if (!confirm('The selected due date is set in the past. Publish this assignment anyway?')) return;
  }

  // Generate new object structure matching database schema
  const newAssignment = {
    id: 'a' + Date.now(),
    title, 
    subject: subject || 'General', 
    dueDate,
    minWords: minWords || 500, 
    type,
    description, 
    rubric,
    teacherId: state.currentUser?.id || 'u2',
    createdAt: new Date().toISOString()
  };
  
  // Prepend into virtual data collection
  ASSIGNMENTS.unshift(newAssignment);
  console.log('Successfully pushed assignment object. Updated Repository Count:', ASSIGNMENTS.length);

  // Trigger positive response feedback animation elements
  succEl.textContent = `"${title}" published successfully!`;
  succEl.classList.remove('hidden');
  
  // Clear layout text containers
  resetCreateForm();
}

// Reset Input Elements Function
function resetCreateForm() {
  ['new-assignment-title', 'new-assignment-subject', 'new-assignment-due',
   'new-assignment-words', 'new-assignment-desc', 'new-assignment-rubric'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  
  const typeSelector = document.getElementById('new-assignment-type');
  if (typeSelector) typeSelector.value = 'essay';
  
  document.getElementById('create-error').classList.add('hidden');
}

function showValidationMessage(element, message) {
  element.textContent = message;
  element.classList.remove('hidden');
}