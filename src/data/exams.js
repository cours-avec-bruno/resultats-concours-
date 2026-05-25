import epA from './epreuve-2026A.json';
import epB from './epreuve-2026B.json';
import epC from './epreuve-2026C.json';

export const EXAMS = [epA, epB, epC];
export const EXAM_MAP = Object.fromEntries(EXAMS.map(e => [e.id, e]));
