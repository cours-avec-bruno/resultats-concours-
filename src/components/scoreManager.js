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

    const calibrated = this._calibrate(earned, answered);
    return { earned, maxTotal, answered, total: this.questions.length, ...calibrated };
  }

  _calibrate(noteBrute, answered) {
    if (!this.calibration || answered === 0) {
      return { noteReelle: null, icMin: null, icMax: null };
    }
    const { mu_hist, sigma_hist, mu_cible, sigma_cible, tolerance } = this.calibration;
    const z = (noteBrute - mu_hist) / sigma_hist;
    const noteReelle = mu_cible + z * sigma_cible;
    return {
      noteReelle: Math.min(20, Math.max(0, noteReelle)),
      icMin: Math.min(20, Math.max(0, noteReelle - tolerance)),
      icMax: Math.min(20, Math.max(0, noteReelle + tolerance)),
    };
  }

  onUpdate(fn) {
    this._listeners.push(fn);
  }

  _notify() {
    const score = this.getScore();
    for (const fn of this._listeners) fn(score);
  }
}
