/* ═══════════════════════════════════════════════
   EDUGRAM · Writing Workspace Logic Engine
═══════════════════════════════════════════════ */
'use strict';

// Active runtime state
let state = {
  currentUser: { id: 'u1', firstName: 'Maria', lastName: 'Santos' },
  activeAssignmentId: null
};

// Data models mapping directly to your app specs
const ASSIGNMENTS = [
  { id: 'a1', title: 'Research Paper: Climate Change', subject: 'English Composition', dueDate: '2026-07-15', minWords: 1200 },
  { id: 'a2', title: 'Analytical Essay: Social Media', subject: 'Critical Thinking', dueDate: '2026-07-18', minWords: 800 },
  { id: 'a3', title: 'Book Report: To Kill a Mockingbird', subject: 'Literature', dueDate: '2026-07-05', minWords: 600 }
];

// Structural simulation dictionary matching local fallbacks
const MOCK_ERRORS = [
  { pattern: /\bteh\b/gi, type: 'spell', error: 'teh', fix: 'the', note: 'Spelling typography error' },
  { pattern: /\brecieve\b/gi, type: 'spell', error: 'recieve', fix: 'receive', note: 'Sequence rule check: i before e except after c' },
  { pattern: /\btheir\s+is\b/gi, type: 'grammar', error: 'their is', fix: 'there is', note: 'Incorrect homophone contextual matching' },
  { pattern: /\bshould\s+of\b/gi, type: 'grammar', error: 'should of', fix: 'should have', note: 'Syntactic phrase error' }
];

const MOCK_STYLE_TIPS = [
  { note: 'Passive voice detected. Try shifting to active verbs to maximize phrase momentum.' },
  { note: 'Vary your sentence structure metrics to maintain a steady rhythm across paragraphs.' },
  { note: 'Ensure your transitional statements logically bridge your core arguments.' }
];

let DRAFTS = {};

// Document Initialization Handler Lifecycle
document.addEventListener('DOMContentLoaded', () => {
  populateAssignmentDropdown();
  initEditorListeners();
});

function populateAssignmentDropdown() {
  const select = document.getElementById('assignment-select');
  if (!select) return;
  
  select.innerHTML = '<option value="">— Select Assignment —</option>' + 
    ASSIGNMENTS.map(a => `<option value="${a.id}">${a.title}</option>`).join('');
}

function initEditorListeners() {
  const select = document.getElementById('assignment-select');
  const area = document.getElementById('writing-area');

  select.addEventListener('change', () => {
    const id = select.value;
    state.activeAssignmentId = id;
    
    if (!id) {
      resetMetadataBar();
      area.textContent = '';
      updateWordMetricDisplay();
      return;
    }

    const match = ASSIGNMENTS.find(x => x.id === id);
    document.getElementById('meta-title').textContent = match.title;
    document.getElementById('meta-due').textContent = new Date(match.dueDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById('meta-words').textContent = match.minWords.toLocaleString();

    // Recover previous draft if saved
    area.textContent = DRAFTS[`${state.currentUser.id}-${id}`] || '';
    updateWordMetricDisplay();
    clearSidebarPanels();
  });

  area.addEventListener('input', updateWordMetricDisplay);
  document.getElementById('save-draft-btn').addEventListener('click', executeSaveDraft);
  document.getElementById('submit-assignment-btn').addEventListener('click', executeSubmitWorkflow);
  document.getElementById('check-writing-btn').addEventListener('click', runHeuristicScanner);
}

function updateWordMetricDisplay() {
  const text = document.getElementById('writing-area').innerText.trim();
  const wordCount = text === '' ? 0 : text.split(/\s+/).length;
  document.getElementById('word-count-display').textContent = `${wordCount.toLocaleString()} word${wordCount !== 1 ? 's' : ''}`;
}

function executeSaveDraft() {
  if (!state.activeAssignmentId) return alert('Please select a target assignment task first.');
  
  const text = document.getElementById('writing-area').innerText;
  DRAFTS[`${state.currentUser.id}-${state.activeAssignmentId}`] = text;

  const btn = document.getElementById('save-draft-btn');
  const initialText = btn.innerHTML;
  btn.innerHTML = '✓ Draft Saved!';
  btn.style.color = 'var(--green)';
  setTimeout(() => { btn.innerHTML = initialText; btn.style.color = ''; }, 2000);
}

function executeSubmitWorkflow() {
  if (!state.activeAssignmentId) return alert('Select assignment scope context before submitting.');
  const text = document.getElementById('writing-area').innerText.trim();
  if (!text) return alert('Cannot submit an empty draft document workspace.');

  const toast = document.getElementById('submit-toast');
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

function runHeuristicScanner() {
  const text = document.getElementById('writing-area').innerText;
  if (!text.trim()) return alert('Type something into the writing area to trigger analysis.');

  // Clean previous highlight bindings
  removeTextCanvasHighlights();
  setAnalyzeButtonLoading(true);

  setTimeout(() => {
    // Process sentence counts metrics
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const averageLength = sentences > 0 ? Math.round(words / sentences) : 0;

    document.getElementById('r-sentences').textContent = sentences;
    document.getElementById('r-avg').textContent = averageLength;
    document.getElementById('r-level').textContent = averageLength > 15 ? 'Advanced Academic' : 'Standard Intermediate';
    document.getElementById('r-passive').textContent = 'None Detected';

    let trackedIssues = [];
    MOCK_ERRORS.forEach(rule => {
      if (text.match(rule.pattern)) {
        trackedIssues.push(rule);
      }
    });

    document.getElementById('error-count').textContent = trackedIssues.length;
    renderIssuesToSidebar(trackedIssues);
    injectHighlightsIntoCanvas(trackedIssues);

    // Compute visual ring parameters
    const score = Math.max(50, 100 - (trackedIssues.length * 12));
    document.getElementById('score-num').textContent = score;
    document.getElementById('score-arc').style.strokeDasharray = `${score}, 100`;

    setCheckBtnLoading(false);
  }, 600);
}

function renderIssuesToSidebar(issues) {
  const list = document.getElementById('error-list');
  const tips = document.getElementById('suggestion-list');

  if (!issues.length) {
    list.innerHTML = '<div class="suggestion-item" style="border-color:var(--green)"><span class="s-fix">✓ Structure clean. No grammar flags.</span></div>';
  } else {
    list.innerHTML = issues.map(i => `
      <div class="suggestion-item">
        <span class="s-type ${i.type}">${i.type}</span>
        <span>Flagged phrase: <span class="s-error">"${i.error}"</span></span>
        <span class="s-fix">Suggestion: → ${i.fix}</span>
        <span class="s-note">${i.note}</span>
      </div>`).join('');
  }

  tips.innerHTML = MOCK_STYLE_TIPS.map(t => `
    <div class="suggestion-item">
      <span class="s-type style">style</span>
      <span class="s-error">${t.note}</span>
    </div>`).join('');
}

function injectHighlightsIntoCanvas(issues) {
  const area = document.getElementById('writing-area');
  let bodyHtml = area.innerHTML;

  issues.forEach(issue => {
    const regex = new RegExp(`\\b(${issue.error})\\b`, 'gi');
    const color = issue.type === 'spell' ? '#fee2e2' : '#fef3c7';
    const border = issue.type === 'spell' ? '#dc2626' : '#d97706';
    
    bodyHtml = bodyHtml.replace(regex, `<mark class="ai-highlight" style="background:${color}; border-bottom: 2px solid ${border}">$1</mark>`);
  });

  area.innerHTML = bodyHtml;
}

function removeTextCanvasHighlights() {
  const area = document.getElementById('writing-area');
  area.querySelectorAll('.ai-highlight').forEach(mark => {
    mark.replaceWith(document.createTextNode(mark.textContent));
  });
  area.normalize();
}

function setAnalyzeButtonLoading(loading) {
  const btn = document.getElementById('check-writing-btn');
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spin-icon">✦</span> Analyzing…`;
  } else {
    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> Check Writing`;
  }
}

function resetMetadataBar() {
  document.getElementById('meta-title').textContent = '—';
  document.getElementById('meta-due').textContent = '—';
  document.getElementById('meta-words').textContent = '—';
}

function clearSidebarPanels() {
  document.getElementById('error-list').innerHTML = '<p class="empty-hint">Click "Check Writing" to scan your text</p>';
  document.getElementById('suggestion-list').innerHTML = '<p class="empty-hint">Suggestions appear after checking</p>';
  document.getElementById('error-count').textContent = '0';
  document.getElementById('score-num').textContent = '—';
  document.getElementById('score-arc').style.strokeDasharray = '0, 100';
  ['r-sentences', 'r-avg', 'r-level', 'r-passive'].forEach(id => { document.getElementById(id).textContent = '—'; });
}