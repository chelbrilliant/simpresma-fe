import React, { useEffect, useMemo, useState } from "react";
import DropdownSelect from "../../components/form/DropdownSelect";

export type Status =
  | "Pending"
  | "Diterima"
  | "Ditolak"
  | "Terkonversi";

export type Prestasi = {
  id: number;
  mahasiswa: string;
  nim: string;
  prodi:
    | "Sistem Informasi"
    | "Teknologi Informasi"
    | "Informatika";
  lomba: string;
  bidang: string;
  tingkatan: string;
  tahapan: string;
  jenis: "Individu" | "Kelompok";
  status: Status;
  tanggal: string;
  feedback?: string;
  history?: { status: Status; timestamp: string; feedback?: string }[];
  skDisahkan?: boolean;
  skUploaded?: boolean;
  skFileName?: string;
  dokumen?: string[];
  mataKuliah?: string[];
  nilai?: string[];
  sks?: string;
};

export const defaultPrestasi: Prestasi[] = [
  {
    id: 1,
    mahasiswa: "Chelsea Brilliant Syah Putra",
    nim: "242410101079",
    prodi: "Sistem Informasi",
    lomba: "Gemastik",
    bidang: "Komputasi",
    tingkatan: "Nasional Kementerian",
    tahapan:
      "Pemenang (Juara 1/2/3/Honorable Mention)",
    jenis: "Individu",
    status: "Pending",
    tanggal: "10 Agustus 2026",
  },

  {
    id: 2,
    mahasiswa: "Andi Setiawan",
    nim: "242410101055",
    prodi: "Teknologi Informasi",
    lomba: "Program Kreativitas Mahasiswa",
    bidang: "Pembelajaran",
    tingkatan: "Nasional Kementerian",
    tahapan: "Lolos Tahap Awal",
    jenis: "Kelompok",
    status: "Diterima",
    tanggal: "8 Agustus 2026",
    mataKuliah: [
      "Pengembangan Aplikasi",
      "Manajemen Proyek",
    ],
    nilai: ["A"],
    sks: "4–6",
  },

  {
    id: 3,
    mahasiswa: "Rina Wulandari",
    nim: "242410101032",
    prodi: "Informatika",
    lomba: "Kompetisi Inovasi Mahasiswa",
    bidang: "Kewirausahaan",
    tingkatan: "Wilayah-Regional-Provinsi",
    tahapan:
      "Pemenang (Juara 1/2/3/Honorable Mention)",
    jenis: "Kelompok",
    status: "Ditolak",
    tanggal: "5 Agustus 2026",
    feedback:
      "Dokumen pendukung yang diunggah belum sesuai dengan ketentuan.",
  },

  {
    id: 4,
    mahasiswa: "Budi Pratama",
    nim: "242410101021",
    prodi: "Sistem Informasi",
    lomba: "UI/UX Design Competition",
    bidang: "Seni",
    tingkatan: "Nasional Non Kementerian-Mandiri",
    tahapan: "Finalis",
    jenis: "Individu",
    status: "Terkonversi",
    tanggal: "1 Agustus 2026",
    mataKuliah: ["UI/UX Design"],
    nilai: ["A"],
    sks: "4–6",
  },
];

export function usePrestasi() {
  const [data, setData] = useState<Prestasi[]>(() => {
    try {
      const s = localStorage.getItem("simpresma_prestasi");

      return s ? JSON.parse(s) : defaultPrestasi;
    } catch {
      return defaultPrestasi;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "simpresma_prestasi",
      JSON.stringify(data)
    );
  }, [data]);

  useEffect(() => {
    const h = () => {
      try {
        const s = localStorage.getItem(
          "simpresma_prestasi"
        );

        if (s) {
          setData(JSON.parse(s));
        }
      } catch {}
    };

    window.addEventListener("simpresma:update", h);

    return () =>
      window.removeEventListener("simpresma:update", h);
  }, []);

  const update = (id: number, patch: Partial<Prestasi>) =>
    setData((prev) =>
      prev.map((x) => {
        if (x.id !== id) return x;
        const changedStatus = patch.status && patch.status !== x.status;
        const history = changedStatus
          ? [
              ...(x.history ?? [
                { status: x.status, timestamp: new Date().toISOString() },
              ]),
              {
                status: patch.status as Status,
                timestamp: new Date().toISOString(),
                feedback: patch.feedback,
              },
            ]
          : x.history;
        return { ...x, ...patch, ...(history ? { history } : {}) };
      })
    );

  const add = (item: Prestasi) => {
    const withHistory = item.history?.length
      ? item
      : { ...item, history: [{ status: item.status, timestamp: new Date().toISOString() }] };
    setData((prev) => [withHistory, ...prev]);
  };

  return {
    data,
    update,
    add,
  };
}

export function notify() {
  window.dispatchEvent(new Event("simpresma:update"));
}

export const bidangOptions = [
  "Pembelajaran",
  "Komputasi",
  "Seni",
  "Olahraga",
  "Penalaran",
  "Kewirausahaan",
  "Lainnya",
];

export const tingkatOptions = [
  "Internasional",
  "Nasional Kementerian (Gemastik, LIDM, Satria Data, NUDC, KDMI, MTQMN)",
  "Nasional Kementerian (PKM, P2MW, PPK Ormawa, Pilmapres, Peksiminas)",
  "Nasional Non Kementerian-Mandiri",
  "Wilayah-Regional-Provinsi",
  "Promahadesa",
];

export const tahapOptions = [
  "Mendaftar",
  "Lolos Tahap Awal",
  "Finalis",
  "Pemenang (Juara 1/2/3/Honorable Mention)",
];

export const prodiOptions = [
  "Sistem Informasi",
  "Teknologi Informasi",
  "Informatika",
];

export const mataKuliahOptions = [
  "Frontend Development",
  "UI/UX Design",
  "Pengembangan Aplikasi",
  "Manajemen Proyek",
  "Analisis dan Perancangan Sistem",
];

export function Title({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h1>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {desc}
        </p>
      </div>

      <div className="p-6">
        {children}
      </div>
    </>
  );
}

export function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>

      <input
        {...props}
        className={`h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500 ${
          props.className || ""
        }`}
      />
    </label>
  );
}

export function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>

      <DropdownSelect
        value={value}
        onChange={onChange}
        options={[
          { value: "", label: `Pilih ${label.toLowerCase()}` },
          ...options.map((o) => ({ value: o, label: o })),
        ]}
      />
    </label>
  );
}

export function Textarea({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>

      <textarea
        {...props}
        className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 ${
          props.className || ""
        }`}
      />
    </label>
  );
}

export function getStatusLabel(status: Status | string, skUploaded = false) {
  if (status === "Pending") return "Diproses";
  if (status === "Diterima") return "Disetujui";
  if (status === "Terkonversi") return skUploaded ? "SK Final Tersedia" : "Menunggu Penerbitan SK";
  return status;
}

export function StatusBadge({
  status,
  skUploaded = false,
}: {
  status: Status | string;
  skUploaded?: boolean;
}) {
  const cls =
    status === "Pending"
      ? "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400"
      : status === "Diterima"
      ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400"
      : status === "Ditolak" ||
        status === "Perlu Perbaikan"
      ? "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400"
      : "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      {getStatusLabel(status, skUploaded)}
    </span>
  );
}

export function StatCard({
  value,
  label,
  icon = "○",
}: {
  value: string | number;
  label: string;
  icon?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/20 text-xl">
          {icon}
        </div>

        <span className="text-xs font-medium text-gray-400">
          Dummy
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          {value}
        </h4>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
      </div>
    </div>
  );
}

export function PrestasiTable({
  data,
  action,
}: {
  data: Prestasi[];
  action?: (p: Prestasi) => React.ReactNode;
}) {
  return (
    <div className="simpresma-table-wrap overflow-x-auto">
      <table className="simpresma-table w-full min-w-[900px]">
        <thead>
          <tr>
            {[
              "No",
              "Mahasiswa",
              "Prestasi",
              "Prodi",
              "Tingkatan",
              "Status",
              "Tanggal",
              "",
            ].map((h) => (
              <th
                key={h}
                className="text-left"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((r, i) => (
            <tr key={r.id}>
              <td className="text-sm text-gray-800 dark:text-white/90">
                {i + 1}
              </td>

              <td className="text-sm text-gray-800 dark:text-white/90">
                {r.mahasiswa}

                <div className="text-xs text-gray-500">
                  {r.nim}
                </div>
              </td>

              <td className="text-sm text-gray-800 dark:text-white/90">
                {r.lomba}

                <div className="text-xs text-gray-500">
                  {r.jenis} • {r.bidang}
                </div>
              </td>

              <td className="text-sm text-gray-500 dark:text-gray-400">
                {r.prodi}
              </td>

              <td className="text-sm text-gray-500 dark:text-gray-400">
                {r.tingkatan}
              </td>

              <td >
                <StatusBadge status={r.status} skUploaded={r.skUploaded} />
              </td>

              <td className="text-sm text-gray-500 dark:text-gray-400">
                {r.tanggal}
              </td>

              <td >
                {action?.(r)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SearchFilter({
  value,
  onChange,
  placeholder = "Cari mahasiswa atau nama prestasi...",
  filters,
  filterValues,
  onFilterChange,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  filters?: {
    label: string;
    options: string[];
  }[];
  filterValues?: Record<string, string>;
  onFilterChange?: (
    label: string,
    value: string
  ) => void;
}) {
  return (
    <Card className="mb-6 p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-md">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            ⌕
          </span>

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-11 pr-4 text-sm text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          />
        </div>

        {filters && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {filters.map((f) => (
              <DropdownSelect
                key={f.label}
                value={filterValues?.[f.label] || ""}
                onChange={(nextValue) => onFilterChange?.(f.label, nextValue)}
                options={[
                  { value: "", label: `Semua ${f.label}` },
                  ...f.options.map((o) => ({ value: o, label: o })),
                ]}
                className="min-w-[160px]"
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

export function DashboardRole({
  role,
}: {
  role:
    | "Mahasiswa"
    | "Verifikator"
    | "Tendik"
    | "Wadek"
    | "Kaprodi";
}) {
  const { data } = usePrestasi();

  const cfg = {
    Mahasiswa: {
      eyebrow: "Portal Mahasiswa",
      title: "Selamat Datang, Mahasiswa SI",
      desc: "Ajukan prestasi perlombaan Anda untuk mendapatkan konversi SKS mata kuliah secara resmi sesuai panduan fakultas.",
      action: "Ajukan Prestasi Baru",
      stats: [
        ["22", "Total Pengajuan", "▣"],
        ["14", "Menunggu Verifikasi", "◷"],
        ["1", "Disetujui", "✓"],
        ["0", "Selesai Konversi", "★"],
      ],
    },
    Verifikator: {
      eyebrow: "Panel Verifikator",
      title: "Dashboard Verifikator",
      desc: "Kelola dan verifikasi pengajuan prestasi sesuai scope Program Studi yang ditetapkan.",
      action: "Buka Shared Inbox",
      stats: [
        ["12", "Menunggu Verifikasi", "◷"],
        ["5", "Perlu Perbaikan", "☷"],
        ["48", "Sudah Diverifikasi", "✓"],
        ["65", "Total Prestasi", "★"],
      ],
    },
    Tendik: {
      eyebrow: "Panel Tendik",
      title: "Dashboard Tendik",
      desc: "Pantau hasil konversi secara read-only dan kelola penerbitan SK final mahasiswa.",
      action: "Lihat Pengajuan",
      stats: [
        ["18", "Siap Dibuatkan SK", "◷"],
        ["42", "SK Terunggah", "✓"],
        ["42", "Konversi Read-Only", "☑"],
        ["3", "Program Studi", "▤"],
      ],
    },
    Wadek: {
      eyebrow: "Portal Wakil Dekan",
      title: "Dashboard Wakil Dekan",
      desc: "Pantau capaian prestasi, proses verifikasi, dan konversi mahasiswa lintas Program Studi.",
      action: "Lihat Peninjauan",
      stats: [
        ["1,248", "Total Mahasiswa", "♙"],
        ["342", "Total Prestasi", "★"],
        ["286", "Terverifikasi", "✓"],
        ["3", "Program Studi", "▤"],
      ],
    },
    Kaprodi: {
      eyebrow: "Portal Kaprodi",
      title: "Dashboard Kaprodi",
      desc: "Pantau pengajuan, rekap prestasi, konversi, dan performa Verifikator pada Program Studi sendiri.",
      action: "Lihat Pengajuan",
      stats: [
        ["128", "Mahasiswa Prodi", "♙"],
        ["42", "Total Prestasi", "★"],
        ["36", "Terverifikasi", "✓"],
        ["2", "Verifikator", "▤"],
      ],
    },
  }[role];

  const recentRows = data.slice(0, 5);
  const pending = Math.max(0, data.filter((r) => r.status === "Pending").length);
  const accepted = data.filter((r) => r.status === "Diterima").length;
  const converted = data.filter((r) => r.status === "Terkonversi").length;
  const rejected = data.filter((r) => r.status === "Ditolak").length;
  const total = Math.max(1, pending + accepted + converted + rejected);
  const pendingPct = Math.round((pending / total) * 100);
  const acceptedPct = Math.round((accepted / total) * 100);
  const convertedPct = Math.round((converted / total) * 100);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-blue-light-500 px-6 py-7 text-white shadow-theme-md sm:px-8">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
            {cfg.eyebrow}
          </span>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{cfg.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">{cfg.desc}</p>
        </div>
        <button
          type="button"
          onClick={() => alert(`${cfg.action} — navigasi tersedia melalui menu di sidebar.`)}
          className="relative z-10 mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-600 shadow-sm sm:absolute sm:right-7 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2"
        >
          {cfg.action} →
        </button>
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-white/10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cfg.stats.map((c) => (
          <StatCard key={c[1]} value={c[0]} label={c[1]} icon={c[2]} />
        ))}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Distribusi Status Prestasi Anda
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Proporsi status seluruh pengajuan prestasi.
              </p>
            </div>
            <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              {role}
            </span>
          </div>

          <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:justify-center">
            <div
              className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#f79009 0 ${pendingPct}%, #12b76a ${pendingPct}% ${pendingPct + acceptedPct}%, #465fff ${pendingPct + acceptedPct}% ${pendingPct + acceptedPct + convertedPct}%, #f04438 ${pendingPct + acceptedPct + convertedPct}% 100%)`,
              }}
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white dark:bg-gray-900">
                <span className="text-2xl font-bold text-gray-800 dark:text-white/90">{data.length}</span>
                <span className="text-[11px] text-gray-500">Pengajuan</span>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-3">
              {[
                ["Pending", pending, "bg-warning-500"],
                ["Diterima", accepted, "bg-success-500"],
                ["Selesai", converted, "bg-brand-500"],
                ["Ditolak", rejected, "bg-error-500"],
              ].map(([label, value, dot]) => (
                <div key={label as string} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/70">
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Proporsi Pengajuan Mahasiswa Antar Prodi
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Persentase jumlah pengajuan mahasiswa dari 3 Program Studi.
            </p>
          </div>

          <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:justify-center">
            <div
              className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
              style={{ background: "conic-gradient(#465fff 0 62%, #7a5af8 62% 82%, #12b76a 82% 100%)" }}
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white dark:bg-gray-900">
                <span className="text-2xl font-bold text-gray-800 dark:text-white/90">100%</span>
                <span className="text-[11px] text-gray-500">Distribusi</span>
              </div>
            </div>
            <div className="w-full max-w-xs space-y-3">
              {[
                ["Sistem Informasi", "62%", "bg-brand-500"],
                ["Teknologi Informasi", "20%", "bg-theme-purple-500"],
                ["Informatika", "18%", "bg-success-500"],
              ].map(([label, value, dot]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 dark:border-gray-800">
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent table */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Pengajuan Terbaru</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">5 pengajuan prestasi perlombaan terakhir.</p>
          </div>
          <span className="text-sm font-medium text-brand-500">Lihat Semua ({data.length}) →</span>
        </div>
        <div className="mt-4">
          <PrestasiTable data={recentRows} />
        </div>
      </Card>
    </div>
  );
}
