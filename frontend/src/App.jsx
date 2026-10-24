import React, { useState, useEffect, useMemo } from 'react';

const NAV = [
  'Overview',
  'Project Guide',
  'Architecture & Pipeline',
  'Experiment Explorer',
  'Resource Analysis',
  'Structural Analysis',
  'Transformation Categories',
  'Methodology & Baselines'
];

const badge = e => (
  <span className={`bg ${e.s === 'ok' ? 'ok' : e.s === 'ne' ? 'bad' : 'warn'}`}>
    {e.s === 'ok' ? 'EQUIVALENT' : e.s === 'ne' ? 'INEQUIVALENT' : 'INCONCLUSIVE'}
  </span>
);

const fmt = v => (v === null || v === undefined) ? (
  <span className="un">unavailable</span>
) : (v > 0 ? '+' + v : String(v));

// Quantum Circuit Vector Illustration Component
function CircuitDiagram({ type }) {
  if (type === 'e1') {
    return (
      <svg viewBox="0 0 460 90" style={{ width: '100%', maxWidth: 460, height: 'auto' }} className="circuit-svg" role="img" aria-label="E1 Basis Rewrite: H to Ry(pi/2) then Z">
        {/* Reference Circuit */}
        <text x="10" y="24" fontSize="11" fill="var(--tx2)" fontWeight="600">REFERENCE</text>
        <line x1="10" y1="50" x2="160" y2="50" stroke="var(--tx2)" strokeWidth="1.5" />
        <text x="10" y="46" fontSize="10" fill="var(--tx2)">q[0]</text>
        <rect x="70" y="34" width="32" height="32" fill="#fff" stroke="#0F62FE" strokeWidth="2" rx="2" />
        <text x="86" y="55" fontSize="14" fontWeight="600" textAnchor="middle" fill="#0F62FE">H</text>

        {/* Transformation Arrow */}
        <text x="195" y="46" fontSize="11" textAnchor="middle" fill="var(--tx2)">rewrites to</text>
        <path d="M180 50 L210 50 M204 45 L210 50 L204 55" stroke="var(--blue)" strokeWidth="2" fill="none" />

        {/* Candidate Circuit */}
        <text x="240" y="24" fontSize="11" fill="var(--tx2)" fontWeight="600">CANDIDATE (BASIS SYNTHESIS)</text>
        <line x1="240" y1="50" x2="440" y2="50" stroke="var(--tx2)" strokeWidth="1.5" />
        <text x="240" y="46" fontSize="10" fill="var(--tx2)">q[0]</text>
        <rect x="290" y="34" width="32" height="32" fill="#fff" stroke="#0F62FE" strokeWidth="2" rx="2" />
        <text x="306" y="55" fontSize="13" fontWeight="600" textAnchor="middle" fill="#0F62FE">Z</text>
        <rect x="345" y="34" width="56" height="32" fill="#fff" stroke="#0F62FE" strokeWidth="2" rx="2" />
        <text x="373" y="54" fontSize="11" fontWeight="600" textAnchor="middle" fill="#0F62FE">Ry(π/2)</text>
      </svg>
    );
  }

  if (type === 'e2') {
    return (
      <svg viewBox="0 0 460 110" style={{ width: '100%', maxWidth: 460, height: 'auto' }} className="circuit-svg" role="img" aria-label="E2 CX-CX Cancellation">
        {/* Reference */}
        <text x="10" y="20" fontSize="11" fill="var(--tx2)" fontWeight="600">REFERENCE (REDUNDANT CX)</text>
        <line x1="10" y1="45" x2="170" y2="45" stroke="var(--tx2)" strokeWidth="1.5" />
        <line x1="10" y1="85" x2="170" y2="85" stroke="var(--tx2)" strokeWidth="1.5" />
        <text x="10" y="41" fontSize="10" fill="var(--tx2)">q[0]</text>
        <text x="10" y="81" fontSize="10" fill="var(--tx2)">q[1]</text>
        {/* CX 1 */}
        <circle cx="65" cy="45" r="4" fill="#0F62FE" />
        <line x1="65" y1="45" x2="65" y2="85" stroke="#0F62FE" strokeWidth="2" />
        <circle cx="65" cy="85" r="10" fill="#fff" stroke="#0F62FE" strokeWidth="2" />
        <line x1="58" y1="85" x2="72" y2="85" stroke="#0F62FE" strokeWidth="2" />
        <line x1="65" y1="78" x2="65" y2="92" stroke="#0F62FE" strokeWidth="2" />
        {/* CX 2 */}
        <circle cx="120" cy="45" r="4" fill="#0F62FE" />
        <line x1="120" y1="45" x2="120" y2="85" stroke="#0F62FE" strokeWidth="2" />
        <circle cx="120" cy="85" r="10" fill="#fff" stroke="#0F62FE" strokeWidth="2" />
        <line x1="113" y1="85" x2="127" y2="85" stroke="#0F62FE" strokeWidth="2" />
        <line x1="120" y1="78" x2="120" y2="92" stroke="#0F62FE" strokeWidth="2" />

        {/* Arrow */}
        <path d="M195 65 L225 65 M219 60 L225 65 L219 70" stroke="var(--blue)" strokeWidth="2" fill="none" />

        {/* Candidate */}
        <text x="250" y="20" fontSize="11" fill="var(--tx2)" fontWeight="600">CANDIDATE (OPTIMIZED)</text>
        <line x1="250" y1="45" x2="430" y2="45" stroke="var(--tx2)" strokeWidth="1.5" />
        <line x1="250" y1="85" x2="430" y2="85" stroke="var(--tx2)" strokeWidth="1.5" />
        <text x="250" y="41" fontSize="10" fill="var(--tx2)">q[0]</text>
        <text x="250" y="81" fontSize="10" fill="var(--tx2)">q[1]</text>
        <text x="340" y="70" fontSize="12" fill="#198038" fontWeight="600" textAnchor="middle">Identity (Cancelled)</text>
      </svg>
    );
  }

  return null;
}

// Interactive Pipeline / Preview for Hero (Accurate Dynamic Data)
function Preview({ stats, list, navigateTo }) {
  const evalList = (list || []).filter(x => !x.isLegit);
  const C = 2 * Math.PI * 30;
  const eqCount = stats?.eq ?? 8;
  const neqCount = stats?.neq ?? 1;
  const incCount = stats?.inc ?? 0;
  const totCount = stats?.total ?? 9;

  return (
    <div className="pv" role="region" aria-label="Observatory snapshot preview showing live dataset telemetry">
      <div className="pvt">
        <i></i><i></i><i></i>
        <b>TranspileLens Observatory — Verified Snapshot Telemetry</b>
      </div>
      <div className="pvb">
        <div className="pvs">
          {NAV.slice(0, 5).map((n, i) => (
            <div key={n} className={i === 0 ? 'on' : ''} style={{ cursor: 'pointer' }} onClick={() => navigateTo(n)}>
              {n}
            </div>
          ))}
        </div>
        <div className="pvm">
          <div className="pvk">
            {[
              ['Proven Equivalent', eqCount, '#198038'],
              ['Not Equivalent (Control)', neqCount, '#DA1E28'],
              ['Inconclusive', incCount, '#B28600']
            ].map(([n, v, c]) => (
              <div key={n} style={{ borderTop: '3px solid ' + c }}>
                <small>{n}</small>
                <b>{v}</b>
              </div>
            ))}
          </div>
          <div className="pvr">
            <div>
              <small><b>Resource deltas (E1–E6)</b> | Signed Δ</small>
              <svg viewBox="0 0 220 110" style={{ width: '100%' }} aria-label="Bar chart preview of resource deltas">
                <line x1={0} x2={220} y1={55} y2={55} stroke="#D8E0EB" />
                {evalList.map((e, i) => {
                  const d = e.d;
                  const o = e.o;
                  const x = 12 + i * 34;
                  return d === null || d === undefined ? (
                    <text key={e.id} x={x + 10} y={50} fontSize={8} fill="#526176">n/a</text>
                  ) : (
                    <g key={e.id}>
                      <rect
                        x={x}
                        y={d > 0 ? 55 - d * 7 : 55}
                        width={9}
                        height={Math.max(2, Math.abs(d) * 7)}
                        fill="#0F62FE"
                        rx="1"
                      />
                      <rect
                        x={x + 11}
                        y={o > 0 ? 55 - o * 7 : 55}
                        width={9}
                        height={Math.max(2, Math.abs(o) * 7)}
                        fill="#36C5F0"
                        rx="1"
                      />
                    </g>
                  );
                })}
                {evalList.map((e, i) => (
                  <text key={'l' + e.id} x={22 + i * 34} y={105} fontSize={8} textAnchor="middle" fill="#526176">
                    {e.id}
                  </text>
                ))}
              </svg>
            </div>
            <div>
              <small><b>Semantic outcomes</b></small>
              <svg viewBox="0 0 80 80" style={{ width: '100%', maxWidth: 96, display: 'block', margin: '6px auto' }} aria-label="Donut chart showing semantic breakdown">
                <circle cx={40} cy={40} r={30} fill="none" stroke="var(--bd)" strokeWidth={10} />
                {totCount > 0 && (
                  <>
                    <circle
                      cx={40}
                      cy={40}
                      r={30}
                      fill="none"
                      stroke="#198038"
                      strokeWidth={10}
                      strokeDasharray={`${(eqCount / totCount) * C} ${C}`}
                      transform="rotate(-90 40 40)"
                    />
                    <circle
                      cx={40}
                      cy={40}
                      r={30}
                      fill="none"
                      stroke="#DA1E28"
                      strokeWidth={10}
                      strokeDasharray={`${(neqCount / totCount) * C} ${C}`}
                      strokeDashoffset={-((eqCount / totCount) * C)}
                      transform="rotate(-90 40 40)"
                    />
                  </>
                )}
                <text x={40} y={44} textAnchor="middle" fontSize={15} fontWeight={600} fill="#161B2E">{totCount}</text>
                <text x={40} y={54} textAnchor="middle" fontSize={8} fill="#526176">records</text>
              </svg>
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--tx2)', fontStyle: 'italic', marginTop: 4 }}>
            Snapshot data derived dynamically from published results.json payload.
          </div>
        </div>
      </div>
    </div>
  );
}

// Hero Section
function Hero({ stats, list, navigateTo }) {
  const go = v => e => {
    e.preventDefault();
    navigateTo(v);
    const el = document.getElementById('observatory');
    if (el) {
      el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };

  const S = (n, l, c) => (
    <div key={l} className="hs" style={{ '--c': c }}>
      <b style={{ color: c }}>{n}</b>
      <span>{l}</span>
    </div>
  );

  return (
    <section className="hero">
      <div className="hwrap">
        <div className="hnav">
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 17, color: '#fff', textDecoration: 'none' }}>
            <svg width={26} height={26} viewBox="0 0 28 28" fill="none" stroke="#fff" strokeWidth={2} aria-hidden="true">
              <circle cx={14} cy={14} r={9} /><path d="M2 14h24M14 5v18" />
            </svg>
            TranspileLens
          </a>
          <nav>
            {NAV.slice(0, 5).map(n => (
              <a key={n} href="#observatory" onClick={go(n)}>{n}</a>
            ))}
          </nav>
          <a className="hbn p" style={{ height: 40 }} href="#observatory" onClick={go('Overview')}>Open Observatory</a>
        </div>
        <div className="hgrid">
          <div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <span className="eb">RESEARCH FRAMEWORK — ROUND 2</span>
              <span style={{ fontSize: 12, color: '#A6C8FF', background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 2 }}>
                Aryan Chavan &amp; Ananya Kulkarni
              </span>
            </div>
            <h1 className="hh">Understand What Changes When Quantum Circuits Transform.</h1>
            <p className="hp">
              TranspileLens pairs formal decision-diagram equivalence checking (via MQT QCEC) with deterministic structural, topological, and resource-level profiling to explain <em>how</em> and <em>why</em> quantum circuits mutate during compilation.
            </p>
            <div className="hcta">
              <a className="hbn p" href="#observatory" onClick={go('Overview')}>
                Explore the Observatory <span className="arrow" aria-hidden="true">→</span>
              </a>
              <a className="hbn s" href="#observatory" onClick={go('Project Guide')}>
                Read Complete Project Guide
              </a>
            </div>
            <p className="hq">"Report evidence, not intent."</p>
          </div>
          <div className="herov">
            <Preview stats={stats} list={list} navigateTo={navigateTo} />
          </div>
        </div>
        <div className="hstats">
          {S(stats.total, 'experiments analysed', '#10172A')}
          {S(stats.eq, 'proven equivalent', '#198038')}
          {S(stats.neq, 'not equivalent (control)', '#DA1E28')}
          {S(stats.inc, 'inconclusive', '#B28600')}
        </div>
      </div>
    </section>
  );
}

// Adaptive Dynamic Resource Chart
function Wide({ list, sel, setSel }) {
  const [metric, setMetric] = useState('depth'); // 'depth', 'ops', 'twoQubit'
  const [corpusFilter, setCorpusFilter] = useState('eval'); // 'eval' or 'all'

  const displayList = useMemo(() => {
    return corpusFilter === 'eval' ? list.filter(x => !x.isLegit) : list;
  }, [list, corpusFilter]);

  const getVal = e => {
    if (metric === 'depth') return e.d;
    if (metric === 'ops') return e.o;
    if (metric === 'twoQubit') return e.d2q;
    return null;
  };

  const metricLabel = metric === 'depth' ? 'Circuit Depth Δ' : metric === 'ops' ? 'Total Operations Δ' : 'Two-Qubit Operations Δ';

  // Calculate dynamic adaptive scale
  const numericValues = displayList.map(getVal).filter(v => v !== null && v !== undefined);
  const dataMin = numericValues.length > 0 ? Math.min(0, ...numericValues) : -4;
  const dataMax = numericValues.length > 0 ? Math.max(0, ...numericValues) : 4;

  const yMin = Math.min(-4, Math.floor(dataMin - 1));
  const yMax = Math.max(4, Math.ceil(dataMax + 1));
  const yRange = yMax - yMin;

  const height = 240;
  const topPad = 24;
  const botPad = 32;
  const plotH = height - topPad - botPad;
  const sc = plotH / (yRange || 8);
  const base = topPad + yMax * sc;

  // Generate ticks
  const ticks = [];
  const step = yRange > 12 ? 4 : 2;
  for (let t = Math.ceil(yMin / step) * step; t <= yMax; t += step) {
    ticks.push(t);
  }
  if (!ticks.includes(0)) ticks.push(0);
  ticks.sort((a, b) => a - b);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            ['depth', 'Depth Δ'],
            ['ops', 'Total Ops Δ'],
            ['twoQubit', '2-Qubit Ops Δ']
          ].map(([m, lbl]) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`pill-btn ${metric === m ? 'active' : ''}`}
            >
              {lbl}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={() => setCorpusFilter('eval')}
              className={`pill-btn ${corpusFilter === 'eval' ? 'active' : ''}`}
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              Evaluation (E1–E6)
            </button>
            <button
              onClick={() => setCorpusFilter('all')}
              className={`pill-btn ${corpusFilter === 'all' ? 'active' : ''}`}
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              All Records ({list.length})
            </button>
          </div>
          <span style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 500 }}>
            Formula: Δ = Candidate − Reference
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 680 240" style={{ width: '100%', minWidth: 500, height: 'auto' }} role="img" aria-label={`Resource deltas: ${metricLabel}`}>
          {ticks.map(v => {
            const y = base - v * sc;
            return (
              <g key={v}>
                <line x1={45} x2={670} y1={y} y2={y} stroke="var(--bd)" strokeDasharray={v === 0 ? undefined : '3 3'} strokeWidth={v === 0 ? 1.5 : 1} />
                <text x={38} y={y + 4} fontSize={10} textAnchor="end" fill={v === 0 ? 'var(--tx)' : 'var(--tx2)'} fontWeight={v === 0 ? 600 : 400}>
                  {v > 0 ? '+' + v : String(v)}
                </text>
              </g>
            );
          })}

          {displayList.map((e, i) => {
            const spacing = 620 / Math.max(1, displayList.length);
            const x = 50 + i * spacing;
            const on = e.id === sel;
            const v = getVal(e);
            const isAvail = v !== null && v !== undefined;
            const barW = Math.min(34, spacing - 12);
            const barX = x + (spacing - barW) / 2;

            return (
              <g
                key={e.id}
                tabIndex={0}
                role="button"
                aria-label={`${e.id}: ${isAvail ? (v > 0 ? '+' + v : v) : 'unavailable'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSel(e.id)}
                onKeyDown={k => { if (k.key === 'Enter') setSel(e.id); }}
              >
                <rect x={x} y={topPad} width={spacing} height={plotH} fill={on ? 'var(--pale)' : 'transparent'} rx="2" />
                {!isAvail ? (
                  <text x={x + spacing / 2} y={base - 6} fontSize={10} textAnchor="middle" fill="var(--tx2)" fontFamily="IBM Plex Mono">N/A</text>
                ) : v === 0 ? (
                  <g>
                    <circle cx={x + spacing / 2} cy={base} r={3} fill="var(--tx2)" />
                    <text x={x + spacing / 2} y={base - 8} fontSize={10} textAnchor="middle" fill="var(--tx2)">0</text>
                  </g>
                ) : (
                  <g>
                    <rect
                      x={barX}
                      y={v > 0 ? base - v * sc : base}
                      width={barW}
                      height={Math.max(2, Math.abs(v) * sc)}
                      fill={v > 0 ? (on ? '#0F62FE' : '#78A9FF') : (on ? '#0072C3' : '#36C5F0')}
                      rx="2"
                    />
                    <text
                      x={x + spacing / 2}
                      y={v > 0 ? base - v * sc - 6 : base - v * sc + 13}
                      fontSize={10}
                      textAnchor="middle"
                      fontWeight={600}
                      fill="var(--tx)"
                      fontFamily="IBM Plex Mono"
                    >
                      {v > 0 ? '+' + v : String(v)}
                    </text>
                  </g>
                )}
                <text
                  x={x + spacing / 2}
                  y={height - 10}
                  fontSize={11}
                  textAnchor="middle"
                  fill={on ? 'var(--blue)' : 'var(--tx)'}
                  fontWeight={on ? 600 : 400}
                  fontFamily="IBM Plex Mono"
                >
                  {e.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--tx2)', marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span><span style={{ color: '#0F62FE' }}>■</span> Positive Δ (Resource overhead / routing / insertion)</span>
          <span><span style={{ color: '#36C5F0' }}>■</span> Negative Δ (Resource reduction / optimization)</span>
          <span><span style={{ color: 'var(--tx2)' }}>●</span> Zero Δ (Preserved)</span>
        </div>
        <span className="mut">
          Note: Negative delta is not universally an improvement; positive delta is not universally a defect.
        </span>
      </div>
    </div>
  );
}

// Donut Chart Component
function Donut({ list }) {
  const [subset, setSubset] = useState('ALL');

  const filteredRecords = useMemo(() => {
    if (subset === 'EVAL') return list.filter(x => !x.isLegit);
    if (subset === 'LEGIT') return list.filter(x => x.isLegit);
    return list;
  }, [list, subset]);

  const counts = useMemo(() => {
    let eq = 0, neq = 0, inc = 0;
    filteredRecords.forEach(e => {
      if (e.s === 'ok') eq++;
      else if (e.s === 'ne') neq++;
      else inc++;
    });
    return { total: filteredRecords.length, eq, neq, inc };
  }, [filteredRecords]);

  const C = 2 * Math.PI * 54;
  const rows = [
    ['Equivalent', counts.eq, '#198038'],
    ['Not equivalent', counts.neq, '#DA1E28'],
    ['Inconclusive', counts.inc, '#F1C21B']
  ];
  let off = 0;

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[
          ['ALL', `All (${list.length})`],
          ['EVAL', `Evaluation E1–E6 (${list.filter(x => !x.isLegit).length})`],
          ['LEGIT', `Baselines L1–L3 (${list.filter(x => x.isLegit).length})`]
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSubset(key)}
            className={`pill-btn ${subset === key ? 'active' : ''}`}
            style={{ fontSize: 11, padding: '3px 8px' }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, alignItems: 'center' }}>
        <svg viewBox="0 0 140 140" role="img" aria-label="Semantic outcomes distribution">
          <circle cx={70} cy={70} r={54} fill="none" stroke="var(--bd)" strokeWidth={16} />
          {counts.total > 0 && rows.filter(r => r[1] > 0).map(([n, v, c]) => {
            const len = (v / counts.total) * C;
            const el = (
              <circle
                key={n}
                cx={70}
                cy={70}
                r={54}
                fill="none"
                stroke={c}
                strokeWidth={16}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-off}
                transform="rotate(-90 70 70)"
              />
            );
            off += len;
            return el;
          })}
          <text x={70} y={74} textAnchor="middle" fontSize={22} fontWeight={600} fill="var(--tx)">{counts.total}</text>
          <text x={70} y={88} textAnchor="middle" fontSize={10} fill="var(--tx2)">records</text>
        </svg>
        <div>
          {rows.map(([n, v, c]) => (
            <div className="lg" key={n}>
              <span className="dot" style={{ background: c }}></span>
              <span>{n}</span>
              <b>{v}</b>
              <span className="mut">{counts.total > 0 ? Math.round((v / counts.total) * 100) : 0}%</span>
            </div>
          ))}
        </div>
      </div>
      <p className="note" style={{ marginTop: 10, fontSize: 11 }}>
        Semantic proofs strictly computed via MQT QCEC. Evaluation corpus separates intentional negative controls (E5) from baseline transpilation.
      </p>
    </div>
  );
}

// Records Table
function Records({ list, sel, setSel, full }) {
  const [corpusTab, setCorpusTab] = useState('ALL');

  const filtered = useMemo(() => {
    if (corpusTab === 'EVAL') return list.filter(x => !x.isLegit);
    if (corpusTab === 'LEGIT') return list.filter(x => x.isLegit);
    return list;
  }, [list, corpusTab]);

  const displayList = full ? filtered : filtered.slice(0, 6);

  return (
    <div>
      {full && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {[
            ['ALL', `All Records (${list.length})`],
            ['EVAL', `Targeted Evaluation (6)`],
            ['LEGIT', `Legitimate Baselines (3)`]
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setCorpusTab(k)}
              className={`pill-btn ${corpusTab === k ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="ov">
        <table className="tb">
          <thead>
            <tr>
              {['ID', 'Corpus Group', 'Semantic Status (QCEC)', 'Acceptance (Hypothesis)', 'Categorizer Interpretation'].map(t => (
                <th key={t}>{t}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayList.map(e => (
              <tr key={e.id} data-s={e.id === sel ? 1 : 0} onClick={() => setSel(e.id)}>
                <td><b>{e.id}</b></td>
                <td>
                  <span className={`bg ${e.isLegit ? 'warn' : 'hv'}`} style={{ fontSize: 10.5 }}>
                    {e.isLegit ? 'LEGITIMATE BASELINE' : 'TARGETED EVALUATION'}
                  </span>
                </td>
                <td>{badge(e)}</td>
                <td>
                  <span className={`bg ${e.acceptance === 'PASS' ? 'ok' : 'bad'}`}>
                    {e.acceptance ? `${e.acceptance} (expected: ${e.expected_status || 'equivalent'})` : 'PASS'}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 12.5 }}>{e.cat || <span className="un">unavailable</span>}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Detail View Component
function Detail({ list, sel }) {
  const e = list.find(x => x.id === sel);
  if (!e) return null;
  const isE6 = e.id === 'E6';
  const isE5 = e.id === 'E5';

  return (
    <div className="c">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Selected: {e.id}</h3>
        <span className={`bg ${e.isLegit ? 'warn' : 'hv'}`}>
          {e.isLegit ? 'Legitimate Baseline' : 'Targeted Evaluation'}
        </span>
      </div>

      <div className="mut">Formal Semantic Equivalence (MQT QCEC)</div>
      <div style={{ margin: '4px 0 12px' }}>{badge(e)}</div>

      <div className="mut">Acceptance Test vs Expected Hypothesis</div>
      <div style={{ margin: '4px 0 12px' }}>
        <span className={`bg ${e.acceptance === 'PASS' ? 'ok' : 'bad'}`}>
          {e.acceptance} (Expected: {e.expected_status})
        </span>
      </div>

      <div className="mut">Deterministic Heuristic Category (Rule Engine, Not Proof)</div>
      <div style={{ margin: '4px 0 12px' }}>
        {e.cat ? <span className="bg hv">{e.cat.toUpperCase()}</span> : <span className="un">unavailable</span>}
      </div>

      <div className="mut">Depth Δ / Operations Δ (Candidate − Reference)</div>
      <div style={{ margin: '4px 0 12px' }}>{fmt(e.d)} / {fmt(e.o)}</div>

      <div className="mut">Two-Qubit Operations Δ</div>
      <div style={{ margin: '4px 0 12px' }}>{fmt(e.d2q)}</div>

      {e.evidence && (
        <>
          <div className="mut" style={{ marginTop: 12 }}>Structural Interpretation Evidence</div>
          <div className="note" style={{ margin: '4px 0 12px', background: 'var(--canvas)', padding: 8 }}>
            {e.evidence}
          </div>
        </>
      )}

      {e.interface_checks && e.interface_checks.length > 0 && (
        <>
          <div className="mut" style={{ marginTop: 12 }}>Interface Validation Evidence</div>
          {e.interface_checks.map((ck, idx) => (
            <div
              key={idx}
              className="note"
              style={{
                margin: '4px 0',
                padding: 8,
                background: 'var(--canvas)',
                borderLeft: `3px solid ${ck.status === 'pass' ? 'var(--ok)' : ck.status === 'fail' ? 'var(--bad)' : 'var(--warn)'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b>{ck.check_name}</b>
                <span className={`bg ${ck.status === 'pass' ? 'ok' : ck.status === 'fail' ? 'bad' : 'warn'}`}>
                  {ck.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 11.5, marginTop: 4 }}>{ck.explanation}</div>
            </div>
          ))}
          {isE6 && (
            <div className="callout info" style={{ fontSize: 11, marginTop: 8 }}>
              <b>E6 Register Width Notice:</b> Register Widths reports FAIL because the candidate allocated 1 ancilla qubit for detour routing (3 vs 2 qubits). QCEC formally proves semantic equivalence on the functional subsystem.
            </div>
          )}
          {isE5 && (
            <div className="callout warn" style={{ fontSize: 11, marginTop: 8 }}>
              <b>E5 Negative Control Contract:</b> Measurement mapping intentionally shifted qubit 0 to 1. QCEC correctly detects output distribution inequivalence, resulting in Category 1 and PASS for acceptance.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Structural Evidence Chart
function StructuralChart({ list, sel, setSel }) {
  const evalList = list.filter(x => !x.isLegit);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
        {evalList.map(e => {
          const on = e.id === sel;
          const jsVal = e.gd !== null && e.gd !== undefined ? e.gd.toFixed(3) : '0.000';
          const addEd = e.added_edges?.length || 0;
          const remEd = e.removed_edges?.length || 0;
          return (
            <div
              key={e.id}
              tabIndex={0}
              role="button"
              onClick={() => setSel(e.id)}
              onKeyDown={k => { if (k.key === 'Enter') setSel(e.id); }}
              style={{
                background: on ? 'var(--pale)' : 'var(--card)',
                border: `1px solid ${on ? 'var(--blue)' : 'var(--bd)'}`,
                padding: '10px 12px',
                cursor: 'pointer',
                borderRadius: 2,
                transition: 'border-color 160ms, background-color 160ms'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <b style={{ fontFamily: 'IBM Plex Mono' }}>{e.id}</b>
                <span className={`bg ${e.rg === 'Routing Heuristic Detected' ? 'hv' : 'warn'}`} style={{ fontSize: 10 }}>
                  {e.rg === 'Routing Heuristic Detected' ? 'ROUTING SIG' : 'NO ROUTING'}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--tx2)', lineHeight: 1.5 }}>
                <div><b>JS Div:</b> {jsVal}</div>
                <div><b>Edges Δ:</b> +{addEd} / -{remEd}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="note" style={{ fontSize: 11, margin: '6px 0 0' }}>
        Structural evidence reports empirical gate-distribution divergence and interaction graph mutations. Topology mutations provide empirical data; they do not prove malicious compiler intent or verify correctness in isolation.
      </p>
    </div>
  );
}

// Accurate Architecture Flowchart Component
function ArchitecturePipeline() {
  return (
    <div>
      <h1>System Architecture &amp; Data Pipeline</h1>
      <p className="sub">
        TranspileLens processes circuit transformations through two distinct, decoupled evidence streams (semantic and structural) before synthesizing a deterministic DeltaProfile.
      </p>

      <div className="flow-diagram">
        <h3 style={{ margin: '0 0 16px', color: 'var(--navy)' }}>TranspileLens Transformation Profiling Dataflow</h3>

        {/* Input Layer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#fff', border: '1px solid var(--bd)', padding: 12, borderTop: '3px solid var(--navy)' }}>
            <div className="flow-pill" style={{ background: 'var(--canvas)', color: 'var(--tx)' }}>INPUT 1</div>
            <h4 style={{ margin: '6px 0 4px' }}>Reference Circuit (Qiskit QuantumCircuit)</h4>
            <div style={{ fontSize: 12, color: 'var(--tx2)' }}>Baseline algorithmic circuit specification before compilation passes.</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--bd)', padding: 12, borderTop: '3px solid var(--blue)' }}>
            <div className="flow-pill" style={{ background: 'var(--canvas)', color: 'var(--tx)' }}>INPUT 2</div>
            <h4 style={{ margin: '6px 0 4px' }}>Candidate Transformation (Qiskit QuantumCircuit)</h4>
            <div style={{ fontSize: 12, color: 'var(--tx2)' }}>Synthesized, optimized, or routed target circuit resulting from compilation.</div>
          </div>
        </div>

        {/* Dual Evidence Streams */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16, marginBottom: 20 }}>
          {/* Stream A: Semantic Evidence */}
          <div className="flow-stream semantic">
            <span className="flow-pill" style={{ background: '#A7F0BA', color: '#044317' }}>STREAM A: SEMANTIC EVIDENCE</span>
            <h4 style={{ margin: '8px 0 6px', color: '#044317' }}>MQT QCEC Verification Engine</h4>
            <p style={{ fontSize: 12, color: 'var(--tx2)', margin: '0 0 10px' }}>
              Rigorous decision-diagram based equivalence checking across basis sets and unitary transformations.
            </p>
            <div style={{ background: '#fff', padding: 8, border: '1px solid var(--bd)', fontSize: 11.5, fontFamily: 'IBM Plex Mono' }}>
              <div>• Equivalent (Unitary match verified)</div>
              <div>• Not Equivalent (Deviation detected)</div>
              <div>• Inconclusive (Timeout / Resource guard)</div>
            </div>
          </div>

          {/* Stream B: Structural Evidence */}
          <div className="flow-stream structural">
            <span className="flow-pill" style={{ background: '#A6C8FF', color: '#002D9C' }}>STREAM B: STRUCTURAL EVIDENCE</span>
            <h4 style={{ margin: '8px 0 6px', color: '#002D9C' }}>Multi-Dimensional Profiling Suite</h4>
            <p style={{ fontSize: 12, color: 'var(--tx2)', margin: '0 0 10px' }}>
              Extracts deterministic structural metrics and topological observables from both circuits.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: '#fff', padding: 8, border: '1px solid var(--bd)', fontSize: 11.5 }}>
                <b>Resource Deltas:</b>
                <div style={{ color: 'var(--tx2)' }}>Depth Δ, Total Ops Δ, 2Q Ops Δ, Gate counts</div>
              </div>
              <div style={{ background: '#fff', padding: 8, border: '1px solid var(--bd)', fontSize: 11.5 }}>
                <b>Interaction Graphs:</b>
                <div style={{ color: 'var(--tx2)' }}>NetworkX coupling graphs, Added/Removed edges</div>
              </div>
              <div style={{ background: '#fff', padding: 8, border: '1px solid var(--bd)', fontSize: 11.5 }}>
                <b>Gate Distribution:</b>
                <div style={{ color: 'var(--tx2)' }}>Jensen-Shannon divergence D_JS(P || Q)</div>
              </div>
              <div style={{ background: '#fff', padding: 8, border: '1px solid var(--bd)', fontSize: 11.5 }}>
                <b>Interface Validation:</b>
                <div style={{ color: 'var(--tx2)' }}>Measurement mappings &amp; classical register widths</div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Layer */}
        <div style={{ background: 'var(--pale)', border: '1px solid #78A9FF', padding: 16, borderRadius: 4, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="flow-pill" style={{ background: '#0F62FE', color: '#fff' }}>SCHEMA INTEGRATION</span>
            <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: '#0043CE' }}>Pydantic DeltaProfile Contract</span>
          </div>
          <h4 style={{ margin: '8px 0 6px', color: '#002D9C' }}>Unified JSON DeltaProfile</h4>
          <p style={{ fontSize: 12.5, color: '#161B2E', margin: 0 }}>
            Merges semantic verification status, signed resource deltas, graph mutations, gate distribution shifts, and interface validation checks into a validated, serializable JSON contract.
          </p>
        </div>

        {/* Decision Layer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: '#fff', border: '1px solid var(--bd)', padding: 16, borderLeft: '4px solid #0F62FE' }}>
            <span className="flow-pill" style={{ background: 'var(--canvas)', color: 'var(--tx)' }}>CLASSIFICATION</span>
            <h4 style={{ margin: '8px 0 6px' }}>Deterministic Rule Engine (Categorizer)</h4>
            <p style={{ fontSize: 12, color: 'var(--tx2)', margin: '0 0 8px' }}>
              Evaluates strictly ordered priority rules (Categories 1–8) against the DeltaProfile to assign an interpretable explanation based on measured evidence, not compiler intent.
            </p>
          </div>

          <div style={{ background: '#FFF7ED', border: '1px solid #FFD8A8', padding: 16, borderLeft: '4px solid #F76707' }}>
            <span className="flow-pill" style={{ background: '#FFE8CC', color: '#D9480F' }}>BASELINE B2 NOTICE</span>
            <h4 style={{ margin: '8px 0 6px', color: '#D9480F' }}>Compiler Pass Telemetry (Unsupported)</h4>
            <p style={{ fontSize: 11.5, color: '#7C2D12', margin: 0 }}>
              Pass-level telemetry is explicitly marked as unsupported post-hoc because passive circuit analysis cannot reconstruct internal compiler pass callbacks without intrusive instrumentation.
            </p>
          </div>
        </div>

        {/* Output Layer */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', border: '1px solid var(--bd)', padding: 14 }}>
            <b>Structured JSON Evidence Report</b>
            <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
              Machine-readable artifact (results.json) containing complete evaluation records and baseline comparisons.
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--bd)', padding: 14 }}>
            <b>Static Research Dashboard (Observatory)</b>
            <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
              React + Vite interface rendering verified snapshots with interactive exploration, adaptive charts, and complete methodology transparency.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Complete Project Guide Component (A-to-Z)
function ProjectGuide() {
  const [activeTab, setActiveTab] = useState('problem');

  const topics = [
    { id: 'problem', title: '1. Problem Statement' },
    { id: 'why', title: '2. Why We Built It' },
    { id: 'what', title: '3. What It Does' },
    { id: 'arch', title: '4. System Architecture' },
    { id: 'method', title: '5. Methodology & Metrics' },
    { id: 'stack', title: '6. Verified Tech Stack' },
    { id: 'experiments', title: '7. Experimental Design' },
    { id: 'baselines', title: '8. Baselines Framework' },
    { id: 'interpretation', title: '9. Results Interpretation' },
    { id: 'limitations', title: '10. Limitations & Future Work' }
  ];

  return (
    <div>
      <h1>TranspileLens Project Guide</h1>
      <p className="sub">
        A comprehensive A-to-Z reference explaining the motivations, architectural mechanics, scientific design, and empirical findings of TranspileLens.
      </p>

      <div className="pill-group">
        {topics.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pill-btn ${activeTab === t.id ? 'active' : ''}`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="c guide-prose" style={{ padding: 24 }}>
        {activeTab === 'problem' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>1. The Problem Statement</h2>
            <p>
              Quantum circuit compilers (transpilers) transform high-level algorithmic quantum circuits into hardware-compliant equivalents ready for execution on physical Quantum Processing Units (QPUs). During this multi-pass process, compilers apply basis synthesis, gate commutation, redundant cancellation, qubit routing, and measurement mapping.
            </p>
            <p>
              While formal equivalence checking (such as Decision-Diagram or ZX-calculus based checkers like MQT QCEC) can verify <strong>semantic preservation</strong> (i.e. whether unitary equivalence holds), they operate as black-box verifiers. They answer <em>whether</em> the circuit preserves its mathematical function, but provide <strong>zero explanation</strong> for <em>how</em> or <em>why</em> structural resources changed.
            </p>
            <div className="callout info">
              <b>The Specific Gap:</b> TranspileLens is built to bridge the diagnostic gap between formal semantic verification and physical structural observability. Existing tools verify equivalence or output flat resource counts; TranspileLens combines both to produce an interpretable, deterministic profile of the transformation.
            </div>
            <h3>What Changes During Quantum Circuit Compilation?</h3>
            <ul>
              <li><strong>Gate Sequences:</strong> Single-qubit gates are synthesized into hardware native bases (e.g. Clifford+T, IBM Echoed Cross-Resonance basis).</li>
              <li><strong>Circuit Depth:</strong> Parallelization or sequentialization changes the critical path length.</li>
              <li><strong>Connectivity &amp; Routing:</strong> SWAP gates or ancilla detours are inserted to map non-local two-qubit interactions onto constrained physical coupling topologies.</li>
              <li><strong>Measurement Interfaces:</strong> Qubit-to-classical-bit mappings can be shifted or reordered, potentially compromising measurement semantics.</li>
            </ul>
          </div>
        )}

        {activeTab === 'why' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>2. Why We Built TranspileLens</h2>
            <p>
              Developers and researchers inspecting quantum transformations currently rely on two flawed extremes:
            </p>
            <ul>
              <li>
                <strong>Raw QASM Text Diffs:</strong> Comparing OpenQASM strings line-by-line is extremely brittle. Harmless register renaming, gate commutation (e.g. exchanging commuting Z and CX gates), or compiler phase shifts produce dozens of line diffs that drown out actual architectural changes.
              </li>
              <li>
                <strong>Scalar Resource Diffs:</strong> Tracking total gate counts alone fails to confirm mathematical correctness. An optimized circuit with fewer gates may contain a catastrophic logical error, while a routed circuit with inflated gates may be completely valid.
              </li>
            </ul>
            <p>
              TranspileLens was conceived to synthesize these isolated signals into a coherent, deterministic evidence profile. By combining formal decision-diagram equivalence verification with topological coupling graph analysis, Jensen-Shannon gate distribution divergence, and classical interface checks, TranspileLens reports actionable evidence without relying on speculative assumptions about compiler intent.
            </p>
            <div className="callout ok">
              <b>Core Philosophy:</b> "Report evidence, not intent." TranspileLens documents observed topological mutations (e.g. SWAP insertion and graph densification) rather than asserting that a specific named pass executed.
            </div>
          </div>
        )}

        {activeTab === 'what' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>3. What TranspileLens Does</h2>
            <p>
              TranspileLens is an interpretable profiling framework for quantum circuit transformations. Given a <strong>Reference Circuit</strong> and a <strong>Candidate Transformation</strong>, it executes four synchronized profiling tasks:
            </p>
            <ol style={{ paddingLeft: 20, color: 'var(--tx2)' }}>
              <li>
                <strong>Formal Semantic Verification:</strong> Uses MQT QCEC to verify unitary equivalence or detect functional divergence (Equivalent, Not Equivalent, or Inconclusive).
              </li>
              <li>
                <strong>Multi-Dimensional Structural Profiling:</strong> Measures signed resource deltas (depth, operations, two-qubit gates), extracts 2-qubit interaction graphs, and computes gate vocabulary divergence.
              </li>
              <li>
                <strong>Classical Interface Validation:</strong> Verifies that classical register bit widths match and physical-to-classical measurement mappings are preserved.
              </li>
              <li>
                <strong>Deterministic Heuristic Categorization:</strong> Evaluates a strictly ordered 8-tier rule engine to assign an interpretable classification explaining the observed structural changes.
              </li>
            </ol>
            <div className="callout">
              <b>Deterministic Guarantee:</b> Identical input circuits produce identical DeltaProfiles and categorizations every time. There is no stochastic estimation or generative AI guessing in the core engine.
            </div>
          </div>
        )}

        {activeTab === 'arch' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>4. System Architecture</h2>
            <p>
              The system consists of a Python-based profiling engine and a static React + Vite research observatory. The complete pipeline is visualized below:
            </p>
            <div style={{ background: 'var(--canvas)', border: '1px solid var(--bd)', padding: 16, margin: '16px 0', fontFamily: 'IBM Plex Mono', fontSize: 12, lineHeight: 1.6 }}>
              [Reference Circuit] &amp; [Candidate Circuit]<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├───&gt; Stream A: Semantic Verifier (MQT QCEC) ──&gt; Equivalent / Not Equivalent / Inconclusive<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───&gt; Stream B: Structural Profilers ────────────&gt; Depth Δ, Ops Δ, 2Q Δ, Graphs, JS Div, Interfaces<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[DeltaProfile Contract] (Validated Pydantic JSON Schema)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Deterministic Rule Engine] (8-Tier Priority Categorizer)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Structured JSON Report] (results.json)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[React Observatory Dashboard] (Web UI)
            </div>
            <p>
              Pass-level compiler provenance (Baseline B2) remains fundamentally unsupported post-hoc without deep compiler callback hooks; TranspileLens explicitly flags this in its telemetry.
            </p>
          </div>
        )}

        {activeTab === 'method' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>5. Methodology &amp; Profiling Metrics</h2>
            <p>TranspileLens calculates metrics using consistent mathematical formulas:</p>
            <h3>Signed Delta Convention</h3>
            <p>All resource changes are strictly computed as:</p>
            <div style={{ background: 'var(--canvas)', padding: '10px 14px', borderLeft: '3px solid var(--blue)', fontFamily: 'IBM Plex Mono', fontSize: 13, margin: '8px 0 14px' }}>
              Δ = Quantity(Candidate) − Quantity(Reference)
            </div>
            <ul>
              <li><strong>Negative Δ:</strong> The quantity decreased (e.g. depth reduction during gate cancellation).</li>
              <li><strong>Positive Δ:</strong> The quantity increased (e.g. SWAP gate overhead during routing).</li>
              <li><strong>Zero Δ:</strong> The quantity remained unchanged.</li>
            </ul>

            <h3>Interaction Graph Mutations</h3>
            <p>
              Circuits are modeled as undirected coupling graphs G = (V, E), where vertices V represent physical qubits and edges E represent two-qubit gates (e.g. CX, CZ, SWAP) acting between them. TranspileLens computes edge deltas:
            </p>
            <div style={{ background: 'var(--canvas)', padding: '10px 14px', borderLeft: '3px solid var(--blue)', fontFamily: 'IBM Plex Mono', fontSize: 13, margin: '8px 0 14px' }}>
              E_added = E_cand \ E_ref &nbsp;&nbsp;|&nbsp;&nbsp; E_removed = E_ref \ E_cand
            </div>

            <h3>Gate Distribution Divergence</h3>
            <p>
              To detect basis synthesis shifts, gate usage is normalized into probability distributions P and Q over the union of all gate types. TranspileLens calculates the symmetric Jensen-Shannon divergence:
            </p>
            <div style={{ background: 'var(--canvas)', padding: '10px 14px', borderLeft: '3px solid var(--blue)', fontFamily: 'IBM Plex Mono', fontSize: 13, margin: '8px 0 14px' }}>
              D_JS(P ∥ Q) = 1/2 · D_KL(P ∥ M) + 1/2 · D_KL(Q ∥ M), &nbsp;&nbsp;where M = 1/2 · (P + Q)
            </div>
          </div>
        )}

        {activeTab === 'stack' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>6. Verified Technology Stack</h2>
            <p>Every technology listed below is verified active in the repository working tree:</p>
            <div className="ov">
              <table className="tb">
                <thead>
                  <tr>
                    <th>Layer</th>
                    <th>Technology</th>
                    <th>Verified Version</th>
                    <th>Role in Platform</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Runtime</td>
                    <td>Python</td>
                    <td>3.14.2 (supports 3.11+)</td>
                    <td>Backend execution and profiling runtime</td>
                  </tr>
                  <tr>
                    <td>Quantum Core</td>
                    <td>Qiskit</td>
                    <td>2.5.2</td>
                    <td>Circuit construction, DAG traversal, transpilation</td>
                  </tr>
                  <tr>
                    <td>Equivalence Checking</td>
                    <td>MQT QCEC</td>
                    <td>3.10.2</td>
                    <td>Formal unitary decision-diagram equivalence verification</td>
                  </tr>
                  <tr>
                    <td>Graph Analysis</td>
                    <td>NetworkX</td>
                    <td>3.7</td>
                    <td>Two-qubit coupling interaction graphs &amp; topology deltas</td>
                  </tr>
                  <tr>
                    <td>Mathematics</td>
                    <td>SciPy &amp; NumPy</td>
                    <td>SciPy 1.18.1 / NumPy 2.5.3</td>
                    <td>Jensen-Shannon distribution divergence and statistical profiling</td>
                  </tr>
                  <tr>
                    <td>Data Contracts</td>
                    <td>Pydantic</td>
                    <td>2.14.0</td>
                    <td>Strict JSON schema definition and profile serialization</td>
                  </tr>
                  <tr>
                    <td>Testing</td>
                    <td>pytest</td>
                    <td>9.1.1</td>
                    <td>35 automated unit and experiment regression tests</td>
                  </tr>
                  <tr>
                    <td>Frontend Framework</td>
                    <td>React + Vite</td>
                    <td>React 19 / Vite 8</td>
                    <td>Static research observatory and results dashboard</td>
                  </tr>
                  <tr>
                    <td>Hosting Target</td>
                    <td>Netlify</td>
                    <td>Static Web Endpoint</td>
                    <td>Static JSON and prebuilt bundle serving</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'experiments' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>7. Experimental Design (E1–E6 and L1–L3)</h2>
            <p>
              The platform evaluates two distinct corpora: an artificial boundary corpus (E1–E6) and a legitimate compiler corpus (L1–L3):
            </p>
            <div className="ov">
              <table className="tb">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Corpus</th>
                    <th>Transformation Description</th>
                    <th>Semantic Expected</th>
                    <th>Semantic Observed</th>
                    <th>Categorizer Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>E1</b></td>
                    <td>Evaluation</td>
                    <td>Basis rewrite: H → Ry(π/2) Z (Z first)</td>
                    <td>equivalent</td>
                    <td><span className="bg ok">EQUIVALENT</span></td>
                    <td>Cat 5 (Equivalent synthesis)</td>
                  </tr>
                  <tr>
                    <td><b>E2</b></td>
                    <td>Evaluation</td>
                    <td>Synthesis optimization: CX-CX cancellation</td>
                    <td>equivalent</td>
                    <td><span className="bg ok">EQUIVALENT</span></td>
                    <td>Cat 5 (Equivalent synthesis)</td>
                  </tr>
                  <tr>
                    <td><b>E3</b></td>
                    <td>Evaluation</td>
                    <td>Nearest-neighbor SWAP routing</td>
                    <td>equivalent</td>
                    <td><span className="bg ok">EQUIVALENT</span></td>
                    <td>Cat 3 (Equivalent routing/layout)</td>
                  </tr>
                  <tr>
                    <td><b>E4</b></td>
                    <td>Evaluation</td>
                    <td>Identity insertion: X → X · X · X</td>
                    <td>equivalent</td>
                    <td><span className="bg ok">EQUIVALENT</span></td>
                    <td>Cat 6 (Resource-only change)</td>
                  </tr>
                  <tr>
                    <td><b>E5</b></td>
                    <td>Evaluation</td>
                    <td>Measurement mapping drift (Negative Control)</td>
                    <td>not_equivalent</td>
                    <td><span className="bg bad">INEQUIVALENT</span></td>
                    <td>Cat 1 (Logical computation change)</td>
                  </tr>
                  <tr>
                    <td><b>E6</b></td>
                    <td>Evaluation</td>
                    <td>Detour routing with auxiliary ancilla allocation</td>
                    <td>equivalent</td>
                    <td><span className="bg ok">EQUIVALENT</span></td>
                    <td>Cat 3 (Equivalent routing/layout)</td>
                  </tr>
                  <tr>
                    <td><b>L1</b></td>
                    <td>Legitimate</td>
                    <td>QFT 3-qubit transpiled at Optimization Level 1</td>
                    <td>equivalent</td>
                    <td><span className="bg ok">EQUIVALENT</span></td>
                    <td>Baseline Record</td>
                  </tr>
                  <tr>
                    <td><b>L2</b></td>
                    <td>Legitimate</td>
                    <td>QFT 3-qubit transpiled at Optimization Level 3</td>
                    <td>equivalent</td>
                    <td><span className="bg ok">EQUIVALENT</span></td>
                    <td>Baseline Record</td>
                  </tr>
                  <tr>
                    <td><b>L3</b></td>
                    <td>Legitimate</td>
                    <td>GHZ 4-qubit transpiled at Optimization Level 3</td>
                    <td>equivalent</td>
                    <td><span className="bg ok">EQUIVALENT</span></td>
                    <td>Baseline Record</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3>Transformation Visualizations</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                <div style={{ background: 'var(--canvas)', border: '1px solid var(--bd)', padding: 12 }}>
                  <b style={{ fontSize: 13 }}>E1: Basis Synthesis Rewrite (H → Ry(π/2) Z)</b>
                  <div style={{ marginTop: 8 }}><CircuitDiagram type="e1" /></div>
                </div>
                <div style={{ background: 'var(--canvas)', border: '1px solid var(--bd)', padding: 12 }}>
                  <b style={{ fontSize: 13 }}>E2: Gate Cancellation (CX · CX → Identity)</b>
                  <div style={{ marginTop: 8 }}><CircuitDiagram type="e2" /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'baselines' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>8. Comparative Baselines (B1–B5)</h2>
            <p>
              TranspileLens benchmarks its diagnostic capabilities against five existing comparison approaches:
            </p>
            <div className="ov">
              <table className="tb">
                <thead>
                  <tr>
                    <th>Baseline</th>
                    <th>Method Name</th>
                    <th>Implementation Status</th>
                    <th>Capabilities &amp; Fundamental Limitations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>B1</b></td>
                    <td>Raw QASM Diff</td>
                    <td><span className="bg ok">Operational</span></td>
                    <td>Line-by-line unified diff. Brittle against harmless register reordering and commuting gate exchanges.</td>
                  </tr>
                  <tr>
                    <td><b>B2</b></td>
                    <td>Compiler Pass Observability</td>
                    <td><span className="bg warn">Unsupported / Limited</span></td>
                    <td>Passive analysis cannot reconstruct compiler callback logs post-hoc without invasive runtime hooks.</td>
                  </tr>
                  <tr>
                    <td><b>B3</b></td>
                    <td>QCEC Only</td>
                    <td><span className="bg ok">Operational</span></td>
                    <td>Proves unitary equivalence with formal rigor, but gives zero structural or resource explanation.</td>
                  </tr>
                  <tr>
                    <td><b>B4</b></td>
                    <td>Resource-Only Comparison</td>
                    <td><span className="bg ok">Operational</span></td>
                    <td>Measures operation and depth deltas, but cannot verify semantic correctness or detect functional bugs.</td>
                  </tr>
                  <tr>
                    <td><b>B5</b></td>
                    <td>TranspileLens Full Profile</td>
                    <td><span className="bg ok">Operational</span></td>
                    <td>Unifies formal equivalence, signed deltas, interaction graphs, and interface validation into an interpretable profile.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'interpretation' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>9. Results Interpretation Guide</h2>
            <p>Follow these scientific guidelines when interpreting TranspileLens output:</p>
            <ul>
              <li>
                <strong>Heuristic Category vs Formal Semantic Result:</strong> The semantic result (Equivalent / Not Equivalent) is a mathematical proof generated by MQT QCEC. The categorization label (e.g. Equivalent routing/layout) is a heuristic explanation generated by deterministic rules. Never present a heuristic category as formal proof of equivalence.
              </li>
              <li>
                <strong>Sign Convention:</strong> Delta = Candidate − Reference. A negative delta indicates resource reduction (e.g. depth decrease); a positive delta indicates resource inflation (e.g. extra SWAP gates). Neither is universally good or bad.
              </li>
              <li>
                <strong>Missing Fields vs Zero:</strong> When a metric was uncollected (such as detailed graph profiler fields for baseline records L1–L3), it is rendered as <code>unavailable</code> / <code>N/A</code>. It is never coerced to 0.000.
              </li>
              <li>
                <strong>Acceptance vs Semantic Equivalence:</strong> Acceptance evaluates whether the experiment matched its hypothesis. Negative control E5 proves inequivalence, which is the expected hypothesis, so E5 passes acceptance testing.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'limitations' && (
          <div>
            <h2 style={{ margin: '0 0 12px', color: 'var(--navy)' }}>10. Limitations &amp; Future Work</h2>
            <p>TranspileLens maintains rigorous scientific honesty regarding its empirical boundaries:</p>
            <div className="callout warn">
              <b>Empirical Boundary:</b> The current evaluation corpus consists of 9 records. While sufficient to validate metamorphic properties and rule precedence, it does not support broad statistical claims regarding compiler accuracy or universal classification performance.
            </div>
            <ul>
              <li>
                <strong>Static Observatory:</strong> The web dashboard is a static results viewer that loads published JSON snapshots. It does not execute live Qiskit transpilation passes or run Python in the browser.
              </li>
              <li>
                <strong>Heuristic Boundary:</strong> TranspileLens cannot prove intent. A transformation classified as routing means SWAP insertion or graph densification was observed; it does not prove which algorithm executed.
              </li>
              <li>
                <strong>Category 7 is NOT Malicious:</strong> Category 7 simply indicates that structural differences exist that are not explained by current heuristics. It is never an indicator of malware or a "quantum Trojan".
              </li>
              <li>
                <strong>Pass Provenance:</strong> Post-hoc analysis cannot universally disentangle multi-pass compiler executions where synthesis and routing occurred simultaneously.
              </li>
            </ul>
            <h3>Future Directions</h3>
            <p>
              Future expansion plans include benchmarking against 50–100 realistic QASM circuits from MQT Bench, implementing configurable QCEC partial equivalence checking for garbage qubits, and instrumenting deep compiler callbacks for verified pass-level provenance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Transformation Categories Deep Dive
function TransformationCategories() {
  const categories = [
    {
      id: '1',
      name: 'Logical computation change',
      color: '#DA1E28',
      desc: 'Triggered when MQT QCEC formally proves that the candidate circuit does not compute the same unitary function as the reference.',
      rule: 'Trigger: sem.status == "not_equivalent"',
      example: 'E5 (Measurement mapping drift)'
    },
    {
      id: '2',
      name: 'Measurement-semantic change',
      color: '#B28600',
      desc: 'Triggered when the unitary passes equivalence, but physical-to-classical measurement mappings differ between circuits.',
      rule: 'Trigger: sem.status == "equivalent" && measurement.mapping_differences_exist',
      example: 'Measurement remapping without state corruption'
    },
    {
      id: '3',
      name: 'Equivalent routing/layout',
      color: '#0F62FE',
      desc: 'Triggered when SWAP gates are detected or interaction coupling graph edges densify to satisfy hardware connectivity constraints.',
      rule: 'Trigger: routing.is_routing_consistent == true',
      example: 'E3 (Nearest-neighbor SWAP), E6 (Detour routing)'
    },
    {
      id: '4',
      name: 'Equivalent optimization',
      color: '#0072C3',
      desc: 'Triggered when total operations strictly decrease (ops_delta < 0) and non-routing gate vocabulary remains unchanged.',
      rule: 'Trigger: ops_delta < 0 && vocab_unchanged',
      example: 'L2 (Redundant phase rotation elimination)'
    },
    {
      id: '5',
      name: 'Equivalent synthesis',
      color: '#8A3FFC',
      desc: 'Triggered when non-routing gate vocabulary changes, indicating basis translation, unitary resynthesis, or decomposition.',
      rule: 'Trigger: non_routing_ref_vocab != non_routing_cand_vocab',
      example: 'E1 (H → Ry(π/2) Z), E2 (CX cancellation)'
    },
    {
      id: '6',
      name: 'Resource-only change',
      color: '#1192E8',
      desc: 'Triggered when operations strictly increase without routing signatures, graph densification, or gate vocabulary changes.',
      rule: 'Trigger: ops_delta > 0 && no routing && no synthesis',
      example: 'E4 (Identity insertion X → X·X·X)'
    },
    {
      id: '7',
      name: 'Semantically equivalent, structurally unexplained transformation',
      color: '#6929C4',
      desc: 'Fallback when measurable structural or topological differences exist, but do not match the current deterministic heuristic rules.',
      rule: 'Trigger: diff_exists && not covered by Rules 3, 4, 5, 6',
      example: 'Non-standard custom compiler mutations'
    },
    {
      id: '8',
      name: 'Unclassified or no measurable delta',
      color: '#526176',
      desc: 'Assigned when no measurable resource, graph, or gate differences exist, or when equivalence checking was inconclusive.',
      rule: 'Trigger: !diff_exists || sem.status != "equivalent"',
      example: 'Identical circuits or QCEC timeouts'
    }
  ];

  return (
    <div>
      <h1>Deterministic Transformation Categories</h1>
      <p className="sub">
        TranspileLens organizes structural interpretations into 8 strictly prioritized tiers. Categorization is a deterministic heuristic classification based on measured evidence, not proof of compiler intent.
      </p>

      <div className="callout info" style={{ marginBottom: 20 }}>
        <b>Crucial Scientific Distinction regarding Category 7:</b> Category 7 is an honest admission of heuristic limits. It means that the observed structural transformation is mathematically equivalent, but cannot be classified by the existing routing, synthesis, or optimization heuristics. It is <strong>NOT</strong> an indicator of malice, suspicious intent, or a "quantum Trojan".
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {categories.map(c => (
          <div key={c.id} className="cat-card" style={{ borderLeft: `4px solid ${c.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="cat-num">CATEGORY {c.id}</span>
              <span style={{ fontSize: 11, color: 'var(--tx2)' }}>{c.example}</span>
            </div>
            <h3 style={{ margin: '8px 0 6px', fontSize: 14.5, color: 'var(--navy)' }}>{c.name}</h3>
            <p style={{ fontSize: 12.5, color: 'var(--tx2)', margin: '0 0 10px', lineHeight: 1.5 }}>
              {c.desc}
            </p>
            <div style={{ background: 'var(--canvas)', padding: '6px 8px', borderRadius: 2, fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--tx)' }}>
              {c.rule}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Overview View
function Overview({ list, stats, sel, setSel, go, data }) {
  const K = (ic, t, v, d, b, bt) => (
    <div className="c" key={t}>
      <div className="kh">{ic}{t}<span className={`bg ${b}`}>{bt}</span></div>
      <div className="big">{v}</div>
      <div className="mut">{d}</div>
    </div>
  );

  const timestampStr = data?.metadata?.timestamp
    ? new Date(data.metadata.timestamp * 1000).toLocaleString()
    : 'Timestamp unavailable';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>Observatory Overview</h1>
          <p className="sub" style={{ margin: '4px 0 0' }}>
            Evidence-first profiling of quantum circuit transformations. We report what was measured, not why it changed.
          </p>
        </div>
        <div
          style={{ background: 'var(--card)', border: '1px solid var(--bd)', padding: '6px 12px', fontSize: 12, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 8 }}
          title="These results were generated by the TranspileLens experiment runner. Refresh Snapshot reloads the published results snapshot; it does not execute new quantum profiling experiments."
        >
          <span className="dot" style={{ background: 'var(--blue)' }}></span>
          <span><b>RESULTS SNAPSHOT:</b> {timestampStr}</span>
          <span style={{ cursor: 'help', color: 'var(--blue)', fontWeight: 600 }}>ⓘ</span>
        </div>
      </div>

      <div className="g k3">
        {K('✓', 'Equivalent', stats.eq, `of ${stats.total} corpus records proven equivalent`, 'ok', 'QCEC')}
        {K('!', 'Not equivalent', stats.neq, `Logical deviations detected (${stats.neq} intentional negative control)`, 'bad', 'QCEC')}
        {K('?', 'Inconclusive', stats.inc, 'Unresolved equivalence checks (none)', 'warn', 'QCEC')}
      </div>

      <div className="g r2">
        <div className="c">
          <h3>
            Resource deltas by experiment <span className="un" style={{ display: sel ? 'none' : 'inline' }}>select an experiment</span>
          </h3>
          <Wide list={list} sel={sel} setSel={setSel} />
          <p className="note">
            Candidate minus reference. Negative delta indicates resource reduction (optimization); positive indicates overhead (routing/identity). Missing fields are strictly rendered as unavailable.
          </p>
        </div>
        <Detail list={list} sel={sel} />
      </div>

      <div className="g r2" style={{ marginBottom: 16 }}>
        <div className="c">
          <h3>Structural evidence profile</h3>
          <StructuralChart list={list} sel={sel} setSel={setSel} />
        </div>
        <div className="c">
          <h3>Semantic outcomes breakdown</h3>
          <Donut list={list} />
        </div>
      </div>

      <div className="c">
        <h3>
          Experiment corpus records{' '}
          <a href="#" onClick={e => { e.preventDefault(); go('Experiment Explorer'); }} style={{ fontSize: 13, color: 'var(--blue)' }}>
            Open full explorer →
          </a>
        </h3>
        <Records list={list} sel={sel} setSel={setSel} full={false} />
      </div>
    </div>
  );
}

// Experiment Explorer View
function Explorer({ list, sel, setSel }) {
  return (
    <div>
      <h1>Experiment Explorer</h1>
      <p className="sub">
        Examine individual experiments. The formal MQT QCEC semantic result and the heuristic categorization label are always presented separately.
      </p>
      <div className="g" style={{ gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)' }}>
        <div className="c">
          <Records list={list} sel={sel} setSel={setSel} full={true} />
          <p className="note" style={{ marginTop: 12 }}>
            Evaluation corpus (E1–E6) contains targeted metamorphic cases; Legitimate baselines (L1–L3) model standard compiler passes.
          </p>
        </div>
        <Detail list={list} sel={sel} />
      </div>
    </div>
  );
}

// Tabular View Helper
function TableView({ title, note, cols, rows }) {
  return (
    <div>
      <h1>{title}</h1>
      <p className="sub">{note}</p>
      <div className="c ov">
        <table className="tb">
          <thead>
            <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ cursor: 'default' }}>
                {r.map((c, j) => <td key={j}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Methodology & Baselines View
function Method() {
  const pipeline = [
    { title: 'Reference Circuit', desc: 'Input Qiskit QuantumCircuit representation defining the baseline quantum algorithm.' },
    { title: 'Candidate Transformation', desc: 'Transpiled or compiled quantum circuit with optimizations, synthesis, or routing applied.' },
    { title: 'Semantic Check (QCEC)', desc: 'Rigorous decision diagram equivalence verification via MQT QCEC (equivalent, not_equivalent, inconclusive).' },
    { title: 'Resource & Structural Profiling', desc: 'Measures signed resource deltas (depth, total ops, 2-qubit ops), graph topology mutations, and JS divergence.' },
    { title: 'Interface-Integrity Checks', desc: 'Validates classical register widths and physical-to-classical measurement mappings, distinguishing missing evidence.' },
    { title: 'Deterministic Categorisation', desc: 'Applies transparent priority rules to map evidence into Category 1–8 (heuristic classification, not intent proof).' }
  ];

  const meanings = [
    { title: 'Semantic Status', desc: 'Reports configured equivalence verification result (Equivalent, Not Equivalent, or Inconclusive) from MQT QCEC.' },
    { title: 'Resource Evidence', desc: 'Shows true signed deltas (candidate minus reference) for depth, gate counts, and two-qubit operations.' },
    { title: 'Structural Evidence', desc: 'Captures interaction graph mutations (added/removed edges) and Jensen-Shannon basis distribution shifts.' },
    { title: 'Interface Checks', desc: 'Verifies register widths and measurement mappings, explicitly flagging unmeasured circuits as MISSING.' },
    { title: 'Categorisation', desc: 'Deterministic rule-based interpretation. Classifies transformations by evidence; not proof of compiler intent.' },
    { title: 'Limitations', desc: 'Static snapshot; does not run Python. Evaluation corpus is small. Baselines lack detailed profile fields. Pass telemetry is limited.' }
  ];

  const baselines = [
    { id: 'B1', name: 'QASM / String Diff', status: 'Operational', desc: 'Syntactic text line diff between unrolled OpenQASM representations. Fails on commuting gates and reordering.' },
    { id: 'B2', name: 'Pass Observability', status: 'Unsupported / Limited', desc: 'Compiler pass hooks are not universally captured post-hoc without deep, invasive compiler callback instrumentation.' },
    { id: 'B3', name: 'QCEC Semantic Only', status: 'Operational', desc: 'Proves mathematical equivalence with formal rigor without providing structural or resource explanations.' },
    { id: 'B4', name: 'Resource Only Baseline', status: 'Operational', desc: 'Measures operation counts and depth deltas without verifying semantic equivalence or topological mutations.' },
    { id: 'B5', name: 'TranspileLens Full Profile', status: 'Operational', desc: 'Unified semantic proofs, signed resource deltas, structural mutations, and interface integrity validation.' }
  ];

  return (
    <div>
      <h1>Methodology &amp; Baseline Framework</h1>
      <p className="sub">
        Deterministic, evidence-based profiling: identical inputs produce identical profiles and verified outcomes.
      </p>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>Verification Pipeline</h3>
        <div className="pipe">
          {pipeline.map((p, i) => (
            <div key={p.title} className={i === 2 || i === 5 ? 'k' : ''}>
              <b>{i + 1}. {p.title}</b>
              <div style={{ fontSize: 11.5, marginTop: 4, color: 'var(--tx2)' }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>What The Results Mean</h3>
        <div className="g" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {meanings.map(m => (
            <div className="c" key={m.title} style={{ padding: 14, borderTop: '3px solid var(--blue)' }}>
              <b>{m.title}</b>
              <p className="mut" style={{ margin: '6px 0 0', lineHeight: 1.45 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>Comparative Baselines (B1–B5)</h3>
        <div className="c ov" style={{ padding: 0 }}>
          <table className="tb">
            <thead>
              <tr>
                {['Baseline', 'Name', 'Status', 'Description'].map(t => <th key={t}>{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {baselines.map(b => (
                <tr key={b.id} style={{ cursor: 'default' }}>
                  <td><b>{b.id}</b></td>
                  <td>{b.name}</td>
                  <td>
                    <span className={`bg ${b.status === 'Operational' ? 'ok' : 'warn'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--tx2)' }}>{b.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Main Application Component
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [v, setV] = useState('Overview');
  const [sel, setSel] = useState('E1');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResults = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`results.json?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(isRefresh ? `Failed to refresh: ${err.message}` : err.message);
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    // Initial data fetch
    let active = true;
    fetch(`results.json?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        if (active) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, []);

  const normalizedData = useMemo(() => {
    if (!data) return [];

    const experiments = (data.experiments || []).map(e => ({
      id: e.case_id,
      isLegit: false,
      acceptance: e.acceptance || 'PASS',
      expected_status: e.expected_status || 'equivalent',
      category_id: e.category,
      s: e.profile?.semantic?.status === 'equivalent' ? 'ok' : e.profile?.semantic?.status === 'not_equivalent' ? 'ne' : 'inc',
      cat: e.profile?.interpretation?.category_name,
      evidence: e.profile?.interpretation?.evidence,
      d: e.profile?.resources?.deltas?.depth?.delta ?? null,
      o: e.profile?.resources?.deltas?.total_ops?.delta ?? null,
      d2q: e.profile?.resources?.deltas?.two_qubit_ops?.delta ?? null,
      gd: e.profile?.gate_distribution?.js_divergence ?? null,
      added_edges: e.profile?.interaction_graph?.added_edges ?? [],
      removed_edges: e.profile?.interaction_graph?.removed_edges ?? [],
      rg: e.profile?.routing?.is_routing_consistent ? 'Routing Heuristic Detected' : 'No Topology Routing Detected',
      interface_checks: e.profile?.interface_validation?.checks || []
    }));

    const legitimate = (data.legitimate || []).map(l => {
      const st = l.baselines?.B3?.semantic_status;
      return {
        id: l.case_id,
        isLegit: true,
        acceptance: 'PASS',
        expected_status: 'equivalent',
        category_id: 'baseline',
        s: st === 'equivalent' ? 'ok' : st === 'not_equivalent' ? 'ne' : 'inc',
        cat: 'Baseline Execution',
        evidence: 'Baseline metrics only (B1–B5). Detailed structural profiler fields uncollected.',
        d: null,
        o: l.baselines?.B4?.ops_delta ?? null,
        d2q: null,
        gd: null,
        added_edges: [],
        removed_edges: [],
        rg: null,
        interface_checks: []
      };
    });

    const all = [...experiments, ...legitimate];

    if (!searchTerm.trim()) return all;

    const term = searchTerm.toLowerCase();
    return all.filter(e => {
      const groupStr = e.isLegit ? 'legitimate baseline' : 'evaluation';
      const statusStr = e.s === 'ok' ? 'equivalent' : e.s === 'ne' ? 'inequivalent' : 'inconclusive';
      return (
        e.id.toLowerCase().includes(term) ||
        (e.cat && e.cat.toLowerCase().includes(term)) ||
        groupStr.includes(term) ||
        statusStr.includes(term)
      );
    });
  }, [data, searchTerm]);

  const stats = useMemo(() => {
    if (!data) return { total: 0, eq: 0, neq: 0, inc: 0 };
    const allLength = (data.experiments?.length || 0) + (data.legitimate?.length || 0);
    const combined = [...(data.experiments || []), ...(data.legitimate || [])];
    let eq = 0, neq = 0, inc = 0;

    combined.forEach(e => {
      const s = e.profile ? e.profile.semantic?.status : e.baselines?.B3?.semantic_status;
      if (s === 'equivalent') eq++;
      else if (s === 'not_equivalent') neq++;
      else if (s === 'inconclusive') inc++;
    });

    return { total: allLength, eq, neq, inc };
  }, [data]);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'IBM Plex Sans, sans-serif' }}>
        <h2>Loading TranspileLens Research Observatory...</h2>
        <p style={{ color: 'var(--tx2)' }}>Reading verified results snapshot...</p>
      </div>
    );
  }

  if (!data && error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'red' }}>
        <h2>Error Loading Observatory Snapshot</h2>
        <p>{error}</p>
        <button className="btn-app" onClick={() => fetchResults(false)}>Retry Fetch</button>
      </div>
    );
  }

  const timestampStr = data?.metadata?.timestamp
    ? new Date(data.metadata.timestamp * 1000).toLocaleString()
    : 'Timestamp unavailable';

  const view = {
    'Overview': <Overview list={normalizedData} stats={stats} sel={sel} setSel={setSel} go={setV} data={data} />,
    'Project Guide': <ProjectGuide />,
    'Architecture & Pipeline': <ArchitecturePipeline />,
    'Experiment Explorer': <Explorer list={normalizedData} sel={sel} setSel={setSel} />,
    'Resource Analysis': (
      <div>
        <h1>Resource Analysis</h1>
        <p className="sub">
          Candidate minus reference (Δ = Candidate − Reference). Negative delta indicates resource reduction (optimization); positive indicates overhead (routing/identity). Missing fields are strictly rendered as unavailable.
        </p>
        <div className="c" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px' }}>Interactive Signed Resource Deltas Chart</h3>
          <Wide list={normalizedData} sel={sel} setSel={setSel} />
        </div>
        <TableView
          title="Resource Metrics Table"
          note="Signed metrics for all records. Notice legitimate baselines L1–L3 preserve N/A where full profiler metrics were uncollected."
          cols={['ID', 'Corpus Group', 'Depth Δ', 'Operations Δ', 'Two-qubit Δ']}
          rows={normalizedData.map(e => [
            e.id,
            e.isLegit ? 'Legitimate Baseline' : 'Evaluation Corpus',
            fmt(e.d),
            fmt(e.o),
            fmt(e.d2q)
          ])}
        />
      </div>
    ),
    'Structural Analysis': (
      <div>
        <h1>Structural Analysis</h1>
        <p className="sub">
          Fields are extracted purely from the verified profile schema. Structural mutations provide empirical evidence; they do not prove routing by themselves, nor do they prove malicious intent.
        </p>
        <div className="c" style={{ marginBottom: 16 }}>
          <h3>Structural mutation signatures (E1–E6)</h3>
          <StructuralChart list={normalizedData} sel={sel} setSel={setSel} />
        </div>
        <TableView
          title="Structural Evidence Details"
          note="Candidate minus reference. Missing fields are strictly rendered as unavailable."
          cols={['ID', 'Gate-distribution divergence', 'Routing-heuristic output', 'Added Edges Δ', 'Removed Edges Δ']}
          rows={normalizedData.map(e => [
            e.id,
            e.gd !== null && e.gd !== undefined ? String(e.gd.toFixed(4)) : fmt(null),
            e.rg || fmt(null),
            e.isLegit ? fmt(null) : String(e.added_edges?.length || 0),
            e.isLegit ? fmt(null) : String(e.removed_edges?.length || 0)
          ])}
        />
      </div>
    ),
    'Transformation Categories': <TransformationCategories />,
    'Methodology & Baselines': <Method />
  }[v];

  return (
    <>
      <Hero stats={stats} list={normalizedData} navigateTo={setV} />
      <div className="app" id="observatory">
        <header className="top">
          <div className="top-left">
            <div className="brand" style={{ cursor: 'pointer' }} onClick={() => setV('Overview')}>
              <svg width={22} height={22} viewBox="0 0 28 28" fill="none" stroke="#0F62FE" strokeWidth={2} aria-hidden="true">
                <circle cx={14} cy={14} r={9} /><path d="M2 14h24M14 5v18" />
              </svg>
              TranspileLens
            </div>
            <input
              className="search"
              aria-label="Search experiments"
              placeholder="Search by ID, category, or status..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="top-right">
            {error && <span style={{ color: 'var(--bad)', fontSize: 12 }}>{error}</span>}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
              title="These results were generated by the TranspileLens experiment runner. Refresh Snapshot reloads the published results snapshot; it does not execute new quantum profiling experiments."
            >
              <span className="bg hv" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>RESULTS SNAPSHOT</span>
              <span style={{ color: refreshing ? 'var(--blue)' : 'var(--tx2)' }}>
                {timestampStr}
              </span>
              <span style={{ cursor: 'help', color: 'var(--blue)', fontWeight: 600 }}>ⓘ</span>
            </div>
            <button className="btn-app" onClick={() => fetchResults(true)} disabled={refreshing}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh Snapshot'}
            </button>
          </div>
        </header>
        <nav className="side" aria-label="Sections">
          {NAV.map(n => (
            <button key={n} aria-current={n === v ? 'page' : undefined} onClick={() => setV(n)}>
              {n}
            </button>
          ))}
          <small>
            <b>TranspileLens</b><br />
            Aryan Chavan &amp; Ananya Kulkarni<br />
            Evidence, not intent
          </small>
        </nav>
        <main>
          {normalizedData.length === 0 && searchTerm ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--tx2)' }}>
              <h3>No matching experiments found</h3>
              <p>Try adjusting your search criteria.</p>
              <button className="btn-app" style={{ marginTop: '16px' }} onClick={() => setSearchTerm('')}>
                Clear search
              </button>
            </div>
          ) : view}
        </main>
      </div>
    </>
  );
}
