/* ═══════════════════════════════════════════════
   EDUGRAM · Instructor Submissions Engine Bundle
═══════════════════════════════════════════════ */
'use strict';

// System Databases Data Architecture Mappings
let ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change' },
  { id: 'a2', title: 'Analytical Essay: Social Media' },
  { id: 'a3', title: 'Book Report: To Kill a Mockingbird' },
  { id: 'a4', title: 'Argumentative Essay: Technology in Education' }
];

let SUBMISSIONS = [
  { id: 's1', assignmentId: 'a3', studentId: 'u1', studentName: 'Maria Santos', content: 'To Kill a Mockingbird by Harper Lee is a profound novel set in the American South during the 1930s. The story is narrated by Scout Finch, a young girl who witnesses her father, lawyer Atticus Finch, defend a Black man named Tom Robinson against an unjust accusation of assault. Through Scout\'s innocent eyes, Lee masterfully explores themes of racial injustice, moral growth, and the loss of innocence. The character of Atticus Finch stands as a moral beacon throughout the novel, demonstrating courage and integrity in the face of prejudice. His famous line — "You never really understand a person until you consider things from his point of view, until you climb inside of his skin and walk around in it" — encapsulates the novel\'s central theme of empathy. Tom Robinson\'s trial is the emotional core of the story, exposing the deep-seated racism embedded in Maycomb\'s society. Despite overwhelming evidence of his innocence, Tom is found guilty, illustrating how prejudice can override justice. The novel ultimately challenges readers to confront their own biases and uphold moral courage.', submittedAt: '2025-07-04T14:32:00Z', version: 2, status: 'graded', feedback: 'Excellent work, Maria! Your character analysis of Atticus is particularly insightful. The quote you selected is perfectly chosen. Consider expanding more on Scout\'s development as a narrator. Strong use of thematic language throughout.', privateNote: 'Excellent structure. Double check punctuation trends on future projects.', grade: '92/100', feedbackAt: '2025-07-06T09:15:00Z' },
  { id: 's2', assignmentId: 'a4', studentId: 'u1', studentName: 'Maria Santos', content: 'Technology has become an inseparable part of modern education, and its integration into Philippine classrooms presents both remarkable opportunities and significant challenges. This essay argues that, when used thoughtfully and equitably, technology enhances the educational experience and prepares students for an increasingly digital world. However, the current state of technological infrastructure in the Philippines reveals a stark digital divide that must be addressed before full integration can be beneficial. Rural schools often lack reliable internet connectivity, making digital learning tools inaccessible to many students. Despite these challenges, the COVID-19 pandemic demonstrated that technology is not merely a convenience but a necessity in maintaining educational continuity. The shift to online learning, though imperfect, proved that students and teachers could adapt to digital platforms. Moving forward, a blended approach — combining traditional teaching with strategic use of technology — offers the most promising path for Philippine education.', submittedAt: '2025-07-01T16:45:00Z', version: 1, status: 'pending', feedback: null, privateNote: null, grade: null, feedbackAt: null },
  { id: 's3', assignmentId: 'a1', studentId: 'u3', studentName: 'John Reyes', content: 'Climate change poses one of the greatest threats to Philippine agriculture, a sector that employs nearly one-third of the country\'s workforce. Rising temperatures, erratic rainfall patterns, and increasingly severe typhoons are disrupting crop cycles and threatening food security across the archipelago. Farmers in the Cagayan Valley, historically one of the most productive agricultural regions, have reported significant changes in planting schedules due to unpredictable monsoon seasons. The traditional indicators they relied upon for generations — flowering of certain trees, migration patterns of birds — no longer reliably predict weather patterns. Rice, the staple crop of the Philippines, is particularly vulnerable to climate change. Studies show that for every degree Celsius increase in temperature during the growing season, rice yields decline by approximately 10%. With projections indicating continued warming, food security becomes an urgent national concern.', submittedAt: '2025-07-10T11:20:00Z', version: 1, status: 'pending', feedback: null, privateNote: null, grade: null, feedbackAt: null }
];

let activeSubmissionTargetId = null;

// Document Entry Component Mounting Hook
document.addEventListener('DOMContentLoaded', () => {
  renderSubmissionsQueue('all');
  initFilterTabActions();
  initModalFunctionalClosures();
  initQuickInsertionTags();
});

function initFilterTabActions() {
  document.querySelectorAll('#t-submissions .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#t-submissions .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSubmissionsQueue(btn.dataset.tfilter);
    });
  });
}

function initModalFunctionalClosures() {
  document.getElementById('modal-close').addEventListener('click', closeFeedbackOverlay);
  document.getElementById('modal-cancel').addEventListener('click', closeFeedbackOverlay);
  document.getElementById('modal-submit-feedback').addEventListener('click', processFeedbackSubmission);
}

function initQuickInsertionTags() {
  document.querySelectorAll('.ftag').forEach(btn => {
    btn.addEventListener('click', () => {
      const textInput = document.getElementById('modal-feedback-text');
      textInput.value = textInput.value ? textInput.value + ' ' + btn.dataset.tag + '.' : btn.dataset.tag + '.';
    });
  });
}

// Submissions List Map Populator
function renderSubmissionsQueue(filter = 'all') {
  const container = document.getElementById('submissions-list');
  if (!container) return;

  let filteredCollection = [...SUBMISSIONS];
  if (filter === 'pending') filteredCollection = filteredCollection.filter(s => s.status === 'pending');
  if (filter === 'graded') filteredCollection = filteredCollection.filter(s => s.status === 'graded');
  
  // Sort listings chronology
  filteredCollection.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  if (filteredCollection.length === 0) {
    container.innerHTML = '<p style="padding:1.5rem; color:var(--gray-400); font-style:italic; text-align:center;">No student submission files match this listing parameter.</p>';
    return;
  }

  // Iterate collection keys into template structure strings
  container.innerHTML = filteredCollection.map(s => {
    const parentAssignment = ASSIGNMENTS.find(x => x.id === s.assignmentId);
    const dateFormatted = new Date(s.submittedAt).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const nameInitials = s.studentName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const operationalActionHtml = s.status === 'graded'
      ? `<span class="graded-badge">Graded · ${s.grade}</span>`
      : `<button class="review-btn" data-sid="${s.id}">Review Draft</button>`;

    return `
      <div class="submission-card">
        <div class="submission-avatar">${nameInitials}</div>
        <div class="submission-info">
          <div class="submission-student">${s.studentName}</div>
          <div class="submission-assignment">${parentAssignment ? parentAssignment.title : 'Deleted Context Scope'}</div>
          <div class="submission-time">Submitted ${dateFormatted} · v${s.version}</div>
        </div>
        <div class="submission-actions">${operationalActionHtml}</div>
      </div>`;
  }).join('');

  // Attach execution click listeners
  container.querySelectorAll('.review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openFeedbackOverlay(btn.dataset.sid);
    });
  });
}

// Modal Form Data Sync Sync
function openFeedbackOverlay(sid) {
  const matchRecord = SUBMISSIONS.find(x => x.id === sid);
  if (!matchRecord) return;
  const parentAssignment = ASSIGNMENTS.find(x => x.id === matchRecord.assignmentId);
  
  activeSubmissionTargetId = sid;

  // Render values to modal element structures
  document.getElementById('modal-student').textContent = matchRecord.studentName;
  document.getElementById('modal-assignment').textContent = parentAssignment ? parentAssignment.title : '—';
  document.getElementById('modal-submitted').textContent = new Date(matchRecord.submittedAt).toLocaleString('en-PH');
  document.getElementById('modal-text').textContent = matchRecord.content;
  
  document.getElementById('modal-feedback-text').value = matchRecord.feedback || '';
  document.getElementById('modal-private-note').value = matchRecord.privateNote || '';
  document.getElementById('modal-grade').value = matchRecord.grade || '';
  
  document.getElementById('feedback-modal').classList.remove('hidden');
}

function closeFeedbackOverlay() {
  document.getElementById('feedback-modal').classList.add('hidden');
  activeSubmissionTargetId = null;
}

// Mutate Data States & Redraw Application Layout Loops
function processFeedbackSubmission() {
  const targetId = activeSubmissionTargetId;
  const publicFeedback = document.getElementById('modal-feedback-text').value.trim();
  const internalNote = document.getElementById('modal-private-note').value.trim();
  const calculatedGrade = document.getElementById('modal-grade').value.trim();

  if (!publicFeedback) { 
    alert('Please draft evaluation remarks inside the feedback input container.'); 
    return; 
  }
  if (!targetId) return;

  const targetObject = SUBMISSIONS.find(x => x.id === targetId);
  if (!targetObject) return;

  // Persist form variables into memory reference maps
  targetObject.feedback = publicFeedback;
  targetObject.privateNote = internalNote;
  targetObject.grade = calculatedGrade || 'Reviewed';
  targetObject.status = 'graded';
  targetObject.feedbackAt = new Date().toISOString();

  closeFeedbackOverlay();

  // Re-trigger layout queue draw updates
  const activeFilterBtn = document.querySelector('#t-submissions .filter-btn.active');
  renderSubmissionsQueue(activeFilterBtn ? activeFilterBtn.dataset.tfilter : 'all');
}