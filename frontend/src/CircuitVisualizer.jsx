import React from 'react';

export default function CircuitVisualizer({ refResources, candResources }) {
  if (!refResources || !candResources) {
    return <div className="text-muted text-small p-2">Structural data unavailable.</div>;
  }

  // We don't have ordered gate sequences, only counts.
  // We will visualize the available gate sets and depths.
  const refWidth = refResources.width || 1;
  const candWidth = candResources.width || 1;

  // Render a simple conceptual lane for each qubit line (up to width)
  const renderLanes = (width, startY, label) => {
    const lanes = [];
    for (let i = 0; i < width; i++) {
      lanes.push(
        <line key={i} x1="100" y1={startY + i * 20} x2="500" y2={startY + i * 20} className="circuit-line" />
      );
      lanes.push(
        <text key={`l-${i}`} x="80" y={startY + i * 20 + 4} textAnchor="end" className="text-muted text-small">q_{i}</text>
      );
    }
    return (
      <g>
        <text x="10" y={startY - 10} style={{ fontWeight: 600, fontSize: '10px', fill: 'var(--blue-60)' }}>{label}</text>
        {lanes}
      </g>
    );
  };

  const renderGateSummary = (gates, startY, yOffset) => {
    const sorted = Object.entries(gates).sort((a,b) => b[1] - a[1]);
    return sorted.map(([gate, count], i) => (
      <g key={gate} transform={`translate(${150 + i * 40}, ${startY + yOffset})`}>
        <rect x="0" y="-12" width="24" height="24" className="circuit-gate" rx="2" />
        <text x="12" y="4" textAnchor="middle" style={{fontSize: '10px'}}>{gate}</text>
        <text x="12" y="-16" textAnchor="middle" style={{fontSize: '8px', fill: 'var(--gray-70)'}}>x{count}</text>
      </g>
    ));
  };

  return (
    <svg width="100%" height="220" viewBox="0 0 600 220" className="circuit-svg">
      <rect width="100%" height="100%" fill="var(--white)" />
      {/* Reference */}
      {renderLanes(refWidth, 40, "REFERENCE")}
      {renderGateSummary(refResources.gate_counts, 40, ((refWidth-1)*20)/2 )}

      {/* Divider */}
      <line x1="10" y1="120" x2="590" y2="120" stroke="var(--gray-20)" strokeDasharray="4 4" />

      {/* Candidate */}
      {renderLanes(candWidth, 160, "CANDIDATE")}
      {renderGateSummary(candResources.gate_counts, 160, ((candWidth-1)*20)/2 )}

      <text x="10" y="210" style={{ fontSize: '10px', fill: 'var(--gray-70)' }}>
        * Conceptual visualization derived from gate distribution counts. Exact sequence not preserved post-hoc.
      </text>
    </svg>
  );
}
