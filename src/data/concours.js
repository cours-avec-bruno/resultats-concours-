// Coefficients PT écrit par concours — source : tableau officiel Banque PT 2026
// PhyB est réparti équitablement entre Chimie et Thermodynamique

const A   = 'banque-pt-2026-epreuve-A';
const B   = 'banque-pt-2026-epreuve-B';
const C   = 'banque-pt-2026-epreuve-C';
const PhA = 'banque-pt-2026-epreuve-phA';
const PCh = 'banque-pt-2026-epreuve-phB-ch';
const PTh = 'banque-pt-2026-epreuve-phB-th';
const IM  = 'banque-pt-2026-info-mod';
const FrA = 'banque-pt-2026-fr-a';
const FrB = 'banque-pt-2026-fr-b';
const LVA = 'banque-pt-2026-lv-a';
const LVB = 'banque-pt-2026-lv-b';
const SIA = 'banque-pt-2026-si-a';
const SIB = 'banque-pt-2026-si-b';
const SIC = 'banque-pt-2026-si-c';

export const CONCOURS = [
  {
    nom: 'Centrale-Supélec',
    sigle: 'CCS',
    // A+B+C+PhA+PhB+IM+FrB+LVA+SIB = 94 pts PT écrit (total concours = 100 avec oraux)
    coeffs: { [A]:8, [B]:8, [C]:8, [PhA]:8, [PCh]:4, [PTh]:4, [IM]:10, [FrB]:17, [LVA]:11, [SIB]:16 },
  },
  {
    nom: 'Mines-Ponts',
    sigle: 'Mines Ponts',
    coeffs: { [B]:3, [C]:4, [PhA]:4, [PCh]:1.5, [PTh]:1.5, [IM]:2, [FrB]:5, [LVA]:3, [SIB]:6 },
  },
  {
    nom: 'Arts et Métiers',
    sigle: 'CNAM',
    coeffs: { [B]:4, [C]:4, [PhA]:4, [PCh]:2, [PTh]:2, [IM]:4, [FrA]:2.5, [FrB]:2.5, [LVB]:4, [SIA]:5, [SIB]:6 },
  },
  {
    nom: 'CCINP',
    sigle: 'CCINP',
    coeffs: { [B]:11, [C]:10, [PhA]:13, [PCh]:5, [PTh]:5, [IM]:11, [FrA]:5, [FrB]:4, [LVA]:5, [LVB]:5, [SIA]:13, [SIC]:13 },
  },
  {
    nom: 'ENS Cachan / Paris-Saclay',
    sigle: 'ENS Cachan',
    coeffs: { [A]:3, [C]:3, [PhA]:3, [PCh]:1, [PTh]:1, [IM]:2, [FrB]:4, [LVA]:2, [SIA]:4, [SIC]:6 },
  },
  {
    nom: 'ENS Rennes',
    sigle: 'ENS Rennes',
    coeffs: { [A]:3, [C]:3, [PhA]:3, [PCh]:1, [PTh]:1, [IM]:2, [FrB]:4, [LVA]:1, [SIA]:4, [SIC]:6 },
  },
  {
    nom: 'École Polytechnique',
    sigle: 'X',
    coeffs: { [A]:6, [PhA]:6, [IM]:4, [FrA]:4, [LVA]:6, [SIC]:10 },
  },
  {
    nom: 'Polytech',
    sigle: 'Polytech',
    coeffs: { [C]:3, [PhA]:3, [IM]:2, [FrB]:2, [LVA]:2, [SIC]:4 },
  },
  {
    nom: 'Mines-Télécom',
    sigle: 'IMT',
    coeffs: { [B]:3, [C]:3, [PhA]:3, [PCh]:1.5, [PTh]:1.5, [IM]:2, [FrB]:6, [LVA]:5, [SIB]:5 },
  },
];

// Retourne { note /20, filled, total } ou null si aucune épreuve saisie
export function computeScore(concours, notes) {
  let sumW = 0, sumC = 0, filled = 0;
  const total = Object.keys(concours.coeffs).length;
  for (const [id, c] of Object.entries(concours.coeffs)) {
    const note = notes[id];
    if (note != null) { sumW += note * c; sumC += c; filled++; }
  }
  if (filled === 0) return null;
  return { note: sumW / sumC, filled, total };
}
