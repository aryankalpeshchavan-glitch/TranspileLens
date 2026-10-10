import React, { useState, useEffect, useMemo, useRef } from 'react';

const NAV = ['Overview', 'Experiment Explorer', 'Resource Analysis', 'Structural Analysis', 'Methodology'];

const badge = e => <span className={`bg ${e.s === 'ok' ? 'ok' : e.s === 'ne' ? 'bad' : 'warn'}`}>{e.s === 'ok' ? 'EQUIVALENT' : e.s === 'ne' ? 'INEQUIVALENT' : 'INCONCLUSIVE'}</span>;
const fmt = v => (v === null || v === undefined) ? <span className="un">unavailable</span> : (v > 0 ? '+' + v : String(v));

// Prototype preview for Hero
function Preview() {
  const E = [
    {id:'E1', d:1, o:1}, {id:'E2', d:-4, o:-5}, {id:'E3', d:2, o:2},
    {id:'E4', d:2, o:2}, {id:'E5', d:null, o:null}, {id:'E6', d:2, o:2}
  ];
  const C = 2 * Math.PI * 30;
  return (
    <div className="pv" role="img" aria-label="Preview of the TranspileLens observatory dashboard">
      <div className="pvt"><i></i><i></i><i></i><b>TranspileLens Observatory</b></div>
      <div className="pvb">
        <div className="pvs">
          {NAV.map((n, i) => <div key={n} className={i ? '' : 'on'}>{n}</div>)}
        </div>
        <div className="pvm">
          <div className="pvk">
            {[['Equivalent',7,'#198038'], ['Not equivalent',2,'#DA1E28'], ['Inconclusive',0,'#B28600']].map(([n,v,c]) => (
              <div key={n} style={{borderTop: '3px solid ' + c}}>
                <small>{n}</small>
                <b>{v}</b>
              </div>
            ))}
          </div>
          <div className="pvr">
            <div>
              <small>Resource deltas</small>
              <svg viewBox="0 0 220 110" style={{width: '100%'}}>
                <line x1={0} x2={220} y1={55} y2={55} stroke="#D8E0EB"/>
                {E.map((e, i) => e.d === null ? 
                  <text key={e.id} x={14+i*35} y={50} fontSize={7} fill="#526176">n/a</text> : 
                  <g key={e.id}>
                    <rect x={8+i*35} y={e.d>0 ? 55-e.d*8 : 55} width={12} height={Math.abs(e.d)*8} fill="#0F62FE" />
                    <rect x={21+i*35} y={e.o>0 ? 55-e.o*8 : 55} width={12} height={Math.abs(e.o)*8} fill="#A6C8FF" />
                  </g>
                )}
                {E.map((e, i) => <text key={'l'+e.id} x={20+i*35} y={106} fontSize={8} textAnchor="middle" fill="#526176">{e.id}</text>)}
              </svg>
            </div>
            <div>
              <small>Semantic outcomes</small>
              <svg viewBox="0 0 80 80" style={{width: '100%', maxWidth: 96, display: 'block', margin: '6px auto'}}>
                <circle cx={40} cy={40} r={30} fill="none" stroke="#198038" strokeWidth={11} strokeDasharray={(7/9*C) + ' ' + C} transform="rotate(-90 40 40)" />
                <circle cx={40} cy={40} r={30} fill="none" stroke="#DA1E28" strokeWidth={11} strokeDasharray={(2/9*C) + ' ' + C} strokeDashoffset={-(7/9*C)} transform="rotate(-90 40 40)" />
                <text x={40} y={45} textAnchor="middle" fontSize={15} fontWeight={600} fill="#161B2E">9</text>
              </svg>
            </div>
          </div>
        </div>
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
            {[['Overview', 'Overview'], ['Experiments', 'Experiment Explorer'], ['Resources', 'Resource Analysis'], ['Structure', 'Structural Analysis'], ['Methodology', 'Methodology']].map(([t, v]) => (
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
              <a className="hbn p" href="#observatory" onClick={go('Overview')}>Explore the Observatory</a>
              <a className="hbn s" href="#observatory" onClick={go('Methodology')}>Discover the Methodology</a>
            </div>
            <p className="hq">Report evidence, not intent.</p>
          </div>
          <div className="herov"><Preview /></div>
        </div>
        <div className="hstats">
          {S(stats.total, 'experiments analysed', '#10172A')}
          {S(stats.eq, 'proven equivalent', '#198038')}
          {S(stats.neq, 'not equivalent', '#DA1E28')}
          {S(stats.inc, 'inconclusive', '#B28600')}
        </div>
      </div>
    </section>
  );
}

function Wide({ list, sel, setSel }) {
  const sc = 16, base = 120;
  // Filter only those with actual valid delta values to plot, or keep them to show 'unavailable'
  return (
    <div>
      <svg viewBox="0 0 640 250" style={{width: '100%', height: 'auto'}} role="img" aria-label="Depth and operations deltas per experiment">
        {[-4, -2, 0, 2, 4].map(v => (
          <g key={v}>
            <line x1={40} x2={630} y1={base - v*sc} y2={base - v*sc} stroke="var(--bd)" strokeDasharray={v ? '3 3' : undefined} />
            <text x={34} y={base - v*sc + 4} fontSize={10} textAnchor="end" fill="var(--tx2)">{v > 0 ? '+' + v : String(v)}</text>
          </g>
        ))}
        {list.slice(0, 6).map((e, i) => {
          const x = 60 + i * 96, on = e.id === sel;
          const bar = (v, dx, c, k) => <rect key={k} x={x + dx} y={v > 0 ? base - v*sc : base} width={32} height={Math.abs(v)*sc} fill={c} />;
          const isAvail = e.d !== null && e.d !== undefined;
          return (
            <g key={e.id} tabIndex={0} role="button" aria-label={e.id} style={{cursor: 'pointer'}} onClick={() => setSel(e.id)} onKeyDown={k => { if(k.key==='Enter') setSel(e.id) }}>
              <rect x={x-8} y={8} width={84} height={224} fill={on ? 'var(--pale)' : 'transparent'} />
              {!isAvail ? 
                <text x={x+34} y={base-8} fontSize={10} textAnchor="middle" fill="var(--tx2)">unavailable</text> : 
                [bar(e.d, 0, on ? '#0F62FE' : '#B6C4DA', 0), bar(e.o, 34, on ? '#78A9FF' : '#D8E0EB', 1)]
              }
              <text x={x+34} y={244} fontSize={11} textAnchor="middle" fill="var(--tx)" fontFamily="IBM Plex Mono">{e.id}</text>
            </g>
          );
        })}
      </svg>
      <div style={{display: 'flex', gap: 16, fontSize: 12, color: 'var(--tx2)'}}>
        <span><span style={{color: '#0F62FE'}}>■</span> Depth Δ</span>
        <span><span style={{color: '#78A9FF'}}>■</span> Operations Δ</span>
      </div>
    </div>
  );
}

function Donut({ stats }) {
  const C = 2 * Math.PI * 54;
  const rows = [
    ['Equivalent', stats.eq, '#198038'], 
    ['Not equivalent', stats.neq, '#DA1E28'], 
    ['Inconclusive', stats.inc, '#F1C21B']
  ];
  let off = 0;
  return (
    <div style={{display: 'grid', gridTemplateColumns: '150px 1fr', gap: 16, alignItems: 'center'}}>
      <svg viewBox="0 0 140 140" role="img">
        <circle cx={70} cy={70} r={54} fill="none" stroke="var(--bd)" strokeWidth={18} />
        {rows.filter(r => r[1]).map(([n, v, c]) => {
          const len = (v / stats.total) * C;
          const el = <circle key={n} cx={70} cy={70} r={54} fill="none" stroke={c} strokeWidth={18} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} transform="rotate(-90 70 70)" />;
          off += len;
          return el;
        })}
        <text x={70} y={76} textAnchor="middle" fontSize={22} fontWeight={600} fill="var(--tx)">{stats.total}</text>
      </svg>
      <div>
        {rows.map(([n, v, c]) => (
          <div className="lg" key={n}>
            <span className="dot" style={{background: c}}></span>{n}<b>{v}</b><span className="mut">{Math.round(v/stats.total*100)}%</span>
          </div>
        ))}
      </div>
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
            {['ID', 'Category (heuristic)', 'Semantic (QCEC)'].map(t => <th key={t}>{t}</th>)}
          </tr>
        </thead>
        <tbody>
          {displayList.map(e => (
            <tr key={e.id} data-s={e.id === sel ? 1 : 0} onClick={() => setSel(e.id)}>
              <td><b>{e.id}</b></td>
              <td>{e.cat || <span className="un">unavailable</span>}</td>
              <td>{badge(e)}</td>
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
  return (
    <div className="c">
      <h3>Selected: {e.id}</h3>
      <div className="mut">Verified by QCEC</div>
      <div style={{margin: '4px 0 12px'}}>{badge(e)}</div>
      
      <div className="mut">Heuristic category (not proof)</div>
      <div style={{margin: '4px 0 12px'}}>
        {e.cat ? <span className="bg hv">{e.cat.toUpperCase()}</span> : <span className="un">unavailable</span>}
      </div>
      
      <div className="mut">Depth Δ / Operations Δ</div>
      <div style={{margin: '4px 0 12px'}}>{fmt(e.d)} / {fmt(e.o)}</div>
      
      <div className="mut">Two-qubit Δ</div>
      <div style={{margin: '4px 0 12px'}}>{fmt(e.d2q)}</div>

      {e.evidence && (
        <>
          <div className="mut">Interpretation Evidence</div>
          <div className="note" style={{margin: '4px 0 12px'}}>{e.evidence}</div>
        </>
      )}
    </div>
  );
}

function Overview({ list, stats, sel, setSel, go }) {
  const K = (ic, t, v, d, b, bt) => (
    <div className="c" key={t}>
      <div className="kh">{ic}{t}<span className={`bg ${b}`}>{bt}</span></div>
      <div className="big">{v}</div>
      <div className="mut">{d}</div>
    </div>
  );
  return (
    <div>
      <h1>Overview</h1>
      <p className="sub">Evidence-first profiling of Qiskit circuit transformations. We report what was measured, not why it changed.</p>
      
      <div className="g k3">
        {K('✓', 'Equivalent', stats.eq, `of ${stats.total} experiments proven equivalent`, 'ok', 'QCEC')}
        {K('!', 'Not equivalent', stats.neq, 'Logical deviations detected', 'bad', 'QCEC')}
        {K('?', 'Inconclusive', stats.inc, 'Unresolved equivalence checks', 'warn', 'QCEC')}
      </div>
      
      <div className="g r2">
        <div className="c">
          <h3>Resource deltas by experiment <span className="un" style={{display: sel ? 'none' : 'inline'}}>select an experiment</span></h3>
          <Wide list={list.filter(x => !x.isLegit)} sel={sel} setSel={setSel} />
          <p className="note">Candidate minus reference. Positive means inflation. Missing fields are strictly rendered as unavailable.</p>
        </div>
        <Detail list={list} sel={sel} />
      </div>
      
      <div className="g r3">
        <div className="c">
          <h3>Semantic outcomes</h3>
          <Donut stats={stats} />
        </div>
        <div className="c">
          <h3>Recent experiment records <a href="#" onClick={e => { e.preventDefault(); go('Experiment Explorer'); }} style={{fontSize: 13, color: 'var(--blue)'}}>Open explorer</a></h3>
          <Records list={list} sel={sel} setSel={setSel} full={false} />
        </div>
      </div>
    </div>
  );
}

function Explorer({ list, sel, setSel }) {
  return (
    <div>
      <h1>Experiment Explorer</h1>
      <p className="sub">Select a record. The verified result and the heuristic label are always shown separately.</p>
      <div className="g" style={{gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)'}}>
        <div className="c">
          <Records list={list} sel={sel} setSel={setSel} full={true} />
          <p className="note">L1–L3 status are sourced securely from their respective baselines.</p>
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

function Method() {
  const st = ['Reference circuit', 'Candidate transformation', 'QCEC semantic check', 'Resource and structural profiling', 'Deterministic categorisation', 'Evidence report'];
  const q = [
    ['The checker establishes', 'Equivalent, not equivalent or inconclusive.'],
    ['The profiler measures', 'Operations, depth, two-qubit operations, gate and interaction structure.'],
    ['The categoriser infers', 'Rule-based labels from measured evidence. Heuristic, not proof.'],
    ['The system cannot establish', 'Malicious intent, attacks or guaranteed compiler correctness.']
  ];
  return (
    <div>
      <h1>Methodology</h1>
      <p className="sub">Deterministic: the same inputs always produce the same report.</p>
      <div className="pipe">
        {st.map((t, i) => <div key={t} className={i === 2 || i === 5 ? 'k' : ''}>{t}</div>)}
      </div>
      <div className="g" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'}}>
        {q.map(([a, b], i) => (
          <div className="c" key={a} style={{borderTop: '3px solid ' + ['#198038', '#0F62FE', '#36C5F0', '#DA1E28'][i]}}>
            <h3>{a}</h3>
            <p className="mut" style={{margin: 0, lineHeight: 1.5}}>{b}</p>
          </div>
        ))}
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
      s: e.profile?.semantic?.status === 'equivalent' ? 'ok' : e.profile?.semantic?.status === 'not_equivalent' ? 'ne' : 'inc',
      cat: e.profile?.interpretation?.category_name,
      evidence: e.profile?.interpretation?.evidence,
      d: e.profile?.resources?.deltas?.depth?.delta ?? null,
      o: e.profile?.resources?.deltas?.total_ops?.delta ?? null,
      d2q: e.profile?.resources?.deltas?.two_qubit_ops?.delta ?? null,
      gd: e.profile?.gate_distribution?.js_divergence ?? null,
      rg: e.profile?.routing?.is_routing_consistent ? 'Routing Heuristic Detected' : 'No Topology Routing Detected'
    }));
    
    const legitimate = (data.legitimate || []).map(l => {
      const st = l.baselines?.B3?.semantic_status;
      return {
        id: l.case_id,
        isLegit: true,
        s: st === 'equivalent' ? 'ok' : st === 'not_equivalent' ? 'ne' : 'inc',
        cat: 'Baseline Execution',
        evidence: 'Baseline metrics only.',
        d: null,
        o: l.baselines?.B4?.ops_delta ?? null,
        d2q: null,
        gd: null,
        rg: null
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

  const view = {
    'Overview': <Overview list={normalizedData} stats={stats} sel={sel} setSel={setSel} go={setV} />,
    'Experiment Explorer': <Explorer list={normalizedData} sel={sel} setSel={setSel} />,
    'Resource Analysis': <Table 
        title="Resource Analysis" 
        note="Candidate minus reference. Missing fields are strictly rendered as unavailable." 
        cols={['ID', 'Depth Δ', 'Operations Δ', 'Two-qubit Δ']} 
        rows={normalizedData.map(e => [e.id, fmt(e.d), fmt(e.o), fmt(e.d2q)])} 
      />,
    'Structural Analysis': <Table 
        title="Structural Analysis" 
        note="Fields are extracted purely from the verified profile schema." 
        cols={['ID', 'Gate-distribution divergence', 'Routing-heuristic output']} 
        rows={normalizedData.map(e => [
          e.id, 
          e.gd !== null ? String(e.gd.toFixed(4)) : fmt(null), 
          e.rg || fmt(null)
        ])} 
      />,
    'Methodology': <Method />
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
            {error && <span style={{color: 'var(--bad)'}}>{error}</span>}
            <span style={{color: refreshing ? 'var(--blue)' : 'var(--tx2)'}}>
              Dataset generated: {new Date(data.metadata?.timestamp * 1000).toLocaleString()}
            </span>
            <button className="hbn p" style={{height: 32, padding: '0 12px'}} onClick={() => fetchResults(true)} disabled={refreshing}>
              {refreshing ? 'Refreshing...' : 'Refresh Results'}
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
              <button className="hbn p" style={{marginTop: '16px'}} onClick={() => setSearchTerm('')}>Clear search</button>
            </div>
          ) : view}
        </main>
      </div>
    </>
  );
}
