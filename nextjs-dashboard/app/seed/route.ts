import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { 
  users, 
  vessels, 
  alerts, 
  fuel, 
  fleetPersonnel, 
  TrakingPackages 
} from '../lib/placeholder-data'; // Impor semua data dummy kamu di sini

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// 1. Seed Users (Data Login)
async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      key TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map((user) => sql`
        INSERT INTO users (id, name, key)
        VALUES (${user.id}, ${user.name}, ${user.key})
        ON CONFLICT (id) DO NOTHING;
      `)
  );
  return insertedUsers;
}

// 2. Seed Vessels (Data Armada Utama)
async function seedVessels() {
  await sql`
    CREATE TABLE IF NOT EXISTS vessels (
      id VARCHAR(255) PRIMARY KEY,
      dest VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL,
      status_color VARCHAR(50) NOT NULL,
      eta VARCHAR(50) NOT NULL,
      eta_color VARCHAR(50) NOT NULL,
      mon VARCHAR(50) NOT NULL
    );
  `;

  const insertedVessels = await Promise.all(
    vessels.map((v) => sql`
        INSERT INTO vessels (id, dest, status, status_color, eta, eta_color, mon)
        VALUES (${v.id}, ${v.dest}, ${v.status}, ${v.statusColor}, ${v.eta}, ${v.etaColor}, ${v.mon})
        ON CONFLICT (id) DO NOTHING;
      `)
  );
  return insertedVessels;
}

// 3. Seed Alerts (Log Sistem)
async function seedAlerts() {
  await sql`
    CREATE TABLE IF NOT EXISTS alerts (
      id SERIAL PRIMARY KEY,
      type VARCHAR(255) NOT NULL,
      tc VARCHAR(50) NOT NULL,
      time VARCHAR(50) NOT NULL,
      body TEXT NOT NULL
    );
  `;

  const insertedAlerts = await Promise.all(
    alerts.map((a) => sql`
        INSERT INTO alerts (type, tc, time, body)
        VALUES (${a.type}, ${a.tc}, ${a.time}, ${a.body});
      `)
  );
  return insertedAlerts;
}

// 4. Seed Fuel (Energi Sektor)
async function seedFuel() {
  await sql`
    CREATE TABLE IF NOT EXISTS fuel (
      id SERIAL PRIMARY KEY,
      c VARCHAR(50) NOT NULL,
      h INTEGER NOT NULL,
      l VARCHAR(100) NOT NULL
    );
  `;

  const insertedFuel = await Promise.all(
    fuel.map((f) => sql`
        INSERT INTO fuel (c, h, l)
        VALUES (${f.c}, ${f.h}, ${f.l});
      `)
  );
  return insertedFuel;
}

// Fungsi utama untuk menjalankan semua seed
export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedUsers();
      await seedVessels();
      await seedAlerts();
      await seedFuel();
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

// Tambahkan fungsi ini di file seed kamu
async function seedTelemetry() {
  await sql`
    CREATE TABLE IF NOT EXISTS telemetry (
      id SERIAL PRIMARY KEY,
      active_vessels INTEGER NOT NULL,
      total_distance VARCHAR(255) NOT NULL,
      signal VARCHAR(100) NOT NULL,
      weather_status VARCHAR(100) NOT NULL
    );
  `;

  // Data ini diambil dari objek telemetry di placeholder-data
  const insertedTelemetry = await sql`
    INSERT INTO telemetry (active_vessels, total_distance, signal, weather_status)
    VALUES (124, '84,202 NM', 'STABLE-LN4', 'OPTIMAL')
    ON CONFLICT DO NOTHING;
  `;
  
  return insertedTelemetry;
}

// Jangan lupa panggil seedTelemetry() di fungsi GET utama