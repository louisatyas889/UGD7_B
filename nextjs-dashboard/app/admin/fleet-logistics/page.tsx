"use client";
import { useState } from "react";
import SereneSailTopbar from "../../ui/SereneSailTopbar";
import { vessels4, packages, sizes } from "../../lib/placeholder-data";


export default function FleetLogisticsPage() {
  const [activeSize, setActiveSize] = useState("MEDIUM");

  // Logika filter: hanya menampilkan paket yang sesuai dengan tab yang dipilih
  const filteredPackages = packages.filter((p : any) => p.size === activeSize);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;600;700;900&display=swap');
        
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#0a0a10;color:#e5e7eb;font-family:'Rajdhani',sans-serif;min-height:100vh; overflow: hidden;}

        /* Header Section */
        .ph{padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .ph-title{display:flex;align-items:center;gap:14px;margin-bottom:4px}
        .ph-t{font-family:'Orbitron',sans-serif;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.04em}
        .live-badge{display:flex;align-items:center;gap:6px;font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:0.16em;padding:4px 10px;border:1px solid rgba(34,211,238,0.3);border-radius:3px;background:rgba(34,211,238,0.06)}
        .ph-sub{font-family:'Rajdhani',sans-serif;font-size:13px;color:#6b7280}

        /* Layout Grid */
        .layout{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:0;height:calc(100vh - 165px)}
        
        /* Left Panel with Custom Scrollbar */
        .left-panel{border-right:1px solid rgba(255,255,255,0.07); overflow-y: auto;}
        .left-panel::-webkit-scrollbar { width: 4px; }
        .left-panel::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }

        .fl-title-row { padding: 14px 20px 6px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); }

        /* Tables */
        table{width:100%;border-collapse:collapse}
        th{font-family:'Share Tech Mono',monospace;font-size:7px;color:#4b5563;letter-spacing:0.2em;text-align:left;padding:12px 18px;border-bottom:1px solid rgba(255,255,255,0.05);font-weight:400;text-transform:uppercase;background:rgba(255,255,255,0.01); position: sticky; top: 0; z-index: 10; background: #0a0a10;}
        td{padding:12px 18px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:middle}
        tbody tr:hover{background:rgba(168,85,247,0.03); cursor: pointer;}

        .vid3{font-family:'Share Tech Mono',monospace;font-size:10px;color:#a855f7;display:block}
        .vsub{font-family:'Share Tech Mono',monospace;font-size:7px;color:#4b5563}

        /* Progress Bar */
        .prog-wrap{display:flex;align-items:center;gap:10px}
        .prog-status{font-family:'Share Tech Mono',monospace;font-size:8px;color:#22d3ee;letter-spacing:0.1em;min-width:100px}
        .prog-track{flex:1;height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;max-width:80px}
        .prog-fill{height:100%;background:#a855f7;border-radius:2px;box-shadow:0 0 6px rgba(168,85,247,0.5)}
        .prog-pct{font-family:'Share Tech Mono',monospace;font-size:9px;color:#6b7280;min-width:28px;text-align:right}

        /* Right Panel Components */
        .right-panel{display:flex;flex-direction:column; overflow-y: auto;}
        .size-tabs{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid rgba(255,255,255,0.07)}
        .stab{padding:12px;text-align:center;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:0.14em;cursor:pointer;transition:all 0.2s;border:none;background:none;color:#6b7280}
        .stab.active{background:rgba(168,85,247,0.15); color:#a855f7; box-shadow: inset 0 -2px 0 #a855f7}

        .pkg-header{display:flex;justify-content:space-between;align-items:center;padding:14px 20px 10px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .pkg-title{font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:600;color:#fff}
        .pkg-id{font-family:'Share Tech Mono',monospace;font-size:10px;color:#6b7280}
        .size-badge{display:flex;align-items:center;gap:8px;font-family:'Share Tech Mono',monospace;font-size:9px;color:#a855f7}
        .size-icon{width:8px;height:8px;border-radius:50%;background:#a855f7;box-shadow: 0 0 5px #a855f7}

        .view-all{text-align:center;padding:12px;font-family:'Share Tech Mono',monospace;font-size:9px;color:#22d3ee;cursor:pointer;border-top:1px solid rgba(255,255,255,0.05);letter-spacing:0.14em}
        
        .health-section{padding:14px 20px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.01); margin-top: auto;}
        .health-title{font-family:'Share Tech Mono',monospace;font-size:8px;color:#6b7280;letter-spacing:0.2em;margin-bottom:10px}
        .health-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
        .hk{font-family:'Rajdhani',sans-serif;font-size:12px;color:#9ca3af}
        .hv{font-family:'Share Tech Mono',monospace;font-size:10px;color:#e5e7eb}

        .footer-bar2{position:fixed;bottom:0;left:0;right:0;height:28px;background:#05050a;border-top:1px solid rgba(168,85,247,0.2);display:flex;align-items:center;gap:20px;padding:0 24px; z-index: 100;}
        .fb2{font-family:'Share Tech Mono',monospace;font-size:8px;color:#4b5563;letter-spacing:0.14em}
        .fb2 span{color:#a855f7}
      `}</style>

      <SereneSailTopbar />

      <div className="ph">
        <div className="ph-title">
          <div className="ph-t">OPERATIONS HUB</div>
          <div className="live-badge" style={{ color: "#22d3ee" }}>LIVE TELEMETRY</div>
        </div>
        <div className="ph-sub">Real-time oversight of global maritime assets and high-priority logistics segments.</div>
      </div>

      <div className="fl-title-row">
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#a855f7", letterSpacing: "0.22em" }}>FLEET OVERVIEW</span>
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: "#4b5563", letterSpacing: "0.14em" }}>ACTIVE VESSELS: {vessels4.length}</span>
      </div>

      <div className="layout">
        {/* Panel Kiri: Daftar Kapal */}
        <div className="left-panel">
          <table>
            <thead>
              <tr>
                <th>VESSEL ID & NAME</th>
                <th>DESTINATION</th>
                <th>DELIVERY PROGRESS</th>
              </tr>
            </thead>
            <tbody>
              {vessels4.map((v : any, i : any) => (
                <tr key={i}>
                  <td>
                    <span className="vid3">{v.id}</span>
                    <span className="vsub">{v.sub}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: "#d1d5db" }}>{v.dest}</span>
                  </td>
                  <td>
                    <div className="prog-wrap">
                      <span className="prog-status">{v.status}</span>
                      <div className="prog-track">
                        <div className="prog-fill" style={{ width: `${v.pct}%` }} />
                      </div>
                      <span className="prog-pct">{v.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel Kanan: Paket & Health */}
        <div className="right-panel">
          <div className="size-tabs">
            {sizes.map((s : any) => (
              <button 
                key={s} 
                className={`stab ${activeSize === s ? "active" : ""}`} 
                onClick={() => setActiveSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="pkg-header">
            <span className="pkg-title">PACKAGE OVERVIEW</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
            </svg>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ fontSize: '7px', padding: '8px 16px' }}>ITEM ID</th>
                  <th style={{ fontSize: '7px', padding: '8px 16px' }}>SIZE</th>
                  <th style={{ fontSize: '7px', padding: '8px 16px' }}>DESTINATION</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((p : any, i : any) => (
                  <tr key={i}>
                    <td style={{ padding: '10px 16px' }}><span className="pkg-id">{p.id}</span></td>
                    <td style={{ padding: '10px 16px' }}>
                      <div className="size-badge"><div className="size-icon" />{p.size}</div>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: "#9ca3af" }}>{p.dest}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="view-all">VIEW ALL SEGMENTS</div>

          <div className="health-section">
            <div className="health-title">OPERATIONAL HEALTH</div>
            <div className="health-row"><span className="hk">Bandwidth Efficiency</span><span className="hv">98.2%</span></div>
            <div className="health-row"><span className="hk">Signal Integrity</span><span className="hv">Normal</span></div>
            <div className="health-row" style={{ marginBottom: 0 }}><span className="hk">Last Sync</span><span className="hv" style={{ color: "#4b5563" }}>0.02s ago</span></div>
          </div>
        </div>
      </div>

      <div className="footer-bar2">
        <span className="fb2">● SYSTEM HEALTH: <span>NOMINAL</span></span>
        <span className="fb2">CONNECTIVITY: <span>ACTIVE</span></span>
        <span className="fb2">TELEMETRY: <span>SYNCHRONIZED</span></span>
      </div>
    </>
  );
}
