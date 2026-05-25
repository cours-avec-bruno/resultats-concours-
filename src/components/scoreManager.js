export class ScoreManager {
  constructor(questions, calibration = null) {
    this.questions = questions;
    this.calibration = calibration;
    this.selections = {};
    this._listeners = [];
  }

  select(questionId, percentage) {
    this.selections[questionId] = percentage;
    this._notify();
  }

  getScore() {
    let earned = 0;
    let maxTotal = 0;
    const answered = Object.keys(this.selections).length;

    for (const q of this.questions) {
      maxTotal += q.bareme;
      const pct = this.selections[q.id];
      if (pct !== undefined) {
        earned += q.bareme * pct / 100;
      }
    }

    const noteNormalisee = maxTotal > 0 ? earned * 20 / maxTotal : 0;
    const models = this._calibrateModels(noteNormalisee, answered);
    return { earned, maxTotal, noteNormalisee, answered, total: this.questions.length, models };
  }

  _calibrateModels(noteBrute, answered) {
    if (!this.calibration || answered === 0) return null;
    const { mu_hist, sigma_hist, mu_cible, sigma_cible, tolerance } = this.calibration;
    const clamp = v => Math.min(20, Math.max(0, v));
    const z = (noteBrute - mu_hist) / sigma_hist;
    const raw_z = mu_cible + z * sigma_cible;
    return [
      { key: 'zscore',        label: 'Z-score',   sublabel: 'Normalisation σ',   note: clamp(raw_z), icMin: clamp(raw_z - tolerance), icMax: clamp(raw_z + tolerance) },
      { key: 'translation',   label: '+Δμ',        sublabel: 'Décalage uniforme', note: clamp(noteBrute + mu_cible - mu_hist) },
      { key: 'proportionnel', label: '×ratio μ',   sublabel: 'Proportionnel',     note: clamp(noteBrute * mu_cible / mu_hist) },
    ];
  }

  onUpdate(fn) {
    this._listeners.push(fn);
  }

  _notify() {
    const score = this.getScore();
    for (const fn of this._listeners) fn(score);
  }
}
