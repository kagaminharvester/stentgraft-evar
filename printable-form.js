/**
 * Printable Sizing Form Generator
 * Creates comprehensive HTML form for EVAR sizing documentation
 */

import { IFU_RULES, IFU_VALIDATION } from './ifu-endurant-rules.js';
import { ENDURANT_PRODUCTS, DIMENSION_LEGEND } from './endurant-products.js';

/**
 * Generate complete printable sizing form
 * @param {Object} measurements - Patient measurements
 * @param {Object} config - Selected configuration
 * @param {Object} checklist - Validation checklist
 * @param {Object} options - Additional options (patientInfo, physician, etc.)
 */
function generatePrintableForm(measurements, config, checklist, options = {}) {
  const now = new Date();

  // Calculate oversizing values
  const proxOversize = config.mainBody ?
    IFU_VALIDATION.calculateOversizing(measurements.neckDiameter, config.mainBody.aortic, 'aortic') : null;

  const ipsiDiam = measurements.introSide === 'right' ? measurements.rightCIA : measurements.leftCIA;
  const contraDiam = measurements.introSide === 'right' ? measurements.leftCIA : measurements.rightCIA;

  const ipsiOversize = config.mainBody ?
    IFU_VALIDATION.calculateOversizing(ipsiDiam, config.mainBody.ipsiLeg, 'iliac') : null;

  const contraOversize = config.contraLimb ?
    IFU_VALIDATION.calculateOversizing(contraDiam, config.contraLimb.distal, 'iliac') : null;

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formularz Wymiarowania EVAR - Endurant II/IIs</title>
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      font-size: 9pt;
      line-height: 1.3;
      color: #1a1a1a;
      background: white;
    }
    .page {
      width: 190mm;
      min-height: 277mm;
      margin: 0 auto;
      padding: 5mm;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .header-left h1 {
      font-size: 14pt;
      color: #0066cc;
      margin-bottom: 2px;
    }
    .header-left .subtitle {
      font-size: 9pt;
      color: #666;
    }
    .header-right {
      text-align: right;
      font-size: 8pt;
    }
    .header-right .date {
      font-weight: bold;
    }

    /* Patient Info */
    .patient-section {
      background: #f0f4f8;
      border: 1px solid #ccd6e0;
      border-radius: 4px;
      padding: 8px 12px;
      margin-bottom: 10px;
    }
    .patient-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }
    .patient-field {
      display: flex;
      gap: 5px;
    }
    .patient-field .label {
      font-weight: bold;
      color: #555;
      min-width: 60px;
    }
    .patient-field .value {
      border-bottom: 1px dotted #999;
      flex: 1;
      min-width: 80px;
    }

    /* Main Grid Layout */
    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    /* Sections */
    .section {
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 8px;
      break-inside: avoid;
    }
    .section-header {
      background: linear-gradient(to right, #0066cc, #0088ee);
      color: white;
      font-weight: bold;
      font-size: 9pt;
      padding: 5px 10px;
      border-radius: 3px 3px 0 0;
    }
    .section-body {
      padding: 8px;
    }

    /* Measurement Table */
    .measurement-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    .measurement-table th,
    .measurement-table td {
      padding: 3px 5px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .measurement-table th {
      color: #666;
      font-weight: normal;
      width: 45%;
    }
    .measurement-table td {
      font-weight: bold;
    }
    .measurement-table td.value {
      text-align: right;
      font-family: 'Consolas', monospace;
    }
    .measurement-table td.unit {
      color: #888;
      text-align: left;
      width: 30px;
    }

    /* Component Box */
    .component-box {
      background: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 8px;
    }
    .component-title {
      font-weight: bold;
      color: #0066cc;
      border-bottom: 1px solid #ddd;
      padding-bottom: 3px;
      margin-bottom: 5px;
    }
    .component-code {
      font-family: 'Consolas', monospace;
      font-size: 11pt;
      font-weight: bold;
      color: #333;
      background: #fff;
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 3px;
      display: inline-block;
      margin-bottom: 5px;
    }
    .component-details {
      font-size: 8pt;
      color: #555;
    }

    /* Oversize Indicator */
    .oversize-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px;
      border-radius: 3px;
      margin: 5px 0;
    }
    .oversize-indicator.optimal {
      background: #d4edda;
      border: 1px solid #28a745;
    }
    .oversize-indicator.acceptable {
      background: #fff3cd;
      border: 1px solid #ffc107;
    }
    .oversize-indicator.warning {
      background: #ffe0b3;
      border: 1px solid #ff9800;
    }
    .oversize-indicator.fail {
      background: #f8d7da;
      border: 1px solid #dc3545;
    }
    .oversize-value {
      font-weight: bold;
      font-size: 12pt;
    }
    .oversize-calc {
      font-size: 7pt;
      color: #666;
    }

    /* Checklist */
    .checklist {
      font-size: 8pt;
    }
    .checklist-item {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      padding: 3px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .check-box {
      width: 14px;
      height: 14px;
      border: 1.5px solid #0066cc;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .check-box.pass::after {
      content: '✓';
      color: #28a745;
      font-weight: bold;
    }
    .check-box.fail::after {
      content: '✗';
      color: #dc3545;
      font-weight: bold;
    }
    .checklist-text {
      flex: 1;
    }
    .checklist-req {
      color: #666;
      font-size: 7pt;
    }

    /* Diagram Area */
    .diagram-area {
      text-align: center;
      padding: 10px;
      min-height: 120px;
      background: #fafafa;
      border: 1px dashed #ccc;
      border-radius: 4px;
    }
    .diagram-placeholder {
      color: #999;
      font-style: italic;
    }

    /* Footer */
    .footer {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #ccc;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 15px;
    }
    .signature-box {
      text-align: center;
    }
    .signature-line {
      border-top: 1px solid #333;
      padding-top: 3px;
      margin-top: 30px;
      font-size: 8pt;
      color: #666;
    }
    .disclaimer {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 4px;
      padding: 8px;
      font-size: 7pt;
      text-align: center;
    }

    /* Full Width Section */
    .full-width {
      grid-column: 1 / -1;
    }

    /* Print Styles */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { width: 100%; min-height: auto; }
      .section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- HEADER -->
    <div class="header">
      <div class="header-left">
        <h1>FORMULARZ WYMIAROWANIA EVAR</h1>
        <div class="subtitle">System Medtronic Endurant II/IIs</div>
      </div>
      <div class="header-right">
        <div class="date">${now.toLocaleDateString('pl-PL')}</div>
        <div>Godz: ${now.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}</div>
      </div>
    </div>

    <!-- PATIENT INFO -->
    <div class="patient-section">
      <div class="patient-grid">
        <div class="patient-field">
          <span class="label">Pacjent:</span>
          <span class="value">${options.patientName || '___________________'}</span>
        </div>
        <div class="patient-field">
          <span class="label">PESEL:</span>
          <span class="value">${options.patientId || '___________________'}</span>
        </div>
        <div class="patient-field">
          <span class="label">Data CTA:</span>
          <span class="value">${options.ctaDate || '___________________'}</span>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="main-content">

      <!-- LEFT COLUMN: MEASUREMENTS -->
      <div class="left-column">

        <!-- Aortic Neck -->
        <div class="section">
          <div class="section-header">SZYJA AORTY (Proximal Neck)</div>
          <div class="section-body">
            <table class="measurement-table">
              <tr>
                <th>Średnica (inner wall)</th>
                <td class="value">${measurements.neckDiameter}</td>
                <td class="unit">mm</td>
              </tr>
              <tr>
                <th>Długość szyi</th>
                <td class="value">${measurements.neckLength}</td>
                <td class="unit">mm</td>
              </tr>
              <tr>
                <th>Kąt angulacji</th>
                <td class="value">${measurements.neckAngle}</td>
                <td class="unit">°</td>
              </tr>
            </table>
            ${proxOversize ? `
            <div class="oversize-indicator ${proxOversize.status}">
              <span class="oversize-value">${proxOversize.oversizingPercent}%</span>
              <span class="oversize-calc">
                Oversize = (${config.mainBody.aortic} - ${measurements.neckDiameter}) / ${measurements.neckDiameter}
              </span>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Iliac Arteries -->
        <div class="section">
          <div class="section-header">TĘTNICE BIODROWE</div>
          <div class="section-body">
            <table class="measurement-table">
              <tr>
                <th>CIA prawa (średnica)</th>
                <td class="value">${measurements.rightCIA}</td>
                <td class="unit">mm</td>
              </tr>
              <tr>
                <th>CIA lewa (średnica)</th>
                <td class="value">${measurements.leftCIA}</td>
                <td class="unit">mm</td>
              </tr>
              <tr>
                <th>Długość CIA (strefa seal)</th>
                <td class="value">${measurements.ciaLength || '—'}</td>
                <td class="unit">mm</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Lengths -->
        <div class="section">
          <div class="section-header">POMIARY DŁUGOŚCI</div>
          <div class="section-body">
            <table class="measurement-table">
              <tr>
                <th>Renal → Bifurkacja</th>
                <td class="value">${measurements.renalToBifurcation}</td>
                <td class="unit">mm</td>
              </tr>
              <tr>
                <th>Aorta do CIA (ipsi)</th>
                <td class="value">${measurements.aortaToIpsiCIA || '—'}</td>
                <td class="unit">mm</td>
              </tr>
              <tr>
                <th>Aorta do CIA (kontra)</th>
                <td class="value">${measurements.aortaToContraCIA || '—'}</td>
                <td class="unit">mm</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Access Vessels -->
        <div class="section">
          <div class="section-header">NACZYNIA DOSTĘPOWE</div>
          <div class="section-body">
            <table class="measurement-table">
              <tr>
                <th>EIA/CFA prawa</th>
                <td class="value">${measurements.accessRight}</td>
                <td class="unit">mm</td>
              </tr>
              <tr>
                <th>EIA/CFA lewa</th>
                <td class="value">${measurements.accessLeft}</td>
                <td class="unit">mm</td>
              </tr>
              <tr>
                <th>Strona wprowadzenia MB</th>
                <td class="value" colspan="2">${measurements.introSide === 'right' ? 'PRAWA' : 'LEWA'}</td>
              </tr>
            </table>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: CONFIGURATION -->
      <div class="right-column">

        <!-- Main Body -->
        <div class="section">
          <div class="section-header">MAIN BODY (Bifurkacja)</div>
          <div class="section-body">
            ${config.mainBody ? `
            <div class="component-code">${config.mainBody.code}</div>
            <div class="component-details">
              <table class="measurement-table">
                <tr><th>Średnica aortalna (A)</th><td class="value">${config.mainBody.aortic}</td><td class="unit">mm</td></tr>
                <tr><th>Noga ipsilateralna (B)</th><td class="value">${config.mainBody.ipsiLeg}</td><td class="unit">mm</td></tr>
                <tr><th>Długość pokryta (E)</th><td class="value">${config.mainBody.coveredLength}</td><td class="unit">mm</td></tr>
                <tr><th>Gate</th><td class="value">${config.mainBody.gate}</td><td class="unit">mm</td></tr>
                <tr><th>System wprowadzający</th><td class="value">${config.mainBody.frenchSize}</td><td class="unit">Fr</td></tr>
              </table>
            </div>
            ${ipsiOversize ? `
            <div class="oversize-indicator ${ipsiOversize.status}">
              <span>Ipsi oversize: </span>
              <span class="oversize-value">${ipsiOversize.oversizingPercent}%</span>
              <span class="oversize-calc">(${config.mainBody.ipsiLeg}-${ipsiDiam})/${ipsiDiam}</span>
            </div>
            ` : ''}
            ` : '<div class="diagram-placeholder">Nie wybrano</div>'}
          </div>
        </div>

        <!-- Contralateral Limb -->
        <div class="section">
          <div class="section-header">CONTRALATERAL LIMB (ETLW)</div>
          <div class="section-body">
            ${config.contraLimb ? `
            <div class="component-code">${config.contraLimb.code}</div>
            <div class="component-details">
              <table class="measurement-table">
                <tr><th>Średnica proksymalna</th><td class="value">${config.contraLimb.proximal}</td><td class="unit">mm</td></tr>
                <tr><th>Średnica dystalna</th><td class="value">${config.contraLimb.distal}</td><td class="unit">mm</td></tr>
                <tr><th>Długość pokryta</th><td class="value">${config.contraLimb.coveredLength}</td><td class="unit">mm</td></tr>
                <tr><th>System wprowadzający</th><td class="value">${config.contraLimb.frenchSize}</td><td class="unit">Fr</td></tr>
              </table>
            </div>
            ${contraOversize ? `
            <div class="oversize-indicator ${contraOversize.status}">
              <span>Kontra oversize: </span>
              <span class="oversize-value">${contraOversize.oversizingPercent}%</span>
              <span class="oversize-calc">(${config.contraLimb.distal}-${contraDiam})/${contraDiam}</span>
            </div>
            ` : ''}
            ` : '<div class="diagram-placeholder">Nie wybrano</div>'}
          </div>
        </div>

        <!-- Extensions (if any) -->
        ${config.extensions && config.extensions.length > 0 ? `
        <div class="section">
          <div class="section-header">PRZEDŁUŻENIA (ETEW)</div>
          <div class="section-body">
            ${config.extensions.map((ext, i) => `
            <div class="component-box">
              <div class="component-title">Extension ${i+1}</div>
              <div class="component-code">${ext.code}</div>
              <div class="component-details">
                Średnica: ${ext.proximal}mm | Długość: ${ext.coveredLength}mm | ${ext.frenchSize}Fr
              </div>
            </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

      </div>

      <!-- FULL WIDTH: CHECKLIST -->
      <div class="section full-width">
        <div class="section-header">CHECKLIST ZGODNOŚCI Z IFU</div>
        <div class="section-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="checklist">
              <div class="checklist-item">
                <div class="check-box ${measurements.neckDiameter >= 19 && measurements.neckDiameter <= 32 ? 'pass' : 'fail'}"></div>
                <div class="checklist-text">
                  Średnica szyi ${IFU_RULES.neck.diameter.min}-${IFU_RULES.neck.diameter.max}mm
                  <div class="checklist-req">Zmierzono: ${measurements.neckDiameter}mm</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="check-box ${measurements.neckLength >= 10 ? 'pass' : 'fail'}"></div>
                <div class="checklist-text">
                  Długość szyi ≥${IFU_RULES.neck.standard.minLength}mm
                  <div class="checklist-req">Zmierzono: ${measurements.neckLength}mm</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="check-box ${measurements.neckAngle <= 60 || (measurements.neckLength >= 15 && measurements.neckAngle <= 75) ? 'pass' : 'fail'}"></div>
                <div class="checklist-text">
                  Kąt szyi ≤60° (≤75° jeśli szyja ≥15mm)
                  <div class="checklist-req">Zmierzono: ${measurements.neckAngle}°</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="check-box ${proxOversize && proxOversize.valid ? 'pass' : 'fail'}"></div>
                <div class="checklist-text">
                  Oversize proksymalny 10-20%
                  <div class="checklist-req">Obliczono: ${proxOversize ? proxOversize.oversizingPercent : '—'}%</div>
                </div>
              </div>
            </div>
            <div class="checklist">
              <div class="checklist-item">
                <div class="check-box ${measurements.ciaLength >= 15 ? 'pass' : 'fail'}"></div>
                <div class="checklist-text">
                  Strefa uszczelnienia ≥${IFU_RULES.iliac.minSealLength}mm
                  <div class="checklist-req">Zmierzono: ${measurements.ciaLength || '—'}mm</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="check-box ${ipsiDiam >= 8 && ipsiDiam <= 25 ? 'pass' : 'fail'}"></div>
                <div class="checklist-text">
                  Średnica CIA ${IFU_RULES.iliac.diameter.min}-${IFU_RULES.iliac.diameter.max}mm
                  <div class="checklist-req">Ipsi: ${ipsiDiam}mm | Kontra: ${contraDiam}mm</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="check-box ${ipsiOversize && ipsiOversize.valid ? 'pass' : 'fail'}"></div>
                <div class="checklist-text">
                  Oversize biodrowy 10-25%
                  <div class="checklist-req">Ipsi: ${ipsiOversize ? ipsiOversize.oversizingPercent : '—'}% | Kontra: ${contraOversize ? contraOversize.oversizingPercent : '—'}%</div>
                </div>
              </div>
              <div class="checklist-item">
                <div class="check-box ${(measurements.introSide === 'right' ? measurements.accessRight : measurements.accessLeft) >= 6 ? 'pass' : 'fail'}"></div>
                <div class="checklist-text">
                  Naczynie dostępowe ≥6mm (main body)
                  <div class="checklist-req">Zmierzono: ${measurements.introSide === 'right' ? measurements.accessRight : measurements.accessLeft}mm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line">Operator / Sizing Specialist</div>
        </div>
        <div class="signature-box">
          <div class="signature-line">Lekarz prowadzący</div>
        </div>
      </div>
      <div class="disclaimer">
        <strong>UWAGA:</strong> Narzędzie pomocnicze - nie zastępuje oceny klinicznej specjalisty.
        Zawsze weryfikuj z aktualnym IFU producenta (Medtronic) przed podjęciem decyzji klinicznych.
        Wymiary graftu muszą być potwierdzone przed zamówieniem i użyciem.
      </div>
    </div>

  </div>

  <script>
    // Print functionality
    function printForm() {
      window.print();
    }
  </script>
</body>
</html>
`;
}

/**
 * Generate simplified sizing summary card
 */
function generateSizingCard(measurements, config) {
  const proxOversize = config.mainBody ?
    IFU_VALIDATION.calculateOversizing(measurements.neckDiameter, config.mainBody.aortic, 'aortic') : null;

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Sizing Card - Endurant</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
    .card { border: 2px solid #0066cc; border-radius: 8px; padding: 15px; }
    .card-header { background: #0066cc; color: white; margin: -15px -15px 15px -15px; padding: 10px 15px; border-radius: 6px 6px 0 0; }
    .card-header h2 { margin: 0; font-size: 14pt; }
    .component { background: #f5f5f5; padding: 10px; margin: 8px 0; border-radius: 4px; }
    .component-name { font-weight: bold; color: #0066cc; }
    .component-code { font-family: monospace; font-size: 14pt; }
    .oversize { background: #d4edda; padding: 5px 10px; border-radius: 4px; margin-top: 5px; }
    .footer { font-size: 8pt; color: #666; text-align: center; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-header">
      <h2>KONFIGURACJA ENDURANT II</h2>
    </div>

    ${config.mainBody ? `
    <div class="component">
      <div class="component-name">Main Body</div>
      <div class="component-code">${config.mainBody.code}</div>
      <div>Aorta: ${config.mainBody.aortic}mm | Ipsi: ${config.mainBody.ipsiLeg}mm | Dł: ${config.mainBody.coveredLength}mm</div>
      ${proxOversize ? `<div class="oversize">Oversize: ${proxOversize.oversizingPercent}%</div>` : ''}
    </div>
    ` : ''}

    ${config.contraLimb ? `
    <div class="component">
      <div class="component-name">Contra Limb</div>
      <div class="component-code">${config.contraLimb.code}</div>
      <div>Prox: ${config.contraLimb.proximal}mm | Dist: ${config.contraLimb.distal}mm | Dł: ${config.contraLimb.coveredLength}mm</div>
    </div>
    ` : ''}

    ${config.extensions && config.extensions.map(ext => `
    <div class="component">
      <div class="component-name">Extension</div>
      <div class="component-code">${ext.code}</div>
      <div>Średnica: ${ext.proximal}mm | Dł: ${ext.coveredLength}mm</div>
    </div>
    `).join('') || ''}

    <div class="footer">
      Wygenerowano: ${new Date().toLocaleString('pl-PL')}<br>
      Stentgraft Sizing App
    </div>
  </div>
</body>
</html>
`;
}

export {
  generatePrintableForm,
  generateSizingCard
};
