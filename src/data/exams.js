import epA from './epreuve-2026A.json';
import epB from './epreuve-2026B.json';
import epC from './epreuve-2026C.json';
import epPhA from './epreuve-2026PhA.json';
import epPhBCh from './epreuve-2026PhBCh.json';
import epPhBTh from './epreuve-2026PhBTh.json';
import epInfoMod from './epreuve-2026InfoMod.json';
import epSIA from './epreuve-2026SIA.json';
import epSIB from './epreuve-2026SIB.json';

export const EXAMS = [epA, epB, epC, epPhA, epPhBCh, epPhBTh, epInfoMod, epSIA, epSIB];
export const EXAM_MAP = Object.fromEntries(EXAMS.map(e => [e.id, e]));
