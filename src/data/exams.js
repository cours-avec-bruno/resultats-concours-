import epA from './epreuve-2026A.json';
import epB from './epreuve-2026B.json';
import epC from './epreuve-2026C.json';
import epPhA from './epreuve-2026PhA.json';

export const EXAMS = [epA, epB, epC, epPhA];
export const EXAM_MAP = Object.fromEntries(EXAMS.map(e => [e.id, e]));
