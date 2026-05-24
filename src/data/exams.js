import epA from './epreuve-2026A.json';
import epB from './epreuve-2026B.json';

export const EXAMS = [epA, epB];
export const EXAM_MAP = Object.fromEntries(EXAMS.map(e => [e.id, e]));
