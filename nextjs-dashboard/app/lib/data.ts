import postgres from 'postgres';
import { Vessel, Alert, Fuel } from './definitions'; // Pastikan interface ini sudah ada

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Query untuk mengambil data Kapal (Vessels)
export async function fetchVessels() {
  try {
    const data = await sql<Vessel[]>`
      SELECT 
        id, 
        dest, 
        status, 
        status_color AS "statusColor", 
        eta, 
        eta_color AS "etaColor", 
        mon 
      FROM vessels
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data vessels.');
  }
}

// Query untuk mengambil Alerts
export async function fetchAlerts() {
  try {
    const data = await sql<Alert[]>`SELECT * FROM alerts ORDER BY id DESC`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data alerts.');
  }
}

// Query untuk mengambil data Fuel (Bahan Bakar)
export async function fetchFuel() {
  try {
    const data = await sql<Fuel[]>`SELECT c, h, l FROM fuel`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data fuel.');
  }
}

export async function fetchTelemetry() {
  try {
    const data = await sql`
      SELECT 
        active_vessels AS "activeVessels", 
        total_distance AS "totalDistance", 
        signal, 
        weather_status AS "weatherStatus" 
      FROM telemetry 
      LIMIT 1
    `;
    return data[0]; // Kita hanya ambil satu baris data terbaru
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data telemetry.');
  }
}