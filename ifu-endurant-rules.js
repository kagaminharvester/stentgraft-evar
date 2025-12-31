/**
 * Endurant II/IIs IFU Rules - Extracted from Medtronic Aortic Product Catalogue
 * This file contains all hard rules for programmatic validation
 */

const IFU_RULES = {
  // Proximal Neck Requirements
  neck: {
    standard: {
      minLength: 10,        // mm - minimum neck length for standard EVAR
      maxAngle: 60,         // degrees - standard max angulation
      maxAngleIfLong: 75,   // degrees - if neck >=15mm
      longNeckThreshold: 15 // mm - neck considered "long"
    },
    withEndoAnchor: {
      minLength: 4,         // mm - with Heli-FX EndoAnchor
      maxAngle: 60          // degrees
    },
    diameter: {
      min: 19,              // mm
      max: 32               // mm
    },
    quality: {
      notes: [
        "Minimal/no circumferential thrombus",
        "Minimal/no calcification (especially if angulated)",
        "Non-conical (reverse taper) anatomy preferred"
      ]
    }
  },

  // Iliac Landing Zone Requirements
  iliac: {
    minSealLength: 15,      // mm - minimum distal seal zone
    diameter: {
      min: 8,               // mm
      max: 25               // mm
    }
  },

  // Access Vessel Requirements
  access: {
    mainBody: {
      min: 6                // mm - for main body delivery
    },
    limb: {
      min: 4.67             // mm - for limb delivery (14Fr)
    },
    byFrenchSize: {
      14: 4.67,             // mm minimum vessel for 14Fr
      16: 5.33,             // mm minimum vessel for 16Fr
      18: 6.0,              // mm minimum vessel for 18Fr
      20: 6.67              // mm minimum vessel for 20Fr
    }
  },

  // Oversizing Recommendations
  oversizing: {
    aortic: {
      min: 0.10,            // 10%
      max: 0.20,            // 20% recommended max
      safeMax: 0.25,        // 25% safe range (associated with decreased endoleak)
      dangerMax: 0.30,      // >30% risk of infolding, collapse
      optimal: 0.15         // 15% optimal
    },
    iliac: {
      min: 0.10,            // 10%
      max: 0.25,            // 25%
      optimal: 0.15         // 15%
    }
  },

  // Component Overlap Requirements
  overlap: {
    minimum: 30,            // mm - minimum overlap between components
    stentOverlap: {
      min: 3,               // stent rings
      max: 5                // stent rings (select limbs)
    },
    notes: [
      "Minimum 3-5 stent overlap between components",
      "30mm overlap assumes proper marker alignment"
    ]
  },

  // Length Calculations
  lengths: {
    // When using 124mm bifurcated, subtract 10mm from contralateral covered length
    bifur124Adjustment: -10,

    // Contralateral length = bifurcated internal + limb length - overlap
    // With minimum 30mm overlap per IFU
    calculateContralateral: (bifurInternalLength, limbLength) => {
      return bifurInternalLength + limbLength - 30;
    }
  }
};

// Sizing Guidelines based on inner wall vessel measurements
const SIZING_GUIDELINES = {
  // Bifurcations, AUI and Aortic Extensions
  aortic: {
    standardEVAR: [
      { vesselMin: 19, vesselMax: 20, graftDiameter: 23 },
      { vesselMin: 21, vesselMax: 22, graftDiameter: 25 },
      { vesselMin: 23, vesselMax: 25, graftDiameter: 28 },
      { vesselMin: 26, vesselMax: 28, graftDiameter: 32 },
      { vesselMin: 29, vesselMax: 32, graftDiameter: 36 }
    ],
    // ChEVAR uses smaller oversizing (not approved globally)
    chEVAR: [
      { vesselMin: 19, vesselMax: 20, graftDiameter: 23 },
      { vesselMin: 21, vesselMax: 23, graftDiameter: 25 },
      { vesselMin: 24, vesselMax: 26, graftDiameter: 28 },
      { vesselMin: 27, vesselMax: 30, graftDiameter: 32 }
    ]
  },

  // Iliac Limbs
  limbs: [
    { vesselMin: 8, vesselMax: 9, graftDiameter: 10 },
    { vesselMin: 10, vesselMax: 11, graftDiameter: 13 },
    { vesselMin: 12, vesselMax: 14, graftDiameter: 16 },
    { vesselMin: 15, vesselMax: 18, graftDiameter: 20 },
    { vesselMin: 19, vesselMax: 22, graftDiameter: 24 },
    { vesselMin: 23, vesselMax: 25, graftDiameter: 28 }
  ],

  // Iliac Extensions (same as limbs)
  iliacExtensions: [
    { vesselMin: 8, vesselMax: 9, graftDiameter: 10 },
    { vesselMin: 10, vesselMax: 11, graftDiameter: 13 },
    { vesselMin: 15, vesselMax: 18, graftDiameter: 20 },
    { vesselMin: 19, vesselMax: 22, graftDiameter: 24 },
    { vesselMin: 23, vesselMax: 25, graftDiameter: 28 }
  ]
};

// Validation Functions
const IFU_VALIDATION = {
  /**
   * Validate neck anatomy against IFU
   */
  validateNeck: (neckDiameter, neckLength, neckAngle, useEndoAnchor = false) => {
    const results = {
      valid: true,
      warnings: [],
      errors: []
    };

    // Check diameter
    if (neckDiameter < IFU_RULES.neck.diameter.min) {
      results.errors.push(`Neck diameter ${neckDiameter}mm is below minimum ${IFU_RULES.neck.diameter.min}mm`);
      results.valid = false;
    }
    if (neckDiameter > IFU_RULES.neck.diameter.max) {
      results.errors.push(`Neck diameter ${neckDiameter}mm exceeds maximum ${IFU_RULES.neck.diameter.max}mm`);
      results.valid = false;
    }

    // Check length
    const minLength = useEndoAnchor ? IFU_RULES.neck.withEndoAnchor.minLength : IFU_RULES.neck.standard.minLength;
    if (neckLength < minLength) {
      results.errors.push(`Neck length ${neckLength}mm is below minimum ${minLength}mm${useEndoAnchor ? ' (with EndoAnchor)' : ''}`);
      results.valid = false;
    }
    if (neckLength < 10 && !useEndoAnchor) {
      results.warnings.push(`Short neck (${neckLength}mm) - consider EndoAnchor if 4-10mm`);
    }

    // Check angulation
    const maxAngle = neckLength >= IFU_RULES.neck.standard.longNeckThreshold
      ? IFU_RULES.neck.standard.maxAngleIfLong
      : IFU_RULES.neck.standard.maxAngle;

    if (neckAngle > maxAngle) {
      results.errors.push(`Neck angle ${neckAngle}° exceeds maximum ${maxAngle}°`);
      results.valid = false;
    }
    if (neckAngle > 60 && neckAngle <= 75 && neckLength >= 15) {
      results.warnings.push(`Angulation ${neckAngle}° allowed only because neck ≥15mm`);
    }

    return results;
  },

  /**
   * Validate iliac anatomy
   */
  validateIliac: (diameter, sealLength) => {
    const results = {
      valid: true,
      warnings: [],
      errors: []
    };

    if (diameter < IFU_RULES.iliac.diameter.min) {
      results.errors.push(`Iliac diameter ${diameter}mm below minimum ${IFU_RULES.iliac.diameter.min}mm`);
      results.valid = false;
    }
    if (diameter > IFU_RULES.iliac.diameter.max) {
      results.errors.push(`Iliac diameter ${diameter}mm exceeds maximum ${IFU_RULES.iliac.diameter.max}mm`);
      results.valid = false;
    }
    if (sealLength < IFU_RULES.iliac.minSealLength) {
      results.errors.push(`Iliac seal zone ${sealLength}mm below minimum ${IFU_RULES.iliac.minSealLength}mm`);
      results.valid = false;
    }

    return results;
  },

  /**
   * Validate access vessel
   */
  validateAccess: (accessDiameter, deviceFrench) => {
    const results = {
      valid: true,
      warnings: [],
      errors: []
    };

    const minRequired = IFU_RULES.access.byFrenchSize[deviceFrench] || IFU_RULES.access.mainBody.min;

    if (accessDiameter < minRequired) {
      results.errors.push(`Access vessel ${accessDiameter}mm too small for ${deviceFrench}Fr device (needs ≥${minRequired}mm)`);
      results.valid = false;
    }

    return results;
  },

  /**
   * Calculate and validate oversizing
   */
  calculateOversizing: (vesselDiameter, graftDiameter, location = 'aortic') => {
    const oversizing = (graftDiameter - vesselDiameter) / vesselDiameter;
    const oversizingPercent = (oversizing * 100).toFixed(1);
    const rules = IFU_RULES.oversizing[location];

    const results = {
      oversizing: oversizing,
      oversizingPercent: oversizingPercent,
      valid: true,
      status: 'optimal',
      message: ''
    };

    if (oversizing < rules.min) {
      results.status = 'undersized';
      results.message = `Undersized: ${oversizingPercent}% (minimum ${rules.min * 100}%)`;
      results.valid = false;
    } else if (oversizing > (rules.dangerMax || rules.max)) {
      results.status = 'dangerous';
      results.message = `DANGER: ${oversizingPercent}% exceeds safe limit (>${(rules.dangerMax || rules.max) * 100}%)`;
      results.valid = false;
    } else if (oversizing > rules.max) {
      results.status = 'high';
      results.message = `High oversizing: ${oversizingPercent}% (>${rules.max * 100}%, but ≤${rules.safeMax * 100}% safe range)`;
      results.valid = true;
    } else if (oversizing >= rules.optimal - 0.025 && oversizing <= rules.optimal + 0.025) {
      results.status = 'optimal';
      results.message = `Optimal: ${oversizingPercent}%`;
    } else {
      results.status = 'acceptable';
      results.message = `Acceptable: ${oversizingPercent}%`;
    }

    return results;
  },

  /**
   * Get recommended graft size for vessel
   */
  getRecommendedGraft: (vesselDiameter, type = 'aortic') => {
    const guidelines = type === 'aortic'
      ? SIZING_GUIDELINES.aortic.standardEVAR
      : SIZING_GUIDELINES.limbs;

    for (const range of guidelines) {
      if (vesselDiameter >= range.vesselMin && vesselDiameter <= range.vesselMax) {
        return range.graftDiameter;
      }
    }
    return null;
  }
};

export {
  IFU_RULES,
  SIZING_GUIDELINES,
  IFU_VALIDATION
};
