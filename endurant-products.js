/**
 * Medtronic Endurant II/IIs Complete Product Database
 * Extracted from Aortic Product Catalogue 2024
 * All dimensions in mm, French sizes for delivery systems
 */

const ENDURANT_PRODUCTS = {
  // ============================================
  // ENDURANT II BIFURCATED STENT GRAFTS (ETBF)
  // ============================================
  bifurcations: {
    ETBF: [
      // 23mm Aortic diameter
      { code: "ETBF2313C124E", aortic: 23, ipsiLeg: 13, coveredLength: 124, gate: 12, frenchSize: 18, dimensions: { A: 23, B: 13, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF2313C145E", aortic: 23, ipsiLeg: 13, coveredLength: 145, gate: 12, frenchSize: 18, dimensions: { A: 23, B: 13, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF2313C166E", aortic: 23, ipsiLeg: 13, coveredLength: 166, gate: 12, frenchSize: 18, dimensions: { A: 23, B: 13, C: 80, D: 114, E: 166, F: 86 } },
      { code: "ETBF2316C124E", aortic: 23, ipsiLeg: 16, coveredLength: 124, gate: 12, frenchSize: 18, dimensions: { A: 23, B: 16, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF2316C145E", aortic: 23, ipsiLeg: 16, coveredLength: 145, gate: 12, frenchSize: 18, dimensions: { A: 23, B: 16, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF2316C166E", aortic: 23, ipsiLeg: 16, coveredLength: 166, gate: 12, frenchSize: 18, dimensions: { A: 23, B: 16, C: 80, D: 114, E: 166, F: 86 } },

      // 25mm Aortic diameter
      { code: "ETBF2513C124E", aortic: 25, ipsiLeg: 13, coveredLength: 124, gate: 14, frenchSize: 18, dimensions: { A: 25, B: 13, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF2513C145E", aortic: 25, ipsiLeg: 13, coveredLength: 145, gate: 14, frenchSize: 18, dimensions: { A: 25, B: 13, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF2513C166E", aortic: 25, ipsiLeg: 13, coveredLength: 166, gate: 14, frenchSize: 18, dimensions: { A: 25, B: 13, C: 80, D: 114, E: 166, F: 86 } },
      { code: "ETBF2516C124E", aortic: 25, ipsiLeg: 16, coveredLength: 124, gate: 14, frenchSize: 18, dimensions: { A: 25, B: 16, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF2516C145E", aortic: 25, ipsiLeg: 16, coveredLength: 145, gate: 14, frenchSize: 18, dimensions: { A: 25, B: 16, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF2516C166E", aortic: 25, ipsiLeg: 16, coveredLength: 166, gate: 14, frenchSize: 18, dimensions: { A: 25, B: 16, C: 80, D: 114, E: 166, F: 86 } },

      // 28mm Aortic diameter
      { code: "ETBF2814C124E", aortic: 28, ipsiLeg: 14, coveredLength: 124, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 14, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF2814C145E", aortic: 28, ipsiLeg: 14, coveredLength: 145, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 14, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF2814C166E", aortic: 28, ipsiLeg: 14, coveredLength: 166, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 14, C: 80, D: 114, E: 166, F: 86 } },
      { code: "ETBF2816C124E", aortic: 28, ipsiLeg: 16, coveredLength: 124, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 16, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF2816C145E", aortic: 28, ipsiLeg: 16, coveredLength: 145, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 16, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF2816C166E", aortic: 28, ipsiLeg: 16, coveredLength: 166, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 16, C: 80, D: 114, E: 166, F: 86 } },
      { code: "ETBF2820C124E", aortic: 28, ipsiLeg: 20, coveredLength: 124, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 20, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF2820C145E", aortic: 28, ipsiLeg: 20, coveredLength: 145, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 20, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF2820C166E", aortic: 28, ipsiLeg: 20, coveredLength: 166, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 20, C: 80, D: 114, E: 166, F: 86 } },

      // 32mm Aortic diameter
      { code: "ETBF3216C124E", aortic: 32, ipsiLeg: 16, coveredLength: 124, gate: 14, frenchSize: 20, dimensions: { A: 32, B: 16, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF3216C145E", aortic: 32, ipsiLeg: 16, coveredLength: 145, gate: 14, frenchSize: 20, dimensions: { A: 32, B: 16, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF3216C166E", aortic: 32, ipsiLeg: 16, coveredLength: 166, gate: 14, frenchSize: 20, dimensions: { A: 32, B: 16, C: 80, D: 114, E: 166, F: 86 } },
      { code: "ETBF3220C124E", aortic: 32, ipsiLeg: 20, coveredLength: 124, gate: 14, frenchSize: 20, dimensions: { A: 32, B: 20, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF3220C145E", aortic: 32, ipsiLeg: 20, coveredLength: 145, gate: 14, frenchSize: 20, dimensions: { A: 32, B: 20, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF3220C166E", aortic: 32, ipsiLeg: 20, coveredLength: 166, gate: 14, frenchSize: 20, dimensions: { A: 32, B: 20, C: 80, D: 114, E: 166, F: 86 } },

      // 36mm Aortic diameter
      { code: "ETBF3616C124E", aortic: 36, ipsiLeg: 16, coveredLength: 124, gate: 14, frenchSize: 20, dimensions: { A: 36, B: 16, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF3616C145E", aortic: 36, ipsiLeg: 16, coveredLength: 145, gate: 14, frenchSize: 20, dimensions: { A: 36, B: 16, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF3616C166E", aortic: 36, ipsiLeg: 16, coveredLength: 166, gate: 14, frenchSize: 20, dimensions: { A: 36, B: 16, C: 80, D: 114, E: 166, F: 86 } },
      { code: "ETBF3620C124E", aortic: 36, ipsiLeg: 20, coveredLength: 124, gate: 14, frenchSize: 20, dimensions: { A: 36, B: 20, C: 80, D: 72, E: 124, F: 44 } },
      { code: "ETBF3620C145E", aortic: 36, ipsiLeg: 20, coveredLength: 145, gate: 14, frenchSize: 20, dimensions: { A: 36, B: 20, C: 80, D: 93, E: 145, F: 65 } },
      { code: "ETBF3620C166E", aortic: 36, ipsiLeg: 20, coveredLength: 166, gate: 14, frenchSize: 20, dimensions: { A: 36, B: 20, C: 80, D: 114, E: 166, F: 86 } }
    ],

    // ENDURANT IIs (Short body) - ESBF
    ESBF: [
      // 23mm Aortic diameter - 103mm covered length
      { code: "ESBF2313C103E", aortic: 23, ipsiLeg: 13, coveredLength: 103, gate: 12, frenchSize: 18, dimensions: { A: 23, B: 13, C: 80, D: 51, E: 103, F: 23 } },
      { code: "ESBF2316C103E", aortic: 23, ipsiLeg: 16, coveredLength: 103, gate: 12, frenchSize: 18, dimensions: { A: 23, B: 16, C: 80, D: 51, E: 103, F: 23 } },

      // 25mm Aortic diameter
      { code: "ESBF2513C103E", aortic: 25, ipsiLeg: 13, coveredLength: 103, gate: 14, frenchSize: 18, dimensions: { A: 25, B: 13, C: 80, D: 51, E: 103, F: 23 } },
      { code: "ESBF2516C103E", aortic: 25, ipsiLeg: 16, coveredLength: 103, gate: 14, frenchSize: 18, dimensions: { A: 25, B: 16, C: 80, D: 51, E: 103, F: 23 } },

      // 28mm Aortic diameter
      { code: "ESBF2814C103E", aortic: 28, ipsiLeg: 14, coveredLength: 103, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 14, C: 80, D: 51, E: 103, F: 23 } },
      { code: "ESBF2816C103E", aortic: 28, ipsiLeg: 16, coveredLength: 103, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 16, C: 80, D: 51, E: 103, F: 23 } },
      { code: "ESBF2820C103E", aortic: 28, ipsiLeg: 20, coveredLength: 103, gate: 14, frenchSize: 20, dimensions: { A: 28, B: 20, C: 80, D: 51, E: 103, F: 23 } },

      // 32mm Aortic diameter
      { code: "ESBF3216C103E", aortic: 32, ipsiLeg: 16, coveredLength: 103, gate: 14, frenchSize: 20, dimensions: { A: 32, B: 16, C: 80, D: 51, E: 103, F: 23 } },
      { code: "ESBF3220C103E", aortic: 32, ipsiLeg: 20, coveredLength: 103, gate: 14, frenchSize: 20, dimensions: { A: 32, B: 20, C: 80, D: 51, E: 103, F: 23 } },

      // 36mm Aortic diameter
      { code: "ESBF3616C103E", aortic: 36, ipsiLeg: 16, coveredLength: 103, gate: 14, frenchSize: 20, dimensions: { A: 36, B: 16, C: 80, D: 51, E: 103, F: 23 } },
      { code: "ESBF3620C103E", aortic: 36, ipsiLeg: 20, coveredLength: 103, gate: 14, frenchSize: 20, dimensions: { A: 36, B: 20, C: 80, D: 51, E: 103, F: 23 } }
    ]
  },

  // ============================================
  // CONTRALATERAL LIMBS (ETLW)
  // ============================================
  limbs: {
    // Tapered limbs (16mm proximal to smaller distal)
    tapered: [
      // 16-10mm
      { code: "ETLW1610C082E", proximal: 16, distal: 10, coveredLength: 82, frenchSize: 14, dimensions: { A: 16, B: 10, C: 82 } },
      { code: "ETLW1610C095E", proximal: 16, distal: 10, coveredLength: 95, frenchSize: 14, dimensions: { A: 16, B: 10, C: 95 } },
      { code: "ETLW1610C120E", proximal: 16, distal: 10, coveredLength: 120, frenchSize: 14, dimensions: { A: 16, B: 10, C: 120 } },
      { code: "ETLW1610C156E", proximal: 16, distal: 10, coveredLength: 156, frenchSize: 14, dimensions: { A: 16, B: 10, C: 156 } },
      { code: "ETLW1610C199E", proximal: 16, distal: 10, coveredLength: 199, frenchSize: 14, dimensions: { A: 16, B: 10, C: 199 } },

      // 16-13mm
      { code: "ETLW1613C082E", proximal: 16, distal: 13, coveredLength: 82, frenchSize: 14, dimensions: { A: 16, B: 13, C: 82 } },
      { code: "ETLW1613C095E", proximal: 16, distal: 13, coveredLength: 95, frenchSize: 14, dimensions: { A: 16, B: 13, C: 95 } },
      { code: "ETLW1613C120E", proximal: 16, distal: 13, coveredLength: 120, frenchSize: 14, dimensions: { A: 16, B: 13, C: 120 } },
      { code: "ETLW1613C156E", proximal: 16, distal: 13, coveredLength: 156, frenchSize: 14, dimensions: { A: 16, B: 13, C: 156 } },
      { code: "ETLW1613C199E", proximal: 16, distal: 13, coveredLength: 199, frenchSize: 14, dimensions: { A: 16, B: 13, C: 199 } }
    ],

    // Straight limbs (same proximal and distal)
    straight: [
      // 16-16mm
      { code: "ETLW1616C082E", proximal: 16, distal: 16, coveredLength: 82, frenchSize: 16, dimensions: { A: 16, B: 16, C: 82 } },
      { code: "ETLW1616C095E", proximal: 16, distal: 16, coveredLength: 95, frenchSize: 16, dimensions: { A: 16, B: 16, C: 95 } },
      { code: "ETLW1616C120E", proximal: 16, distal: 16, coveredLength: 120, frenchSize: 16, dimensions: { A: 16, B: 16, C: 120 } },
      { code: "ETLW1616C156E", proximal: 16, distal: 16, coveredLength: 156, frenchSize: 16, dimensions: { A: 16, B: 16, C: 156 } },
      { code: "ETLW1616C199E", proximal: 16, distal: 16, coveredLength: 199, frenchSize: 16, dimensions: { A: 16, B: 16, C: 199 } }
    ],

    // Flared limbs (16mm proximal to larger distal)
    flared: [
      // 16-20mm
      { code: "ETLW1620C082E", proximal: 16, distal: 20, coveredLength: 82, frenchSize: 16, dimensions: { A: 16, B: 20, C: 82 } },
      { code: "ETLW1620C095E", proximal: 16, distal: 20, coveredLength: 95, frenchSize: 16, dimensions: { A: 16, B: 20, C: 95 } },
      { code: "ETLW1620C120E", proximal: 16, distal: 20, coveredLength: 120, frenchSize: 16, dimensions: { A: 16, B: 20, C: 120 } },
      { code: "ETLW1620C156E", proximal: 16, distal: 20, coveredLength: 156, frenchSize: 16, dimensions: { A: 16, B: 20, C: 156 } },
      { code: "ETLW1620C199E", proximal: 16, distal: 20, coveredLength: 199, frenchSize: 16, dimensions: { A: 16, B: 20, C: 199 } },

      // 16-24mm
      { code: "ETLW1624C082E", proximal: 16, distal: 24, coveredLength: 82, frenchSize: 16, dimensions: { A: 16, B: 24, C: 82 } },
      { code: "ETLW1624C095E", proximal: 16, distal: 24, coveredLength: 95, frenchSize: 16, dimensions: { A: 16, B: 24, C: 95 } },
      { code: "ETLW1624C120E", proximal: 16, distal: 24, coveredLength: 120, frenchSize: 16, dimensions: { A: 16, B: 24, C: 120 } },
      { code: "ETLW1624C156E", proximal: 16, distal: 24, coveredLength: 156, frenchSize: 16, dimensions: { A: 16, B: 24, C: 156 } },
      { code: "ETLW1624C199E", proximal: 16, distal: 24, coveredLength: 199, frenchSize: 16, dimensions: { A: 16, B: 24, C: 199 } },

      // 16-28mm
      { code: "ETLW1628C082E", proximal: 16, distal: 28, coveredLength: 82, frenchSize: 16, dimensions: { A: 16, B: 28, C: 82 } },
      { code: "ETLW1628C095E", proximal: 16, distal: 28, coveredLength: 95, frenchSize: 16, dimensions: { A: 16, B: 28, C: 95 } },
      { code: "ETLW1628C120E", proximal: 16, distal: 28, coveredLength: 120, frenchSize: 16, dimensions: { A: 16, B: 28, C: 120 } },
      { code: "ETLW1628C156E", proximal: 16, distal: 28, coveredLength: 156, frenchSize: 16, dimensions: { A: 16, B: 28, C: 156 } },
      { code: "ETLW1628C199E", proximal: 16, distal: 28, coveredLength: 199, frenchSize: 16, dimensions: { A: 16, B: 28, C: 199 } }
    ]
  },

  // ============================================
  // ILIAC EXTENSIONS (ETEW)
  // ============================================
  iliacExtensions: [
    // Straight extensions (same proximal and distal diameter)
    { code: "ETEW1010C082E", proximal: 10, distal: 10, coveredLength: 82, frenchSize: 14, dimensions: { A: 10, B: 10, C: 82 } },
    { code: "ETEW1313C082E", proximal: 13, distal: 13, coveredLength: 82, frenchSize: 14, dimensions: { A: 13, B: 13, C: 82 } },
    { code: "ETEW1616C082E", proximal: 16, distal: 16, coveredLength: 82, frenchSize: 16, dimensions: { A: 16, B: 16, C: 82 } },
    { code: "ETEW2020C082E", proximal: 20, distal: 20, coveredLength: 82, frenchSize: 16, dimensions: { A: 20, B: 20, C: 82 } },
    { code: "ETEW2424C082E", proximal: 24, distal: 24, coveredLength: 82, frenchSize: 16, dimensions: { A: 24, B: 24, C: 82 } },
    { code: "ETEW2828C082E", proximal: 28, distal: 28, coveredLength: 82, frenchSize: 16, dimensions: { A: 28, B: 28, C: 82 } }
  ],

  // ============================================
  // AORTO-UNI-ILIAC (AUI) - ETUF
  // ============================================
  aui: [
    { code: "ETUF2313C105E", aortic: 23, iliac: 13, coveredLength: 105, frenchSize: 18, dimensions: { A: 23, B: 13, C: 105 } },
    { code: "ETUF2513C105E", aortic: 25, iliac: 13, coveredLength: 105, frenchSize: 18, dimensions: { A: 25, B: 13, C: 105 } },
    { code: "ETUF2814C105E", aortic: 28, iliac: 14, coveredLength: 105, frenchSize: 20, dimensions: { A: 28, B: 14, C: 105 } },
    { code: "ETUF3216C105E", aortic: 32, iliac: 16, coveredLength: 105, frenchSize: 20, dimensions: { A: 32, B: 16, C: 105 } },
    { code: "ETUF3616C105E", aortic: 36, iliac: 16, coveredLength: 105, frenchSize: 20, dimensions: { A: 36, B: 16, C: 105 } }
  ],

  // ============================================
  // AORTIC EXTENSIONS (ETCF/ETTF)
  // ============================================
  aorticExtensions: {
    // Tapered extensions (ETCF)
    tapered: [
      { code: "ETCF2823C049E", proximal: 28, distal: 23, coveredLength: 49, frenchSize: 20, dimensions: { A: 28, B: 23, C: 49 } },
      { code: "ETCF3225C049E", proximal: 32, distal: 25, coveredLength: 49, frenchSize: 20, dimensions: { A: 32, B: 25, C: 49 } },
      { code: "ETCF3628C049E", proximal: 36, distal: 28, coveredLength: 49, frenchSize: 20, dimensions: { A: 36, B: 28, C: 49 } }
    ],
    // Straight extensions (ETTF)
    straight: [
      { code: "ETTF2323C049E", proximal: 23, distal: 23, coveredLength: 49, frenchSize: 18, dimensions: { A: 23, B: 23, C: 49 } },
      { code: "ETTF2525C049E", proximal: 25, distal: 25, coveredLength: 49, frenchSize: 18, dimensions: { A: 25, B: 25, C: 49 } },
      { code: "ETTF2828C049E", proximal: 28, distal: 28, coveredLength: 49, frenchSize: 20, dimensions: { A: 28, B: 28, C: 49 } },
      { code: "ETTF3232C049E", proximal: 32, distal: 32, coveredLength: 49, frenchSize: 20, dimensions: { A: 32, B: 32, C: 49 } },
      { code: "ETTF3636C049E", proximal: 36, distal: 36, coveredLength: 49, frenchSize: 20, dimensions: { A: 36, B: 36, C: 49 } }
    ]
  }
};

// ============================================
// DIMENSION LEGEND
// ============================================
const DIMENSION_LEGEND = {
  bifurcation: {
    A: "Proximal aortic graft diameter",
    B: "Ipsilateral leg graft diameter",
    C: "Ipsilateral outer covered length",
    D: "Contralateral inner covered length",
    E: "Total covered body length",
    F: "Contralateral covered length from gate"
  },
  limb: {
    A: "Proximal graft diameter (gate connection)",
    B: "Distal graft diameter (iliac landing)",
    C: "Covered length"
  },
  extension: {
    A: "Proximal graft diameter",
    B: "Distal graft diameter",
    C: "Covered length"
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const PRODUCT_HELPERS = {
  /**
   * Find suitable bifurcation for given anatomy
   */
  findBifurcation: (aorticDiameter, ipsiLegDiameter, requiredLength, preferShort = false) => {
    const products = preferShort ? ENDURANT_PRODUCTS.bifurcations.ESBF : ENDURANT_PRODUCTS.bifurcations.ETBF;

    return products.filter(p =>
      p.aortic === aorticDiameter &&
      p.ipsiLeg === ipsiLegDiameter &&
      p.coveredLength >= requiredLength
    ).sort((a, b) => a.coveredLength - b.coveredLength);
  },

  /**
   * Find suitable contralateral limb
   */
  findLimb: (distalDiameter, requiredLength) => {
    const allLimbs = [
      ...ENDURANT_PRODUCTS.limbs.tapered,
      ...ENDURANT_PRODUCTS.limbs.straight,
      ...ENDURANT_PRODUCTS.limbs.flared
    ];

    return allLimbs.filter(l =>
      l.distal === distalDiameter &&
      l.coveredLength >= requiredLength
    ).sort((a, b) => a.coveredLength - b.coveredLength);
  },

  /**
   * Find iliac extension
   */
  findExtension: (diameter) => {
    return ENDURANT_PRODUCTS.iliacExtensions.filter(e => e.proximal === diameter);
  },

  /**
   * Get all available aortic diameters
   */
  getAorticDiameters: () => [23, 25, 28, 32, 36],

  /**
   * Get available ipsilateral leg diameters for aortic size
   */
  getIpsiLegOptions: (aorticDiameter) => {
    const options = new Set();
    [...ENDURANT_PRODUCTS.bifurcations.ETBF, ...ENDURANT_PRODUCTS.bifurcations.ESBF]
      .filter(p => p.aortic === aorticDiameter)
      .forEach(p => options.add(p.ipsiLeg));
    return Array.from(options).sort((a, b) => a - b);
  },

  /**
   * Get available limb distal diameters
   */
  getLimbDistalOptions: () => [10, 13, 16, 20, 24, 28],

  /**
   * Calculate total contralateral length coverage
   * @param bifurcation - selected bifurcation product
   * @param limb - selected contralateral limb
   * @param overlap - overlap in mm (default 30)
   */
  calculateContralateralCoverage: (bifurcation, limb, overlap = 30) => {
    // Contralateral inner covered + limb length - overlap
    return bifurcation.dimensions.D + limb.coveredLength - overlap;
  },

  /**
   * Get French size to mm conversion
   */
  frenchToMm: (french) => french / 3,

  /**
   * Check if access vessel is adequate for device
   */
  checkAccessVessel: (vesselDiameter, frenchSize) => {
    const minRequired = frenchSize / 3;
    return {
      adequate: vesselDiameter >= minRequired,
      minRequired: minRequired,
      margin: vesselDiameter - minRequired
    };
  }
};

export {
  ENDURANT_PRODUCTS,
  DIMENSION_LEGEND,
  PRODUCT_HELPERS
};
