import './style.css';
import epreuve from './data/epreuve.json';
import { ScoreManager } from './components/scoreManager.js';
import { createQuestionCard } from './components/renderQuestion.js';

const app = document.getElementById('app');
const scoreManager = new ScoreManager(epreuve.questions);
const N = epreuve.questions.length;

app.innerHTML = `
  <div class="min-h-screen bg-gray-50 pb-28">

    <!-- Sticky header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div class="max-w-2xl mx-auto px-4 py-3 sm:py-4">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="text-xs font-semibold text-indigo-500 uppercase tracking-wider truncate">${epreuve.concours}</p>
            <h1 class="text-lg sm:text-xl font-bold text-gray-900 leading-tight">${epreuve.titre}</h1>
            <p class="text-xs text-gray-400 mt-0.5">${epreuve.duree} · Barème sur ${epreuve.totalPoints} points</p>
          </div>
          <div class="text-right shrink-0">
            <div id="score-value" class="text-3xl font-black text-indigo-600 tabular-nums leading-none">—</div>
            <div class="text-xs text-gray-400">/ ${epreuve.totalPoints}</div>
          </div>
        </div>

        <div class="mt-3">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span id="progress-label">0 / ${N} question${N > 1 ? 's' : ''} évaluée${N > 1 ? 's' : ''}</span>
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
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p class="text-xs text-gray-500 font-medium">Note estimée</p>
          <p id="bottom-score" class="text-2xl font-black text-indigo-600 leading-none tabular-nums">—</p>
        </div>
        <div id="completion-badge" class="hidden">
          <span class="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            Toutes les questions évaluées
          </span>
        </div>
        <div id="score-breakdown" class="text-right text-xs text-gray-400 space-y-0.5">
          <p id="breakdown-line"></p>
        </div>
      </div>
    </div>

  </div>
`;

const container = document.getElementById('questions-container');
for (const question of epreuve.questions) {
  container.appendChild(createQuestionCard(question, scoreManager));
}

scoreManager.onUpdate(({ earned, maxTotal, answered, total }) => {
  const pct = Math.round((answered / total) * 100);

  document.getElementById('progress-bar').style.width = `${pct}%`;
  document.getElementById('progress-pct').textContent = `${pct} %`;
  document.getElementById('progress-label').textContent =
    `${answered} / ${total} question${total > 1 ? 's' : ''} évaluée${total > 1 ? 's' : ''}`;

  const displayScore = answered === 0
    ? '—'
    : (Number.isInteger(earned) ? String(earned) : earned.toFixed(2));

  document.getElementById('score-value').textContent = displayScore;
  document.getElementById('bottom-score').textContent = displayScore;

  if (answered === total) {
    document.getElementById('completion-badge').classList.remove('hidden');
    document.getElementById('score-breakdown').classList.add('hidden');
  } else {
    document.getElementById('completion-badge').classList.add('hidden');
    document.getElementById('score-breakdown').classList.remove('hidden');
    const remaining = total - answered;
    document.getElementById('breakdown-line').textContent =
      `${remaining} question${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`;
  }
});
