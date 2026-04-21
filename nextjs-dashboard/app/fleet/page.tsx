"use client";
import { useState, useEffect } from "react";
import PrimeTopbar from "../ui/PrimeTopbar";

function MonIcon({ t }: { t: string }) {
  if (t === "chart") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
  if (t === "anchor") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>;
  if (t === "warn") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
}

export default function FleetPage() {
  const [time, setTime] = useState("");
  const [data, setData] = useState<any>({
    vessels: [],
    alerts: [],
    fuel: [],
    regions: [],
    efficiency: { cargo: "0%", route: "0%" }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDashboardData() {
      try {
        const response = await fetch('/api/fleet');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setLoading(false);
      }
    }
    getDashboardData();
  }, []);

  useEffect(() => {
    const updateTime = () => { 
      const n = new Date(); 
      let h = n.getHours(); 
      const m = String(n.getMinutes()).padStart(2, "0"); 
      const s = String(n.getSeconds()).padStart(2, "0");
      const ap = h >= 12 ? "PM" : "AM"; 
      h = h % 12 || 12; 
      setTime(`${h}:${m}:${s} ${ap}`); 
    };
    updateTime(); 
    const id = setInterval(updateTime, 1000); 
    return () => clearInterval(id);
  }, []);

  if (loading) return <div style={{color: '#22d3ee', padding: 20, fontFamily: 'Orbitron'}}>UPLINKING TO SERENA SAIL SYSTEM...</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;600;700;900&display=swap');
        
        body { background: #050505; color: #e5e7eb; font-family: 'Rajdhani', sans-serif; margin: 0; height: 100vh; overflow: hidden; }
        .screen-wrapper { display: flex; flex-direction: column; height: 100vh; }
        .main-container { flex: 1; padding: 10px 25px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
        
        .header-flex { display: flex; justify-content: space-between; align-items: flex-start; }
        .title-h1 { font-family: 'Orbitron', sans-serif; font-size: 18px; font-weight: 800; color: #fff; margin: 0; }
        
        .grid-layout { display: grid; grid-template-columns: 1fr 300px; gap: 15px; flex: 1; min-height: 0; }
        .panel-v2 { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.02); border-radius: 2px; display: flex; flex-direction: column; }
        .panel-label { font-family: 'Share Tech Mono', monospace; font-size: 8px; color: #4b5563; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.02); letter-spacing: 1px; }
        
        .table-container { flex: 1; overflow-y: auto; padding: 0 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { font-family: 'Share Tech Mono', monospace; font-size: 8px; color: #374151; padding: 8px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.02); position: sticky; top: 0; background: #0a0a0a; }
        td { padding: 8px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.01); font-size: 10px; }
        
        .left-column { display: flex; flex-direction: column; gap: 10px; min-height: 0; }
        .right-column { display: flex; flex-direction: column; gap: 10px; min-height: 0; }

        .region-bar-wrap { display: flex; align-items: flex-end; gap: 10px; height: 60px; padding: 10px 20px; }
        .region-item { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; height: 100%; }
        .region-bar { width: 100%; transition: height 0.5s ease; border-radius: 1px 1px 0 0; }
        .region-text { font-size: 7px; color: #4b5563; font-family: 'Share Tech Mono'; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .fuel-container { display: flex; align-items: flex-end; justify-content: space-between; flex: 1; padding: 10px; gap: 4px; background: rgba(255,255,255,0.01); margin: 10px; }
        .fuel-bar { width: 100%; border-radius: 1px; position: relative; }
        .fuel-label { position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); font-size: 6px; color: #374151; font-family: 'Share Tech Mono'; }

        .progress-bar-wrap { height: 3px; background: #111; width: 100%; margin-top: 5px; }
        .progress-fill { height: 100%; transition: width 0.8s ease; }
      `}</style>

      <div className="screen-wrapper">
        <PrimeTopbar />
        <div className="main-container">
          <div className="header-flex">
            <div>
              <h1 className="title-h1">FLEET OVERVIEW</h1>
              <p style={{fontSize:9, color:"#4b5563", marginTop:2}}>Logistik global dan pelacakan kapal</p>
            </div>
            <div style={{textAlign:"right", fontFamily:"'Share Tech Mono',monospace"}}>
              <div style={{color:"#22d3ee", fontSize:8}}>SYSTEM STATUS: NOMINAL</div>
              <div style={{color:"#374151", fontSize:8}}>{time}</div>
            </div>
          </div>

          <div className="grid-layout">
            <div className="left-column">
              {/* 1. TABEL (DIPERSEMPIT) */}
              <div className="panel-v2" style={{flex: 1.2}}>
                <div className="panel-label">ARMADA AKTIF</div>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr><th style={{textAlign:"left"}}>ID KAPAL</th><th>TUJUAN</th><th>STATUS</th><th>ETA</th><th>MONITORING</th></tr>
                    </thead>
                    <tbody>
                      {data?.vessels?.map((v: any) => (
                        <tr key={v.id}>
                          <td style={{textAlign:"left"}}><span style={{color: '#22d3ee', fontWeight: 600}}>{v.id}</span></td>
                          <td style={{color: '#9ca3af'}}>{v.dest}</td>
                          <td><span className="pill" style={{color: v.status_color, borderColor: v.status_color, border:'1px solid', padding:'1px 5px', borderRadius:'10px', fontSize:'7px'}}>{v.status}</span></td>
                          <td style={{fontFamily: 'Share Tech Mono'}}>{v.eta}</td>
                          <td><MonIcon t={v.mon}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. EFFICIENCY */}
              <div className="panel-v2" style={{flex: 0.4}}>
                <div className="panel-label">LOGISTICS EFFICIENCY</div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: '10px 20px'}}>
                  {['cargo', 'route'].map((type) => (
                    <div key={type}>
                      <div style={{display:'flex', justifyContent:'space-between', fontSize:8, color:'#4b5563'}}>
                        <span style={{textTransform:'uppercase'}}>{type} UTILIZATION</span>
                        <span style={{color: type === 'cargo' ? '#22d3ee' : '#a855f7'}}>{data?.efficiency?.[type]}</span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div className="progress-fill" style={{width: data?.efficiency?.[type] || '0%', background: type === 'cargo' ? '#22d3ee' : '#a855f7'}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. REGIONAL DISTRIBUTION (KEMBALI) */}
              <div className="panel-v2" style={{flex: 0.6}}>
                <div className="panel-label">REGIONAL DISTRIBUTION (PACKAGE DROPOFF %)</div>
                <div className="region-bar-wrap">
                  {data?.regions?.map((reg: any, i: number) => (
                    <div className="region-item" key={i}>
                      <div className="region-bar" style={{height: `${reg.percent}%`, background: reg.color, opacity: 0.8}} />
                      <div className="region-text">{reg.name} - {reg.percent}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="right-column">
              <div className="panel-v2" style={{flex: 1}}>
                <div className="panel-label" style={{color: '#f87171'}}>⚠️ CRITICAL ALERTS</div>
                <div style={{overflowY: 'auto', flex: 1}}>
                  {data?.alerts?.map((alert: any) => (
                    <div key={alert.id} style={{borderLeft: `2px solid ${alert.tc}`, background: 'rgba(255,255,255,0.01)', margin: '8px', padding: '8px'}}>
                      <div style={{display:'flex', justifyContent:'space-between', fontSize:7}}>
                        <span style={{color: alert.tc, fontWeight:700}}>{alert.type}</span>
                        <span style={{color:'#374151'}}>{alert.time}</span>
                      </div>
                      <p style={{fontSize:8, color:'#9ca3af', margin:'2px 0 0'}}>{alert.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-v2" style={{flex: 1}}>
                <div className="panel-label">FUEL CONSUMPTION</div>
                <div className="fuel-container">
                  {data?.fuel?.map((f: any) => (
                    <div key={f.id} className="fuel-bar" style={{height: `${f.h}%`, background: f.c}}>
                      <span className="fuel-label">{f.l?.split('-')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
