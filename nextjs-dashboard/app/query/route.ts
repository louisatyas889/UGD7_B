export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import postgres from 'postgres';
// Import fungsi data dashboard kamu
import { 
  fetchVessels, 
  fetchAlerts, 
  fetchFuel, 
  fetchTelemetry,
  fetchFleetPersonnel,
  fetchTrackingPackages 
} from '@/app/lib/data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    // KONDISI 1: Jika ada ID (Digunakan oleh fitur Tracing di Landing Page)
    if (id) {
      const vessels = await sql`
        SELECT id, name, status, lat, lng 
        FROM vessels 
        WHERE id = ${id.toUpperCase()} 
        LIMIT 1
      `;
      return NextResponse.json({ vessels });
    }

    // KONDISI 2: Jika tidak ada ID (Digunakan oleh Dashboard Admin)
    const [vessels, alerts, fuel, telemetry, personnel, tracking] = await Promise.all([
      fetchVessels(),
      fetchAlerts(),
      fetchFuel(),
      fetchTelemetry(),
      fetchFleetPersonnel(),
      fetchTrackingPackages(),
    ]);

    return NextResponse.json({ 
      vessels, 
      alerts, 
      fuel, 
      telemetry, 
      personnel, 
      tracking 
    });

  } catch (error: any) {
    console.error("Error di Query Router:", error); 
    return NextResponse.json(
      { error: 'Gagal ambil data: ' + error.message }, 
      { status: 500 }
    );
  }
}