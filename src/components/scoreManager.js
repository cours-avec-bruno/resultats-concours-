export class ScoreManager {
  constructor(questions) {
    this.questions = questions;
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

    return { earned, maxTotal, answered, total: this.questions.length };
  }

  onUpdate(fn) {
    this._listeners.push(fn);
  }

  _notify() {
    const score = this.getScore();
    for (const fn of this._listeners) fn(score);
  }
}
