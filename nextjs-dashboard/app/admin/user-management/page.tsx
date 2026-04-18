"use client";
import { useState, useEffect } from "react";
import SereneSailTopbar from "../../ui/SereneSailTopbar";
import { fleetPersonnel } from "../../lib/placeholder-data";

export default function UserManagementPage() {
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  const checkStatus = (start: number, end: number) => {
    if (start < end) return currentHour >= start && currentHour < end;
    return currentHour >= start || currentHour < end; // Logic shift malam
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0c", color: "white", fontFamily: "sans-serif" }}>
      <SereneSailTopbar />
      
      <main style={{ padding: "40px" }}>
        <header style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "10px", fontFamily: "monospace", color: "#6b7280", letterSpacing: "0.2em" }}>
            — FLEET PERSONNEL COMMAND
          </p>
          <h1 style={{ fontSize: "30px", fontWeight: "bold", marginTop: "4px" }}>User Management</h1>
        </header>

        {/* STATS GRID (Kembali Lagi!) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "CREW", value: "142" },
            { label: "ON DECK", value: "38", status: "online" },
            { label: "SHIFT OVERLAP", value: "12 HRS" },
            { label: "SECURITY STATUS", value: "Normal", color: "#4ade80" }
          ].map((stat, i) => (
            <div key={i} style={{ backgroundColor: "#111114", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
              <p style={{ fontSize: "9px", fontFamily: "monospace", color: "#6b7280", marginBottom: "8px" }}>{stat.label}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {stat.status === "online" && <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />}
                <span style={{ fontSize: "24px", fontWeight: "600", color: stat.color || "white" }}>{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Personnel Table */}
        <div style={{ backgroundColor: "#0d0d10", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "2px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ color: "#6b7280", borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "monospace", fontSize: "10px" }}>
                <th style={{ padding: "16px 24px" }}>USER ID</th>
                <th style={{ padding: "16px 24px" }}>NAME</th>
                <th style={{ padding: "16px 24px" }}>STATUS</th>
                <th style={{ padding: "16px 24px" }}>WORK SHIFT</th>
                <th style={{ padding: "16px 24px" }}>JOB TITLE</th>
                <th style={{ padding: "16px 24px", textAlign: "right" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {fleetPersonnel.map((crew) => {
                const isOnDuty = checkStatus(crew.startHour, crew.endHour);
                return (
                  <tr key={crew.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "16px 24px", color: "#9ca3af", fontFamily: "monospace" }}>{crew.id}</td>
                    <td style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
                      <span style={{ fontWeight: "500" }}>{crew.name}</span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: isOnDuty ? "#4ade80" : "#ef4444", boxShadow: isOnDuty ? "0 0 8px #4ade80" : "none" }} />
                        <span style={{ fontSize: "10px", color: isOnDuty ? "#4ade80" : "#ef4444" }}>{isOnDuty ? "ON SITE" : "RESTING"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "2px", border: "1px solid rgba(255,255,255,0.1)", color: crew.workShift === "NIGHT" ? "#a855f7" : crew.workShift === "SWING" ? "#fbbf24" : "#60a5fa" }}>{crew.workShift}</span>
                    </td>
                    <td style={{ padding: "16px 24px", color: "#9ca3af" }}>{crew.jobTitle}</td>
                    <td style={{ padding: "16px 24px", textAlign: "right", cursor: "pointer", position: "relative" }} onClick={() => setSelectedCrew(selectedCrew === crew.id ? null : crew.id)}>
                      ⋮
                      {selectedCrew === crew.id && (
                         <div style={{ position: "absolute", right: "60px", top: "0", zIndex: 50, width: "180px", backgroundColor: "#16161a", border: "1px solid #22d3ee", padding: "15px", textAlign: "left" }}>
                            <p style={{ fontSize: "8px", color: "#6b7280" }}>ASSIGNED VESSEL</p>
                            <p style={{ fontSize: "10px", color: "#22d3ee", fontWeight: "bold" }}>{crew.assignedVessel}</p>
                            <p style={{ fontSize: "8px", color: "#6b7280", marginTop: "10px" }}>DUTY STATUS</p>
                            <p style={{ fontSize: "10px", color: "white" }}>{isOnDuty ? "On Board" : "Off Duty"}</p>
                            <button style={{ marginTop: "10px", width: "100%", backgroundColor: "white", color: "black", fontWeight: "bold", fontSize: "10px", padding: "5px", border: "none" }}>SAVE</button>
                         </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <footer style={{ position: "fixed", bottom: 0, width: "100%", backgroundColor: "#050508", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "8px 24px", display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#4b5563", fontFamily: "monospace" }}>
        <div>SYSTEM HEALTH: NOMINAL | CONNECTIVITY: ACTIVE</div>
        <div>LAT: 24.1200 N LONG: 80.1234 W</div>
      </footer>
    </div>
  );
}
