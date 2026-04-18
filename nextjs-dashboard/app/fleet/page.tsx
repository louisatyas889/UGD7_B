"use client";
import { useState, useEffect } from "react";
import PrimeTopbar from "../ui/PrimeTopbar";

// Menyesuaikan ID Kapal dengan gambar Figma (PL-992-BUMI, dll)
const vessels = [
  { id:"PL-992-BUMI", dest:"Singapore Hub", status:"EN ROUTE", st:"enroute", eta:"14:28:00", mon:"chart" },
  { id:"PL-441-BULAN", dest:"Port of Rotterdam", status:"DELAYED", st:"delayed", eta:"UNKNOWN", mon:"warn" },
  { id:"PL-770-ORION", dest:"Busan Terminal", status:"IN PORT", st:"inport", eta:"–", mon:"anchor" },
  { id:"PL-105-MARS", dest:"Dry Dock C", status:"MAINTENANCE", st:"maint", eta:"–", mon:"wrench" },
];

function MonIcon({t}:{t:string}) {
  if(t==="chart") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
  if(t==="anchor") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>;
  if(t==="warn") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
}

export default function FleetPage() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const t = () => { const n=new Date(); let h=n.getHours(); const m=String(n.getMinutes()).padStart(2,"0"); const ap=h>=12?"PM":"AM"; h=h%12||12; setTime(`${h}:${m}:${String(n.getSeconds()).padStart(2,"0")} ${ap}`); };
    t(); const id=setInterval(t,1000); return ()=>clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;600;700;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#050505;color:#e5e7eb;font-family:'Rajdhani',sans-serif}
        
        .main-container{padding:24px; max-width:1600px; margin:0 auto}
        .header-flex{display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:30px}
        .title-h1{font-family:'Orbitron',sans-serif; font-size:28px; font-weight:800; letter-spacing:0.05em; color:#fff}
        
        .grid-layout{display:grid; grid-template-columns: 1fr 300px; gap:24px}
        
        /* Panel Base */
        .panel-v2{background:#0a0a0a; border:1px solid rgba(255,255,255,0.03); border-radius:4px}
        .panel-label{font-family:'Share Tech Mono',monospace; font-size:10px; color:#4b5563; letter-spacing:0.2em; padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.03)}
        
        /* Table Figma Style */
        .table-wrap{padding:0 20px 20px}
        table{width:100%; border-collapse:collapse}
        th{font-family:'Share Tech Mono',monospace; font-size:9px; color:#374151; text-align:center; padding:20px 10px; font-weight:400; text-transform:uppercase}
        td{padding:25px 10px; text-align:center; vertical-align:middle; border-bottom:1px solid rgba(255,255,255,0.02)}
        .v-id{font-family:'Orbitron',sans-serif; font-size:13px; font-weight:600; color:#22d3ee; letter-spacing:0.05em}
        .v-dest{font-size:12px; color:#9ca3af; line-height:1.2}
        
        /* Status Figma Style */
        .pill{display:inline-block; padding:4px 15px; border-radius:20px; font-family:'Share Tech Mono',monospace; font-size:9px; border:1px solid}
        .enroute{color:#22d3ee; border-color:#22d3ee; background:rgba(34,211,238,0.05)}
        .delayed{color:#f87171; border-color:#f87171; background:rgba(248,113,113,0.05)}
        .inport{color:#9ca3af; border-color:#4b5563}
        .maint{color:#f472b6; border-color:#f472b6}

        /* Search Bar di Atas Tabel */
        .table-header-ctrl{display:flex; justify-content:flex-end; align-items:center; gap:12px; padding:15px 20px}
        .search-box{background:#111; border:none; border-radius:15px; padding:6px 15px; font-size:12px; color:#fff; width:200px; outline:none}

        /* Distribution Bars */
        .dist-container{display:flex; gap:10px; padding:20px; align-items:flex-end; height:180px}
        .dist-bar{flex:1; border-radius:2px; position:relative}
        .dist-label{position:absolute; bottom:-25px; left:0; font-family:'Share Tech Mono',monospace; font-size:8px; color:#4b5563; white-space:nowrap}

        /* Right Column (Alerts & Fuel) */
        .alert-card{margin:15px; padding:20px; background:rgba(248,113,113,0.05); border-left:3px solid #f87171}
        .fuel-viz{height:250px; display:flex; align-items:flex-end; gap:8px; padding:20px}
        .fuel-bar-v2{flex:1; border-radius:1px}
      `}</style>

      <PrimeTopbar />

      <div className="main-container">
        <div className="header-flex">
          <div>
            <h1 className="title-h1">FLEET OVERVIEW</h1>
            <p style={{fontSize:13, color:"#4b5563", marginTop:5}}>Logistik global dan pelacakan kapal</p>
          </div>
          <div style={{textAlign:"right", fontFamily:"'Share Tech Mono',monospace"}}>
            <div style={{color:"#22d3ee", fontSize:10, letterSpacing:"0.1em"}}>SYSTEM STATUS: NOMINAL</div>
            <div style={{color:"#374151", fontSize:9, marginTop:4}}>Last Updated: {time}</div>
          </div>
        </div>

        <div className="grid-layout">
          <div className="left-side">
            {/* Armada Aktif Section */}
            <div className="panel-v2">
              <div className="panel-label">ARMADA AKTIF</div>
              <div className="table-header-ctrl">
                <input type="text" className="search-box" placeholder="Search vessel..." />
                <span style={{fontSize:9, color:"#22d3ee", border:"1px solid #22d3ee", padding:"2px 8px", borderRadius:10}}>LIVE_STREAM</span>
                <span style={{fontSize:9, color:"#4b5563"}}>42 TOTAL VESSELS</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{textAlign:"left"}}>ID KAPAL</th>
                      <th>TUJUAN</th>
                      <th>STATUS</th>
                      <th>ETA</th>
                      <th>MONITORING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vessels.map(v => (
                      <tr key={v.id}>
                        <td style={{textAlign:"left"}}><span className="v-id">{v.id}</span></td>
                        <td><div className="v-dest">{v.dest.split(' ').join('\n')}</div></td>
                        <td><span className={`pill ${v.st}`}>{v.status}</span></td>
                        <td><span style={{fontFamily:"'Share Tech Mono'", fontSize:13, color:v.eta==="UNKNOWN"?"#f87171":"#fff"}}>{v.eta}</span></td>
                        <td><MonIcon t={v.mon}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logistics & Regional Distribution di Bawah */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:20, marginTop:24}}>
              <div className="panel-v2" style={{padding:20}}>
                <div style={{fontFamily:"'Share Tech Mono'", fontSize:9, color:"#4b5563", marginBottom:20}}>LOGISTICS EFFICIENCY</div>
                <div style={{marginBottom:15}}>
                   <div style={{display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:8}}><span>CARGO UTILIZATION</span><span style={{color:"#22d3ee"}}>92.4%</span></div>
                   <div style={{height:4, background:"#111"}}><div style={{width:"92.4%", height:"100%", background:"#22d3ee"}}/></div>
                </div>
                <div>
                   <div style={{display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:8}}><span>ROUTE OPTIMIZATION</span><span style={{color:"#a855f7"}}>87.1%</span></div>
                   <div style={{height:4, background:"#111"}}><div style={{width:"87.1%", height:"100%", background:"#a855f7"}}/></div>
                </div>
              </div>

              <div className="panel-v2">
                <div className="panel-label">REGIONAL DISTRIBUTION</div>
                <div className="dist-container">
                  <div className="dist-bar" style={{height:"70%", background:"#22d3ee", flex:2}}><span className="dist-label">BUMI - REG SINGAPORE - 28%</span></div>
                  <div className="dist-bar" style={{height:"40%", background:"#a855f7", flex:1.5}}><span className="dist-label">MARS - REG BELANDA - 18%</span></div>
                  <div className="dist-bar" style={{height:"60%", background:"#22d3ee", flex:2}}><span className="dist-label">MOON - REG MALAYSIA - 15%</span></div>
                  <div className="dist-bar" style={{height:"35%", background:"#a855f7", flex:1.2}}><span className="dist-label">ORION - REG NUGINI - 10%</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-side">
            {/* Critical Alerts Figma Style */}
            <div className="panel-v2" style={{marginBottom:24}}>
              <div className="panel-label">⚠️ CRITICAL ALERTS</div>
              <div className="alert-card">
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
                  <span style={{color:"#f87171", fontWeight:700, fontSize:10}}>WEATHER WARNING</span>
                  <span style={{color:"#4b5563", fontSize:9}}>12m ago</span>
                </div>
                <p style={{fontSize:11, color:"#9ca3af", lineHeight:1.4}}>Tropical depression identified in Sector 7-B. Rerouting recommended for PL-4822.</p>
              </div>
              <div style={{padding:"0 20px 20px"}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
                  <span style={{color:"#f59e0b", fontWeight:700, fontSize:10}}>ENGINE ISSUE</span>
                  <span style={{color:"#4b5563", fontSize:9}}>45m ago</span>
                </div>
                <p style={{fontSize:11, color:"#9ca3af", lineHeight:1.4}}>Fuel pressure drop detected in Port Engine #2 on PL-9011.</p>
              </div>
            </div>

            {/* Fuel Consumption */}
            <div className="panel-v2">
              <div className="panel-label">FUEL CONSUMPTION (BAHAN BAKAR)</div>
              <div className="fuel-viz">
                <div className="fuel-bar-v2" style={{height:"40%", background:"#f87171"}} />
                <div className="fuel-bar-v2" style={{height:"55%", background:"#f472b6"}} />
                <div className="fuel-bar-v2" style={{height:"35%", background:"#a855f7"}} />
                <div className="fuel-bar-v2" style={{height:"80%", background:"#22d3ee"}} />
                <div className="fuel-bar-v2" style={{height:"95%", background:"#22d3ee"}} />
                <div className="fuel-bar-v2" style={{height:"65%", background:"#a855f7"}} />
                <div className="fuel-bar-v2" style={{height:"50%", background:"#f87171"}} />
              </div>
              <div style={{padding:20, borderTop:"1px solid rgba(255,255,255,0.03)"}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
                   <span style={{fontSize:9, color:"#4b5563"}}>Aggregate Fuel Level</span>
                   <span style={{fontSize:11, fontWeight:600}}>12.4K Liters</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                   <span style={{fontSize:9, color:"#4b5563"}}>Consumption Variance</span>
                   <span style={{fontSize:11, fontWeight:600, color:"#22d3ee"}}>+2.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
