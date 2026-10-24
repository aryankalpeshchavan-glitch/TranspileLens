import React, { useState, useEffect, useMemo, useRef } from 'react';

const NAV = ['Overview', 'Experiment Explorer', 'Resource Analysis', 'Structural Analysis', 'Methodology', 'Project Guide'];

const badge = e => <span className={`bg ${e.s === 'ok' ? 'ok' : e.s === 'ne' ? 'bad' : 'warn'}`}>{e.s === 'ok' ? 'EQUIVALENT' : e.s === 'ne' ? 'INEQUIVALENT' : 'INCONCLUSIVE'}</span>;
const fmt = v => (v === null || v === undefined) ? <span className="un">unavailable</span> : (v > 0 ? '+' + v : String(v));

// Prototype preview for Hero
function Preview({ stats }) {
  const steps = [
    { title: 'Reference circuit', detail: 'The baseline computation' },
    { title: 'Candidate circuit', detail: 'The transformed version' },
    { title: 'QCEC semantic check', detail: 'Equivalent / not equivalent / inconclusive' },
    { title: 'Delta profile', detail: 'Resources, topology and interface evidence' },
    { title: 'Rule-based interpretation', detail: 'Deterministic category from measured evidence' },
    { title: 'JSON + dashboard', detail: 'Inspectable, timestamped result snapshot' }
  ];

  return (
    <div className="pv" aria-label="Illustrative TranspileLens analysis pipeline">
      <div className="pvt">
        <i></i><i></i><i></i>
        <b>TranspileLens · Analysis Pipeline</b>
        <span className="pv-label">ILLUSTRATIVE</span>
      </div>
      <div className="pv-flow">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className="pv-step">
              <span className="pv-stepnum">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <b>{step.title}</b>
                <small>{step.detail}</small>
              </div>
            </div>
            {index < steps.length - 1 && <div className="pv-down" aria-hidden="true">↓</div>}
          </React.Fragment>
        ))}
      </div>
      <div className="pv-foot">
        <div className="pv-counts">
          <div><b>{stats.eq}</b><span>QCEC equivalent</span></div>
          <div><b>{stats.neq}</b><span>Not equivalent</span></div>
          <div><b>{stats.inc}</b><span>Inconclusive</span></div>
        </div>
        <p>Counts come from the loaded results snapshot. The website does not run new quantum compilations.</p>
      </div>
    </div>
  );
}

function Hero({ stats, navigateTo }) {
  const go = v => e => {
    e.preventDefault();
    navigateTo(v);
    document.getElementById('observatory').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const S = (n, l, c) => (
    <div key={l} className="hs" style={{'--c': c}}>
      <b style={{color: c}}>{n}</b>
      <span>{l}</span>
    </div>
  );
  return (
    <section className="hero">
      <div className="hwrap">
        <div className="hnav">
          <a href="#" style={{display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 17, color: '#fff', textDecoration: 'none'}}>
            <svg width={26} height={26} viewBox="0 0 28 28" fill="none" stroke="#fff" strokeWidth={2} aria-hidden="true">
              <circle cx={14} cy={14} r={9}/><path d="M2 14h24M14 5v18"/>
            </svg>
            TranspileLens
          </a>
          <nav>
            {[['Overview', 'Overview'], ['Experiments', 'Experiment Explorer'], ['Resources', 'Resource Analysis'], ['Structure', 'Structural Analysis'], ['Methodology', 'Methodology'], ['Project Guide', 'Project Guide']].map(([t, v]) => (
              <a key={t} href="#observatory" onClick={go(v)}>{t}</a>
            ))}
          </nav>
          <a className="hbn p" style={{height: 40}} href="#observatory" onClick={go('Overview')}>Open observatory</a>
        </div>
        <div className="hgrid">
          <div>
            <p className="eb">Quantum transformation intelligence</p>
            <h1 className="hh">See What Changes When Quantum Circuits Transform.</h1>
            <p className="hp">Understand quantum circuit transformations through semantic verification, resource analysis and interpretable structural evidence.</p>
            <div className="hcta">
              <a className="hbn p" href="#observatory" onClick={go('Overview')}>Explore the Observatory <span className="arrow" aria-hidden="true">→</span></a>
              <a className="hbn s" href="#observatory" onClick={go('Methodology')}>Discover the Methodology</a>
            </div>
            <p className="hq">Report evidence, not intent.</p>
          </div>
          <div className="herov"><Preview stats={stats} /></div>
        </div>
        <div className="hstats">
          {S(stats.total, 'experiments analysed', '#10172A')}
          {S(stats.eq, 'QCEC equivalent', '#198038')}
          {S(stats.neq, 'not equivalent', '#DA1E28')}
          {S(stats.inc, 'inconclusive', '#B28600')}
        </div>
      </div>
    </section>
  );
}

function Wide({ list, sel, setSel }) {
  const [metric, setMetric] = useState('depth'); // 'depth', 'ops', 'twoQubit'
  const base = 120;

  const getVal = e => {
    if (metric === 'depth') return e.d;
    if (metric === 'ops') return e.o;
    if (metric === 'twoQubit') return e.d2q;
    return null;
  };

  const metricLabel = metric === 'depth' ? 'Circuit Depth Δ' : metric === 'ops' ? 'Total Operations Δ' : 'Two-Qubit Operations Δ';
  const evalList = list.filter(x => !x.isLegit);
  const availableValues = evalList.map(getVal).filter(v => typeof v === 'number' && Number.isFinite(v));
  const maxAbs = Math.max(4, Math.ceil(Math.max(0, ...availableValues.map(Math.abs)) / 2) * 2);
  const sc = 76 / maxAbs;
  const ticks = [-maxAbs, -maxAbs / 2, 0, maxAbs / 2, maxAbs];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8}}>
        <div style={{display: 'flex', gap: 6}}>
          {[
            ['depth', 'Depth Δ'],
            ['ops', 'Total Ops Δ'],
            ['twoQubit', '2-Qubit Ops Δ']
          ].map(([m, lbl]) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              style={{
                fontSize: 12, padding: '4px 10px', cursor: 'pointer', border: '1px solid var(--bd)',
                background: metric === m ? 'var(--blue)' : 'var(--card)',
                color: metric === m ? '#fff' : 'var(--tx)',
                fontWeight: metric === m ? 600 : 400,
                borderRadius: 2
              }}
            >
              {lbl}
            </button>
          ))}
        </div>
        <div style={{fontSize: 12, color: 'var(--tx2)'}}>
          Candidate minus Reference (Signed Δ)
        </div>
      </div>
      <svg viewBox="0 0 640 240" style={{width: '100%', height: 'auto'}} role="img" aria-label={`Resource deltas: ${metricLabel}`}>
        {ticks.map(v => (
          <g key={v}>
            <line x1={40} x2={630} y1={base - v*sc} y2={base - v*sc} stroke="var(--bd)" strokeDasharray={v ? '3 3' : undefined} />
            <text x={34} y={base - v*sc + 4} fontSize={10} textAnchor="end" fill="var(--tx2)">{v > 0 ? '+' + v : String(v)}</text>
          </g>
        ))}
        {evalList.map((e, i) => {
          const x = 55 + i * 96, on = e.id === sel;
          const v = getVal(e);
          const isAvail = v !== null && v !== undefined;
          const barColor = v > 0 ? '#0F62FE' : '#36C5F0';
          return (
            <g key={e.id} tabIndex={0} role="button" aria-label={`${e.id}: ${isAvail ? v : 'unavailable'}`} style={{cursor: 'pointer'}} onClick={() => setSel(e.id)} onKeyDown={k => { if(k.key==='Enter') setSel(e.id); }}>
              <rect x={x-8} y={8} width={80} height={224} fill={on ? 'var(--pale)' : 'transparent'} />
              {!isAvail ? (
                <text x={x+32} y={base-6} fontSize={10} textAnchor="middle" fill="var(--tx2)">N/A</text>
              ) : v === 0 ? (
                <g>
                  <circle cx={x+32} cy={base} r={3} fill="var(--tx2)" />
                  <text x={x+32} y={base-10} fontSize={10} textAnchor="middle" fill="var(--tx2)">0</text>
                </g>
              ) : (
                <g>
                  <rect
                    x={x+16}
                    y={v > 0 ? base - v*sc : base}
                    width={32}
                    height={Math.abs(v)*sc}
                    fill={on ? barColor : (v > 0 ? '#78A9FF' : '#A6C8FF')}
                  />
                  <text
                    x={x+32}
                    y={v > 0 ? base - v*sc - 6 : base - v*sc + 12}
                    fontSize={10}
                    textAnchor="middle"
                    fontWeight={600}
                    fill="var(--tx)"
                  >
                    {v > 0 ? '+' + v : String(v)}
                  </text>
                </g>
              )}
              <text x={x+32} y={236} fontSize={11} textAnchor="middle" fill={on ? 'var(--blue)' : 'var(--tx)'} fontWeight={on ? 600 : 400} fontFamily="IBM Plex Mono">{e.id}</text>
            </g>
          );
        })}
      </svg>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--tx2)', marginTop: 8}}>
        <div style={{display: 'flex', gap: 16}}>
          <span><span style={{color: '#0F62FE'}}>■</span> Positive delta (Resource inflation)</span>
          <span><span style={{color: '#36C5F0'}}>■</span> Negative delta (Resource reduction)</span>
        </div>
        <span className="mut">Legitimate baselines (L1–L3) preserve N/A (profiler deltas uncollected)</span>
      </div>
    </div>
  );
}

function Donut({ list }) {
  const [subset, setSubset] = useState('ALL'); // 'ALL', 'EVAL', 'LEGIT'

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
      <div style={{display: 'flex', gap: 6, marginBottom: 14}}>
        {[
          ['ALL', `All (${list.length})`],
          ['EVAL', `Evaluation E1–E6 (${list.filter(x => !x.isLegit).length})`],
          ['LEGIT', `Baselines L1–L3 (${list.filter(x => x.isLegit).length})`]
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSubset(key)}
            style={{
              fontSize: 11.5, padding: '3px 8px', cursor: 'pointer', border: '1px solid var(--bd)',
              background: subset === key ? 'var(--blue)' : 'var(--card)',
              color: subset === key ? '#fff' : 'var(--tx)',
              fontWeight: subset === key ? 600 : 400,
              borderRadius: 2
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, alignItems: 'center'}}>
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
              <span className="dot" style={{background: c}}></span>
              <span>{n}</span>
              <b>{v}</b>
              <span className="mut">{counts.total > 0 ? Math.round((v / counts.total) * 100) : 0}%</span>
            </div>
          ))}
        </div>
      </div>
      <p className="note" style={{marginTop: 10, fontSize: 11}}>
        Semantic proofs strictly computed via MQT QCEC. Evaluation corpus separates intentional negative controls (E5) from baseline transpilation.
      </p>
    </div>
  );
}

function Records({ list, sel, setSel, full }) {
  const displayList = full ? list : list.slice(0, 6);
  return (
    <div className="ov">
      <table className="tb">
        <thead>
          <tr>
            {['ID', 'Corpus Group', 'Semantic (QCEC)', 'Acceptance', 'Categorizer Classification'].map(t => <th key={t}>{t}</th>)}
          </tr>
        </thead>
        <tbody>
          {displayList.map(e => (
            <tr key={e.id} data-s={e.id === sel ? 1 : 0} onClick={() => setSel(e.id)}>
              <td><b>{e.id}</b></td>
              <td>
                <span className={`bg ${e.isLegit ? 'warn' : 'hv'}`} style={{fontSize: 10.5}}>
                  {e.isLegit ? 'BASELINE (L1–L3)' : 'EVALUATION (E1–E6)'}
                </span>
              </td>
              <td>{badge(e)}</td>
              <td>
                <span className={`bg ${e.acceptance === 'PASS' ? 'ok' : 'bad'}`}>
                  {e.acceptance ? `${e.acceptance} (exp: ${e.expected_status || 'equiv'})` : 'PASS'}
                </span>
              </td>
              <td>
                <span style={{fontSize: 12.5}}>{e.cat || <span className="un">unavailable</span>}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Detail({ list, sel }) {
  const e = list.find(x => x.id === sel);
  if (!e) return null;
  const isE6 = e.id === 'E6';

  return (
    <div className="c">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
        <h3 style={{margin: 0}}>Selected: {e.id}</h3>
        <span className={`bg ${e.isLegit ? 'warn' : 'hv'}`}>
          {e.isLegit ? 'Legitimate Baseline' : 'Evaluation Corpus'}
        </span>
      </div>

      <div className="mut">Verified by QCEC</div>
      <div style={{margin: '4px 0 12px'}}>{badge(e)}</div>

      <div className="mut">Acceptance vs Expected Status</div>
      <div style={{margin: '4px 0 12px'}}>
        <span className={`bg ${e.acceptance === 'PASS' ? 'ok' : 'bad'}`}>
          {e.acceptance} (Expected: {e.expected_status})
        </span>
      </div>

      <div className="mut">Heuristic category (deterministic rule, not proof)</div>
      <div style={{margin: '4px 0 12px'}}>
        {e.cat ? <span className="bg hv">{e.cat.toUpperCase()}</span> : <span className="un">unavailable</span>}
      </div>

      <div className="mut">Depth Δ / Operations Δ</div>
      <div style={{margin: '4px 0 12px'}}>{fmt(e.d)} / {fmt(e.o)}</div>

      <div className="mut">Two-qubit Δ</div>
      <div style={{margin: '4px 0 12px'}}>{fmt(e.d2q)}</div>

      {e.evidence && (
        <>
          <div className="mut" style={{marginTop: 12}}>Interpretation Evidence</div>
          <div className="note" style={{margin: '4px 0 12px', background: 'var(--canvas)', padding: 8}}>{e.evidence}</div>
        </>
      )}

      {e.interface_checks && e.interface_checks.length > 0 && (
        <>
          <div className="mut" style={{marginTop: 12}}>Interface Validation Evidence</div>
          {e.interface_checks.map((ck, idx) => (
            <div key={idx} className="note" style={{margin: '4px 0', padding: 8, background: 'var(--canvas)', borderLeft: `3px solid ${ck.status === 'pass' ? 'var(--ok)' : ck.status === 'fail' ? 'var(--bad)' : 'var(--warn)'}`}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <b>{ck.check_name}</b>
                <span className={`bg ${ck.status === 'pass' ? 'ok' : ck.status === 'fail' ? 'bad' : 'warn'}`}>
                  {ck.status.toUpperCase()}
                </span>
              </div>
              <div style={{fontSize: 11.5, marginTop: 4}}>{ck.explanation}</div>
            </div>
          ))}
          {isE6 && (
            <div className="note" style={{fontSize: 11, color: 'var(--tx2)', marginTop: 8, fontStyle: 'italic', background: 'var(--pale)', padding: 8}}>
              Note: E6 Register Widths check reports FAIL because candidate allocated 1 ancilla qubit for detour routing. Despite the register width delta, the transformation is proven semantically equivalent under QCEC.
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StructuralChart({ list, sel, setSel }) {
  const evalList = list.filter(x => !x.isLegit);
  return (
    <div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 12}}>
        {evalList.map(e => {
          const on = e.id === sel;
          const jsVal = e.gd !== null && e.gd !== undefined ? e.gd.toFixed(3) : 'N/A';
          const addEd = e.added_edges?.length || 0;
          const remEd = e.removed_edges?.length || 0;
          return (
            <div
              key={e.id}
              tabIndex={0}
              role="button"
              onClick={() => setSel(e.id)}
              onKeyDown={k => { if(k.key==='Enter') setSel(e.id); }}
              style={{
                background: on ? 'var(--pale)' : 'var(--card)',
                border: `1px solid ${on ? 'var(--blue)' : 'var(--bd)'}`,
                padding: '10px 12px',
                cursor: 'pointer',
                borderRadius: 2,
                transition: 'border-color 160ms, background-color 160ms'
              }}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6}}>
                <b style={{fontFamily: 'IBM Plex Mono'}}>{e.id}</b>
                <span className={`bg ${e.rg === 'Routing Heuristic Detected' ? 'hv' : 'warn'}`} style={{fontSize: 10}}>
                  {e.rg === 'Routing Heuristic Detected' ? 'ROUTING SIG' : 'NO ROUTING'}
                </span>
              </div>
              <div style={{fontSize: 11.5, color: 'var(--tx2)', lineHeight: 1.5}}>
                <div><b>JS Div:</b> {jsVal === 'N/A' ? <span className="un">N/A</span> : jsVal}</div>
                <div><b>Edges Δ:</b> +{addEd} / -{remEd}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="note" style={{fontSize: 11, margin: '6px 0 0'}}>
        Structural evidence reports empirical gate-distribution divergence and interaction graph mutations. Topology mutations provide empirical data; they do not prove malicious compiler intent or verify correctness in isolation.
      </p>
    </div>
  );
}

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
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16}}>
        <div>
          <h1 style={{margin: 0}}>Overview</h1>
          <p className="sub" style={{margin: '4px 0 0'}}>Evidence-first profiling of Qiskit circuit transformations. We report what was measured, not why it changed.</p>
        </div>
        <div
          style={{background: 'var(--card)', border: '1px solid var(--bd)', padding: '6px 12px', fontSize: 12, color: 'var(--tx2)', display: 'flex', alignItems: 'center', gap: 8}}
          title="These results were generated by the TranspileLens experiment runner. Refresh Data reloads the published results snapshot; it does not execute new quantum profiling experiments."
        >
          <span className="dot" style={{background: 'var(--blue)'}}></span>
          <span><b>RESULTS SNAPSHOT:</b> {timestampStr}</span>
          <span style={{cursor: 'help', color: 'var(--blue)', fontWeight: 600}}>ⓘ</span>
        </div>
      </div>

      <div className="g k3">
        {K('✓', 'Equivalent', stats.eq, `of ${stats.total} corpus records proven equivalent`, 'ok', 'QCEC')}
        {K('!', 'Not equivalent', stats.neq, `Logical deviations detected (${stats.neq} intentional control)`, 'bad', 'QCEC')}
        {K('?', 'Inconclusive', stats.inc, 'Unresolved equivalence checks', 'warn', 'QCEC')}
      </div>

      <div className="g r2">
        <div className="c">
          <h3>Resource deltas by experiment <span className="un" style={{display: sel ? 'none' : 'inline'}}>select an experiment</span></h3>
          <Wide list={list} sel={sel} setSel={setSel} />
          <p className="note">Candidate minus reference. Negative delta indicates resource reduction (optimization); positive indicates overhead (routing/identity). Missing fields are strictly rendered as unavailable.</p>
        </div>
        <Detail list={list} sel={sel} />
      </div>

      <div className="g r2" style={{marginBottom: 16}}>
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
        <h3>Experiment corpus records <a href="#" onClick={e => { e.preventDefault(); go('Experiment Explorer'); }} style={{fontSize: 13, color: 'var(--blue)'}}>Open full explorer</a></h3>
        <Records list={list} sel={sel} setSel={setSel} full={false} />
      </div>
    </div>
  );
}

function Explorer({ list, sel, setSel }) {
  return (
    <div>
      <h1>Experiment Explorer</h1>
      <p className="sub">Select a record. The verified semantic result and the heuristic categorization label are always shown separately.</p>
      <div className="g" style={{gridTemplateColumns: 'minmax(0,1.8fr) minmax(0,1fr)'}}>
        <div className="c">
          <Records list={list} sel={sel} setSel={setSel} full={true} />
          <p className="note">L1–L3 statuses are sourced securely from their respective comparative baselines.</p>
        </div>
        <Detail list={list} sel={sel} />
      </div>
    </div>
  );
}

function Table({ title, note, cols, rows }) {
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
              <tr key={i} style={{cursor: 'default'}}>
                {r.map((c, j) => <td key={j}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectGuide() {
  const pipeline = [
    { title: 'Reference + candidate', desc: 'Start with a reference circuit and a transformed candidate produced by a rewrite, optimization, synthesis, or routing scenario.' },
    { title: 'Semantic check', desc: 'Ask MQT QCEC whether the circuits are equivalent, not equivalent, or inconclusive under the configured checking conditions.' },
    { title: 'Measure differences', desc: 'Compare available gate counts, depth, two-qubit operations, interaction-graph edges, gate-distribution divergence, and measurement/interface evidence.' },
    { title: 'Build a DeltaProfile', desc: 'Keep semantic outcomes separate from structural observations. Missing or unsupported fields remain unavailable rather than being turned into zero.' },
    { title: 'Apply deterministic rules', desc: 'Map the collected evidence to a heuristic category. The label summarizes evidence; it does not prove which compiler pass ran.' },
    { title: 'Publish a result snapshot', desc: 'Write structured JSON and render that snapshot in the dashboard with experiment details and signed deltas.' }
  ];

  const categories = [
    'Logical computation change',
    'Measurement-semantic change',
    'Equivalent routing/layout',
    'Equivalent optimization',
    'Equivalent synthesis',
    'Resource-only change',
    'Semantically equivalent, structurally unexplained',
    'Unclassified / no measurable delta'
  ];

  return (
    <div className="guide">
      <div className="guide-heading">
        <span className="guide-kicker">PROJECT BRIEF · A TO Z</span>
        <h1>What TranspileLens is—and what it is not</h1>
        <p className="sub">A guided explanation of the problem, motivation, architecture, outputs, and scientific boundaries behind this research prototype.</p>
      </div>

      <div className="g guide-topgrid">
        <section className="c guide-callout">
          <span className="guide-tag">THE PROBLEM</span>
          <h2>Equivalence alone does not explain the transformation.</h2>
          <p>A quantum compiler can change gate sequences, circuit depth, operation counts, connectivity patterns, and measurement interfaces. A textual diff shows where text changed; an equivalence checker evaluates semantic preservation. Neither view, by itself, gives a complete, readable profile of the structural changes.</p>
        </section>
        <section className="c guide-callout">
          <span className="guide-tag">WHY WE BUILT IT</span>
          <h2>Make changes inspectable, not mysterious.</h2>
          <p>TranspileLens was built to bring semantic results and measurable structural evidence into one repeatable report. The goal is to help a developer or researcher understand what changed between two circuit versions and which observations support that interpretation.</p>
        </section>
      </div>

      <section className="c guide-section">
        <div className="guide-sectionhead">
          <div>
            <span className="guide-tag">END-TO-END FLOW</span>
            <h2>How it works</h2>
          </div>
          <span className="bg hv">Evidence-first pipeline</span>
        </div>
        <div className="guide-pipeline">
          {pipeline.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="guide-step">
                <span className="guide-stepnum">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{step.title}</h3><p>{step.desc}</p></div>
              </div>
              {index < pipeline.length - 1 && <div className="guide-connector" aria-hidden="true">↓</div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="g guide-topgrid">
        <section className="c">
          <span className="guide-tag">WHAT IT MEASURES</span>
          <h2>Evidence collected</h2>
          <div className="guide-evidence">
            <div><b>Semantic status</b><p>QCEC result: equivalent, not equivalent, or inconclusive.</p></div>
            <div><b>Resource deltas</b><p>Candidate minus reference for available operation counts, circuit depth, and two-qubit operations.</p></div>
            <div><b>Structural signals</b><p>Interaction-graph changes and gate-distribution divergence, where available.</p></div>
            <div><b>Interface checks</b><p>Register-width and measurement-mapping evidence, including explicit missing-data states.</p></div>
          </div>
        </section>
        <section className="c">
          <span className="guide-tag">HOW TO READ THE RESULT</span>
          <h2>Three semantic outcomes</h2>
          <div className="guide-status">
            <div><span className="bg ok">EQUIVALENT</span><p>The configured checker reports the circuits equivalent under its checking model and conditions.</p></div>
            <div><span className="bg bad">NOT EQUIVALENT</span><p>The checker reports a semantic mismatch for the compared circuits.</p></div>
            <div><span className="bg warn">INCONCLUSIVE</span><p>The check did not establish equivalence or inequivalence. This is not proof that the circuits differ.</p></div>
          </div>
        </section>
      </div>

      <section className="c guide-section">
        <div className="guide-sectionhead">
          <div><span className="guide-tag">DETERMINISTIC HEURISTICS</span><h2>Transformation categories</h2></div>
          <span className="guide-note">Interpretation ≠ proof of compiler intent</span>
        </div>
        <div className="guide-categories">
          {categories.map((category, index) => (
            <div className="guide-category" key={category}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <b>{category}</b>
            </div>
          ))}
        </div>
        <p className="note">Category 7 means the transformation is semantically equivalent but the current rules do not adequately explain its observed structure. It does not mean malicious, unsafe, or a Trojan.</p>
      </section>

      <div className="g guide-topgrid">
        <section className="c">
          <span className="guide-tag">WHY NOT JUST USE…?</span>
          <h2>Complementary, not replacement tooling</h2>
          <div className="guide-compare">
            <div><b>Text diff</b><p>Shows textual changes, which can be noisy after reordering or reformatting.</p></div>
            <div><b>QCEC alone</b><p>Provides semantic equivalence outcomes, but not the complete structural profile presented here.</p></div>
            <div><b>Resource counts alone</b><p>Summarize size and depth but do not establish whether computation was preserved.</p></div>
            <div><b>TranspileLens</b><p>Combines these evidence types in a structured profile while keeping their limitations visible.</p></div>
          </div>
        </section>
        <section className="c">
          <span className="guide-tag">SCIENTIFIC BOUNDARIES</span>
          <h2>What it does not claim</h2>
          <ul className="guide-list">
            <li>It is not a new quantum algorithm or a replacement for QCEC.</li>
            <li>It is not a formal proof of which compiler pass executed.</li>
            <li>It does not detect malware or establish malicious intent.</li>
            <li>Its routing/synthesis labels are heuristic and may be imperfect.</li>
            <li>The corpus is small; results do not establish universal accuracy or generalization.</li>
            <li>The hosted dashboard renders a generated snapshot; it does not run live quantum compilation.</li>
          </ul>
        </section>
      </div>

      <section className="guide-bottom">
        <b>Core principle</b>
        <p>“Report evidence, not intent.”</p>
        <span>TranspileLens helps explain observable changes between reference and candidate quantum circuits—without claiming more than the evidence supports.</span>
      </section>
    </div>
  );
}

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
    { id: 'B1', name: 'QASM / String Diff', status: 'Operational', desc: 'Syntactic text line diff between unrolled OpenQASM representations.' },
    { id: 'B2', name: 'Pass Observability', status: 'Unsupported / Limited', desc: 'Compiler pass hooks are not universally captured post-hoc without deep compiler instrumentation.' },
    { id: 'B3', name: 'QCEC Semantic Only', status: 'Operational', desc: 'Proves mathematical equivalence without providing structural or resource explanations.' },
    { id: 'B4', name: 'Resource Only Baseline', status: 'Operational', desc: 'Measures operation counts and depth deltas without verifying semantic equivalence.' },
    { id: 'B5', name: 'TranspileLens Full Profile', status: 'Operational', desc: 'Unified semantic proofs, resource deltas, structural mutations, and interface integrity validation.' }
  ];

  return (
    <div>
      <h1>Methodology & Baseline Framework</h1>
      <p className="sub">Deterministic, evidence-based profiling: identical inputs produce identical profiles and verified outcomes.</p>

      <div style={{marginBottom: 24}}>
        <h3 style={{fontSize: 16, fontWeight: 500, marginBottom: 12}}>Verification Pipeline</h3>
        <div className="pipe">
          {pipeline.map((p, i) => (
            <div key={p.title} className={i === 2 || i === 5 ? 'k' : ''}>
              <b>{i + 1}. {p.title}</b>
              <div style={{fontSize: 11.5, marginTop: 4, color: 'var(--tx2)'}}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginBottom: 24}}>
        <h3 style={{fontSize: 16, fontWeight: 500, marginBottom: 12}}>What The Results Mean</h3>
        <div className="g" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'}}>
          {meanings.map(m => (
            <div className="c" key={m.title} style={{padding: 14, borderTop: '3px solid var(--blue)'}}>
              <b>{m.title}</b>
              <p className="mut" style={{margin: '6px 0 0', lineHeight: 1.45}}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{fontSize: 16, fontWeight: 500, marginBottom: 12}}>Comparative Baselines (B1–B5)</h3>
        <div className="c ov" style={{padding: 0}}>
          <table className="tb">
            <thead>
              <tr>
                {['Baseline', 'Name', 'Status', 'Description'].map(t => <th key={t}>{t}</th>)}
              </tr>
            </thead>
            <tbody>
              {baselines.map(b => (
                <tr key={b.id} style={{cursor: 'default'}}>
                  <td><b>{b.id}</b></td>
                  <td>{b.name}</td>
                  <td>
                    <span className={`bg ${b.status === 'Operational' ? 'ok' : 'warn'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{fontSize: 12.5, color: 'var(--tx2)'}}>{b.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
      // Data is intentionally preserved if this is just a refresh error
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
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
        evidence: 'Baseline metrics only (B1–B5).',
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
    // Stats are always based on the full dataset, not the filtered dataset
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

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Platform...</div>;
  if (!data && error) return <div style={{padding: '50px', textAlign: 'center', color: 'red'}}>Error: {error}</div>;

  const timestampStr = data?.metadata?.timestamp
    ? new Date(data.metadata.timestamp * 1000).toLocaleString()
    : 'Timestamp unavailable';

  const view = {
    'Overview': <Overview list={normalizedData} stats={stats} sel={sel} setSel={setSel} go={setV} data={data} />,
    'Experiment Explorer': <Explorer list={normalizedData} sel={sel} setSel={setSel} />,
    'Resource Analysis': <Table
        title="Resource Analysis"
        note="Candidate minus reference. Negative delta indicates resource reduction (optimization); positive indicates overhead. Missing fields are strictly rendered as unavailable."
        cols={['ID', 'Depth Δ', 'Operations Δ', 'Two-qubit Δ']}
        rows={normalizedData.map(e => [e.id, fmt(e.d), fmt(e.o), fmt(e.d2q)])}
      />,
    'Structural Analysis': (
      <div>
        <h1>Structural Analysis</h1>
        <p className="sub">Fields are extracted purely from the verified profile schema. Structural mutations provide empirical evidence; they do not prove routing by themselves, nor do they prove malicious intent.</p>
        <div className="c" style={{marginBottom: 16}}>
          <h3>Structural mutation signatures</h3>
          <StructuralChart list={normalizedData} sel={sel} setSel={setSel} />
        </div>
        <Table
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
    'Methodology': <Method />,\n    'Project Guide': <ProjectGuide />
  }[v];

  return (
    <>
      <Hero stats={stats} navigateTo={setV} />
      <div className="app" id="observatory">
        <header className="top">
          <div className="top-left">
            <div className="brand">
              <svg width={22} height={22} viewBox="0 0 28 28" fill="none" stroke="#0F62FE" strokeWidth={2} aria-hidden="true">
                <circle cx={14} cy={14} r={9}/><path d="M2 14h24M14 5v18"/>
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
            {error && <span style={{color: 'var(--bad)', fontSize: 12}}>{error}</span>}
            <div
              style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12}}
              title="These results were generated by the TranspileLens experiment runner. Refresh Data reloads the published results snapshot; it does not execute new quantum profiling experiments."
            >
              <span className="bg hv" style={{fontWeight: 600, letterSpacing: '0.04em'}}>RESULTS SNAPSHOT</span>
              <span style={{color: refreshing ? 'var(--blue)' : 'var(--tx2)'}}>
                {timestampStr}
              </span>
              <span style={{cursor: 'help', color: 'var(--blue)', fontWeight: 600}}>ⓘ</span>
            </div>
            <button className="btn-app" onClick={() => fetchResults(true)} disabled={refreshing}>
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh Snapshot'}
            </button>
          </div>
        </header>
        <nav className="side" aria-label="Sections">
          {NAV.map(n => (
            <button key={n} aria-current={n === v ? 'page' : undefined} onClick={() => setV(n)}>{n}</button>
          ))}
          <small>Evidence, not intent</small>
        </nav>
        <main>
          {normalizedData.length === 0 && searchTerm ? (
            <div style={{padding: '40px', textAlign: 'center', color: 'var(--tx2)'}}>
              <h3>No matching experiments found</h3>
              <p>Try adjusting your search criteria.</p>
              <button className="btn-app" style={{marginTop: '16px'}} onClick={() => setSearchTerm('')}>Clear search</button>
            </div>
          ) : view}
        </main>
      </div>
    </>
  );
}
