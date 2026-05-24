import './style.css';
import { EXAMS, EXAM_MAP } from './data/exams.js';
import { ScoreManager } from './components/scoreManager.js';
import { createQuestionCard } from './components/renderQuestion.js';

const app = document.getElementById('app');

// Global error handler — surfaces JS errors visually instead of blank page
window.addEventListener('error', (e) => {
  app.innerHTML = `<div style="padding:2rem;font-family:monospace;color:#c00">
    <b>Erreur JS :</b> ${e.message}<br>
    <small>${e.filename} ligne ${e.lineno}</small>
  </div>`;
});
window.addEventListener('unhandledrejection', (e) => {
  app.innerHTML = `<div style="padding:2rem;font-family:monospace;color:#c00">
    <b>Promesse rejetée :</b> ${e.reason}
  </div>`;
});

function fmt(n, dec = 2) {
  if (n === null || n === undefined) return '—';
  const v = parseFloat(n.toFixed(dec));
  return Number.isInteger(v) ? String(v) : v.toFixed(dec);
}

/* ─── HOME ─────────────────────────────────────────────────────── */
function renderHome() {
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <header class="bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-2xl mx-auto px-4 py-5">
          <p class="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Banque PT 2026</p>
          <h1 class="text-2xl font-black text-gray-900 mt-0.5">Auto-évaluation Concours</h1>
          <p class="text-sm text-gray-400 mt-1">Sélectionne une épreuve pour commencer</p>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 py-6 w-full space-y-3">
        ${EXAMS.map(ep => `
          <button
            type="button"
            data-id="${ep.id}"
            class="exam-btn w-full text-left bg-white border border-gray-200 rounded-xl shadow-sm px-5 py-4
                   hover:border-indigo-300 hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-xs font-medium text-indigo-500 uppercase tracking-wide">${ep.concours}</p>
                <p class="text-base font-bold text-gray-900 mt-0.5">${ep.titre}</p>
                <p class="text-xs text-gray-400 mt-1">${ep.questions.length} questions · ${ep.totalPoints} pts · Moy. hist. ${ep.calibration?.mu_hist ?? '—'}/20</p>
              </div>
              <svg class="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        `).join('')}
      </main>
    </div>
  `;

  document.querySelectorAll('.exam-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      location.hash = btn.dataset.id;
    });
  });
}

/* ─── EXAM VIEW ─────────────────────────────────────────────────── */
function renderExam(epreuve) {
  const scoreManager = new ScoreManager(epreuve.questions, epreuve.calibration ?? null);
  const N = epreuve.questions.length;
  const hasCalib = !!epreuve.calibration;

  app.innerHTML = `
    <div class="min-h-screen bg-gray-50 pb-32">

      <header class="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div class="max-w-2xl mx-auto px-4 py-3">
          <div class="flex items-center gap-2 mb-2">
            <button id="btn-back" type="button"
              class="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-medium transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Accueil
            </button>
          </div>
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="text-xs font-semibold text-indigo-500 uppercase tracking-wider truncate">${epreuve.concours}</p>
              <h1 class="text-lg font-bold text-gray-900 leading-tight">${epreuve.titre}</h1>
              <p class="text-xs text-gray-400 mt-0.5">Barème indicatif sur ${epreuve.totalPoints} pts</p>
            </div>
            <div class="text-right shrink-0">
              <div id="score-brut" class="text-3xl font-black text-indigo-600 tabular-nums leading-none">—</div>
              <div class="text-xs text-gray-400">brut / ${epreuve.totalPoints}</div>
            </div>
          </div>
          <div class="mt-2">
            <div class="flex justify-between text-xs text-gray-400 mb-1">
              <span id="progress-label">0 / ${N} questions évaluées</span>
              <span id="progress-pct">0 %</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div id="progress-bar" class="bg-indigo-400 h-1.5 rounded-full transition-all duration-500" style="width:0%"></div>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-2xl mx-auto px-4 py-5 space-y-4" id="questions-container"></main>

      <div class="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-200 shadow-lg">
        <div class="max-w-2xl mx-auto px-4 py-3">
          <div id="banner-progress" class="flex items-center justify-between gap-4">
            <div>
              <p class="text-xs text-gray-400 font-medium">Note brute</p>
              <p id="bottom-brut" class="text-2xl font-black text-indigo-600 leading-none tabular-nums">—</p>
            </div>
            ${hasCalib ? `
            <div class="text-right">
              <p class="text-xs text-gray-400 font-medium">Note concours estimée</p>
              <p id="bottom-reelle" class="text-2xl font-black text-emerald-600 leading-none tabular-nums">—</p>
            </div>` : ''}
            <p id="remaining-badge" class="text-xs text-gray-400 text-right"></p>
          </div>
          <div id="banner-complete" class="hidden">
            <div class="flex items-stretch gap-3">
              <div class="flex-1 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-center">
                <p class="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Note brute</p>
                <p id="final-brut" class="text-2xl font-black text-indigo-700 tabular-nums">—</p>
                <p class="text-xs text-indigo-400">/ ${epreuve.totalPoints}</p>
              </div>
              ${hasCalib ? `
              <div class="flex-1 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center">
                <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Note concours</p>
                <p id="final-reelle" class="text-2xl font-black text-emerald-700 tabular-nums">—</p>
                <p id="final-ic" class="text-xs text-emerald-500">IC 95 % : —</p>
              </div>` : ''}
              <div class="flex items-center">
                <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-green-200">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                  Terminé
                </span>
              </div>
            </div>
            ${hasCalib ? `<p class="text-xs text-gray-400 mt-2 text-center">Calibré sur ${epreuve.calibration.source}</p>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-back').addEventListener('click', () => { location.hash = ''; });

  const container = document.getElementById('questions-container');
  for (const q of epreuve.questions) container.appendChild(createQuestionCard(q, scoreManager));

  scoreManager.onUpdate(({ earned, maxTotal, answered, total, noteReelle, icMin, icMax }) => {
    const pct = Math.round((answered / total) * 100);
    const complete = answered === total;
    const brutStr = answered === 0 ? '—' : fmt(earned);

    document.getElementById('progress-bar').style.width = `${pct}%`;
    document.getElementById('progress-pct').textContent = `${pct} %`;
    document.getElementById('progress-label').textContent =
      `${answered} / ${total} question${total > 1 ? 's' : ''} évaluée${total > 1 ? 's' : ''}`;
    document.getElementById('score-brut').textContent = brutStr;

    if (complete) {
      document.getElementById('banner-progress').classList.add('hidden');
      document.getElementById('banner-complete').classList.remove('hidden');
      document.getElementById('final-brut').textContent = `${fmt(earned)} / ${maxTotal}`;
      if (hasCalib) {
        document.getElementById('final-reelle').textContent = `${fmt(noteReelle)} / 20`;
        document.getElementById('final-ic').textContent = `IC 95 % : [${fmt(icMin)} ; ${fmt(icMax)}]`;
      }
    } else {
      document.getElementById('banner-progress').classList.remove('hidden');
      document.getElementById('banner-complete').classList.add('hidden');
      document.getElementById('bottom-brut').textContent = brutStr;
      if (hasCalib) {
        document.getElementById('bottom-reelle').textContent =
          answered === 0 ? '—' : `${fmt(noteReelle)} / 20`;
      }
      const remaining = total - answered;
      document.getElementById('remaining-badge').textContent =
        answered === 0 ? '' : `${remaining} restante${remaining > 1 ? 's' : ''}`;
    }
  });
}

/* ─── ROUTER ────────────────────────────────────────────────────── */
function route() {
  const id = location.hash.replace('#', '');
  const epreuve = EXAM_MAP[id];
  if (epreuve) renderExam(epreuve);
  else renderHome();
}

window.addEventListener('hashchange', route);
route();
