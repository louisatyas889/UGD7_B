"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState(""); 
  const [key, setKey] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState("WAITING FOR INPUT..."); 
  const [statusColor, setStatusColor] = useState("#a855f7");
  const [error, setError] = useState("");

  const handleConnect = async () => {
    if (connecting) return;

    if (!name.trim() || !key.trim()) { 
      setError("OPERATOR ID & AUTHORIZATION KEY REQUIRED"); 
      setStatus("INPUT ERROR"); 
      setStatusColor("#f87171"); 
      return; 
    }

    setError(""); 
    setConnecting(true); 
    setStatus("AUTHENTICATING..."); 
    setStatusColor("#f59e0b");

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, key })
      });

      const result = await response.json();

      if (response.ok) {
        // Cek Role dari database
        if (result.user.role === 'ADMIN' || result.user.role === 'SYS-ADMIN') {
          setStatus("ADMIN ACCESS GRANTED — INITIALIZING SECURE TERMINAL...");
          setStatusColor("#a855f7");
          
          // --- PERBAIKAN DI SINI: Diarahkan ke User Management ---
          setTimeout(() => router.push("/admin/user-management"), 1500);
        } else {
          setStatus("CONNECTION ESTABLISHED — REDIRECTING...");
          setStatusColor("#22c55e");
          setTimeout(() => router.push("/dashboard"), 1500);
        }
      } else {
        throw new Error(result.error || "INVALID OPERATOR CREDENTIALS");
      }
    } catch (err: any) {
      setConnecting(false);
      setError(err.message.toUpperCase());
      setStatus("ACCESS DENIED");
      setStatusColor("#ef4444");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow:wght@300;400;500&family=Orbitron:wght@400;600;700;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{width:100%;height:100%;background:#020204;overflow:hidden}
        
        .page{
          position:relative;width:100vw;height:100vh;
          display:flex;flex-direction:column;overflow:hidden;
          background:#050508;
        }

        .page::before {
          content: ""; position: absolute; inset: 0;
          background-image: 
            linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          perspective: 500px;
          transform: rotateX(20deg); transform-origin: top;
          animation: gridMove 20s linear infinite; z-index: 1;
        }

        .page::after {
          content: ""; position: absolute; width: 100%; height: 2px;
          background: rgba(168, 85, 247, 0.2); box-shadow: 0 0 15px #a855f7;
          top: 0; z-index: 3; animation: scan 4s linear infinite;
        }

        @keyframes gridMove { from { background-position: 0 0; } to { background-position: 0 100%; } }
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }

        .vignette{position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse 70% 80% at 50% 40%,transparent 30%,rgba(0,0,0,0.8) 100%)}
        
        .topbar{position:relative;z-index:10;display:flex;align-items:flex-start;justify-content:space-between;padding:20px 32px 0}
        .logo-block{display:flex;align-items:flex-start;gap:10px;cursor:pointer;transition:all 0.3s}
        .logo-block:hover { text-shadow: 0 0 12px #a855f7; }
        .logo-icon{width:36px;height:36px;background:rgba(88,28,200,0.25);border:1px solid rgba(168,85,247,0.4);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
        .logo-text{display:flex;flex-direction:column}
        .logo-name{font-family:'Orbitron',sans-serif;font-size:13px;font-weight:700;color:#a855f7;letter-spacing:0.1em;line-height:1}
        .logo-sub{font-family:'Share Tech Mono',monospace;font-size:7px;color:#9ca3af;letter-spacing:0.22em;margin-top:3px}
        .logo-coords{font-family:'Share Tech Mono',monospace;font-size:7.5px;color:#6b7280;letter-spacing:0.08em;margin-top:6px;line-height:1.7}
        .status-pills{display:flex;gap:20px;align-items:center;padding-top:6px}
        .pill{display:flex;align-items:center;gap:6px;font-family:'Share Tech Mono',monospace;font-size:9px;color:#9ca3af;letter-spacing:0.16em}
        .pill-dot{width:7px;height:7px;border-radius:50%;animation:pdot 2s ease-in-out infinite}
        .pill-dot.green{background:#22c55e;box-shadow:0 0 7px #22c55e}
        @keyframes pdot{0%,100%{opacity:1}50%{opacity:0.35}}
        
        .center{flex:1;display:flex;align-items:center;justify-content:center;position:relative;z-index:10}
        .modal{width:100%;max-width:360px;background:rgba(8,5,18,0.88);border:1px solid rgba(168,85,247,0.5);border-radius:6px;padding:36px 32px 28px;box-shadow:0 0 60px rgba(168,85,247,0.1);backdrop-filter:blur(16px);position:relative}
        .corner{position:absolute;width:14px;height:14px;border-color:#a855f7;border-style:solid}
        .corner.tl{top:-1px;left:-1px;border-width:2px 0 0 2px}
        .corner.tr{top:-1px;right:-1px;border-width:2px 2px 0 0}
        .corner.bl{bottom:-1px;left:-1px;border-width:0 0 2px 2px}
        .corner.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0}
        .modal-title{font-family:'Orbitron',sans-serif;font-size:17px;font-weight:700;text-align:center;color:#fff;letter-spacing:0.18em;margin-bottom:8px}
        .modal-sub{font-family:'Barlow',sans-serif;font-size:13px;color:#9ca3af;text-align:center;margin-bottom:28px;font-weight:300;letter-spacing:0.02em}
        
        .field{margin-bottom:16px}
        .field-label{display:block;font-family:'Share Tech Mono',monospace;font-size:8px;color:#a855f7;letter-spacing:0.28em;text-transform:uppercase;margin-bottom:8px}
        .input-wrap{display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(168,85,247,0.2);border-radius:4px;transition:border-color 0.2s,box-shadow 0.2s}
        .input-wrap:focus-within{border-color:rgba(168,85,247,0.55);box-shadow:0 0 14px rgba(168,85,247,0.12)}
        .input-wrap input{background:none;border:none;outline:none;color:#d1d5db;font-family:'Share Tech Mono',monospace;font-size:12px;width:100%;letter-spacing:0.06em}
        
        .btn{width:100%;height:50px;border:none;border-radius:4px;background:linear-gradient(90deg,#7c3aed 0%,#a855f7 50%,#c084fc 100%);color:#fff;font-family:'Orbitron',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;position:relative;overflow:hidden;margin-bottom:22px;transition:box-shadow 0.3s}
        .btn:hover:not(:disabled) { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
        .btn:disabled{opacity:0.7;cursor:not-allowed}
        
        .footer-bottom{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:10px 32px 18px}
        .footer-copy{font-family:'Share Tech Mono',monospace;font-size:7px;color:#374151;letter-spacing:0.1em}
      `}</style>

      <div className="page">
        <div className="vignette"/>

        <div className="topbar">
          <div className="logo-block">
            <div className="logo-icon">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path d="M1 3 Q3.5 1 6 3 Q8.5 5 11 3 Q13.5 1 16 3 Q18.5 5 20 3" stroke="#a855f7" strokeWidth="1.8" fill="none"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-name">Serene Sail</span>
              <span className="logo-sub">MARITIME INTELLIGENCE NETWORK</span>
              <div className="logo-coords">LAT: 51.5074° N<br/>LONG: 0.1278° W</div>
            </div>
          </div>
          <div className="status-pills">
            <div className="pill"><div className="pill-dot green"/>SIGNAL: STABLE</div>
          </div>
        </div>

        <div className="center">
          <div className="modal">
            <div className="corner tl"/><div className="corner tr"/><div className="corner bl"/><div className="corner br"/>
            <div className="modal-title">SECURE ACCESS PORTAL</div>
            <div className="modal-sub">Verify credentials from Neon Database.</div>
            
            <div className="field">
              <span className="field-label">OPERATOR ID</span>
              <div className="input-wrap">
                <input 
                  type="text" 
                  value={name} 
                  onChange={e=>{setName(e.target.value); setError("")}} 
                  placeholder="e.g. Louisa Admin"
                  disabled={connecting}
                />
              </div>
            </div>

            <div className="field">
              <span className="field-label">AUTHORIZATION KEY</span>
              <div className="input-wrap">
                <input 
                  type="password" 
                  value={key} 
                  onChange={e=>{setKey(e.target.value); setError("")}} 
                  placeholder="····"
                  disabled={connecting}
                />
              </div>
            </div>

            {error && (
              <div style={{color:'#f87171', fontSize:9, fontFamily:'Share Tech Mono', marginBottom:15, border:'1px solid rgba(248,113,113,0.3)', padding:8, background:'rgba(248,113,113,0.05)'}}>
                ⚠ {error}
              </div>
            )}

            <button className="btn" onClick={handleConnect} disabled={connecting}>
              {connecting ? "AUTHENTICATING..." : "INITIATE CONNECTION"}
            </button>

            <div style={{marginTop:20, display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
              <div style={{width:7, height:7, borderRadius:'50%', background:statusColor, boxShadow:`0 0 7px ${statusColor}`, animation:'pdot 1.2s ease-in-out infinite'}}/>
              <span style={{color: statusColor, fontSize:9, fontFamily:'Share Tech Mono', letterSpacing:1}}>{status}</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© 2026 SERENE SAIL MARITIME INTELLIGENCE NETWORK.</span>
        </div>
      </div>
    </>
  );
}
