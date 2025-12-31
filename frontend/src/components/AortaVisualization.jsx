// SVG Visualization of Aortoiliac Anatomy with Stentgraft Placement
import React, { useMemo } from 'react';

const COLORS = {
  vessel: '#ffcccb',
  vesselStroke: '#8b0000',
  stentgraft: '#4a90d9',
  stentgraftStroke: '#1a5490',
  mainBody: '#4a90d9',
  contraLimb: '#6ab04c',
  ipsiExt: '#f39c12',
  overlap: 'rgba(255, 215, 0, 0.3)',
  measurement: '#333',
  highlight: '#ff6b6b',
  text: '#2c3e50'
};

// Scale factor for dimensions (mm to pixels)
const SCALE = 2;

export function AortaVisualization({ measurements, configuration, highlightSegment }) {
  const svgWidth = 400;
  const svgHeight = 600;
  const centerX = svgWidth / 2;

  // Calculate vessel positions based on measurements
  const anatomy = useMemo(() => {
    if (!measurements) return null;

    const neckDiam = measurements.neckDiameter * SCALE;
    const rightCIA = measurements.rightCIA * SCALE;
    const leftCIA = measurements.leftCIA * SCALE;
    const neckLength = measurements.neckLength * SCALE;
    const renalToBif = measurements.renalToBifurcation * SCALE;
    const ciaLength = measurements.ciaLength * SCALE;

    // Aorta starts at top
    const aortaTop = 50;
    const bifurcationY = aortaTop + renalToBif;
    const iliacEndY = bifurcationY + ciaLength;

    return {
      aorta: {
        top: aortaTop,
        neckEnd: aortaTop + neckLength,
        aneurysmEnd: bifurcationY - 20,
        bifurcation: bifurcationY,
        width: neckDiam,
        aneurysmWidth: neckDiam * 2.5 // Aneurysm expansion
      },
      rightIliac: {
        startX: centerX + 30,
        endX: centerX + 60,
        startY: bifurcationY,
        endY: iliacEndY,
        width: rightCIA
      },
      leftIliac: {
        startX: centerX - 30,
        endX: centerX - 60,
        startY: bifurcationY,
        endY: iliacEndY,
        width: leftCIA
      }
    };
  }, [measurements]);

  // Calculate stentgraft positions
  const stentgraft = useMemo(() => {
    if (!configuration || !anatomy) return null;

    const { mainBody, contralateralLimb, ipsilateralExtension } = configuration;
    const mbLength = mainBody.length * SCALE;
    const contraLength = contralateralLimb.length * SCALE;
    const ipsiLength = ipsilateralExtension.length * SCALE;

    const mbTop = anatomy.aorta.top + 10; // Starts in neck
    const mbBottom = mbTop + mbLength;

    // Determine which side is ipsilateral based on intro side
    const isRightIntro = measurements.introSide === 'right';

    return {
      mainBody: {
        top: mbTop,
        bottom: mbBottom,
        aorticWidth: mainBody.aorticDiam * SCALE,
        ipsiLegWidth: mainBody.ipsiLegDiam * SCALE,
        gateWidth: mainBody.gateSize * SCALE
      },
      contraLimb: {
        top: mbBottom - 35 * SCALE, // Overlap
        bottom: mbBottom - 35 * SCALE + contraLength,
        proxWidth: contralateralLimb.proximalDiam * SCALE,
        distWidth: contralateralLimb.distalDiam * SCALE,
        side: isRightIntro ? 'left' : 'right'
      },
      ipsiExt: {
        top: mbBottom - 35 * SCALE,
        bottom: mbBottom - 35 * SCALE + ipsiLength,
        width: (ipsilateralExtension.distalDiam || ipsilateralExtension.diameter) * SCALE,
        side: isRightIntro ? 'right' : 'left'
      }
    };
  }, [configuration, anatomy, measurements]);

  if (!anatomy) {
    return (
      <div className="visualization-placeholder">
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <text x={centerX} y={svgHeight / 2} textAnchor="middle" fill={COLORS.text}>
            Wprowadź pomiary anatomiczne
          </text>
        </svg>
      </div>
    );
  }

  const isHighlighted = (segment) => highlightSegment === segment;

  return (
    <div className="aorta-visualization">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ background: '#f8f9fa', borderRadius: '8px' }}
      >
        {/* Definitions */}
        <defs>
          <linearGradient id="vesselGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.vessel} />
            <stop offset="50%" stopColor="#ffe4e4" />
            <stop offset="100%" stopColor={COLORS.vessel} />
          </linearGradient>
          <linearGradient id="stentgraftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.mainBody} stopOpacity="0.9" />
            <stop offset="50%" stopColor="#6aa8e8" stopOpacity="0.9" />
            <stop offset="100%" stopColor={COLORS.mainBody} stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Title */}
        <text x={centerX} y={25} textAnchor="middle" fontSize="14" fontWeight="bold" fill={COLORS.text}>
          Anatomia Aortobiodowa
        </text>

        {/* Renal arteries marker */}
        <line x1={centerX - 60} y1={anatomy.aorta.top} x2={centerX - 40} y2={anatomy.aorta.top}
          stroke={COLORS.vesselStroke} strokeWidth="3" />
        <line x1={centerX + 40} y1={anatomy.aorta.top} x2={centerX + 60} y2={anatomy.aorta.top}
          stroke={COLORS.vesselStroke} strokeWidth="3" />
        <text x={centerX - 80} y={anatomy.aorta.top + 4} fontSize="10" fill={COLORS.text}>
          Tt. nerkowe
        </text>

        {/* Aorta - Neck */}
        <rect
          x={centerX - anatomy.aorta.width / 2}
          y={anatomy.aorta.top}
          width={anatomy.aorta.width}
          height={anatomy.aorta.neckEnd - anatomy.aorta.top}
          fill="url(#vesselGradient)"
          stroke={isHighlighted('neck') ? COLORS.highlight : COLORS.vesselStroke}
          strokeWidth={isHighlighted('neck') ? 3 : 1}
          filter={isHighlighted('neck') ? 'url(#glow)' : ''}
        />

        {/* Aorta - Aneurysm sac */}
        <ellipse
          cx={centerX}
          cy={(anatomy.aorta.neckEnd + anatomy.aorta.bifurcation) / 2}
          rx={anatomy.aorta.aneurysmWidth / 2}
          ry={(anatomy.aorta.bifurcation - anatomy.aorta.neckEnd) / 2}
          fill="url(#vesselGradient)"
          stroke={COLORS.vesselStroke}
          strokeWidth="1"
          strokeDasharray="5,3"
        />
        <text x={centerX + anatomy.aorta.aneurysmWidth / 2 + 10}
          y={(anatomy.aorta.neckEnd + anatomy.aorta.bifurcation) / 2}
          fontSize="10" fill={COLORS.text}>
          Worek tętniaka
        </text>

        {/* Right Iliac */}
        <path
          d={`M ${centerX + 10} ${anatomy.rightIliac.startY}
              Q ${anatomy.rightIliac.startX} ${anatomy.rightIliac.startY + 30}
                ${anatomy.rightIliac.endX} ${anatomy.rightIliac.endY}
              L ${anatomy.rightIliac.endX + anatomy.rightIliac.width} ${anatomy.rightIliac.endY}
              Q ${anatomy.rightIliac.startX + anatomy.rightIliac.width} ${anatomy.rightIliac.startY + 30}
                ${centerX + 10 + anatomy.rightIliac.width / 2} ${anatomy.rightIliac.startY}
              Z`}
          fill="url(#vesselGradient)"
          stroke={isHighlighted('rightCIA') ? COLORS.highlight : COLORS.vesselStroke}
          strokeWidth={isHighlighted('rightCIA') ? 3 : 1}
        />

        {/* Left Iliac */}
        <path
          d={`M ${centerX - 10} ${anatomy.leftIliac.startY}
              Q ${anatomy.leftIliac.startX} ${anatomy.leftIliac.startY + 30}
                ${anatomy.leftIliac.endX} ${anatomy.leftIliac.endY}
              L ${anatomy.leftIliac.endX - anatomy.leftIliac.width} ${anatomy.leftIliac.endY}
              Q ${anatomy.leftIliac.startX - anatomy.leftIliac.width} ${anatomy.leftIliac.startY + 30}
                ${centerX - 10 - anatomy.leftIliac.width / 2} ${anatomy.leftIliac.startY}
              Z`}
          fill="url(#vesselGradient)"
          stroke={isHighlighted('leftCIA') ? COLORS.highlight : COLORS.vesselStroke}
          strokeWidth={isHighlighted('leftCIA') ? 3 : 1}
        />

        {/* Stentgraft overlay */}
        {stentgraft && (
          <g className="stentgraft-overlay">
            {/* Main Body - Aortic portion */}
            <rect
              x={centerX - stentgraft.mainBody.aorticWidth / 2}
              y={stentgraft.mainBody.top}
              width={stentgraft.mainBody.aorticWidth}
              height={(anatomy.aorta.bifurcation - stentgraft.mainBody.top) * 0.7}
              fill="url(#stentgraftGradient)"
              stroke={COLORS.stentgraftStroke}
              strokeWidth="2"
              rx="3"
            />

            {/* Main Body - Ipsilateral leg */}
            <rect
              x={stentgraft.ipsiExt.side === 'right'
                ? centerX + 5
                : centerX - 5 - stentgraft.mainBody.ipsiLegWidth}
              y={anatomy.aorta.bifurcation - 20}
              width={stentgraft.mainBody.ipsiLegWidth}
              height={stentgraft.mainBody.bottom - anatomy.aorta.bifurcation + 20}
              fill={COLORS.mainBody}
              stroke={COLORS.stentgraftStroke}
              strokeWidth="2"
              rx="2"
              opacity="0.9"
            />

            {/* Gate indication */}
            <rect
              x={stentgraft.contraLimb.side === 'right'
                ? centerX + 5
                : centerX - 5 - stentgraft.mainBody.gateWidth}
              y={anatomy.aorta.bifurcation - 10}
              width={stentgraft.mainBody.gateWidth}
              height={30}
              fill={COLORS.mainBody}
              stroke={COLORS.stentgraftStroke}
              strokeWidth="2"
              rx="2"
              opacity="0.9"
            />

            {/* Contralateral Limb (ETLW) */}
            <path
              d={`M ${stentgraft.contraLimb.side === 'left'
                    ? centerX - 5
                    : centerX + 5 + stentgraft.contraLimb.proxWidth}
                  ${stentgraft.contraLimb.top}
                  L ${stentgraft.contraLimb.side === 'left'
                    ? centerX - 50 - stentgraft.contraLimb.distWidth / 2
                    : centerX + 50 + stentgraft.contraLimb.distWidth / 2}
                  ${stentgraft.contraLimb.bottom}
                  L ${stentgraft.contraLimb.side === 'left'
                    ? centerX - 50 + stentgraft.contraLimb.distWidth / 2
                    : centerX + 50 - stentgraft.contraLimb.distWidth / 2}
                  ${stentgraft.contraLimb.bottom}
                  L ${stentgraft.contraLimb.side === 'left'
                    ? centerX - 5 - stentgraft.contraLimb.proxWidth
                    : centerX + 5}
                  ${stentgraft.contraLimb.top}
                  Z`}
              fill={COLORS.contraLimb}
              stroke="#2d572c"
              strokeWidth="2"
              opacity="0.85"
            />

            {/* Ipsilateral Extension */}
            <path
              d={`M ${stentgraft.ipsiExt.side === 'right'
                    ? centerX + 5
                    : centerX - 5}
                  ${stentgraft.ipsiExt.top}
                  L ${stentgraft.ipsiExt.side === 'right'
                    ? centerX + 50 - stentgraft.ipsiExt.width / 2
                    : centerX - 50 + stentgraft.ipsiExt.width / 2}
                  ${stentgraft.ipsiExt.bottom}
                  L ${stentgraft.ipsiExt.side === 'right'
                    ? centerX + 50 + stentgraft.ipsiExt.width / 2
                    : centerX - 50 - stentgraft.ipsiExt.width / 2}
                  ${stentgraft.ipsiExt.bottom}
                  L ${stentgraft.ipsiExt.side === 'right'
                    ? centerX + 5 + stentgraft.mainBody.ipsiLegWidth
                    : centerX - 5 - stentgraft.mainBody.ipsiLegWidth}
                  ${stentgraft.ipsiExt.top}
                  Z`}
              fill={COLORS.ipsiExt}
              stroke="#c27d0e"
              strokeWidth="2"
              opacity="0.85"
            />
          </g>
        )}

        {/* Measurement labels */}
        <g className="measurements">
          {/* Neck diameter */}
          <text x={centerX + anatomy.aorta.width / 2 + 5} y={anatomy.aorta.top + 15}
            fontSize="9" fill={COLORS.measurement}>
            ⌀{measurements.neckDiameter}mm
          </text>

          {/* Neck length */}
          <line x1={centerX - anatomy.aorta.width / 2 - 20} y1={anatomy.aorta.top}
            x2={centerX - anatomy.aorta.width / 2 - 20} y2={anatomy.aorta.neckEnd}
            stroke={COLORS.measurement} strokeWidth="1" markerEnd="url(#arrow)" />
          <text x={centerX - anatomy.aorta.width / 2 - 35} y={(anatomy.aorta.top + anatomy.aorta.neckEnd) / 2}
            fontSize="9" fill={COLORS.measurement} transform={`rotate(-90, ${centerX - anatomy.aorta.width / 2 - 35}, ${(anatomy.aorta.top + anatomy.aorta.neckEnd) / 2})`}>
            {measurements.neckLength}mm
          </text>

          {/* Right CIA */}
          <text x={anatomy.rightIliac.endX + 15} y={anatomy.rightIliac.endY - 20}
            fontSize="9" fill={COLORS.measurement}>
            P: ⌀{measurements.rightCIA}mm
          </text>

          {/* Left CIA */}
          <text x={anatomy.leftIliac.endX - anatomy.leftIliac.width - 45} y={anatomy.leftIliac.endY - 20}
            fontSize="9" fill={COLORS.measurement}>
            L: ⌀{measurements.leftCIA}mm
          </text>
        </g>

        {/* Legend */}
        <g className="legend" transform="translate(10, 500)">
          <rect width="150" height="90" fill="white" stroke="#ddd" rx="4" />
          <text x="10" y="15" fontSize="10" fontWeight="bold">Legenda:</text>

          <rect x="10" y="25" width="15" height="10" fill={COLORS.mainBody} stroke={COLORS.stentgraftStroke} />
          <text x="30" y="33" fontSize="9">Main Body</text>

          <rect x="10" y="40" width="15" height="10" fill={COLORS.contraLimb} stroke="#2d572c" />
          <text x="30" y="48" fontSize="9">ETLW (kontra)</text>

          <rect x="10" y="55" width="15" height="10" fill={COLORS.ipsiExt} stroke="#c27d0e" />
          <text x="30" y="63" fontSize="9">Przedłużka (ipsi)</text>

          <rect x="10" y="70" width="15" height="10" fill="url(#vesselGradient)" stroke={COLORS.vesselStroke} />
          <text x="30" y="78" fontSize="9">Naczynie</text>
        </g>

        {/* Configuration info */}
        {configuration && (
          <g className="config-info" transform="translate(250, 500)">
            <rect width="140" height="90" fill="white" stroke="#ddd" rx="4" />
            <text x="10" y="15" fontSize="10" fontWeight="bold">Konfiguracja:</text>
            <text x="10" y="30" fontSize="8">{configuration.mainBody.code}</text>
            <text x="10" y="45" fontSize="8">{configuration.contralateralLimb.code}</text>
            <text x="10" y="60" fontSize="8">{configuration.ipsilateralExtension.code}</text>
            <text x="10" y="78" fontSize="8" fill="#666">
              Score: {configuration.totalScore?.toFixed(0) || 'N/A'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export default AortaVisualization;
