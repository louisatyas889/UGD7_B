import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // 1. Ambil Data Kapal/Vessels
    const vessels = await sql`
      SELECT id, dest, status, status_color as "statusColor", eta, eta_color as "etaColor", mon 
      FROM vessels
    `;

    // 2. Data Telemetry (Bisa di-hardcode atau ambil dari agregasi)
    const telemetry = {
      activeVessels: vessels.length,
      totalDistance: "12,840 NM",
      signal: "SAT-LINK-9",
      weatherStatus: "OPTIMAL"
    };

    // 3. Data Fuel (Hardcoded untuk visualisasi bar chart)
    const fuel = [
      { l: "V-992", h: 85, c: "#22d3ee" },
      { l: "V-441", h: 42, c: "#a855f7" },
      { l: "V-770", h: 68, c: "#22d3ee" }
    ];

    // 4. Data Alerts/Logs
    const alerts = [
      { type: "CRITICAL", tc: "#f87171", time: "02:14", body: "Suez Canal passage confirmed for PL-770." },
      { type: "SYSTEM", tc: "#22d3ee", time: "05:00", body: "Satellite link re-established in Sector NW-440." }
    ];

    return NextResponse.json({ 
      vessels, 
      telemetry, 
      fuel, 
      alerts 
    });

  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data dashboard" }, { status: 500 });
  }
}
