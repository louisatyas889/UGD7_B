import postgres from 'postgres';
import { Vessel, Alert, Fuel } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// --- Fungsi yang sudah ada ---

export async function fetchVessels() {
  try {
    const data = await sql<Vessel[]>`
      SELECT id, dest, status, status_color AS "statusColor", eta, eta_color AS "etaColor", mon 
      FROM vessels
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data vessels.');
  }
}

export async function fetchAlerts() {
  try {
    const data = await sql<Alert[]>`SELECT * FROM alerts ORDER BY id DESC`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data alerts.');
  }
}

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
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data telemetry.');
  }
}

// --- TAMBAHKAN FUNGSI BARU DI BAWAH INI ---

// Fungsi untuk mengambil data Personel (Dibutuhkan untuk halaman Fleet/Kru)
export async function fetchFleetPersonnel() {
  try {
    const data = await sql`
      SELECT 
        id, 
        name, 
        job_title AS "jobTitle", 
        work_shift AS "workShift", 
        working_hours AS "workingHours", 
        assigned_vessel AS "assignedVessel"
      FROM fleet_personnel
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data personnel.');
  }
}

// Fungsi untuk mengambil data Tracking (Sangat penting untuk halaman Analytics & Map)
export async function fetchTrackingPackages() {
  try {
    const data = await sql`
      SELECT 
        id, 
        size, 
        dest, 
        lat, 
        lng, 
        vessel_name AS "vesselName" 
      FROM tracking_packages
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal mengambil data tracking.');
  }
}
