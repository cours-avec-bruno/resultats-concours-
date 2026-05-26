const KEY = 'pt2026-notes';

export const globalStore = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  },
  setNote(examId, note20) {
    const data = this.getAll();
    data[examId] = note20;
    localStorage.setItem(KEY, JSON.stringify(data));
  },
  getNote(examId) {
    return this.getAll()[examId] ?? null;
  },
};
