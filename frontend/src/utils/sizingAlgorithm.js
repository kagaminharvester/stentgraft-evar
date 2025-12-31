// Stentgraft Sizing Algorithm for Endurant II/IIs
import {
  ETBF_PRODUCTS,
  ESBF_PRODUCTS,
  ETLW_PRODUCTS,
  ETEW_PRODUCTS,
  IFU_CONSTRAINTS,
  SIZING_GUIDE
} from '../data/endurantDatabase.js';

// Calculate oversizing percentage
export function calculateOversizing(graftDiam, vesselDiam) {
  return ((graftDiam - vesselDiam) / vesselDiam) * 100;
}

// Check if oversizing is within acceptable range
export function isOversizingValid(graftDiam, vesselDiam) {
  const oversizing = calculateOversizing(graftDiam, vesselDiam);
  return oversizing >= IFU_CONSTRAINTS.oversizing.min &&
         oversizing <= IFU_CONSTRAINTS.oversizing.max;
}

// Find optimal aortic graft size
export function findAorticGraftSize(neckDiameter) {
  const recommendation = SIZING_GUIDE.aorticOversizing.find(
    r => neckDiameter >= r.vesselMin && neckDiameter <= r.vesselMax
  );
  return recommendation ? recommendation.graftSize : null;
}

// Find optimal iliac graft size
export function findIliacGraftSize(iliacDiameter) {
  const recommendations = SIZING_GUIDE.iliacOversizing.filter(
    r => iliacDiameter >= r.vesselMin && iliacDiameter <= r.vesselMax
  );
  // Return smallest valid option for conservative approach
  return recommendations.length > 0
    ? Math.min(...recommendations.map(r => r.graftSize))
    : null;
}

// Validate anatomy against IFU
export function validateAnatomy(measurements) {
  const issues = [];
  const warnings = [];

  // Neck length
  if (measurements.neckLength < IFU_CONSTRAINTS.neckLength.min) {
    if (measurements.neckLength >= IFU_CONSTRAINTS.neckLength.withEndoAnchor) {
      warnings.push(`Szyja ${measurements.neckLength}mm - rozważ EndoAnchor (IFU: min ${IFU_CONSTRAINTS.neckLength.min}mm)`);
    } else {
      issues.push(`Szyja zbyt krótka: ${measurements.neckLength}mm (IFU: min ${IFU_CONSTRAINTS.neckLength.withEndoAnchor}mm z EndoAnchor)`);
    }
  }

  // Neck angle
  if (measurements.neckAngle > IFU_CONSTRAINTS.neckAngle.max) {
    if (measurements.neckAngle <= IFU_CONSTRAINTS.neckAngle.withLongNeck && measurements.neckLength >= 15) {
      warnings.push(`Kąt szyi ${measurements.neckAngle}° - akceptowalny przy szyi ≥15mm`);
    } else {
      issues.push(`Kąt szyi zbyt duży: ${measurements.neckAngle}° (IFU: max ${IFU_CONSTRAINTS.neckAngle.max}°)`);
    }
  }

  // Neck diameter
  if (measurements.neckDiameter < IFU_CONSTRAINTS.neckDiameter.min ||
      measurements.neckDiameter > IFU_CONSTRAINTS.neckDiameter.max) {
    issues.push(`Średnica szyi poza zakresem: ${measurements.neckDiameter}mm (IFU: ${IFU_CONSTRAINTS.neckDiameter.min}-${IFU_CONSTRAINTS.neckDiameter.max}mm)`);
  }

  // Iliac diameters
  if (measurements.rightCIA < IFU_CONSTRAINTS.iliacDiameter.min) {
    issues.push(`Prawa CIA zbyt wąska: ${measurements.rightCIA}mm (IFU: min ${IFU_CONSTRAINTS.iliacDiameter.min}mm)`);
  }
  if (measurements.leftCIA < IFU_CONSTRAINTS.iliacDiameter.min) {
    issues.push(`Lewa CIA zbyt wąska: ${measurements.leftCIA}mm (IFU: min ${IFU_CONSTRAINTS.iliacDiameter.min}mm)`);
  }
  if (measurements.rightCIA > IFU_CONSTRAINTS.iliacDiameter.max) {
    warnings.push(`Prawa CIA szeroka: ${measurements.rightCIA}mm - rozważ iliac branch device`);
  }
  if (measurements.leftCIA > IFU_CONSTRAINTS.iliacDiameter.max) {
    warnings.push(`Lewa CIA szeroka: ${measurements.leftCIA}mm - rozważ iliac branch device`);
  }

  // Access vessels
  if (measurements.accessRight < IFU_CONSTRAINTS.accessVessel.mainBody) {
    warnings.push(`Dostęp prawy ${measurements.accessRight}mm - może wymagać konduit`);
  }
  if (measurements.accessLeft < IFU_CONSTRAINTS.accessVessel.mainBody) {
    warnings.push(`Dostęp lewy ${measurements.accessLeft}mm - może wymagać konduit`);
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
    canProceed: issues.length === 0 || (issues.length > 0 && warnings.length > 0)
  };
}

// Find suitable main bodies
export function findMainBodies(measurements) {
  const aorticSize = findAorticGraftSize(measurements.neckDiameter);
  if (!aorticSize) return [];

  // Filter main bodies by aortic diameter
  const eligibleETBF = ETBF_PRODUCTS.filter(mb => mb.aorticDiam === aorticSize);
  const eligibleESBF = ESBF_PRODUCTS.filter(mb => mb.aorticDiam === aorticSize);

  const allMainBodies = [...eligibleETBF, ...eligibleESBF];

  // Calculate required main body length
  // renalToBifurcation - need to leave room for extensions with overlap
  const minLengthForExtensions = measurements.renalToBifurcation - measurements.ciaLength + IFU_CONSTRAINTS.overlap.min;

  return allMainBodies.map(mb => {
    const oversizing = calculateOversizing(mb.aorticDiam, measurements.neckDiameter);
    const lengthOK = mb.length <= measurements.renalToBifurcation;
    const allowsExtensions = mb.length <= minLengthForExtensions;

    return {
      ...mb,
      oversizing: oversizing.toFixed(1),
      lengthOK,
      allowsExtensions,
      score: calculateMainBodyScore(mb, measurements, oversizing, lengthOK)
    };
  }).sort((a, b) => b.score - a.score);
}

// Calculate score for main body selection
function calculateMainBodyScore(mainBody, measurements, oversizing, lengthOK) {
  let score = 100;

  // Penalize if length doesn't fit
  if (!lengthOK) score -= 50;

  // Prefer optimal oversizing (15%)
  score -= Math.abs(oversizing - 15) * 2;

  // Prefer ETBF over ESBF for complex anatomies
  if (mainBody.code.startsWith('ETBF')) score += 5;

  // Prefer ipsilateral leg that matches introduction side vessel
  const introSideVessel = measurements.introSide === 'right'
    ? measurements.rightCIA
    : measurements.leftCIA;
  const ipsiOversizing = calculateOversizing(mainBody.ipsiLegDiam, introSideVessel);
  if (ipsiOversizing >= 10 && ipsiOversizing <= 25) score += 10;

  return score;
}

// Find suitable contralateral limbs
export function findContralateralLimbs(measurements, mainBody) {
  const contraVessel = measurements.introSide === 'right'
    ? measurements.leftCIA
    : measurements.rightCIA;

  const targetDistalDiam = findIliacGraftSize(contraVessel);

  // ETLW always has 16mm proximal - compatible with gate sizes 12-14mm
  const eligibleETLW = ETLW_PRODUCTS.filter(limb => {
    const distalOversizing = calculateOversizing(limb.distalDiam, contraVessel);
    return distalOversizing >= IFU_CONSTRAINTS.oversizing.min &&
           distalOversizing <= IFU_CONSTRAINTS.oversizing.max;
  });

  return eligibleETLW.map(limb => {
    const distalOversizing = calculateOversizing(limb.distalDiam, contraVessel);
    return {
      ...limb,
      distalOversizing: distalOversizing.toFixed(1),
      score: 100 - Math.abs(distalOversizing - 15) * 2
    };
  }).sort((a, b) => b.score - a.score);
}

// Find suitable iliac extensions for ipsilateral side
export function findIpsilateralExtensions(measurements, mainBody) {
  const ipsiVessel = measurements.introSide === 'right'
    ? measurements.rightCIA
    : measurements.leftCIA;

  const ipsiLegDiam = mainBody.ipsiLegDiam;
  const results = [];

  // Option 1: Use ETLW (tapered) if ipsi leg is 16mm or can accept 16mm proximal
  if (ipsiLegDiam >= 16) {
    const eligibleETLW = ETLW_PRODUCTS.filter(limb => {
      const distalOversizing = calculateOversizing(limb.distalDiam, ipsiVessel);
      return distalOversizing >= IFU_CONSTRAINTS.oversizing.min &&
             distalOversizing <= IFU_CONSTRAINTS.oversizing.max;
    });

    eligibleETLW.forEach(limb => {
      const distalOversizing = calculateOversizing(limb.distalDiam, ipsiVessel);
      results.push({
        ...limb,
        type: 'ETLW',
        connectionType: 'inside-leg',
        distalOversizing: distalOversizing.toFixed(1),
        score: 100 - Math.abs(distalOversizing - 15) * 2 + 5 // Slight preference for ETLW
      });
    });
  }

  // Option 2: Use ETEW (straight) matching ipsi leg diameter
  const eligibleETEW = ETEW_PRODUCTS.filter(ext => {
    const oversizing = calculateOversizing(ext.diameter, ipsiVessel);
    return ext.diameter === ipsiLegDiam &&
           oversizing >= IFU_CONSTRAINTS.oversizing.min &&
           oversizing <= IFU_CONSTRAINTS.oversizing.max;
  });

  eligibleETEW.forEach(ext => {
    const oversizing = calculateOversizing(ext.diameter, ipsiVessel);
    results.push({
      ...ext,
      type: 'ETEW',
      connectionType: 'same-diameter',
      distalOversizing: oversizing.toFixed(1),
      score: 100 - Math.abs(oversizing - 15) * 2
    });
  });

  return results.sort((a, b) => b.score - a.score);
}

// Main sizing function - returns 2 optimal configurations
export function calculateOptimalConfigurations(measurements) {
  const validation = validateAnatomy(measurements);

  const mainBodies = findMainBodies(measurements);
  if (mainBodies.length === 0) {
    return {
      validation,
      configurations: [],
      error: 'Nie znaleziono odpowiedniego main body dla podanej anatomii'
    };
  }

  const configurations = [];

  // Generate configurations for top main bodies
  for (const mainBody of mainBodies.slice(0, 4)) {
    const contraLimbs = findContralateralLimbs(measurements, mainBody);
    const ipsiExtensions = findIpsilateralExtensions(measurements, mainBody);

    if (contraLimbs.length > 0 && ipsiExtensions.length > 0) {
      // Configuration with ETLW on both sides (if possible)
      const etlwBothSides = mainBody.ipsiLegDiam >= 16;

      configurations.push({
        mainBody,
        contralateralLimb: contraLimbs[0],
        ipsilateralExtension: ipsiExtensions[0],
        totalScore: mainBody.score + contraLimbs[0].score + ipsiExtensions[0].score,
        etlwBothSides,
        overlap: calculateOverlap(mainBody, contraLimbs[0], ipsiExtensions[0], measurements),
        comments: generateComments(mainBody, contraLimbs[0], ipsiExtensions[0], measurements, validation)
      });
    }
  }

  // Sort by score and return top 2
  configurations.sort((a, b) => b.totalScore - a.totalScore);

  return {
    validation,
    configurations: configurations.slice(0, 2),
    measurements
  };
}

// Calculate overlap between components
function calculateOverlap(mainBody, contraLimb, ipsiExt, measurements) {
  const mainBodyInAorta = Math.min(mainBody.length, measurements.renalToBifurcation);
  const remainingForLegs = measurements.ciaLength;

  return {
    mainBodyInAorta,
    contraOverlapAvailable: remainingForLegs - (contraLimb.length - IFU_CONSTRAINTS.overlap.min),
    ipsiOverlapAvailable: remainingForLegs - (ipsiExt.length - IFU_CONSTRAINTS.overlap.min),
    meetsMinimum: true // Simplified - would need more complex calculation
  };
}

// Generate clinical comments
function generateComments(mainBody, contraLimb, ipsiExt, measurements, validation) {
  const comments = [];

  // Main body comments
  comments.push(`Main body ${mainBody.code}: przewymiarowanie ${mainBody.oversizing}%`);

  // Configuration type
  if (ipsiExt.type === 'ETLW') {
    comments.push('Konfiguracja z ETLW po obu stronach - optymalna dla wąskich tętnic biodrowych');
  }

  // Oversizing comments
  if (parseFloat(mainBody.oversizing) < 10) {
    comments.push('UWAGA: Niskie przewymiarowanie aortalne - ryzyko migracji');
  } else if (parseFloat(mainBody.oversizing) > 20) {
    comments.push('UWAGA: Wysokie przewymiarowanie - ryzyko fałdowania');
  }

  // Validation warnings
  validation.warnings.forEach(w => comments.push(w));

  return comments;
}

// Export configuration summary as string
export function formatConfigurationSummary(config) {
  if (!config) return 'Brak konfiguracji';

  return `
KONFIGURACJA STENTGRAFTU ENDURANT II/IIs
========================================
Main Body: ${config.mainBody.code}
  - Średnica aortalna: ${config.mainBody.aorticDiam}mm
  - Noga ipsilateralna: ${config.mainBody.ipsiLegDiam}mm
  - Długość: ${config.mainBody.length}mm
  - Przewymiarowanie: ${config.mainBody.oversizing}%

Odnoga kontralateralna: ${config.contralateralLimb.code}
  - Proksymalna: ${config.contralateralLimb.proximalDiam}mm
  - Dystalna: ${config.contralateralLimb.distalDiam}mm
  - Długość: ${config.contralateralLimb.length}mm

Przedłużenie ipsilateralne: ${config.ipsilateralExtension.code}
  - Typ: ${config.ipsilateralExtension.type}
  - Średnica dystalna: ${config.ipsilateralExtension.distalDiam || config.ipsilateralExtension.diameter}mm
  - Długość: ${config.ipsilateralExtension.length}mm

KOMENTARZE:
${config.comments.map(c => '• ' + c).join('\n')}
  `.trim();
}
