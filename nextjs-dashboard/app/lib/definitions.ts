// app/lib/definitions.ts

export interface Vessel {
  id: string;
  dest: string;
  status: 'EN ROUTE' | 'IN PORT' | 'DELAYED' | 'MAINTENANCE' | 'STORM' | 'IN TRANSIT' | 'APPROACHING' | 'LOADING' | 'DEPARTING' | 'DEPARTURE PHASE';
  statusColor: string;
  eta: string;
  etaColor: string;
  mon: string;
}

export interface Alert {
  id?: number; // Pakai tanda tanya karena di DB SERIAL (otomatis), tapi di dummy mungkin belum ada
  type: string;
  tc: string;
  time: string;
  body: string;
}

export interface Fuel {
  c: string;
  h: number;
  l: string;
}

// Pastikan ada kata 'export' di depannya
export type Revenue = {
  month: string;
  revenue: number;
};
