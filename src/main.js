import './style.css';
import epreuve from './data/epreuve-2026A.json';
import { ScoreManager } from './components/scoreManager.js';
import { createQuestionCard } from './components/renderQuestion.js';

const app = document.getElementById('app');
const scoreManager = new ScoreManager(epreuve.questions, epreuve.calibration ?? null);
const N = epreuve.questions.length;
const hasCalib = !!epreuve.calibration;

function fmt(n, decimals = 2) {
  if (n === null || n === undefined) return '—';
  const v = parseFloat(n.toFixed(decimals));
  return Number.isInteger(v) ? String(v) : v.toFixed(decimals);
}

app.innerHTML = `
  <div class="min-h-screen bg-gray-50 pb-32">

    <!-- Sticky header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div class="max-w-2xl mx-auto px-4 py-3 sm:py-4">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="text-xs font-semibold text-indigo-500 uppercase tracking-wider truncate">${epreuve.concours}</p>
            <h1 class="text-lg sm:text-xl font-bold text-gray-900 leading-tight">${epreuve.titre}</h1>
            <p class="text-xs text-gray-400 mt-0.5">Barème indicatif sur ${epreuve.totalPoints} pts</p>
          </div>
          <div class="text-right shrink-0">
            <div id="score-brut" class="text-3xl font-black text-indigo-600 tabular-nums leading-none">—</div>
            <div class="text-xs text-gray-400">brut / ${epreuve.totalPoints}</div>
          </div>
        </div>

        <div class="mt-3">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span id="progress-label">0 / ${N} questions évaluées</span>
            <span id="progress-pct">0 %</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div id="progress-bar" class="bg-indigo-400 h-1.5 rounded-full transition-all duration-500 ease-out" style="width: 0%"></div>
          </div>
        </div>
      </div>
    </header>

    <!-- Questions -->
    <main class="max-w-2xl mx-auto px-4 py-5 space-y-4" id="questions-container"></main>

    <!-- Sticky bottom score banner -->
    <div class="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-200 shadow-lg">
      <div class="max-w-2xl mx-auto px-4 py-3">

        <!-- Before completion: compact line -->
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
          <div id="remaining-badge" class="text-xs text-gray-400 text-right"></div>
        </div>

        <!-- After completion: full calibration card -->
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
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                Terminé
              </span>
            </div>
          </div>
          ${hasCalib ? `<p class="text-xs text-gray-400 mt-2 text-center">Modèle calibré sur ${epreuve.calibration.source}</p>` : ''}
        </div>

      </div>
    </div>

  </div>
`;

const container = document.getElementById('questions-container');
for (const question of epreuve.questions) {
  container.appendChild(createQuestionCard(question, scoreManager));
}

scoreManager.onUpdate(({ earned, maxTotal, answered, total, noteReelle, icMin, icMax }) => {
  const pct = Math.round((answered / total) * 100);
  const complete = answered === total;

  // Progress bar
  document.getElementById('progress-bar').style.width = `${pct}%`;
  document.getElementById('progress-pct').textContent = `${pct} %`;
  document.getElementById('progress-label').textContent =
    `${answered} / ${total} question${total > 1 ? 's' : ''} évaluée${total > 1 ? 's' : ''}`;

  const brutStr = answered === 0 ? '—' : fmt(earned);

  // Header brut
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
