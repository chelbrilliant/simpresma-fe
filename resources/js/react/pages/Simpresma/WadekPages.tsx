import { useState } from "react";
import DropdownSelect from "../../components/form/DropdownSelect";
import { Card, PrestasiTable, SearchFilter, StatusBadge, Title, usePrestasi, prodiOptions } from "./SimpresmaShared";

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

export function WadekMonitoring() {
  const { data } = usePrestasi();
  const [q, setQ] = useState("");
  const [prodi, setProdi] = useState("");
  const rows = data.filter((r) => (!prodi || r.prodi === prodi)).filter((r) => !q || `${r.mahasiswa} ${r.lomba} ${r.prodi}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <Title title="Peninjauan Prestasi" description="Melihat seluruh pengajuan prestasi lintas program studi secara read-only tanpa hak menyetujui atau menolak." />
      <SearchFilter value={q} onChange={setQ} placeholder="Cari mahasiswa, prestasi, atau prodi..." filters={[{ label: "Program Studi", options: prodiOptions }]} filterValues={{ "Program Studi": prodi }} onFilterChange={(_, value) => setProdi(value)} />
      <Card className="p-5"><PrestasiTable data={rows} action={(r) => <button onClick={() => alert(`Detail read-only: ${r.mahasiswa} — ${r.lomba}`)} className="text-sm font-medium text-brand-500">Lihat Detail</button>} /></Card>
    </>
  );
}

export function WadekRekap() {
  const { data } = usePrestasi();
  const [prodi, setProdi] = useState("");
  const [detail, setDetail] = useState<typeof data | null>(null);
  const rows = data.filter((r) => !prodi || r.prodi === prodi);
  const bidang = Array.from(new Set(rows.map((r) => r.bidang)));
  const tingkat = Array.from(new Set(rows.map((r) => r.tingkatan)));
  return (
    <>
      <Title title="Resume & Rekap Prestasi" description="Rekap lintas seluruh program studi dengan opsi memilih sebagian atau seluruh prodi dan drill-down." />
      <div className="mb-6 flex flex-wrap gap-3"><DropdownSelect value={prodi} onChange={setProdi} options={[{ value: "", label: "Semua Program Studi" }, ...prodiOptions.map((p) => ({ value: p, label: p }))]} className="w-auto min-w-[200px]" /></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5"><h3 className="font-semibold text-gray-800 dark:text-white/90">Rekap per Bidang</h3><div className="mt-4 space-y-2">{bidang.map((b)=><button key={b} onClick={()=>setDetail(rows.filter(r=>r.bidang===b))} className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left text-sm dark:bg-gray-800"><span>{b}</span><span className="font-semibold">{rows.filter(r=>r.bidang===b).length}</span></button>)}</div></Card>
        <Card className="p-5"><h3 className="font-semibold text-gray-800 dark:text-white/90">Rekap per Tingkatan</h3><div className="mt-4 space-y-2">{tingkat.map((t)=><button key={t} onClick={()=>setDetail(rows.filter(r=>r.tingkatan===t))} className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left text-sm dark:bg-gray-800"><span>{t}</span><span className="font-semibold">{rows.filter(r=>r.tingkatan===t).length}</span></button>)}</div></Card>
      </div>
      {detail && <Card className="mt-6 p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">Detail Rekap</h3><button onClick={()=>setDetail(null)} className="text-sm text-gray-500">Tutup</button></div><div className="mt-4"><PrestasiTable data={detail} /></div></Card>}
    </>
  );
}

export function WadekKonversi() {
  const { data } = usePrestasi();
  const rows = data.filter((r) => r.status === "Terkonversi");
  return <><Title title="Resume Konversi" description="Ringkasan mata kuliah dan SKS terkonversi mahasiswa lintas program studi." /><Card className="p-5"><div className="overflow-x-auto"><table className="simpresma-table w-full min-w-[900px]"><thead><tr className="border-b border-gray-200 dark:border-gray-800">{['Mahasiswa','Prodi','Prestasi','Mata Kuliah','SKS','Nilai','Status'].map(h=><th key={h} className="pb-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.id} className="border-b border-gray-200 dark:border-gray-800"><td className="py-3 text-sm">{r.mahasiswa}</td><td className="py-3 text-sm">{r.prodi}</td><td className="py-3 text-sm">{r.lomba}</td><td className="py-3 text-sm">{r.mataKuliah?.join(", ") || "-"}</td><td className="py-3 text-sm">{r.sks || "-"}</td><td className="py-3 text-sm">{r.nilai?.join(", ") || "-"}</td><td className="py-3"><StatusBadge status={r.status} skUploaded={r.skUploaded} /></td></tr>)}</tbody></table></div></Card></>;
}

export function WadekPerforma() {
  const { data } = usePrestasi();
  const verifiers = [
    { name: "Dosen Verifikator SI", prodi: "Sistem Informasi", days: "2,1 hari" },
    { name: "Dosen Verifikator TI", prodi: "Teknologi Informasi", days: "2,4 hari" },
    { name: "Dosen Verifikator IF", prodi: "Informatika", days: "2,7 hari" },
  ];
  return <><Title title="Performa Verifikator" description="Pemantauan jumlah diproses, backlog, dan rata-rata waktu respons per Verifikator lintas program studi tanpa rasio persetujuan/penolakan individual." /><Card className="p-5"><div className="overflow-x-auto"><table className="simpresma-table w-full min-w-[760px]"><thead><tr className="border-b border-gray-200 dark:border-gray-800">{["Verifikator","Program Studi","Sudah Diproses","Backlog","Rata-rata Respons"].map((h)=><th key={h} className="pb-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead><tbody>{verifiers.map((v)=><tr key={v.name} className="border-b border-gray-200 dark:border-gray-800"><td className="py-3 text-sm font-medium">{v.name}</td><td className="py-3 text-sm">{v.prodi}</td><td className="py-3 text-sm">{data.filter(r=>r.prodi===v.prodi && r.status!=="Pending").length}</td><td className="py-3 text-sm">{data.filter(r=>r.prodi===v.prodi && r.status==="Pending").length}</td><td className="py-3 text-sm">{v.days}</td></tr>)}</tbody></table></div></Card></>;
}

export function WadekPelaporan() {
  const { data } = usePrestasi();
  const [prodi, setProdi] = useState("");
  const rows = data.filter((r) => !prodi || r.prodi === prodi);
  return <><Title title="Pelaporan Excel" description="Ekspor data capaian mahasiswa on-demand dengan cakupan seluruh atau sebagian program studi." /><Card className="p-6"><DropdownSelect value={prodi} onChange={setProdi} options={[{ value: "", label: "Seluruh Program Studi" }, ...prodiOptions.map((p) => ({ value: p, label: p }))]} className="w-auto min-w-[200px]" /><p className="mt-4 text-sm text-gray-500">{prodi ? `Cakupan: ${prodi}` : "Cakupan: seluruh program studi"}</p><button onClick={()=>exportExcel(rows, `Laporan_SIMPRESMA_${prodi ? prodi.replace(/\s+/g,"_") : "Semua_Prodi"}.xls`)} className="mt-5 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white">Convert to Excel</button></Card></>;
}

function Stat({ label, value }: { label: string; value: number | string }) { return <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p></div>; }
