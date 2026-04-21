export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (!id) return NextResponse.json({ status: "Ready" });

    // KUNCI PERBAIKAN: Cari di 'tracking_packages'
    const results = await sql`
      SELECT 
        id, 
        vessel_name as name, 
        'ON ROUTE' as status, 
        lat, 
        lng 
      FROM tracking_packages 
      WHERE id = ${id.toUpperCase()} 
      LIMIT 1
    `;

    if (results.length === 0) {
      return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ vessels: results });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
