import { useMemo, useState } from "react";
import { Card, PrestasiTable, SearchFilter, StatusBadge, Title, StatCard, usePrestasi, prodiOptions } from "./SimpresmaShared";
import { loadActiveAccount } from "./SimpresmaMockAccess";
import { loadMatrixRows } from "./SimpresmaMatrix";

function scopeProdi() {
  return loadActiveAccount()?.prodi ?? "Sistem Informasi";
}

function exportExcel(rows: ReturnType<typeof usePrestasi>["data"], filename: string) {
  const html = `<table border="1"><tr><th>No</th><th>Mahasiswa</th><th>NIM</th><th>Prestasi</th><th>Prodi</th><th>Bidang</th><th>Tingkatan</th><th>Status</th></tr>${rows.map((r, i) => `<tr><td>${i + 1}</td><td>${r.mahasiswa}</td><td>${r.nim}</td><td>${r.lomba}</td><td>${r.prodi}</td><td>${r.bidang}</td><td>${r.tingkatan}</td><td>${r.status}</td></tr>`).join("")}</table>`;
  const blob = new Blob(["\ufeff", `<html><body>${html}</body></html>`], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function KaprodiDashboard() {
  const { data } = usePrestasi();
  const prodi = scopeProdi();
  const rows = data.filter((r) => r.prodi === prodi);
  const pending = rows.filter((r) => r.status === "Pending").length;
  const accepted = rows.filter((r) => r.status === "Diterima").length;
  const converted = rows.filter((r) => r.status === "Terkonversi").length;
  const rejected = rows.filter((r) => r.status === "Ditolak").length;
  const total = Math.max(1, rows.length);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-theme-purple-500 px-6 py-7 text-white shadow-theme-md sm:px-8">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20">Portal Kaprodi</span>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Dashboard Kaprodi</h1>
          <p className="mt-2 text-sm leading-6 text-white/85">Pemantauan read-only seluruh proses prestasi dan konversi pada {prodi}.</p>
        </div>
        <div className="relative z-10 mt-5 rounded-xl bg-white/10 px-5 py-4 text-center ring-1 ring-white/15 sm:absolute sm:right-7 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2">
          <div className="text-2xl font-bold">{rows.length}</div>
          <div className="text-xs text-white/80">Total Pengajuan Prodi</div>
        </div>
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard value={rows.length} label="Total Pengajuan" icon="▣" />
        <StatCard value={pending} label="Menunggu Verifikasi" icon="◷" />
        <StatCard value={accepted} label="Disetujui" icon="✓" />
        <StatCard value={converted} label="Selesai Konversi" icon="★" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Distribusi Status Prestasi</h3>
          <p className="mt-1 text-sm text-gray-500">Komposisi status pengajuan pada {prodi}.</p>
          <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:justify-center">
            <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#f79009 0 ${(pending/total)*100}%, #12b76a ${(pending/total)*100}% ${((pending+accepted)/total)*100}%, #465fff ${((pending+accepted)/total)*100}% ${((pending+accepted+converted)/total)*100}%, #f04438 ${((pending+accepted+converted)/total)*100}% 100%)` }}>
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white dark:bg-gray-900">
                <span className="text-2xl font-bold text-gray-800 dark:text-white/90">{rows.length}</span>
                <span className="text-[11px] text-gray-500">Pengajuan</span>
              </div>
            </div>
            <div className="w-full max-w-xs space-y-3">
              {[["Pending", pending, "bg-warning-500"], ["Diterima", accepted, "bg-success-500"], ["Selesai", converted, "bg-brand-500"], ["Ditolak", rejected, "bg-error-500"]].map(([label, value, dot]) => (
                <div key={label as string} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800/70">
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><span className={`h-2.5 w-2.5 rounded-full ${dot}`} />{label}</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Capaian per Program Studi</h3>
          <p className="mt-1 text-sm text-gray-500">Ringkasan konteks pemantauan fakultas.</p>
          <div className="mt-7 space-y-5">
            {[["Sistem Informasi", 62], ["Teknologi Informasi", 20], ["Informatika", 18]].map(([name, value]) => (
              <div key={name as string}>
                <div className="mb-2 flex items-center justify-between"><span className="text-sm text-gray-700 dark:text-gray-300">{name}</span><span className="text-sm font-medium text-gray-500">{value}%</span></div>
                <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800"><div className="h-full rounded-full bg-brand-500" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div><h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Pengajuan Terbaru</h3><p className="mt-1 text-sm text-gray-500">5 pengajuan terbaru dari {prodi}.</p></div>
          <span className="text-sm font-medium text-brand-500">Lihat Semua ({rows.length}) →</span>
        </div>
        <div className="mt-4"><PrestasiTable data={rows.slice(0, 5)} /></div>
      </Card>
    </div>
  );
}

export function KaprodiMonitoring() {
  const { data } = usePrestasi();
  const prodi = scopeProdi();
  const [q, setQ] = useState("");
  const rows = data.filter((r) => r.prodi === prodi).filter((r) => !q || `${r.mahasiswa} ${r.lomba} ${r.status}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <Title title="Peninjauan Prestasi" description={`Melihat seluruh pengajuan prestasi ${prodi} secara read-only tanpa hak menyetujui atau menolak.`} />
      <SearchFilter value={q} onChange={setQ} placeholder="Cari mahasiswa atau prestasi..." />
      <Card className="p-5"><PrestasiTable data={rows} action={(r) => <button className="text-sm font-medium text-brand-500" onClick={() => alert(`Detail read-only: ${r.mahasiswa} — ${r.lomba}`)}>Lihat Detail</button>} /></Card>
    </>
  );
}

export function KaprodiRekap() {
  const { data } = usePrestasi();
  const prodi = scopeProdi();
  const rows = data.filter((r) => r.prodi === prodi);
  const bidang = Array.from(new Set(rows.map((r) => r.bidang)));
  const tingkat = Array.from(new Set(rows.map((r) => r.tingkatan)));
  const [detail, setDetail] = useState<typeof rows | null>(null);
  return (
    <>
      <Title title="Resume & Rekap Prestasi" description={`Rekap per Bidang dan Tingkatan Lomba khusus ${prodi}. Angka dapat dibuka untuk drill-down.`} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5"><h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Rekap per Bidang</h3><div className="mt-4 space-y-2">{bidang.map((b)=><button key={b} type="button" onClick={()=>setDetail(rows.filter(r=>r.bidang===b))} className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left text-sm dark:bg-gray-800"><span>{b}</span><span className="font-semibold">{rows.filter(r=>r.bidang===b).length}</span></button>)}</div></Card>
        <Card className="p-5"><h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Rekap per Tingkatan</h3><div className="mt-4 space-y-2">{tingkat.map((t)=><button key={t} type="button" onClick={()=>setDetail(rows.filter(r=>r.tingkatan===t))} className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left text-sm dark:bg-gray-800"><span>{t}</span><span className="font-semibold">{rows.filter(r=>r.tingkatan===t).length}</span></button>)}</div></Card>
      </div>
      {detail && <Card className="mt-6 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">Detail Rekap</h3><button onClick={()=>setDetail(null)} className="text-sm text-gray-500">Tutup</button></div><div className="mt-4"><PrestasiTable data={detail} /></div></Card>}
    </>
  );
}

export function KaprodiKonversi() {
  const { data } = usePrestasi();
  const rows = data.filter((r) => r.prodi === scopeProdi() && r.status === "Terkonversi");
  return <><Title title="Resume Konversi" description={`Ringkasan mata kuliah dan SKS terkonversi pada ${scopeProdi()}.`} /><Card className="p-5"><div className="overflow-x-auto"><table className="simpresma-table w-full min-w-[900px]"><thead><tr className="border-b border-gray-200 dark:border-gray-800">{['Mahasiswa','Prestasi','Mata Kuliah','SKS','Nilai','Status'].map(h=><th key={h} className="pb-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-b border-gray-200 dark:border-gray-800"><td className="py-3 text-sm">{r.mahasiswa}</td><td className="py-3 text-sm">{r.lomba}</td><td className="py-3 text-sm">{r.mataKuliah?.join(", ") || "-"}</td><td className="py-3 text-sm">{r.sks || "-"}</td><td className="py-3 text-sm">{r.nilai?.join(", ") || "-"}</td><td className="py-3"><StatusBadge status={r.status} skUploaded={r.skUploaded} /></td></tr>)}</tbody></table></div></Card></>;
}

export function KaprodiPerforma() {
  const { data } = usePrestasi();
  const prodi = scopeProdi();
  const rows = data.filter((r) => r.prodi === prodi);
  const verifier = prodi === "Sistem Informasi" ? "Dosen Verifikator SI" : prodi === "Teknologi Informasi" ? "Dosen Verifikator TI" : "Dosen Verifikator IF";
  return <><Title title="Performa Verifikator" description={`Pemantauan performa Verifikator ${prodi} tanpa menampilkan rasio persetujuan/penolakan individual.`} /><Card className="p-5"><div className="overflow-x-auto"><table className="simpresma-table w-full min-w-[700px]"><thead><tr className="border-b border-gray-200 dark:border-gray-800">{["Verifikator","Program Studi","Sudah Diproses","Backlog","Rata-rata Respons"].map((h)=><th key={h} className="pb-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead><tbody><tr><td className="py-3 text-sm font-medium">{verifier}</td><td className="py-3 text-sm">{prodi}</td><td className="py-3 text-sm">{rows.filter(r=>r.status!=="Pending").length}</td><td className="py-3 text-sm">{rows.filter(r=>r.status==="Pending").length}</td><td className="py-3 text-sm">2,4 hari</td></tr></tbody></table></div></Card></>;
}

export function KaprodiPelaporan() {
  const { data } = usePrestasi();
  const rows = data.filter((r) => r.prodi === scopeProdi());
  return <><Title title="Pelaporan Excel" description={`Ekspor data capaian mahasiswa khusus ${scopeProdi()}.`} /><Card className="p-6"><p className="text-sm text-gray-500">Laporan dibuat on-demand berdasarkan data frontend saat tombol ditekan.</p><button onClick={()=>exportExcel(rows, `Laporan_SIMPRESMA_${scopeProdi().replace(/\s+/g,"_")}.xls`)} className="mt-5 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white">Convert to Excel</button></Card></>;
}

function Stat({ label, value }: { label: string; value: number | string }) { return <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p></div>; }

