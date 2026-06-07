/* ═══════════════════════════════════════════════
   EDUGRAM · Published Assignments Controller Engine
═══════════════════════════════════════════════ */
'use strict';

// Shared Session Database Array Matrix
let ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change', subject: 'English Composition', dueDate: '2025-07-15', minWords: 1200, type: 'research', openDate: '2025-06-20' },
  { id: 'a2', title: 'Analytical Essay: Social Media', subject: 'Critical Thinking', dueDate: '2025-07-18', minWords: 800, type: 'essay', openDate: null },
  { id: 'a3', title: 'Book Report: To Kill a Mockingbird', subject: 'Literature', dueDate: '2025-07-05', minWords: 600, type: 'report', openDate: '2025-06-15' }
];

let SUBMISSIONS = [
  { id: 's1', assignmentId: 'a3', studentId: 'u1', status: 'graded' },
  { id: 's2', assignmentId: 'a1', studentId: 'u1', status: 'pending' }
];

let state = {
  editAssignmentId: null
};

// Mount View Component Elements Lifecycle
document.addEventListener('DOMContentLoaded', () => {
  renderTeacherAssignments();
  initModalFunctionalClosures();
  
  document.getElementById('add-assignment-shortcut').addEventListener('click', () => {
    alert('Routing workspace context to Create Assignment channel panel…');
  });
});

function initModalFunctionalClosures() {
  document.getElementById('edit-assignment-close').addEventListener('click', closeEditAssignmentModal);
  document.getElementById('edit-assignment-backdrop').addEventListener('click', closeEditAssignmentModal);
  document.getElementById('edit-assignment-cancel').addEventListener('click', closeEditAssignmentModal);
  document.getElementById('edit-assignment-save').addEventListener('click', saveEditedAssignment);
}

// Assignment Data Grid Generator Mapping
function renderTeacherAssignments() {
  const container = document.getElementById('teacher-assignment-list');
  if (!container) return;

  if (!ASSIGNMENTS.length) {
    container.innerHTML = '<p style="color:var(--gray-400); font-style:italic; padding:1.5rem; text-align:center;">No active published assignments found.</p>';
    return;
  }

  container.innerHTML = ASSIGNMENTS.map(a => {
    const subCount = SUBMISSIONS.filter(s => s.assignmentId === a.id).length;
    const dueFormatted = new Date(a.dueDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    const openFormatted = a.openDate ? new Date(a.openDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
    const typeLabel = { essay: 'Essay', research: 'Research Paper', report: 'Book Report', reflection: 'Reflection', analysis: 'Critical Analysis' }[a.type] || a.type;
    
    return `
      <div class="t-assignment-row">
        <div class="ta-info">
          <div class="ta-title">${a.title}</div>
          <div class="ta-meta">
            <span>📚 ${a.subject}</span>
            ${openFormatted ? `<span>🗓️ Opens ${openFormatted}</span>` : ''}
            <span>📅 Due ${dueFormatted}</span>
            <span>📝 Min. ${a.minWords.toLocaleString()} words</span>
            <span>🏷️ ${typeLabel}</span>
            <span>👥 ${subCount} submission${subCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="ta-edit-btn" data-aid="${a.id}">✏️ Edit</button>
          <button class="ta-del" data-aid="${a.id}">Delete</button>
        </div>
      </div>`;
  }).join('');

  // Attach execution handler loops
  container.querySelectorAll('.ta-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditAssignmentModal(btn.dataset.aid));
  });

  container.querySelectorAll('.ta-del').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to permanently delete this assignment?')) {
        ASSIGNMENTS = ASSIGNMENTS.filter(a => a.id !== btn.dataset.aid);
        renderTeacherAssignments();
      }
    });
  });
}

// Modal Synchronization Handlers
function openEditAssignmentModal(assignmentId) {
  const match = ASSIGNMENTS.find(x => x.id === assignmentId);
  if (!match) return;
  
  state.editAssignmentId = assignmentId;

  document.getElementById('edit-assignment-title').value = match.title;
  document.getElementById('edit-assignment-due').value = match.dueDate;
  document.getElementById('edit-assignment-open').value = match.openDate || '';
  document.getElementById('edit-assignment-words').value = match.minWords || '';
  document.getElementById('edit-assignment-type').value = match.type || 'essay';
  
  document.getElementById('edit-assignment-error').classList.add('hidden');
  document.getElementById('edit-assignment-success').classList.add('hidden');
  document.getElementById('edit-assignment-modal').classList.remove('hidden');
}

function closeEditAssignmentModal() {
  document.getElementById('edit-assignment-modal').classList.add('hidden');
  state.editAssignmentId = null;
}

// Persist Object Updates into Memory Scope
function saveEditedAssignment() {
  const id = state.editAssignmentId;
  if (!id) return;

  const assignmentObj = ASSIGNMENTS.find(x => x.id === id);
  if (!assignmentObj) return;

  const title = document.getElementById('edit-assignment-title').value.trim();
  const dueDate = document.getElementById('edit-assignment-due').value;
  const openDate = document.getElementById('edit-assignment-open').value;
  const minWords = parseInt(document.getElementById('edit-assignment-words').value) || 0;
  const type = document.getElementById('edit-assignment-type').value;
  
  const errEl = document.getElementById('edit-assignment-error');
  const succEl = document.getElementById('edit-assignment-success');
  
  errEl.classList.add('hidden');
  succEl.classList.add('hidden');

  // Input Constraints Validations
  if (!title) { errEl.textContent = 'Assignment title is required.'; errEl.classList.remove('hidden'); return; }
  if (!dueDate) { errEl.textContent = 'Due date is required.'; errEl.classList.remove('hidden'); return; }
  if (openDate && dueDate && new Date(openDate) >= new Date(dueDate)) {
    errEl.textContent = 'Open date must fall chronologically before the selected deadline date.';
    errEl.classList.remove('hidden');
    return;
  }

  // Write changes back to memory collection
  assignmentObj.title = title;
  assignmentObj.dueDate = dueDate;
  assignmentObj.openDate = openDate || null;
  assignmentObj.minWords = minWords || 500;
  assignmentObj.type = type;

  succEl.textContent = 'Assignment changes saved successfully!';
  succEl.classList.remove('hidden');

  renderTeacherAssignments();

  setTimeout(() => closeEditAssignmentModal(), 1200);
}