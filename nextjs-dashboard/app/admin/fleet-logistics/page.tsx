"use client";
import { useState, useEffect } from "react";
import SereneSailTopbar from "@/app/ui/SereneSailTopbar";

// 1. Definisikan Tipe Data agar TypeScript tidak bingung
interface Vessel {
  id: string;
  dest: string;
  status: string;
  status_color: string;
  pct: number;
}

interface Tracking {
  id: string;
  size: string;
  dest: string;
}

interface DashboardData {
  vessels: Vessel[];
  tracking: Tracking[];
}

// 2. Data Dummy untuk Fallback
const fallbackData: DashboardData = {
  vessels: [
    { id: "PL-992-BUMI", dest: "Port of Rotterdam (NLD)", status: "EN ROUTE", status_color: "#22d3ee", pct: 85 },
    { id: "PL-441-BULAN", dest: "Singapore Harbor (SGP)", status: "IN PORT", status_color: "#6b7280", pct: 100 },
    { id: "PL-770-ORION", dest: "Suez Canal (EGY)", status: "DELAYED", status_color: "#f87171", pct: 35 }
  ],
  tracking: [
    { id: "PKG-100293", size: "MEDIUM", dest: "Japan (HND)" },
    { id: "PKG-100412", size: "MEDIUM", dest: "Germany (FRA)" },
    { id: "PKG-200112", size: "SMALL", dest: "Korea (ICN)" }
  ]
};

export default function FleetLogisticsPage() {
  const [activeSize, setActiveSize] = useState("MEDIUM");
  
  // 3. Inisialisasi State dengan Tipe yang Benar
  const [data, setData] = useState<DashboardData>({
    vessels: [],
    tracking: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; 
    
    async function fetchAdminData() {
      try {
        const response = await fetch('/api/fleet-logistics'); 
        const result = await response.json();
        
        if (isMounted) {
          // Jika API mengembalikan data, pakai itu. Jika kosong/error, pakai fallback.
          setData({
            vessels: result.vessels?.length > 0 ? result.vessels : fallbackData.vessels,
            tracking: result.tracking?.length > 0 ? result.tracking : fallbackData.tracking
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        if (isMounted) {
          setData(fallbackData); // Pakai dummy jika koneksi gagal
          setLoading(false);
        }
      }
    }
    fetchAdminData();
    return () => { isMounted = false; };
  }, []);

  const sizes = ["SMALL", "MEDIUM", "LARGE"];
  const filteredPackages = data.tracking.filter((p) => p.size === activeSize);

  if (loading) return (
    <div style={{ 
      color: '#a855f7', padding: '20px', background: '#0a0a10', minHeight: '100vh',
      fontFamily: "'Share Tech Mono', monospace", display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      &gt; ACCESSING NEON DATABASE...
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;600;700;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{background:#0a0a10;color:#e5e7eb;font-family:'Rajdhani',sans-serif;min-height:100vh; overflow: hidden;}
        .ph{padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.06)}
        .ph-title{display:flex;align-items:center;gap:14px;margin-bottom:4px}
        .ph-t{font-family:'Orbitron',sans-serif;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.04em}
        .layout{display:grid;grid-template-columns:1fr 1fr;gap:0;height:calc(100vh - 165px)}
        .left-panel{border-right:1px solid rgba(255,255,255,0.07); overflow-y: auto;}
        table{width:100%;border-collapse:collapse}
        th{font-family:'Share Tech Mono',monospace;font-size:7px;color:#4b5563;padding:12px 18px;text-align:left;text-transform:uppercase;position:sticky;top:0;background:#0a0a10;}
        td{padding:12px 18px;border-bottom:1px solid rgba(255,255,255,0.04)}
        .prog-fill{height:100%;background:#a855f7;box-shadow:0 0 6px rgba(168,85,247,0.5); transition: width 0.5s ease;}
        .stab{padding:12px;text-align:center;font-family:'Share Tech Mono',monospace;font-size:9px;cursor:pointer;background:none;color:#6b7280;border:none}
        .stab.active{background:rgba(168,85,247,0.15); color:#a855f7; box-shadow: inset 0 -2px 0 #a855f7}
        .footer-bar2{position:fixed;bottom:0;width:100%;height:28px;background:#05050a;border-top:1px solid rgba(168,85,247,0.2);display:flex;align-items:center;padding:0 24px;}
      `}</style>

      <SereneSailTopbar />

      <div className="ph">
        <div className="ph-title">
          <div className="ph-t">OPERATIONS HUB</div>
        </div>
      </div>

      <div className="layout">
        <div className="left-panel">
          <table>
            <thead>
              <tr><th>VESSEL ID</th><th>DESTINATION</th><th>PROGRESS</th></tr>
            </thead>
            <tbody>
              {data.vessels.map((v) => (
                <tr key={v.id}>
                  <td><span style={{color:'#a855f7', fontFamily:"'Share Tech Mono'"}}>{v.id}</span></td>
                  <td style={{fontSize:'12px'}}>{v.dest}</td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                      <span style={{fontSize:'8px', color: v.status_color}}>{v.status}</span>
                      <div style={{width:'80px', height:'4px', background:'rgba(255,255,255,0.06)'}}>
                        <div className="prog-fill" style={{ width: `${v.pct}%` }} />
                      </div>
                      <span style={{fontSize:'9px'}}>{v.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="right-panel" style={{display:'flex', flexDirection:'column'}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)'}}>
            {sizes.map((s) => (
              <button key={s} className={`stab ${activeSize === s ? "active" : ""}`} onClick={() => setActiveSize(s)}>{s}</button>
            ))}
          </div>
          <div style={{flex:1, overflowY:'auto'}}>
            <table>
              <thead>
                <tr><th>ITEM ID</th><th>SIZE</th><th>DESTINATION</th></tr>
              </thead>
              <tbody>
                {filteredPackages.map((p) => (
                  <tr key={p.id}>
                    <td style={{fontSize:'10px', color:'#6b7280'}}>{p.id}</td>
                    <td style={{fontSize:'9px', color:'#a855f7'}}>{p.size}</td>
                    <td style={{fontSize:'12px'}}>{p.dest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="footer-bar2">
        <span style={{fontSize:'8px', color:'#4b5563'}}>SYSTEM HEALTH: <span style={{color:'#a855f7'}}>NOMINAL</span></span>
      </div>
    </>
  );
}
