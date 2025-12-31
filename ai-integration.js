/**
 * AI Integration Module for Stentgraft Sizing App
 * Enhanced system prompt with complete IFU rules
 */

import { IFU_RULES, SIZING_GUIDELINES, IFU_VALIDATION } from './ifu-endurant-rules.js';
import { ENDURANT_PRODUCTS, PRODUCT_HELPERS } from './endurant-products.js';
import { generateSizingChecklist, formatChecklistForDisplay, generateHTMLChecklist } from './sizing-checklist.js';
import { generatePrintableForm, generateSizingCard } from './printable-form.js';

/**
 * Generate comprehensive system prompt for AI
 */
function generateSystemPrompt() {
  return `Jesteś ekspertem klinicznym w wymiarowaniu stentgraftów AAA z systemu Medtronic Endurant II/IIs.
Twoje rekomendacje MUSZĄ być zgodne z oficjalnym IFU (Instructions for Use).

══════════════════════════════════════════════════════════════════
OBOWIĄZKOWE REGUŁY IFU - MEDTRONIC ENDURANT II/IIs
══════════════════════════════════════════════════════════════════

1. SZYJA AORTY (PROXIMAL NECK)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Średnica: ${IFU_RULES.neck.diameter.min}-${IFU_RULES.neck.diameter.max} mm (inner wall)
• Długość minimalna: ≥${IFU_RULES.neck.standard.minLength} mm (standard EVAR)
• Długość minimalna: ≥${IFU_RULES.neck.withEndoAnchor.minLength} mm (z Heli-FX EndoAnchor)
• Kąt angulacji: ≤${IFU_RULES.neck.standard.maxAngle}° (standard)
• Kąt angulacji: ≤${IFU_RULES.neck.standard.maxAngleIfLong}° (jeśli szyja ≥${IFU_RULES.neck.standard.longNeckThreshold}mm)
• Jakość szyi: brak/minimal skrzeplina, brak/minimal zwapnienia

2. TĘTNICE BIODROWE (ILIAC LANDING ZONE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Średnica CIA: ${IFU_RULES.iliac.diameter.min}-${IFU_RULES.iliac.diameter.max} mm
• Minimalna strefa uszczelnienia: ≥${IFU_RULES.iliac.minSealLength} mm

3. PRZEWYMIAROWANIE (OVERSIZING)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Proksymalne (aortalne): ${IFU_RULES.oversizing.aortic.min*100}-${IFU_RULES.oversizing.aortic.max*100}%
  - Optymalne: ${IFU_RULES.oversizing.aortic.optimal*100}%
  - Dopuszczalne do: ${IFU_RULES.oversizing.aortic.safeMax*100}% (safe range)
  - NIEBEZPIECZNE: >${IFU_RULES.oversizing.aortic.dangerMax*100}% (ryzyko infolding/kolaps)
• Biodrowe: ${IFU_RULES.oversizing.iliac.min*100}-${IFU_RULES.oversizing.iliac.max*100}%

4. NACZYNIA DOSTĘPOWE
━━━━━━━━━━━━━━━━━━━━━
• Main Body: ≥${IFU_RULES.access.mainBody.min} mm
• Limb (14Fr): ≥${IFU_RULES.access.byFrenchSize[14]} mm
• Limb (16Fr): ≥${IFU_RULES.access.byFrenchSize[16]} mm

5. ZAKŁADKA KOMPONENTÓW (OVERLAP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Minimalna: ${IFU_RULES.overlap.minimum} mm (3-5 stentów)

══════════════════════════════════════════════════════════════════
TABELE WYMIAROWANIA - DOBÓR GRAFTU
══════════════════════════════════════════════════════════════════

AORTA (Standard EVAR):
${SIZING_GUIDELINES.aortic.standardEVAR.map(r =>
  `  Naczynie ${r.vesselMin}-${r.vesselMax}mm → Graft ${r.graftDiameter}mm`
).join('\n')}

TĘTNICE BIODROWE (Limbs):
${SIZING_GUIDELINES.limbs.map(r =>
  `  Naczynie ${r.vesselMin}-${r.vesselMax}mm → Graft ${r.graftDiameter}mm`
).join('\n')}

══════════════════════════════════════════════════════════════════
PRODUKTY ENDURANT II/IIs
══════════════════════════════════════════════════════════════════

MAIN BODY (ETBF) - Bifurkacje:
• Średnice aortalne: 23, 25, 28, 32, 36mm
• Nogi ipsilateralne: 13, 14, 16, 20mm
• Długości: 103 (IIs), 124, 145, 166mm
• Gate: 12mm (aortic 23mm), 14mm (aortic 25-36mm)
• French: 18Fr (23-25mm), 20Fr (28-36mm)

CONTRALATERAL LIMBS (ETLW):
• Proksymalna zawsze 16mm (do gate)
• Dystalne: 10, 13, 16, 20, 24, 28mm
• Długości: 82, 95, 120, 156, 199mm

ILIAC EXTENSIONS (ETEW):
• Proste (ta sama średnica): 10, 13, 16, 20, 24, 28mm
• Długość: 82mm

AORTIC EXTENSIONS (ETCF/ETTF):
• Tapered: 28→23, 32→25, 36→28mm
• Straight: 23, 25, 28, 32, 36mm
• Długość: 49mm

══════════════════════════════════════════════════════════════════
ZASADY KONFIGURACJI
══════════════════════════════════════════════════════════════════

1. ETLW po stronie kontralateralnej ZAWSZE
2. ETLW po stronie ipsilateralnej możliwe TYLKO jeśli noga main body ≥16mm
3. Przy ESBF (103mm) używaj dla krótkich tętniaków
4. Długość kontralateralna = wewnętrzna dł. kontra (D) + ETLW - overlap(30mm)
5. Przy 124mm bifurkacji odejmij 10mm od wewn. dł. kontra

══════════════════════════════════════════════════════════════════
FORMAT ODPOWIEDZI
══════════════════════════════════════════════════════════════════

Dla KAŻDEJ rekomendacji MUSISZ podać:

1. WALIDACJA IFU
   ✓/✗ Średnica szyi: [wartość]mm (IFU: 19-32mm)
   ✓/✗ Długość szyi: [wartość]mm (IFU: ≥10mm)
   ✓/✗ Kąt szyi: [wartość]° (IFU: ≤60°)
   ✓/✗ Średnica CIA: [wartość]mm (IFU: 8-25mm)

2. KOMPONENTY Z OBLICZENIAMI
   Main Body: [KOD]
   - Oversize proksymalny: (graft - vessel)/vessel × 100% = [X]%

   Contra Limb: [KOD]
   - Oversize dystalny: (graft - vessel)/vessel × 100% = [X]%

3. KOMENTARZ KLINICZNY
   - Uzasadnienie wyboru
   - Uwagi o anatomii
   - Alternatywy

Odpowiadaj po polsku. Zawsze pokazuj obliczenia.`;
}

/**
 * Process measurements and generate complete response
 */
function processWithChecklist(measurements) {
  // Validate measurements against IFU
  const neckValidation = IFU_VALIDATION.validateNeck(
    measurements.neckDiameter,
    measurements.neckLength,
    measurements.neckAngle,
    measurements.useEndoAnchor
  );

  const ipsiDiam = measurements.introSide === 'right' ? measurements.rightCIA : measurements.leftCIA;
  const contraDiam = measurements.introSide === 'right' ? measurements.leftCIA : measurements.rightCIA;

  const ipsiValidation = IFU_VALIDATION.validateIliac(ipsiDiam, measurements.ciaLength || 30);
  const contraValidation = IFU_VALIDATION.validateIliac(contraDiam, measurements.ciaLength || 30);

  // Get recommended graft sizes
  const recommendedAortic = IFU_VALIDATION.getRecommendedGraft(measurements.neckDiameter, 'aortic');
  const recommendedIpsi = IFU_VALIDATION.getRecommendedGraft(ipsiDiam, 'iliac');
  const recommendedContra = IFU_VALIDATION.getRecommendedGraft(contraDiam, 'iliac');

  return {
    ifuValidation: {
      neck: neckValidation,
      ipsiIliac: ipsiValidation,
      contraIliac: contraValidation,
      overall: neckValidation.valid && ipsiValidation.valid && contraValidation.valid
    },
    recommendations: {
      aorticGraft: recommendedAortic,
      ipsiLimbGraft: recommendedIpsi,
      contraLimbGraft: recommendedContra
    },
    measurements
  };
}

/**
 * Generate AI prompt with pre-validation
 */
function generateSizingPrompt(measurements) {
  const preCheck = processWithChecklist(measurements);

  return `POMIARY PACJENTA:
━━━━━━━━━━━━━━━━━
• Średnica szyi: ${measurements.neckDiameter} mm
• Długość szyi: ${measurements.neckLength} mm
• Kąt szyi: ${measurements.neckAngle}°
• CIA prawa: ${measurements.rightCIA} mm
• CIA lewa: ${measurements.leftCIA} mm
• Renal→Bifurkacja: ${measurements.renalToBifurcation} mm
• Długość CIA: ${measurements.ciaLength || 'nie podano'} mm
• Dostęp: P ${measurements.accessRight}mm / L ${measurements.accessLeft}mm
• Strona wprowadzenia MB: ${measurements.introSide === 'right' ? 'PRAWA' : 'LEWA'}

PRE-WALIDACJA IFU:
━━━━━━━━━━━━━━━━━
${preCheck.ifuValidation.neck.valid ? '✓' : '✗'} Szyja aorty: ${preCheck.ifuValidation.neck.errors.concat(preCheck.ifuValidation.neck.warnings).join('; ') || 'OK'}
${preCheck.ifuValidation.ipsiIliac.valid ? '✓' : '✗'} CIA ipsilateralna: ${preCheck.ifuValidation.ipsiIliac.errors.join('; ') || 'OK'}
${preCheck.ifuValidation.contraIliac.valid ? '✓' : '✗'} CIA kontralateralna: ${preCheck.ifuValidation.contraIliac.errors.join('; ') || 'OK'}

SUGEROWANE ROZMIARY (wg tabeli):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Graft aortalny: ${preCheck.recommendations.aorticGraft || 'POZA ZAKRESEM'}mm
• Noga ipsi: ${preCheck.recommendations.ipsiLimbGraft || 'POZA ZAKRESEM'}mm
• Noga kontra: ${preCheck.recommendations.contraLimbGraft || 'POZA ZAKRESEM'}mm

ZADANIE:
Dobierz optymalną konfigurację Endurant II/IIs.
Podaj 2 warianty z pełnymi obliczeniami przewymiarowania.
Każdy komponent musi mieć obliczenie: (graft - vessel)/vessel × 100%.`;
}

export {
  generateSystemPrompt,
  processWithChecklist,
  generateSizingPrompt,
  // Re-export from other modules
  generateSizingChecklist,
  formatChecklistForDisplay,
  generateHTMLChecklist,
  generatePrintableForm,
  generateSizingCard,
  IFU_RULES,
  SIZING_GUIDELINES,
  IFU_VALIDATION,
  ENDURANT_PRODUCTS,
  PRODUCT_HELPERS
};
