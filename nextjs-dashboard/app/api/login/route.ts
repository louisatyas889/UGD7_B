import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, key } = body;

    // Bersihkan spasi yang tidak sengaja terketik
    const cleanName = name?.trim();
    const cleanKey = key?.trim();

    // Query diperbaiki agar bisa cek ke kolom 'name' ATAU 'id'
    // PostgreSQL sangat sensitif terhadap huruf besar/kecil (Case Sensitive)
    const users = await sql`
      SELECT * FROM users 
      WHERE (name = ${cleanName} OR id = ${cleanName}) 
      AND key = ${cleanKey} 
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "INVALID OPERATOR CREDENTIALS" }, 
        { status: 401 }
      );
    }

    // Mengirim data user jika ditemukan
    return NextResponse.json({ user: users[0] });

  } catch (error: any) {
    // Memberikan pesan error yang lebih jelas di konsol terminal
    console.error("Login API Error:", error.message);
    return NextResponse.json(
      { error: "DATABASE_ERROR: " + error.message }, 
      { status: 500 }
    );
  }
}