/* ═══════════════════════════════════════════════
   EDUGRAM · Standing People Management Platform Engine
═══════════════════════════════════════════════ */
'use strict';

// Simulated state variables
const USERS = [
  { id: 'u1', email: 'student@edugram.edu', role: 'student', firstName: 'Maria', lastName: 'Santos', studentId: '2024-00101', section: 'BSIT-3A' },
  { id: 'u2', email: 'teacher@edugram.edu', role: 'teacher', firstName: 'Prof. Juan', lastName: 'Dela Cruz', employeeId: 'FAC-2024-001' },
  { id: 'u3', email: 'john@edugram.edu', role: 'student', firstName: 'John', lastName: 'Reyes', studentId: '2024-00102', section: 'BSIT-3B' },
];

let SUBMISSIONS = [
  { id: 's1', assignmentId: 'a3', studentId: 'u1', studentName: 'Maria Santos', status: 'graded', grade: '92/100' },
  { id: 's2', assignmentId: 'a4', studentId: 'u1', studentName: 'Maria Santos', status: 'pending', grade: null },
  { id: 's3', assignmentId: 'a1', studentId: 'u3', studentName: 'John Reyes', status: 'pending', grade: null }
];

let state = {
  currentUser: { id: 'u2', email: 'teacher@edugram.edu', role: 'teacher', firstName: 'Prof. Juan' },
  peopleRoleFilter: 'all',
  peopleSearchQuery: '',
  viewPersonId: null
};

// Document Mounting Lifecycle Entry
document.addEventListener('DOMContentLoaded', () => {
  renderPeopleGrid();
  initPeopleManagementControls();
});

function initPeopleManagementControls() {
  // Search
  document.getElementById('people-search').addEventListener('input', e => {
    state.peopleSearchQuery = e.target.value.toLowerCase();
    renderPeopleGrid();
  });

  // Filter tab controls
  document.querySelectorAll('.people-filter-tabs .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.people-filter-tabs .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.peopleRoleFilter = btn.dataset.prole;
      renderPeopleGrid();
    });
  });

  // Numeric cards click listener assignment
  document.querySelectorAll('.pstat-clickable').forEach(stat => {
    stat.addEventListener('click', () => {
      const filter = stat.dataset.statfilter;
      if (filter === 'submissions') {
        openSubmissionsDetailModal();
      } else {
        document.querySelectorAll('.people-filter-tabs .filter-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.prole === filter);
        });
        state.peopleRoleFilter = filter;
        renderPeopleGrid();
      }
    });
  });

  // User additions triggers binding
  document.getElementById('add-person-btn').addEventListener('click', () => openAddPersonModal('student'));
  document.getElementById('add-teacher-btn').addEventListener('click', () => openAddPersonModal('teacher'));
  document.getElementById('add-person-close').addEventListener('click', closeAddPersonModal);
  document.getElementById('np-cancel').addEventListener('click', closeAddPersonModal);
  document.getElementById('np-save').addEventListener('click', saveNewPerson);

  // Profile modification controllers mapping
  document.getElementById('view-person-close').addEventListener('click', closeViewPersonModal);
  document.getElementById('vp-cancel').addEventListener('click', closeViewPersonModal);
  document.getElementById('vp-save').addEventListener('click', saveViewedPerson);
  document.getElementById('vp-delete').addEventListener('click', deleteViewedPerson);

  // Submissions lists details close bounds
  document.getElementById('subs-detail-close').addEventListener('click', closeSubmissionsDetailModal);
  document.getElementById('subs-detail-cancel').addEventListener('click', closeSubmissionsDetailModal);

  // Dynamic Label Modifier internally linked to select updates
  document.getElementById('np-role-select').addEventListener('change', (e) => {
    const isTeacher = e.target.value === 'teacher';
    document.getElementById('add-person-modal-title').textContent = isTeacher ? 'Add New Teacher' : 'Add New Student';
    document.getElementById('np-id-label').textContent = isTeacher ? 'Employee ID *' : 'Student ID *';
    document.getElementById('np-id').placeholder = isTeacher ? 'e.g. FAC-2024-001' : 'e.g. 2024-00123';
    document.getElementById('np-email').placeholder = isTeacher ? 'teacher@institution.edu' : 'student@institution.edu';
  });
}

// User Profile Grid Component Populator loop
function renderPeopleGrid() {
  const grid = document.getElementById('people-grid');
  let users = USERS.filter(u => u.id !== state.currentUser?.id);

  if (state.peopleRoleFilter !== 'all') users = users.filter(u => u.role === state.peopleRoleFilter);

  if (state.peopleSearchQuery) {
    users = users.filter(u => {
      const metadataStr = `${u.firstName} ${u.lastName} ${u.email} ${u.studentId || u.employeeId || ''}`.toLowerCase();
      return metadataStr.includes(state.peopleSearchQuery);
    });
  }

  // Live Statistical telemetry variables distribution sync
  document.getElementById('pstat-total').textContent = USERS.length;
  document.getElementById('pstat-students').textContent = USERS.filter(u => u.role === 'student').length;
  document.getElementById('pstat-teachers').textContent = USERS.filter(u => u.role === 'teacher').length;
  const uniqueSubsSet = new Set(SUBMISSIONS.map(s => s.studentId));
  document.getElementById('pstat-active').textContent = [...uniqueSubsSet].filter(id => USERS.some(u => u.id === id)).length;

  if (!users.length) {
    grid.innerHTML = '<div class="people-empty">No users found matching your specifications.</div>';
    return;
  }

  grid.innerHTML = users.map(u => {
    const initials = (u.firstName[0] + (u.lastName[0] || '')).toUpperCase();
    const idRef = u.studentId || u.employeeId || 'N/A';
    const subCount = SUBMISSIONS.filter(s => s.studentId === u.id).length;
    const gradedCount = SUBMISSIONS.filter(s => s.studentId === u.id && s.status === 'graded').length;
    const isTeacher = u.role === 'teacher';

    return `
      <div class="person-card ${isTeacher ? 'teacher-card' : ''}" onclick="openViewPersonModal('${u.id}')">
        <div class="pc-top">
          <div class="pc-avatar ${isTeacher ? 'teacher-av' : ''}">${initials}</div>
          <div class="pc-info">
            <div class="pc-name">${u.firstName} ${u.lastName}</div>
            <div class="pc-email">${u.email}</div>
          </div>
          <span class="pc-role-badge ${isTeacher ? 'teacher-badge' : ''}">${u.role}</span>
        </div>
        <div class="pc-meta">
          <div class="pc-meta-item">ID: <span>${idRef}</span></div>
          ${u.section ? `<div class="pc-meta-item">Section: <span>${u.section}</span></div>` : ''}
        </div>
        <div class="pc-footer">
          ${isTeacher ? '' : `
          <div class="pc-activity">
            <div class="pc-activity-item"><strong>${subCount}</strong> submitted</div>
            <div class="pc-activity-item"><strong>${gradedCount}</strong> graded</div>
          </div>`}
          <div class="pc-btn-row" style="margin-left:auto;">
            <button class="pc-view-btn" onclick="event.stopPropagation(); openViewPersonModal('${u.id}')">Edit</button>
            <button class="pc-del-btn" onclick="event.stopPropagation(); confirmUserDeletion('${u.id}')">Remove</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function openAddPersonModal(role = 'student') {
  ['np-first','np-last','np-email','np-id','np-section','np-pass'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('np-error').classList.add('hidden');
  document.getElementById('np-success').classList.add('hidden');
  document.getElementById('np-role-select').value = role;
  document.getElementById('np-role-select').dispatchEvent(new Event('change'));
  document.getElementById('add-person-modal').classList.remove('hidden');
}

function closeAddPersonModal() { document.getElementById('add-person-modal').classList.add('hidden'); }

function saveNewPerson() {
  const first = document.getElementById('np-first').value.trim();
  const last = document.getElementById('np-last').value.trim();
  const email = document.getElementById('np-email').value.trim();
  const id = document.getElementById('np-id').value.trim();
  const section = document.getElementById('np-section').value.trim();
  const pass = document.getElementById('np-pass').value;
  const role = document.getElementById('np-role-select').value;
  const errEl = document.getElementById('np-error');
  const succEl = document.getElementById('np-success');

  if (!first || !last || !email || !id || !pass) { errEl.textContent = 'Please fill out all required items.'; errEl.classList.remove('hidden'); return; }
  if (USERS.some(u => u.email === email)) { errEl.textContent = 'Email address already present in database.'; errEl.classList.remove('hidden'); return; }

  const targetPayload = { id: 'u' + Date.now(), email, password: pass, role, firstName: first, lastName: last, section: section || '', ...(role === 'teacher' ? { employeeId: id } : { studentId: id }) };
  USERS.push(targetPayload);

  succEl.textContent = 'Account entry finalized correctly!';
  succEl.classList.remove('hidden');
  setTimeout(() => { closeAddPersonModal(); renderPeopleGrid(); }, 1200);
}

function openViewPersonModal(uid) {
  const u = USERS.find(x => x.id === uid);
  if (!u) return;
  state.viewPersonId = uid;

  // Map values onto targets
  document.getElementById('vp-avatar').textContent = (u.firstName[0] + u.lastName[0]).toUpperCase();
  document.getElementById('vp-name').textContent = `${u.firstName} ${u.lastName}`;
  document.getElementById('vp-role-badge').textContent = u.role.toUpperCase();
  document.getElementById('vp-first').value = u.firstName;
  document.getElementById('vp-last').value = u.lastName;
  document.getElementById('vp-email').value = u.email;
  document.getElementById('vp-sid').value = u.studentId || u.employeeId || '';
  document.getElementById('vp-section').value = u.section || '';
  document.getElementById('vp-pass').value = '';

  const userSubs = SUBMISSIONS.filter(s => s.studentId === uid);
  document.getElementById('vp-activity').innerHTML = `
    <div class="vp-act-item"><span class="vp-act-num">${userSubs.length}</span><span class="vp-act-label">Submitted</span></div>
    <div class="vp-act-item"><span class="vp-act-num">${userSubs.filter(s => s.status === 'graded').length}</span><span class="vp-act-label">Graded</span></div>
    <div class="vp-act-item"><span class="vp-act-num">${userSubs.filter(s => s.status === 'pending').length}</span><span class="vp-act-label">Pending</span></div>`;

  document.getElementById('vp-error').classList.add('hidden');
  document.getElementById('vp-success').classList.add('hidden');
  document.getElementById('view-person-modal').classList.remove('hidden');
}

function closeViewPersonModal() { document.getElementById('view-person-modal').classList.add('hidden'); state.viewPersonId = null; }

function saveViewedPerson() {
  if (!state.viewPersonId) return;
  const u = USERS.find(x => x.id === state.viewPersonId);
  if (!u) return;

  u.firstName = document.getElementById('vp-first').value.trim();
  u.lastName = document.getElementById('vp-last').value.trim();
  u.email = document.getElementById('vp-email').value.trim();
  u.section = document.getElementById('vp-section').value.trim();
  const pass = document.getElementById('vp-pass').value;
  if (pass) u.password = pass;

  document.getElementById('vp-success').textContent = 'Profile records saved!';
  document.getElementById('vp-success').classList.remove('hidden');
  setTimeout(() => { closeViewPersonModal(); renderPeopleGrid(); }, 1200);
}

function deleteViewedPerson() {
  if (!state.viewPersonId) return;
  confirmUserDeletion(state.viewPersonId);
  closeViewPersonModal();
}

function confirmUserDeletion(uid) {
  const u = USERS.find(x => x.id === uid);
  if (!u) return;
  if (confirm(`Are you sure you want to completely remove user entries for "${u.firstName} ${u.lastName}"?`)) {
    USERS.splice(USERS.indexOf(u), 1);
    renderPeopleGrid();
  }
}

function openSubmissionsDetailModal() {
  const withSubsSet = new Set(SUBMISSIONS.map(s => s.studentId));
  const activeUsersList = USERS.filter(u => withSubsSet.has(u.id));
  const listContainer = document.getElementById('subs-detail-list');

  document.getElementById('subs-detail-title').textContent = `Users with Active Submissions (${activeUsersList.length})`;

  if (!activeUsersList.length) {
    listContainer.innerHTML = '<p class="people-empty">No active submission tracks documented.</p>';
  } else {
    listContainer.innerHTML = activeUsersList.map(u => {
      const userSubs = SUBMISSIONS.filter(s => s.studentId === u.id);
      return `
        <div class="subs-detail-row">
          <div class="sdr-avatar">${(u.firstName[0] + u.lastName[0]).toUpperCase()}</div>
          <div class="sdr-info">
            <div class="sdr-name">${u.firstName} ${u.lastName}</div>
            <div class="sdr-email">${u.email}</div>
          </div>
          <div class="sdr-stats">
            <div class="sdr-stat"><span class="sdr-num">${userSubs.length}</span><span class="sdr-lbl">Total</span></div>
            <div class="sdr-stat"><span class="sdr-num sdr-graded">${userSubs.filter(s => s.status === 'graded').length}</span><span class="sdr-lbl">Graded</span></div>
            <div class="sdr-stat"><span class="sdr-num sdr-pending">${userSubs.filter(s => s.status === 'pending').length}</span><span class="sdr-lbl">Pending</span></div>
          </div>
        </div>`;
    }).join('');
  }
  document.getElementById('submissions-detail-modal').classList.remove('hidden');
}

function closeSubmissionsDetailModal() { document.getElementById('submissions-detail-modal').classList.add('hidden'); }