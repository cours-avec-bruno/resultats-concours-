import { renderContent } from './renderContent.js';

const STEPS = [
  { value: 0,   label: '0 %',   key: '0' },
  { value: 25,  label: '25 %',  key: '25' },
  { value: 50,  label: '50 %',  key: '50' },
  { value: 75,  label: '75 %',  key: '75' },
  { value: 100, label: '100 %', key: '100' },
];

export function createQuestionCard(question, scoreManager) {
  const card = document.createElement('article');
  card.id = `question-${question.id}`;
  card.className = 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden';

  let corrigeVisible = false;
  let selectedPct = null;

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

  card.innerHTML = `
    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-2 flex-wrap min-w-0">
          ${question.partie
            ? `<span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded shrink-0">${question.partie}</span>`
            : ''}
          <span class="text-sm font-bold text-gray-800">${question.numero}</span>
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

      <div>
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Mon estimation</p>
        <div class="btn-group flex gap-2" role="group" aria-label="Estimation de réussite"></div>
        <p class="sub-score text-xs text-gray-500 mt-2 min-h-[1.25rem]"></p>
      </div>
    </div>
  `;

  card.querySelector('.toggle-corrige').addEventListener('click', toggleCorrige);
  renderButtons();
  return card;
}
