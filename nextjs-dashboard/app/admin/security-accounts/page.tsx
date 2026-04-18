"use client";
import { useState, useEffect } from "react";
import SereneSailTopbar from "../../ui/SereneSailTopbar";

// Daftar pegawai untuk simulasi "Live Monitoring"
const staffMembers = [
  { name: "Captain Elias Thorne", role: "ROOT", loc: "BRIDGE" },
  { name: "Sarah Jenkins", role: "SECURE", loc: "ENGINE ROOM" },
  { name: "Marcus Vane", role: "SECURE", loc: "DECK 04" },
  { name: "Li Wei", role: "GUEST", loc: "CARGO BAY" },
  { name: "Dr. Julian Ross", role: "SECURE", loc: "MED-BAY" }
];

export default function SecurityAccountsPage() {
  const [activeLogs, setActiveLogs] = useState([
    { time: "14:22:01", msg: "Root access granted to Elias Thorne", color: "#22c55e", id: 1 },
    { time: "12:15:44", msg: "Failed login attempt from IP 104.22.1.9", color: "#f87171", id: 2 },
  ]);

  // Simulasi Data Real-time: User keluar masuk sistem
  useEffect(() => {
    const interval = setInterval(() => {
      const randomStaff = staffMembers[Math.floor(Math.random() * staffMembers.length)];
      const now = new Date().toLocaleTimeString('en-GB');
      
      const newLog = {
        time: now,
        msg: `${randomStaff.name} accessed system from ${randomStaff.loc}`,
        color: "#22d3ee",
        id: Date.now()
      };

      setActiveLogs(prev => [newLog, ...prev.slice(0, 14)]); // Simpan 15 log terbaru
    }, 5000); // Update setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ backgroundColor: "#0a0a10", minHeight: "100vh", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700&display=swap');
        .layout-sec{display:grid;grid-template-columns:1fr 450px;gap:24px;padding:24px}
        .panel{background:#0f0f1a;border:1px solid rgba(255,255,255,0.07);padding:20px;position:relative}
        .log-row{display:flex;gap:15px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.03);font-size:12px;animation: fadeIn 0.5s ease-out}
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .inp-cyber{width:100%;background:#050508;border:1px solid #333;color:white;padding:12px;margin-bottom:15px;font-family:'Share Tech Mono'}
        .btn-override{width:100%;padding:15px;background:linear-gradient(90deg,#22d3ee,#a855f7);border:none;color:white;font-weight:bold;cursor:pointer;letter-spacing:2px}
      `}</style>

      <SereneSailTopbar />

      {/* Header Info */}
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ fontSize: "10px", color: "#4b5563", fontFamily: "Share Tech Mono" }}>SYSTEM PROTOCOL 9.4</p>
          <h1 style={{ fontSize: "28px", fontWeight: "700", fontFamily: "Rajdhani" }}>Security & Control</h1>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ background: "#111", padding: "10px 20px", border: "1px solid #22c55e" }}>
            <p style={{ fontSize: "8px", color: "#6b7280" }}>GLOBAL STATUS</p>
            <p style={{ color: "#22c55e", fontSize: "12px", fontWeight: "bold" }}>● ENCRYPTED</p>
          </div>
          <div style={{ background: "#111", padding: "10px 20px", border: "1px solid #333" }}>
            <p style={{ fontSize: "8px", color: "#6b7280" }}>ACTIVE LINKS</p>
            <p style={{ fontSize: "12px", fontWeight: "bold" }}>14 NODES</p>
          </div>
        </div>
      </div>

      <div className="layout-sec">
        {/* Kiri: Live Monitoring (Tabel Aktivitas User) */}
        <div className="panel" style={{ minHeight: "600px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "12px", fontFamily: "Share Tech Mono", color: "#a855f7" }}>REMOTE SESSION MANAGEMENT</h3>
            <span style={{ fontSize: "10px", color: "#22d3ee" }}>LIVE TELEMETRY</span>
          </div>
          
          <div style={{ maxHeight: "500px", overflow: "hidden" }}>
            {activeLogs.map((log) => (
              <div key={log.id} className="log-row">
                <span style={{ color: log.color, fontFamily: "Share Tech Mono", minWidth: "80px" }}>[{log.time}]</span>
                <span style={{ color: "#9ca3af" }}>{log.msg}</span>
              </div>
            ))}
          </div>

          <button style={{ position: "absolute", bottom: "20px", left: "20px", background: "none", border: "1px dashed #ef4444", color: "#ef4444", padding: "10px", fontSize: "10px", width: "calc(100% - 40px)" }}>
            TERMINATE ALL SESSIONS
          </button>
        </div>

        {/* Kanan: Credential Control */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="panel">
            <h3 style={{ fontSize: "14px", marginBottom: "15px", fontFamily: "Share Tech Mono" }}>🛡️ CREDENTIAL CONTROL</h3>
            <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "20px" }}>Update administrative access tokens and authorization protocols.</p>
            
            <label style={{ fontSize: "9px", color: "#4b5563" }}>USER NAME</label>
            <input className="inp-cyber" defaultValue="Elias Thorne" />
            
            <label style={{ fontSize: "9px", color: "#4b5563" }}>JOB TITLE</label>
            <input className="inp-cyber" defaultValue="Captain Commander" />
            
            <label style={{ fontSize: "9px", color: "#4b5563" }}>NEW PASSWORD</label>
            <input className="inp-cyber" type="password" placeholder="••••••••••••" />

            <div style={{ background: "rgba(168,85,247,0.1)", padding: "15px", border: "1px solid #a855f7", marginBottom: "20px" }}>
              <p style={{ fontSize: "10px", color: "#a855f7", marginBottom: "10px" }}>AUTHORIZING CHANGES</p>
              <div style={{ display: "flex", gap: "10px" }}>
                {["S", "I", "G", "N"].map((l, i) => (
                  <div key={i} style={{ width: "30px", height: "30px", border: "1px solid #22d3ee", display: "flex", alignItems: "center", justifyContent: "center", color: "#22d3ee" }}>{l}</div>
                ))}
              </div>
            </div>

            <button className="btn-override">EXECUTE OVERRIDE</button>
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div style={{ position: "fixed", bottom: 0, width: "100%", padding: "10px 24px", background: "#050508", borderTop: "1px solid #222", fontSize: "10px", display: "flex", justifyContent: "space-between", color: "#4b5563", fontFamily: "Share Tech Mono" }}>
        <span>SYSTEM HEALTH: NOMINAL</span>
        <span>TELEMETRY: SYNCHRONIZED | LAT: 24.1200 N LONG: 80.1234 W</span>
      </div>
    </div>
  );
}
