import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // 1. Ambil semua data secara paralel agar cepat
    const [vessels, fuel, tracking] = await Promise.all([
      sql`SELECT * FROM vessels ORDER BY id ASC`,
      sql`SELECT h, c, l FROM fuel_stats ORDER BY id ASC`,
      sql`SELECT id, dest, lat, lng, vessel_name FROM tracking_packages LIMIT 3`
    ]);

    // 2. Logika Telemetri Dinamis
    // Menghitung jumlah kapal yang sedang berlayar (EN ROUTE)
    const activeCount = vessels.filter(v => v.status === 'EN ROUTE').length;
    
    // Mencari rata-rata signal strength (opsional, atau hardcoded sesuai desain)
    const avgSignal = "98.2%"; 

    // 3. Susun data sesuai dengan interface AnalyticsData di frontend
    const responseData = {
      vessels: vessels,
      fuel: fuel,
      tracking: tracking,
      telemetry: {
        activeVessels: activeCount,
        totalDistance: "12,840 NM", // Nilai akumulasi
        signal: avgSignal,
        weatherStatus: "OPTIMAL"
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Database Query Error:", error);
    return NextResponse.json(
      { error: "Gagal menyinkronkan data analitik" }, 
      { status: 500 }
    );
  }
}
