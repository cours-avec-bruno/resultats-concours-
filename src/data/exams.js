import epA from './epreuve-2026A.json';
import epB from './epreuve-2026B.json';
import epC from './epreuve-2026C.json';
import epPhA from './epreuve-2026PhA.json';
import epPhBCh from './epreuve-2026PhBCh.json';
import epPhBTh from './epreuve-2026PhBTh.json';
import epInfoMod from './epreuve-2026InfoMod.json';
import epSIA from './epreuve-2026SIA.json';
import epSIB from './epreuve-2026SIB.json';
import epSIC from './epreuve-2026SIC.json';
import epFrA from './epreuve-2026FrA.json';
import epFrB from './epreuve-2026FrB.json';
import epLVA from './epreuve-2026LVA.json';
import epLVB from './epreuve-2026LVB.json';

export const EXAMS = [epA, epB, epC, epPhA, epPhBCh, epPhBTh, epInfoMod, epSIA, epSIB, epSIC, epFrA, epFrB, epLVA, epLVB];
export const EXAM_MAP = Object.fromEntries(EXAMS.map(e => [e.id, e]));
