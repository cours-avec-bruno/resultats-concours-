const KEY = 'pt2026-notes';

export const globalStore = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  },
  // raw   : note brute /20
  // calibrated : note Z-score /20 (null si pas de calibration → on utilisera raw)
  setNote(examId, raw, calibrated = null) {
    const data = this.getAll();
    data[examId] = { raw, calibrated };
    localStorage.setItem(KEY, JSON.stringify(data));
  },
  getRaw(examId) {
    const d = this.getAll()[examId];
    if (d == null) return null;
    return typeof d === 'object' ? d.raw : d; // compat ancien format
  },
};
