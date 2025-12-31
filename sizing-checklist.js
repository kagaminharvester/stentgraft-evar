/**
 * Sizing Checklist Generator with Full Calculations
 * Generates detailed checklist for EVAR sizing with IFU compliance validation
 */

import { IFU_RULES, IFU_VALIDATION } from './ifu-endurant-rules.js';
import { ENDURANT_PRODUCTS, PRODUCT_HELPERS } from './endurant-products.js';

/**
 * Generate complete sizing checklist with calculations
 * @param {Object} measurements - Patient measurements
 * @param {Object} selectedConfig - Selected stentgraft configuration
 * @returns {Object} Complete checklist with status and calculations
 */
function generateSizingChecklist(measurements, selectedConfig) {
  const checklist = {
    timestamp: new Date().toISOString(),
    patient: measurements.patientId || 'N/A',
    overallStatus: 'PASS',
    sections: []
  };

  // ============================================
  // SECTION 1: PROXIMAL NECK ASSESSMENT
  // ============================================
  const neckSection = {
    title: "1. SZYJA AORTY (Proximal Neck)",
    items: []
  };

  // 1.1 Neck diameter
  const neckDiameterCheck = {
    criterion: "Średnica szyi aorty",
    requirement: `${IFU_RULES.neck.diameter.min}-${IFU_RULES.neck.diameter.max} mm`,
    measured: `${measurements.neckDiameter} mm`,
    status: (measurements.neckDiameter >= IFU_RULES.neck.diameter.min &&
             measurements.neckDiameter <= IFU_RULES.neck.diameter.max) ? 'PASS' : 'FAIL',
    calculation: null
  };
  neckSection.items.push(neckDiameterCheck);

  // 1.2 Neck length
  const minNeckLength = measurements.useEndoAnchor ?
    IFU_RULES.neck.withEndoAnchor.minLength :
    IFU_RULES.neck.standard.minLength;

  const neckLengthCheck = {
    criterion: "Długość szyi aorty",
    requirement: `≥${minNeckLength} mm${measurements.useEndoAnchor ? ' (z EndoAnchor)' : ''}`,
    measured: `${measurements.neckLength} mm`,
    status: measurements.neckLength >= minNeckLength ? 'PASS' : 'FAIL',
    calculation: null,
    note: measurements.neckLength < 10 && !measurements.useEndoAnchor ?
      'Rozważ użycie Heli-FX EndoAnchor przy szyi 4-10mm' : null
  };
  neckSection.items.push(neckLengthCheck);

  // 1.3 Neck angulation
  const maxAngle = measurements.neckLength >= IFU_RULES.neck.standard.longNeckThreshold ?
    IFU_RULES.neck.standard.maxAngleIfLong :
    IFU_RULES.neck.standard.maxAngle;

  const neckAngleCheck = {
    criterion: "Kąt szyi aorty",
    requirement: `≤${maxAngle}°${measurements.neckLength >= 15 ? ' (szyja ≥15mm)' : ''}`,
    measured: `${measurements.neckAngle}°`,
    status: measurements.neckAngle <= maxAngle ? 'PASS' : 'FAIL',
    calculation: null
  };
  neckSection.items.push(neckAngleCheck);

  // 1.4 Proximal oversizing
  if (selectedConfig.mainBody) {
    const proxOversize = IFU_VALIDATION.calculateOversizing(
      measurements.neckDiameter,
      selectedConfig.mainBody.aortic,
      'aortic'
    );

    const proxOversizeCheck = {
      criterion: "Przewymiarowanie proksymalne",
      requirement: `${IFU_RULES.oversizing.aortic.min * 100}-${IFU_RULES.oversizing.aortic.max * 100}% (opt. ${IFU_RULES.oversizing.aortic.optimal * 100}%)`,
      measured: `${proxOversize.oversizingPercent}%`,
      status: proxOversize.valid ? (proxOversize.status === 'optimal' ? 'OPTIMAL' : 'PASS') : 'FAIL',
      calculation: `Naczynie: ${measurements.neckDiameter}mm → Graft: ${selectedConfig.mainBody.aortic}mm
      Oversize = (${selectedConfig.mainBody.aortic} - ${measurements.neckDiameter}) / ${measurements.neckDiameter} × 100% = ${proxOversize.oversizingPercent}%`,
      note: proxOversize.message
    };
    neckSection.items.push(proxOversizeCheck);
  }

  checklist.sections.push(neckSection);

  // ============================================
  // SECTION 2: IPSILATERAL ILIAC (strona wprowadzenia main body)
  // ============================================
  const ipsiSection = {
    title: `2. TĘTNICA BIODROWA IPSILATERALNA (${measurements.introSide === 'right' ? 'PRAWA' : 'LEWA'})`,
    items: []
  };

  const ipsiDiameter = measurements.introSide === 'right' ? measurements.rightCIA : measurements.leftCIA;

  // 2.1 Iliac diameter
  const ipsiDiamCheck = {
    criterion: "Średnica CIA",
    requirement: `${IFU_RULES.iliac.diameter.min}-${IFU_RULES.iliac.diameter.max} mm`,
    measured: `${ipsiDiameter} mm`,
    status: (ipsiDiameter >= IFU_RULES.iliac.diameter.min &&
             ipsiDiameter <= IFU_RULES.iliac.diameter.max) ? 'PASS' : 'FAIL',
    calculation: null
  };
  ipsiSection.items.push(ipsiDiamCheck);

  // 2.2 Seal zone length
  if (measurements.ciaLength) {
    const ipsiSealCheck = {
      criterion: "Strefa uszczelnienia",
      requirement: `≥${IFU_RULES.iliac.minSealLength} mm`,
      measured: `${measurements.ciaLength} mm (długość CIA)`,
      status: measurements.ciaLength >= IFU_RULES.iliac.minSealLength ? 'PASS' : 'FAIL',
      calculation: null,
      note: measurements.ciaLength < 20 ? 'Krótka strefa - rozważ przedłużenie do EIA' : null
    };
    ipsiSection.items.push(ipsiSealCheck);
  }

  // 2.3 Ipsilateral leg oversizing
  if (selectedConfig.mainBody) {
    const ipsiLegOversize = IFU_VALIDATION.calculateOversizing(
      ipsiDiameter,
      selectedConfig.mainBody.ipsiLeg,
      'iliac'
    );

    const ipsiOversizeCheck = {
      criterion: "Przewymiarowanie nogi ipsilateralnej",
      requirement: `${IFU_RULES.oversizing.iliac.min * 100}-${IFU_RULES.oversizing.iliac.max * 100}%`,
      measured: `${ipsiLegOversize.oversizingPercent}%`,
      status: ipsiLegOversize.valid ? 'PASS' : 'FAIL',
      calculation: `Naczynie: ${ipsiDiameter}mm → Graft: ${selectedConfig.mainBody.ipsiLeg}mm
      Oversize = (${selectedConfig.mainBody.ipsiLeg} - ${ipsiDiameter}) / ${ipsiDiameter} × 100% = ${ipsiLegOversize.oversizingPercent}%`,
      note: ipsiLegOversize.message
    };
    ipsiSection.items.push(ipsiOversizeCheck);
  }

  // 2.4 Access vessel
  if (selectedConfig.mainBody) {
    const accessDiam = measurements.introSide === 'right' ? measurements.accessRight : measurements.accessLeft;
    const requiredAccess = PRODUCT_HELPERS.frenchToMm(selectedConfig.mainBody.frenchSize);

    const accessCheck = {
      criterion: "Naczynie dostępowe",
      requirement: `≥${requiredAccess.toFixed(1)} mm (dla ${selectedConfig.mainBody.frenchSize}Fr)`,
      measured: `${accessDiam} mm`,
      status: accessDiam >= requiredAccess ? 'PASS' : 'FAIL',
      calculation: `${selectedConfig.mainBody.frenchSize}Fr ÷ 3 = ${requiredAccess.toFixed(2)}mm minimalnie`,
      note: accessDiam < requiredAccess ? 'Rozważ konduit lub alternatywny dostęp' : null
    };
    ipsiSection.items.push(accessCheck);
  }

  checklist.sections.push(ipsiSection);

  // ============================================
  // SECTION 3: CONTRALATERAL ILIAC
  // ============================================
  const contraSection = {
    title: `3. TĘTNICA BIODROWA KONTRALATERALNA (${measurements.introSide === 'right' ? 'LEWA' : 'PRAWA'})`,
    items: []
  };

  const contraDiameter = measurements.introSide === 'right' ? measurements.leftCIA : measurements.rightCIA;

  // 3.1 Contralateral diameter
  const contraDiamCheck = {
    criterion: "Średnica CIA",
    requirement: `${IFU_RULES.iliac.diameter.min}-${IFU_RULES.iliac.diameter.max} mm`,
    measured: `${contraDiameter} mm`,
    status: (contraDiameter >= IFU_RULES.iliac.diameter.min &&
             contraDiameter <= IFU_RULES.iliac.diameter.max) ? 'PASS' : 'FAIL',
    calculation: null
  };
  contraSection.items.push(contraDiamCheck);

  // 3.2 Contralateral limb oversizing
  if (selectedConfig.contraLimb) {
    const contraOversize = IFU_VALIDATION.calculateOversizing(
      contraDiameter,
      selectedConfig.contraLimb.distal,
      'iliac'
    );

    const contraOversizeCheck = {
      criterion: "Przewymiarowanie nogi kontralateralnej",
      requirement: `${IFU_RULES.oversizing.iliac.min * 100}-${IFU_RULES.oversizing.iliac.max * 100}%`,
      measured: `${contraOversize.oversizingPercent}%`,
      status: contraOversize.valid ? 'PASS' : 'FAIL',
      calculation: `Naczynie: ${contraDiameter}mm → Graft: ${selectedConfig.contraLimb.distal}mm
      Oversize = (${selectedConfig.contraLimb.distal} - ${contraDiameter}) / ${contraDiameter} × 100% = ${contraOversize.oversizingPercent}%`,
      note: contraOversize.message
    };
    contraSection.items.push(contraOversizeCheck);
  }

  // 3.3 Contralateral access
  if (selectedConfig.contraLimb) {
    const contraAccessDiam = measurements.introSide === 'right' ? measurements.accessLeft : measurements.accessRight;
    const contraRequiredAccess = PRODUCT_HELPERS.frenchToMm(selectedConfig.contraLimb.frenchSize);

    const contraAccessCheck = {
      criterion: "Naczynie dostępowe kontralateralne",
      requirement: `≥${contraRequiredAccess.toFixed(1)} mm (dla ${selectedConfig.contraLimb.frenchSize}Fr)`,
      measured: `${contraAccessDiam} mm`,
      status: contraAccessDiam >= contraRequiredAccess ? 'PASS' : 'FAIL',
      calculation: `${selectedConfig.contraLimb.frenchSize}Fr ÷ 3 = ${contraRequiredAccess.toFixed(2)}mm minimalnie`
    };
    contraSection.items.push(contraAccessCheck);
  }

  checklist.sections.push(contraSection);

  // ============================================
  // SECTION 4: LENGTH CALCULATIONS
  // ============================================
  const lengthSection = {
    title: "4. DŁUGOŚCI I ZAKŁADKI",
    items: []
  };

  // 4.1 Main body coverage
  if (selectedConfig.mainBody && measurements.renalToBifurcation) {
    const mainBodyCoverage = {
      criterion: "Pokrycie main body",
      requirement: `Od tętnic nerkowych do rozwidlenia + margines`,
      measured: `${measurements.renalToBifurcation} mm (renal-bifurkacja)`,
      status: selectedConfig.mainBody.coveredLength >= measurements.renalToBifurcation ? 'PASS' : 'FAIL',
      calculation: `Main body: ${selectedConfig.mainBody.code}
      Całkowita długość pokryta: ${selectedConfig.mainBody.coveredLength}mm
      Wymagana: ${measurements.renalToBifurcation}mm
      Margines: ${selectedConfig.mainBody.coveredLength - measurements.renalToBifurcation}mm`,
      note: selectedConfig.mainBody.coveredLength - measurements.renalToBifurcation < 15 ?
        'Mały margines - rozważ dłuższy main body' : null
    };
    lengthSection.items.push(mainBodyCoverage);
  }

  // 4.2 Component overlap
  if (selectedConfig.mainBody && selectedConfig.contraLimb) {
    const overlapCalc = {
      criterion: "Zakładka komponentów",
      requirement: `≥${IFU_RULES.overlap.minimum} mm (3-5 stentów)`,
      measured: `Planowana: ${IFU_RULES.overlap.minimum}mm`,
      status: 'PASS',
      calculation: `Minimalna zakładka: ${IFU_RULES.overlap.minimum}mm
      Odpowiada 3-5 ringom stentowym
      Gate main body: ${selectedConfig.mainBody.gate}mm`,
      note: 'Upewnij się o prawidłowym dopasowaniu markerów podczas zabiegu'
    };
    lengthSection.items.push(overlapCalc);
  }

  // 4.3 Contralateral total length
  if (selectedConfig.mainBody && selectedConfig.contraLimb) {
    // Internal contralateral length from main body
    const internalContraLength = selectedConfig.mainBody.dimensions.D;
    const limbLength = selectedConfig.contraLimb.coveredLength;
    const totalContraLength = internalContraLength + limbLength - IFU_RULES.overlap.minimum;

    const contraLengthCalc = {
      criterion: "Całkowita długość kontralateralna",
      requirement: `Pokrycie od gate do lądowania w CIA`,
      measured: `${totalContraLength} mm`,
      status: 'INFO',
      calculation: `Wewnętrzna długość kontra (D): ${internalContraLength}mm
      + Długość ETLW: ${limbLength}mm
      - Zakładka: ${IFU_RULES.overlap.minimum}mm
      = ${totalContraLength}mm całkowitego pokrycia`,
      note: selectedConfig.mainBody.coveredLength === 124 ?
        'UWAGA: Przy 124mm bifurkacji, odejmij 10mm od wewnętrznej długości kontra' : null
    };
    lengthSection.items.push(contraLengthCalc);
  }

  checklist.sections.push(lengthSection);

  // ============================================
  // SECTION 5: COMPONENT SUMMARY
  // ============================================
  const componentSection = {
    title: "5. PODSUMOWANIE KOMPONENTÓW",
    items: []
  };

  if (selectedConfig.mainBody) {
    componentSection.items.push({
      criterion: "Main Body",
      requirement: "Bifurkacja aortobiodorwa",
      measured: selectedConfig.mainBody.code,
      status: 'INFO',
      calculation: `Średnica aortalna: ${selectedConfig.mainBody.aortic}mm
      Noga ipsilateralna: ${selectedConfig.mainBody.ipsiLeg}mm
      Długość: ${selectedConfig.mainBody.coveredLength}mm
      Gate: ${selectedConfig.mainBody.gate}mm
      System wprowadzający: ${selectedConfig.mainBody.frenchSize}Fr`
    });
  }

  if (selectedConfig.contraLimb) {
    componentSection.items.push({
      criterion: "Contralateral Limb",
      requirement: "Noga kontralateralna ETLW",
      measured: selectedConfig.contraLimb.code,
      status: 'INFO',
      calculation: `Proksymalna: ${selectedConfig.contraLimb.proximal}mm
      Dystalna: ${selectedConfig.contraLimb.distal}mm
      Długość: ${selectedConfig.contraLimb.coveredLength}mm
      System: ${selectedConfig.contraLimb.frenchSize}Fr`
    });
  }

  if (selectedConfig.extensions && selectedConfig.extensions.length > 0) {
    selectedConfig.extensions.forEach((ext, idx) => {
      componentSection.items.push({
        criterion: `Extension ${idx + 1}`,
        requirement: "Przedłużenie biodrowe ETEW",
        measured: ext.code,
        status: 'INFO',
        calculation: `Średnica: ${ext.proximal}mm
      Długość: ${ext.coveredLength}mm
      System: ${ext.frenchSize}Fr`
      });
    });
  }

  checklist.sections.push(componentSection);

  // ============================================
  // CALCULATE OVERALL STATUS
  // ============================================
  let hasWarning = false;
  let hasFail = false;

  checklist.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.status === 'FAIL') hasFail = true;
      if (item.status === 'WARNING') hasWarning = true;
    });
  });

  if (hasFail) {
    checklist.overallStatus = 'FAIL';
  } else if (hasWarning) {
    checklist.overallStatus = 'WARNING';
  } else {
    checklist.overallStatus = 'PASS';
  }

  return checklist;
}

/**
 * Format checklist for display/print
 */
function formatChecklistForDisplay(checklist) {
  let output = '';

  output += `═══════════════════════════════════════════════════════════════\n`;
  output += `    CHECKLIST WYMIAROWANIA STENTGRAFTU ENDURANT II/IIs\n`;
  output += `═══════════════════════════════════════════════════════════════\n`;
  output += `Data: ${new Date(checklist.timestamp).toLocaleString('pl-PL')}\n`;
  output += `Status ogólny: ${getStatusIcon(checklist.overallStatus)} ${checklist.overallStatus}\n`;
  output += `───────────────────────────────────────────────────────────────\n\n`;

  checklist.sections.forEach(section => {
    output += `▌ ${section.title}\n`;
    output += `├─────────────────────────────────────────────────────────────\n`;

    section.items.forEach(item => {
      const icon = getStatusIcon(item.status);
      output += `│ ${icon} ${item.criterion}\n`;
      output += `│   Wymaganie: ${item.requirement}\n`;
      output += `│   Zmierzono: ${item.measured}\n`;
      if (item.calculation) {
        output += `│   Obliczenie:\n`;
        item.calculation.split('\n').forEach(line => {
          output += `│     ${line.trim()}\n`;
        });
      }
      if (item.note) {
        output += `│   ⚠ ${item.note}\n`;
      }
      output += `│\n`;
    });
    output += `\n`;
  });

  output += `═══════════════════════════════════════════════════════════════\n`;
  output += `   Wygenerowano przez Stentgraft Sizing App\n`;
  output += `   UWAGA: Narzędzie pomocnicze - zawsze weryfikuj z IFU\n`;
  output += `═══════════════════════════════════════════════════════════════\n`;

  return output;
}

function getStatusIcon(status) {
  switch (status) {
    case 'PASS': return '✓';
    case 'OPTIMAL': return '★';
    case 'WARNING': return '⚠';
    case 'FAIL': return '✗';
    case 'INFO': return '○';
    default: return '•';
  }
}

/**
 * Generate HTML checklist for printing
 */
function generateHTMLChecklist(checklist) {
  const statusColors = {
    'PASS': '#28a745',
    'OPTIMAL': '#17a2b8',
    'WARNING': '#ffc107',
    'FAIL': '#dc3545',
    'INFO': '#6c757d'
  };

  let html = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checklist Wymiarowania - Endurant II/IIs</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      margin: 0;
      padding: 15px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px double #333;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .header h1 {
      margin: 0 0 5px 0;
      font-size: 16pt;
    }
    .header .subtitle {
      font-size: 10pt;
      color: #666;
    }
    .meta-info {
      display: flex;
      justify-content: space-between;
      background: #f8f9fa;
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    .overall-status {
      font-weight: bold;
      padding: 3px 10px;
      border-radius: 3px;
      color: white;
    }
    .section {
      margin-bottom: 15px;
      break-inside: avoid;
    }
    .section-title {
      background: #343a40;
      color: white;
      padding: 6px 10px;
      font-weight: bold;
      font-size: 11pt;
    }
    .item {
      border: 1px solid #dee2e6;
      border-top: none;
      padding: 8px 10px;
    }
    .item:nth-child(odd) {
      background: #f8f9fa;
    }
    .item-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
    }
    .status-badge {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 50%;
      color: white;
      font-weight: bold;
      font-size: 12px;
    }
    .criterion {
      font-weight: bold;
    }
    .details {
      margin-left: 28px;
      font-size: 10pt;
    }
    .details .row {
      display: flex;
      gap: 20px;
      margin-bottom: 2px;
    }
    .details .label {
      color: #666;
      min-width: 80px;
    }
    .calculation {
      background: #e9ecef;
      padding: 5px 8px;
      margin: 5px 0;
      font-family: 'Courier New', monospace;
      font-size: 9pt;
      white-space: pre-wrap;
    }
    .note {
      color: #856404;
      background: #fff3cd;
      padding: 4px 8px;
      margin-top: 5px;
      border-left: 3px solid #ffc107;
      font-size: 9pt;
    }
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
    .signature-area {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding-top: 15px;
    }
    .signature-box {
      width: 45%;
      border-top: 1px solid #333;
      padding-top: 5px;
      text-align: center;
      font-size: 9pt;
    }
    @media print {
      body { padding: 0; }
      .section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>CHECKLIST WYMIAROWANIA STENTGRAFTU</h1>
    <div class="subtitle">Medtronic Endurant II/IIs System</div>
  </div>

  <div class="meta-info">
    <div>Data: ${new Date(checklist.timestamp).toLocaleString('pl-PL')}</div>
    <div>
      Status:
      <span class="overall-status" style="background: ${statusColors[checklist.overallStatus]}">
        ${checklist.overallStatus}
      </span>
    </div>
  </div>
`;

  checklist.sections.forEach(section => {
    html += `
  <div class="section">
    <div class="section-title">${section.title}</div>
`;
    section.items.forEach(item => {
      const color = statusColors[item.status] || '#6c757d';
      const icon = item.status === 'PASS' ? '✓' :
                   item.status === 'OPTIMAL' ? '★' :
                   item.status === 'FAIL' ? '✗' :
                   item.status === 'WARNING' ? '!' : '○';

      html += `
    <div class="item">
      <div class="item-header">
        <span class="status-badge" style="background: ${color}">${icon}</span>
        <span class="criterion">${item.criterion}</span>
      </div>
      <div class="details">
        <div class="row"><span class="label">Wymaganie:</span><span>${item.requirement}</span></div>
        <div class="row"><span class="label">Zmierzono:</span><span>${item.measured}</span></div>
        ${item.calculation ? `<div class="calculation">${item.calculation}</div>` : ''}
        ${item.note ? `<div class="note">⚠ ${item.note}</div>` : ''}
      </div>
    </div>
`;
    });
    html += `  </div>\n`;
  });

  html += `
  <div class="signature-area">
    <div class="signature-box">Operator / Sizing Specialist</div>
    <div class="signature-box">Lekarz prowadzący</div>
  </div>

  <div class="footer">
    <strong>UWAGA:</strong> Narzędzie pomocnicze - nie zastępuje oceny klinicznej.<br>
    Zawsze weryfikuj z aktualnym IFU producenta przed podjęciem decyzji klinicznych.<br>
    Wygenerowano przez Stentgraft Sizing App
  </div>
</body>
</html>
`;

  return html;
}

export {
  generateSizingChecklist,
  formatChecklistForDisplay,
  generateHTMLChecklist
};
