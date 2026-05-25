import { renderContent } from './renderContent.js';

const STEPS = [
  { value: 0,   label: '0 %',   key: '0' },
  { value: 25,  label: '25 %',  key: '25' },
  { value: 50,  label: '50 %',  key: '50' },
  { value: 75,  label: '75 %',  key: '75' },
  { value: 100, label: '100 %', key: '100' },
];

function gaugeColor(pct) {
  if (pct <= 20) return ['#ef4444', 'text-red-500'];
  if (pct <= 40) return ['#f97316', 'text-orange-500'];
  if (pct <= 60) return ['#f59e0b', 'text-amber-500'];
  if (pct <= 80) return ['#84cc16', 'text-lime-600'];
  return ['#10b981', 'text-emerald-600'];
}

function noteColor(val) {
  if (val < 8)  return '#ef4444';
  if (val < 10) return '#f97316';
  if (val < 14) return '#6366f1';
  return '#10b981';
}

export function createQuestionCard(question, scoreManager) {
  if (question.type === 'note') return createNoteCard(question, scoreManager);

  const card = document.createElement('article');
  card.id = `question-${question.id}`;
  const isDessin = question.type === 'dessin';
  card.className = `bg-white rounded-xl shadow-sm overflow-hidden ${isDessin ? 'border border-violet-200' : 'border border-gray-200'}`;

  let corrigeVisible = false;
  let selectedPct = null;
  let gaugeInteracted = false;

  function renderButtons() {
    const group = card.querySelector('.btn-group');
    if (!group) return;
    group.innerHTML = '';

    STEPS.forEach(({ value, label, key }) => {
      const isActive = selectedPct === value;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.dataset.pct = value;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.className = `btn-estimation ${isActive ? `active-${key}` : `idle-${key}`}`;
      btn.addEventListener('click', () => {
        selectedPct = value;
        scoreManager.select(question.id, value);
        renderButtons();
        renderSubScore();
      });
      group.appendChild(btn);
    });
  }

  function renderSubScore() {
    const el = card.querySelector('.sub-score');
    if (!el) return;
    if (selectedPct === null) {
      el.textContent = '';
    } else {
      const earned = question.bareme * selectedPct / 100;
      const fmt = Number.isInteger(earned) ? earned : earned.toFixed(2);
      el.textContent = `→ Score estimé : ${fmt} / ${question.bareme} pt${question.bareme > 1 ? 's' : ''}`;
    }
  }

  function toggleCorrige() {
    corrigeVisible = !corrigeVisible;
    const corrigeEl = card.querySelector('.corrige-block');
    const arrow = card.querySelector('.toggle-arrow');
    const label = card.querySelector('.toggle-label');
    corrigeEl?.classList.toggle('hidden', !corrigeVisible);
    if (arrow) arrow.style.transform = corrigeVisible ? 'rotate(90deg)' : 'rotate(0deg)';
    if (label) label.textContent = corrigeVisible ? 'Masquer le corrigé' : 'Afficher le corrigé';
  }

  const dessinBadge = isDessin
    ? `<span class="shrink-0 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">Dessin</span>`
    : '';

  const estimationBlock = isDessin ? `
    <div>
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs font-semibold text-violet-400 uppercase tracking-widest">Mon estimation (dessin)</p>
        <span class="gauge-pct text-sm font-bold text-gray-400">Non évalué</span>
      </div>
      <input type="range" min="0" max="100" step="5" value="0"
        class="gauge-slider w-full cursor-pointer mb-2" style="accent-color:#7c3aed">
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div class="gauge-fill h-full rounded-full transition-all duration-200" style="width:0%;background:#e5e7eb"></div>
      </div>
      <div class="flex justify-between text-[10px] text-gray-300 mt-1">
        <span>0 %</span><span>25 %</span><span>50 %</span><span>75 %</span><span>100 %</span>
      </div>
      <p class="sub-score text-xs text-gray-500 mt-2 min-h-[1.25rem]"></p>
    </div>
  ` : `
    <div>
      <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Mon estimation</p>
      <div class="btn-group flex gap-2" role="group" aria-label="Estimation de réussite"></div>
      <p class="sub-score text-xs text-gray-500 mt-2 min-h-[1.25rem]"></p>
    </div>
  `;

  card.innerHTML = `
    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-2 flex-wrap min-w-0">
          ${question.partie
            ? `<span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded shrink-0">${question.partie}</span>`
            : ''}
          <span class="text-sm font-bold text-gray-800">${question.numero}</span>
          ${dessinBadge}
        </div>
        <span class="shrink-0 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full whitespace-nowrap">
          ${question.bareme} pt${question.bareme > 1 ? 's' : ''}
        </span>
      </div>

      <div class="prose prose-sm max-w-none text-gray-700 mb-4 enonce-content">
        ${renderContent(question.enonce)}
      </div>

      <button type="button" class="toggle-corrige inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors mb-3 focus:outline-none focus:underline">
        <svg class="toggle-arrow w-4 h-4 shrink-0 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
        <span class="toggle-label">Afficher le corrigé</span>
      </button>

      <div class="corrige-block hidden mb-4">
        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p class="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-3">Corrigé</p>
          <div class="prose prose-sm max-w-none text-gray-700 corrige-content">
            ${renderContent(question.corrige)}
          </div>
        </div>
      </div>

      ${estimationBlock}
    </div>
  `;

  card.querySelector('.toggle-corrige').addEventListener('click', toggleCorrige);

  if (isDessin) {
    const slider = card.querySelector('.gauge-slider');
    slider.addEventListener('input', () => {
      gaugeInteracted = true;
      const pct = parseInt(slider.value);
      scoreManager.select(question.id, pct);
      const fill = card.querySelector('.gauge-fill');
      const label = card.querySelector('.gauge-pct');
      const subScore = card.querySelector('.sub-score');
      const [color, textClass] = gaugeColor(pct);
      fill.style.width = `${pct}%`;
      fill.style.background = color;
      label.textContent = `${pct} %`;
      label.className = `gauge-pct text-sm font-bold tabular-nums ${textClass}`;
      const earned = question.bareme * pct / 100;
      const fmt = Number.isInteger(earned) ? earned : earned.toFixed(2);
      subScore.textContent = `→ Score estimé : ${fmt} / ${question.bareme} pt${question.bareme > 1 ? 's' : ''}`;
    });
  } else {
    renderButtons();
  }

  return card;
}

function createNoteCard(question, scoreManager) {
  const card = document.createElement('article');
  card.id = `question-${question.id}`;
  card.className = 'bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden';

  card.innerHTML = `
    <div class="bg-gradient-to-r from-indigo-50 to-violet-50 px-5 py-3 border-b border-indigo-100">
      <p class="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Saisie de note</p>
    </div>
    <div class="p-6">
      <div class="flex items-end justify-center gap-2 mb-6">
        <span class="note-display text-6xl font-black tabular-nums leading-none" style="color:#a5b4fc">—</span>
        <span class="text-2xl font-bold text-gray-200 mb-1">/ 20</span>
      </div>
      <input type="range" min="0" max="20" step="0.5" value="0"
        class="note-slider w-full cursor-pointer mb-2" style="accent-color:#6366f1">
      <div class="flex justify-between text-[10px] text-gray-300 mb-4">
        <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span>
      </div>
      <p class="note-hint text-xs text-gray-400 text-center">Déplacez le curseur pour saisir votre note</p>
    </div>
  `;

  const slider = card.querySelector('.note-slider');
  const display = card.querySelector('.note-display');
  const hint = card.querySelector('.note-hint');

  slider.addEventListener('input', () => {
    const val = parseFloat(slider.value);
    const pct = val / 20 * 100;
    scoreManager.select(question.id, pct);
    const color = noteColor(val);
    display.style.color = color;
    display.textContent = Number.isInteger(val) ? String(val) : val.toFixed(1);
    hint.textContent = '';
  });

  return card;
}
