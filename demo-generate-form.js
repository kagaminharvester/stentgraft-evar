/**
 * Demo script - Generate sizing form and checklist
 * Run: node demo-generate-form.js
 */

import {
  generateSystemPrompt,
  processWithChecklist,
  generateSizingPrompt,
  generateSizingChecklist,
  formatChecklistForDisplay,
  generateHTMLChecklist,
  generatePrintableForm,
  generateSizingCard,
  IFU_VALIDATION,
  ENDURANT_PRODUCTS
} from './ai-integration.js';

import fs from 'fs';

// Example patient measurements
const measurements = {
  neckDiameter: 25,
  neckLength: 36,
  neckAngle: 45,
  rightCIA: 12,
  leftCIA: 14,
  renalToBifurcation: 117,
  ciaLength: 45,
  accessRight: 7,
  accessLeft: 8,
  introSide: 'right',
  useEndoAnchor: false
};

// Example selected configuration (based on measurements)
const selectedConfig = {
  mainBody: {
    code: "ETBF2816C145E",
    aortic: 28,
    ipsiLeg: 16,
    coveredLength: 145,
    gate: 14,
    frenchSize: 20,
    dimensions: { A: 28, B: 16, C: 80, D: 93, E: 145, F: 65 }
  },
  contraLimb: {
    code: "ETLW1616C095E",
    proximal: 16,
    distal: 16,
    coveredLength: 95,
    frenchSize: 16,
    dimensions: { A: 16, B: 16, C: 95 }
  },
  extensions: []
};

console.log('═══════════════════════════════════════════════════════════════');
console.log('         STENTGRAFT SIZING DEMO - Endurant II/IIs');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Show pre-validation
console.log('1. PRE-WALIDACJA IFU\n');
const preCheck = processWithChecklist(measurements);
console.log('Szyja aorty:', preCheck.ifuValidation.neck.valid ? 'OK' : 'PROBLEM');
preCheck.ifuValidation.neck.errors.forEach(e => console.log('  ✗', e));
preCheck.ifuValidation.neck.warnings.forEach(w => console.log('  ⚠', w));

console.log('CIA ipsilateralna:', preCheck.ifuValidation.ipsiIliac.valid ? 'OK' : 'PROBLEM');
console.log('CIA kontralateralna:', preCheck.ifuValidation.contraIliac.valid ? 'OK' : 'PROBLEM');
console.log();

// 2. Show oversizing calculations
console.log('2. OBLICZENIA PRZEWYMIAROWANIA\n');
const proxOversize = IFU_VALIDATION.calculateOversizing(
  measurements.neckDiameter,
  selectedConfig.mainBody.aortic,
  'aortic'
);
console.log(`Proksymalne: ${measurements.neckDiameter}mm → ${selectedConfig.mainBody.aortic}mm = ${proxOversize.oversizingPercent}%`);
console.log(`  Status: ${proxOversize.status.toUpperCase()} - ${proxOversize.message}`);

const ipsiOversize = IFU_VALIDATION.calculateOversizing(
  measurements.rightCIA,
  selectedConfig.mainBody.ipsiLeg,
  'iliac'
);
console.log(`Ipsilateralne: ${measurements.rightCIA}mm → ${selectedConfig.mainBody.ipsiLeg}mm = ${ipsiOversize.oversizingPercent}%`);
console.log(`  Status: ${ipsiOversize.status.toUpperCase()}`);

const contraOversize = IFU_VALIDATION.calculateOversizing(
  measurements.leftCIA,
  selectedConfig.contraLimb.distal,
  'iliac'
);
console.log(`Kontralateralne: ${measurements.leftCIA}mm → ${selectedConfig.contraLimb.distal}mm = ${contraOversize.oversizingPercent}%`);
console.log(`  Status: ${contraOversize.status.toUpperCase()}`);
console.log();

// 3. Generate checklist
console.log('3. GENEROWANIE CHECKLISTY\n');
const checklist = generateSizingChecklist(measurements, selectedConfig);
console.log(formatChecklistForDisplay(checklist));

// 4. Generate HTML files
console.log('\n4. GENEROWANIE PLIKÓW HTML\n');

// Generate printable form
const printableHTML = generatePrintableForm(measurements, selectedConfig, checklist, {
  patientName: 'Jan Kowalski',
  patientId: '12345678901',
  ctaDate: '2024-12-30'
});
fs.writeFileSync('output-form.html', printableHTML);
console.log('✓ Zapisano: output-form.html');

// Generate checklist HTML
const checklistHTML = generateHTMLChecklist(checklist);
fs.writeFileSync('output-checklist.html', checklistHTML);
console.log('✓ Zapisano: output-checklist.html');

// Generate sizing card
const cardHTML = generateSizingCard(measurements, selectedConfig);
fs.writeFileSync('output-card.html', cardHTML);
console.log('✓ Zapisano: output-card.html');

// 5. Show AI prompt
console.log('\n5. PROMPT DLA AI\n');
console.log('─'.repeat(60));
console.log(generateSizingPrompt(measurements));
console.log('─'.repeat(60));

// 6. System prompt preview
console.log('\n6. SYSTEM PROMPT (pierwsze 2000 znaków)\n');
const sysPrompt = generateSystemPrompt();
console.log(sysPrompt.substring(0, 2000) + '\n...[skrócono]...\n');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('         DEMO ZAKOŃCZONE - sprawdź wygenerowane pliki HTML');
console.log('═══════════════════════════════════════════════════════════════\n');
