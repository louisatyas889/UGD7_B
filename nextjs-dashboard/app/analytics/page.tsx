"use client";
import { useState, useEffect } from "react";
import PrimeTopbar from "../ui/PrimeTopbar";

interface AnalyticsData {
  vessels: any[];
  fuel: any[];
  telemetry: {
    activeVessels: number;
    totalDistance: string;
    signal: string;
    weatherStatus: string;
  } | null;
  tracking: any[];
}

export default function AnalyticsPage() {
  const [time, setTime] = useState("");
  const [data, setData] = useState<AnalyticsData>({
    vessels: [],
    fuel: [],
    telemetry: null,
    tracking: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateClock = () => {
      const n = new Date();
      let h = n.getHours();
      const m = String(n.getMinutes()).padStart(2, "0");
      const ap = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setTime(`${h}:${m} ${ap}`);
    };
    
    updateClock();
    const clockId = setInterval(updateClock, 1000);

    const fetchData = async () => {
      try {
        const res = await fetch('/api/analytics'); // Pastikan path ini sesuai dengan route.ts kamu
        const json = await res.json();
        setData({
          vessels: json.vessels || [],
          fuel: json.fuel || [],
          telemetry: json.telemetry || null,
          tracking: json.tracking || []
        });
      } catch (err) {
        console.error("Gagal sinkronisasi dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => clearInterval(clockId);
  }, []);

  if (loading) return (
    <div style={{ background: '#050505', color: '#22d3ee', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron' }}>
      INITIALIZING SYSTEM...
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;600;700;900&display=swap');
        body { background: #050505; color: #e5e7eb; font-family: 'Rajdhani', sans-serif; margin: 0; }
        .main-container { padding: 30px 40px; max-width: 1600px; margin: 0 auto; }
        .grid-layout { display: grid; grid-template-columns: 1fr 400px; gap: 30px; margin-top: 30px; }
        .panel-v3 { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.03); border-radius: 4px; padding: 24px; }
        .kpi-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .kpi-card { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.03); border-radius: 4px; padding: 20px; }
        .kpi-label { font-family: 'Share Tech Mono', monospace; font-size: 8px; color: #4b5563; letter-spacing: 0.1em; margin-bottom: 10px; text-transform: uppercase; }
        .kpi-val { font-family: 'Orbitron', sans-serif; font-size: 32px; font-weight: 800; color: #fff; }
        .fuel-chart-wrap { display: flex; align-items: flex-end; gap: 10px; height: 180px; margin-top: 30px; border-bottom: 1px solid #111; padding-bottom: 10px; }
        .fuel-bar { flex: 1; border-radius: 2px 2px 0 0; position: relative; transition: height 0.5s ease; }
        .fuel-bar-label { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-family: 'Share Tech Mono', monospace; font-size: 7px; color: #374151; }
        .loc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .loc-card { background: #0d0d0d; padding: 15px; border-radius: 4px; border: 1px solid rgba(168, 85, 247, 0.1); }
      `}</style>

      <PrimeTopbar />

      <div className="main-container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontFamily: "'Orbitron'", fontSize: 28, fontWeight: 800, margin: 0, color: "#fff" }}>Analytics</h1>
            <p style={{ color: "#4b5563", fontSize: 13, marginTop: 5 }}>Surveilans data real-time untuk armada PrimeLog.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#22d3ee", fontFamily: "'Share Tech Mono'", fontSize: 10 }}>SYSTEM OPERATIONAL</div>
            <div style={{ fontFamily: "'Orbitron'", fontSize: 16, color: "#fff" }}>{time}</div>
          </div>
        </div>

        <div className="grid-layout">
          <div className="left-col">
            <div className="kpi-row">
              <div className="kpi-card" style={{ borderLeft: "3px solid #a855f7" }}>
                <div className="kpi-label">TOTAL DISTANCE</div>
                <div className="kpi-val">{data.telemetry?.totalDistance || '0 NM'}</div>
                <div style={{ color: "#a855f7", fontSize: 9, fontFamily: "'Share Tech Mono'", marginTop: 10 }}>◉ GLOBAL TRACKING</div>
              </div>
              <div className="kpi-card" style={{ borderLeft: "3px solid #22d3ee" }}>
                <div className="kpi-label">SIGNAL STRENGTH</div>
                <div className="kpi-val">{data.telemetry?.signal || '0%'}</div>
                <div style={{ color: "#22d3ee", fontSize: 9, fontFamily: "'Share Tech Mono'", marginTop: 10 }}>STATUS: {data.telemetry?.weatherStatus || 'UNKNOWN'}</div>
              </div>
            </div>

            <div className="panel-v3" style={{ marginBottom: 30 }}>
              <div style={{ fontFamily: "'Rajdhani'", fontSize: 14, fontWeight: 600 }}>PENGGUNAAN BAHAN BAKAR</div>
              <div className="fuel-chart-wrap">
                {data.fuel.map((f: any, i: number) => (
                  <div key={i} className="fuel-bar" style={{ height: `${f.h}%`, background: f.c }}>
                    <div className="fuel-bar-label">{f.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-v3">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ fontFamily: "'Rajdhani'", fontSize: 14, fontWeight: 600 }}>LOKASI TERAKHIR (PACKAGES)</div>
                <div style={{ color: "#a855f7", fontSize: 9, fontFamily: "'Share Tech Mono'" }}>◉ LIVE COORDINATES</div>
              </div>
              <div className="loc-grid">
                {data.tracking.map((t: any, i: number) => (
                  <div className="loc-card" key={i}>
                    <div style={{ fontFamily: "'Orbitron'", fontSize: 10, color: "#a855f7", marginBottom: 8 }}>{t.id}</div>
                    <div style={{ fontSize: 8, color: "#4b5563", fontFamily: "'Share Tech Mono'" }}>VESSEL: {t.vessel_name || t.vesselName}</div>
                    <div style={{ fontSize: 9, color: "#e5e7eb", fontFamily: "'Share Tech Mono'", marginBottom: 8 }}>{t.lat}°, {t.lng}°</div>
                    <div style={{ fontSize: 8, color: "#4b5563", fontFamily: "'Share Tech Mono'" }}>DESTINATION</div>
                    <div style={{ fontSize: 9, color: "#22d3ee", fontFamily: "'Share Tech Mono'" }}>{t.dest}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="panel-v3" style={{ marginBottom: 30 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 20 }}>STATUS ARMADA (ACTIVE)</div>
              {data.vessels.map((v: any, i: number) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 8 }}>
                    <span>
                      <span style={{ color: v.status_color || v.statusColor || "#fff", marginRight: 8 }}>■</span> 
                      {v.id}
                    </span>
                    <span style={{ color: "#fff" }}>{v.status}</span>
                  </div>
                  <div style={{ height: 4, background: "#111", borderRadius: 2 }}>
                    <div style={{ 
                      width: `100%`, 
                      height: "100%", 
                      background: v.status_color || v.statusColor || "#333", 
                      borderRadius: 2 
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="panel-v3">
              <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, marginBottom: 25 }}>Operational Capacity</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: "relative", width: 120, height: 120, marginBottom: 20 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#111" strokeWidth="10" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#22d3ee" 
                      strokeWidth="10" 
                      strokeDasharray={`${(data.telemetry?.activeVessels || 0) / (data.vessels.length || 1) * 251} 251`} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Orbitron' }}>{data.telemetry?.activeVessels || 0}</div>
                    <div style={{ fontSize: 6, color: "#4b5563", fontFamily: 'Share Tech Mono' }}>ACTIVE</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Orbitron', fontSize: 20, fontWeight: 700 }}>{data.vessels.length}</div>
                  <div style={{ fontSize: 7, color: '#4b5563', fontFamily: 'Share Tech Mono' }}>TRACKED VESSELS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
