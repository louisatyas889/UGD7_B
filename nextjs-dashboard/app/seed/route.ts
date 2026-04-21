// @ts-nocheck
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ==========================================
// DATA HARDCODED (DATABASE SOURCE)
// ==========================================

const users = [
  { id: "Louisa-2909", key: "2909", name: "Louisa", role: "USER" },
  { id: "Della-2888", key: "2888", name: "Della", role: "USER" }
];

const dummyAdmins = [
  { id: "Louisa-Admin", key: "0909", name: "Louisa Admin", role: "ADMIN" },
  { id: "Della-Admin", key: "8888", name: "Della Admin", role: "ADMIN" }
];

const vessels = [
  { 
    id: "PL-992-BUMI", dest: "Port of Rotterdam (NLD)", status: "EN ROUTE", statusColor: "#22d3ee", 
    eta: "24 OCT 14:00", etaColor: "#e5e7eb", mon: "chart", 
    lat: 15.0, lng: 95.0, speed: "14.2 Knots", fuel: "82%", 
    diag: "NO ISSUES", signal: "98.4%", weather: "OPTIMAL", color: "#a855f7",
    pct: 85 
  },
  { 
    id: "PL-441-BULAN", dest: "Singapore Harbor (SGP)", status: "IN PORT", statusColor: "#6b7280", 
    eta: "DOCKED", etaColor: "#e5e7eb", mon: "anchor", 
    lat: 5.0, lng: 115.0, speed: "12.4 Knots", fuel: "78%", 
    diag: "NO ISSUES", signal: "95.2%", weather: "OPTIMAL", color: "#22d3ee",
    pct: 100
  },
  { 
    id: "PL-770-ORION", dest: "Suez Canal (EGY)", status: "DELAYED", statusColor: "#f87171", 
    eta: "RECALCULATING", etaColor: "#f87171", mon: "warn", 
    lat: -2.0, lng: 120.0, speed: "10.8 Knots", fuel: "45%", 
    diag: "ENGINE WARN", signal: "88.1%", weather: "STORMY", color: "#f87171",
    pct: 35
  }
];

const trackingPackages = [
  { id: "PKG-100293", size: "MEDIUM", dest: "Japan (HND)", lat: 35.6762, lng: 139.6503, vesselName: "PL-992-BUMI" },
  { id: "PKG-100412", size: "MEDIUM", dest: "Germany (FRA)", lat: 50.1109, lng: 8.6821, vesselName: "PL-770-ORION" },
  { id: "PKG-200112", size: "SMALL", dest: "Korea (ICN)", lat: 37.5665, lng: 126.9780, vesselName: "PL-441-BULAN" }
];

const alerts = [
  { id: 1, type: "CRITICAL", time: "10:45 AM", body: "Engine Temp Overheating on PL-992", tc: "#f87171" },
  { id: 2, type: "SYSTEM", time: "09:12 AM", body: "Database Synced with Neon Cloud", tc: "#22d3ee" }
];

const fuelData = [
  { id: 1, h: 85, c: "#22d3ee", l: "V-BUMI" },
  { id: 2, h: 40, c: "#fbbf24", l: "V-BULAN" },
  { id: 3, h: 15, c: "#f87171", l: "V-ORION" },
  { id: 4, h: 95, c: "#a855f7", l: "V-AQUILA" }
];

const regionsData = [
  { name: "BUMI - REG SINGAPUR", percent: 28, color: "#22d3ee" },
  { name: "MARS - REG BELANDA", percent: 18, color: "#a855f7" },
  { name: "MOON - REG MALAYSIA", percent: 15, color: "#22d3ee" },
  { name: "ORION - REG NUGINI", percent: 10, color: "#a855f7" }
];

// ==========================================
// FUNGSI SEED (BUILDER)
// ==========================================

async function seedUsers() {
  await sql`DROP TABLE IF EXISTS users CASCADE`;
  await sql`CREATE TABLE users (id TEXT PRIMARY KEY, name VARCHAR(255) NOT NULL, key TEXT NOT NULL, role VARCHAR(50) DEFAULT 'USER')`;
  const allUsers = [...users, ...dummyAdmins];
  for (const u of allUsers) {
    await sql`INSERT INTO users (id, name, key, role) VALUES (${u.id}, ${u.name}, ${u.key}, ${u.role})`;
  }
}

async function seedVessels() {
  await sql`DROP TABLE IF EXISTS vessels CASCADE`;
  await sql`CREATE TABLE vessels (
    id VARCHAR(255) PRIMARY KEY, dest VARCHAR(255), status VARCHAR(50), status_color VARCHAR(50), 
    eta VARCHAR(50), eta_color VARCHAR(50), mon VARCHAR(50), lat DOUBLE PRECISION, 
    lng DOUBLE PRECISION, speed VARCHAR(50), fuel VARCHAR(50), diag VARCHAR(50), 
    signal VARCHAR(50), weather VARCHAR(50), color VARCHAR(50), pct INTEGER
  )`;
  for (const v of vessels) {
    await sql`INSERT INTO vessels (id, dest, status, status_color, eta, eta_color, mon, lat, lng, speed, fuel, diag, signal, weather, color, pct) 
              VALUES (${v.id}, ${v.dest}, ${v.status}, ${v.statusColor}, ${v.eta}, ${v.etaColor}, ${v.mon}, ${v.lat}, ${v.lng}, ${v.speed}, ${v.fuel}, ${v.diag}, ${v.signal}, ${v.weather}, ${v.color}, ${v.pct})`;
  }
}

async function seedTracking() {
  await sql`DROP TABLE IF EXISTS tracking_packages CASCADE`;
  await sql`CREATE TABLE tracking_packages (
    id VARCHAR(255) PRIMARY KEY, size VARCHAR(50), dest VARCHAR(255), 
    lat DOUBLE PRECISION, lng DOUBLE PRECISION, vessel_name VARCHAR(255)
  )`;
  for (const t of trackingPackages) {
    await sql`INSERT INTO tracking_packages (id, size, dest, lat, lng, vessel_name) 
              VALUES (${t.id}, ${t.size}, ${t.dest}, ${t.lat}, ${t.lng}, ${t.vesselName})`;
  }
}

async function seedFleetExtras() {
  await sql`DROP TABLE IF EXISTS alerts CASCADE`;
  await sql`CREATE TABLE alerts (id SERIAL PRIMARY KEY, type TEXT, time TEXT, body TEXT, tc TEXT)`;
  for (const a of alerts) {
    await sql`INSERT INTO alerts (type, time, body, tc) VALUES (${a.type}, ${a.time}, ${a.body}, ${a.tc})`;
  }

  await sql`DROP TABLE IF EXISTS fuel_stats CASCADE`;
  await sql`CREATE TABLE fuel_stats (id SERIAL PRIMARY KEY, h INTEGER, c TEXT, l TEXT)`;
  for (const f of fuelData) {
    await sql`INSERT INTO fuel_stats (h, c, l) VALUES (${f.h}, ${f.c}, ${f.l})`;
  }
}

async function seedRegions() {
  await sql`DROP TABLE IF EXISTS regions CASCADE`;
  await sql`CREATE TABLE regions (id SERIAL PRIMARY KEY, name VARCHAR(255), percent INTEGER, color VARCHAR(50))`;
  for (const r of regionsData) {
    await sql`INSERT INTO regions (name, percent, color) VALUES (${r.name}, ${r.percent}, ${r.color})`;
  }
}

// ==========================================
// MAIN GET HANDLER (DATA SYNC)
// ==========================================

export async function GET() {
  try {
    console.log("CRITICAL: Executing Full Database Reset & Sync...");
    
    // Menjalankan SEMUA fungsi seed untuk SEMUA halaman
    await seedUsers();
    await seedVessels();
    await seedTracking();
    await seedFleetExtras();
    await seedRegions();

    // Mengambil data untuk dikirim balik ke frontend
    const vesselsFromDB = await sql`SELECT * FROM vessels ORDER BY id ASC`;
    const trackingFromDB = await sql`SELECT * FROM tracking_packages`;
    const alertsFromDB = await sql`SELECT * FROM alerts`;
    const fuelFromDB = await sql`SELECT * FROM fuel_stats`;
    const regionsFromDB = await sql`SELECT * FROM regions`;

    return NextResponse.json({ 
      success: true,
      vessels: vesselsFromDB,
      tracking: trackingFromDB,
      alerts: alertsFromDB,
      fuel: fuelFromDB,
      regions: regionsFromDB,
      message: 'DATABASE SERENESAIL FULLY SYNCED!' 
    });

  } catch (error) {
    console.error("Critical Error during Sync:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
