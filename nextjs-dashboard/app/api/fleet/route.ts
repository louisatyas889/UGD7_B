import { NextResponse } from 'next/server';
import postgres from 'postgres';

// Inisialisasi koneksi ke database
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // 1. Ambil data dari semua tabel terkait
    const vessels = await sql`SELECT * FROM vessels ORDER BY id ASC`;
    const alerts = await sql`SELECT * FROM alerts ORDER BY id DESC LIMIT 3`;
    const fuel = await sql`SELECT * FROM fuel_stats ORDER BY id ASC`;
    
    // Ambil data region untuk bar chart di bawah
    const regions = await sql`SELECT * FROM regions ORDER BY id ASC`;

    // 2. Data kalkulasi & statis
    const activeVessels = vessels.length;
    
    const efficiencyData = {
      cargo: "93.4%",
      route: "87.1%"
    };

    // 3. Response JSON yang sudah termasuk 'regions'
    return NextResponse.json({
      vessels: vessels,
      alerts: alerts,
      fuel: fuel,
      regions: regions, // WAJIB ADA untuk merender Regional Distribution
      efficiency: efficiencyData,
      telemetry: {
        signal: '98%',
        active_vessels: activeVessels,
        total_distance: "14,205.82 km"
      }
    });

  } catch (error) {
    console.error("API Fleet Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data armada dan regional" }, 
      { status: 500 }
    );
  }
}
