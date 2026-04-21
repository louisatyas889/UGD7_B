import { NextResponse } from 'next/server';
import postgres from 'postgres';

// Inisialisasi koneksi ke database Neon
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // Mengambil data kapal dengan koordinat dan detail telemetri lengkap
    // Urutan berdasarkan ID agar konsisten di peta
    const vessels = await sql`
      SELECT 
        id, 
        lat, 
        lng, 
        speed, 
        fuel, 
        diag, 
        signal, 
        weather, 
        color 
      FROM vessels 
      ORDER BY id ASC
    `;

    // Response JSON untuk dikonsumsi oleh Leaflet di frontend
    return NextResponse.json({
      vessels: vessels
    });

  } catch (error) {
    console.error("Map API Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data koordinat armada" }, 
      { status: 500 }
    );
  }
}
