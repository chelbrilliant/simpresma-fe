export type MatrixRow = {
  tingkatan: string;
  tahapan: string;
  sks: string;
  nilai: string;
};

const INTERNATIONAL = "Internasional";
const NASIONAL_1 = "Nasional Kementerian (Gemastik, LIDM, Satria Data, NUDC, KDMI, MTQMN)";
const NASIONAL_2 = "Nasional Kementerian (PKM, P2MW, PPK Ormawa, Pilmapres, Peksiminas)";
const NON_KEMENTERIAN = "Nasional Non Kementerian-Mandiri";
const REGIONAL = "Wilayah-Regional-Provinsi";
const PROMAHADESA = "Promahadesa";

const M = "Mendaftar";
const L = "Lolos Tahap Awal";
const F = "Finalis";
const P = "Pemenang (Juara 1/2/3/Honorable Mention)";

export const defaultMatrixRows: MatrixRow[] = [
  { tingkatan: INTERNATIONAL, tahapan: M, sks: "2–3", nilai: "AB" },
  { tingkatan: INTERNATIONAL, tahapan: L, sks: "2–3", nilai: "AB" },
  { tingkatan: INTERNATIONAL, tahapan: F, sks: "4–6", nilai: "A" },
  { tingkatan: INTERNATIONAL, tahapan: P, sks: "8–12", nilai: "A" },

  { tingkatan: NASIONAL_1, tahapan: M, sks: "-", nilai: "-" },
  { tingkatan: NASIONAL_1, tahapan: L, sks: "-", nilai: "-" },
  { tingkatan: NASIONAL_1, tahapan: F, sks: "4–6", nilai: "AB" },
  { tingkatan: NASIONAL_1, tahapan: P, sks: "6–9", nilai: "A" },

  { tingkatan: NASIONAL_2, tahapan: M, sks: "-", nilai: "-" },
  { tingkatan: NASIONAL_2, tahapan: L, sks: "4–6", nilai: "A" },
  { tingkatan: NASIONAL_2, tahapan: F, sks: "6–9", nilai: "A" },
  { tingkatan: NASIONAL_2, tahapan: P, sks: "8–12", nilai: "A" },

  { tingkatan: NON_KEMENTERIAN, tahapan: M, sks: "-", nilai: "-" },
  { tingkatan: NON_KEMENTERIAN, tahapan: L, sks: "-", nilai: "-" },
  { tingkatan: NON_KEMENTERIAN, tahapan: F, sks: "2–3", nilai: "AB" },
  { tingkatan: NON_KEMENTERIAN, tahapan: P, sks: "4–6", nilai: "A" },

  { tingkatan: REGIONAL, tahapan: M, sks: "-", nilai: "-" },
  { tingkatan: REGIONAL, tahapan: L, sks: "-", nilai: "-" },
  { tingkatan: REGIONAL, tahapan: F, sks: "2–3", nilai: "B" },
  { tingkatan: REGIONAL, tahapan: P, sks: "4–6", nilai: "AB" },

  { tingkatan: PROMAHADESA, tahapan: M, sks: "-", nilai: "-" },
  { tingkatan: PROMAHADESA, tahapan: L, sks: "2–3", nilai: "A" },
  { tingkatan: PROMAHADESA, tahapan: F, sks: "-", nilai: "-" },
  { tingkatan: PROMAHADESA, tahapan: P, sks: "-", nilai: "-" },
];

export const defaultBidangMapping: Record<string, string[]> = {
  Pembelajaran: ["Pengembangan Aplikasi", "Analisis dan Perancangan Sistem"],
  Komputasi: ["Frontend Development", "Pengembangan Aplikasi"],
  Seni: ["UI/UX Design"],
  Olahraga: ["Manajemen Proyek"],
  Penalaran: ["Analisis dan Perancangan Sistem"],
  Kewirausahaan: ["Manajemen Proyek"],
  Lainnya: ["Sistem Informasi Manajemen"],
};

export const masterCoursesByProdi: Record<string, string[]> = {
  "Sistem Informasi": [
    "MKI9007 - Manajemen dan Kewirausahaan",
    "KSI1408 - Rekayasa Proses Bisnis",
    "Frontend Development",
    "UI/UX Design",
    "Pengembangan Aplikasi",
    "Analisis dan Perancangan Sistem",
  ],
  "Teknologi Informasi": [
    "KTU1053 - Model Bisnis Digital",
    "KTU1055 - Analisis Pasar dan Validasi Produk",
    "Frontend Development",
    "Pengembangan Aplikasi",
    "Manajemen Proyek",
  ],
  Informatika: [
    "MKI9007 - Manajemen dan Kewirausahaan",
    "UI/UX Design",
    "Pengembangan Aplikasi",
    "Analisis dan Perancangan Sistem",
  ],
};

const MATRIX_KEY = "simpresma_matrix_conversion";
const BIDANG_KEY = "simpresma_matrix_bidang";

export function loadMatrixRows(): MatrixRow[] {
  try {
    const raw = localStorage.getItem(MATRIX_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : defaultMatrixRows;
  } catch {
    return defaultMatrixRows;
  }
}

export function saveMatrixRows(rows: MatrixRow[]) {
  localStorage.setItem(MATRIX_KEY, JSON.stringify(rows));
  window.dispatchEvent(new Event("simpresma:matrix-update"));
}

export function loadBidangMapping(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(BIDANG_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : defaultBidangMapping;
  } catch {
    return defaultBidangMapping;
  }
}

export function saveBidangMapping(mapping: Record<string, string[]>) {
  localStorage.setItem(BIDANG_KEY, JSON.stringify(mapping));
  window.dispatchEvent(new Event("simpresma:matrix-update"));
}

function sameLevel(rowLevel: string, level: string) {
  if (rowLevel === level) return true;
  if (rowLevel === "Nasional Kementerian" && level.startsWith("Nasional Kementerian")) return true;
  if (level === "Nasional Kementerian" && rowLevel.startsWith("Nasional Kementerian")) return true;
  return false;
}

export function getConversionMatrix(tingkatan: string, tahapan: string) {
  return loadMatrixRows().find((row) => sameLevel(row.tingkatan, tingkatan) && row.tahapan === tahapan) ?? null;
}
