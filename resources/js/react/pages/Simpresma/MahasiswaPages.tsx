import React, { useMemo, useState } from "react";

import {
  Card,
  PrestasiTable,
  SearchFilter,
  StatusBadge,
  Title,
  Textarea,
  Input,
  usePrestasi,
  prodiOptions,
  getStatusLabel,
} from "./SimpresmaShared";
import { loadBidangMapping } from "./SimpresmaMatrix";

function downloadMockSK(row: any) {
  const lines = ["SURAT KEPUTUSAN KONVERSI PRESTASI MAHASISWA", `Nama: ${row.mahasiswa}`, `NIM: ${row.nim}`, `Program Studi: ${row.prodi}`, `Prestasi: ${row.lomba}`, `Mata Kuliah: ${(row.mataKuliah ?? []).join(", ")}`, `Nilai: ${(row.nilai ?? []).join(", ")}`, "Dokumen ini merupakan simulasi frontend SIMPRESMA."];
  const escapePdf = (text: string) => text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const stream = ["BT", "/F1 11 Tf", "50 760 Td", ...lines.map((line, i) => `${i ? "0 -24 Td " : ""}(${escapePdf(line)}) Tj`), "ET"].join("\n");
  const objects = ["1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj", "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj", "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>endobj", "4 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj", `5 0 obj<< /Length ${stream.length} >>stream\n${stream}\nendstream endobj`];
  let pdf = "%PDF-1.4\n"; const offsets = [0];
  for (const obj of objects) { offsets.push(pdf.length); pdf += obj + "\n"; }
  const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" })); const a = document.createElement("a"); a.href = url; a.download = `SK_${row.nim}.pdf`; a.click(); URL.revokeObjectURL(url);
}

export function MahasiswaRiwayat() {
  const { data, update } = usePrestasi();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [jenis, setJenis] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [selectedMatkul, setSelectedMatkul] = useState<string[]>([]);
  const rows = useMemo(() => data
    .filter((r) => r.mahasiswa === "Chelsea Brilliant Syah Putra")
    .filter((r) => !q || `${r.lomba} ${r.status}`.toLowerCase().includes(q.toLowerCase()))
    .filter((r) => !status || r.status === status)
    .filter((r) => !jenis || r.jenis === jenis), [data, q, status, jenis]);
  const selectedRow = data.find((r) => r.id === selected);
  const mapping = loadBidangMapping();
  const available = selectedRow ? mapping[selectedRow.bidang] ?? [] : [];

  return (
    <>
      <Title title="Riwayat Prestasi" description="Lihat seluruh pengajuan dan pilih mata kuliah konversi setelah pengajuan disetujui." />
      <SearchFilter value={q} onChange={setQ} placeholder="Cari nama prestasi..." filters={[{ label: "Status", options: ["Diproses", "Disetujui", "Ditolak", "Menunggu Penerbitan SK", "SK Final Tersedia"] }, { label: "Jenis", options: ["Individu", "Kelompok"] }]} filterValues={{ Status: status, Jenis: jenis }} onFilterChange={(l, v) => { if (l === "Status") { const map: Record<string,string> = { "Diproses":"Pending", "Disetujui":"Diterima", "Ditolak":"Ditolak", "Menunggu Penerbitan SK":"Terkonversi", "SK Final Tersedia":"Terkonversi" }; setStatus(map[v] ?? ""); } else setJenis(v); }} />
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><p className="text-sm text-gray-500">Total Pengajuan</p><p className="mt-2 text-2xl font-bold">{rows.length}</p></div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><p className="text-sm text-gray-500">Disetujui / Menunggu SK</p><p className="mt-2 text-2xl font-bold">{rows.filter((x) => x.status === "Diterima" || x.status === "Terkonversi").length}</p></div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><p className="text-sm text-gray-500">Diproses</p><p className="mt-2 text-2xl font-bold">{rows.filter((x) => x.status === "Pending").length}</p></div>
      </div>
      <Card className="p-5">
        <PrestasiTable data={rows} action={(r) => <button onClick={() => { if (r.status === "Terkonversi" && r.skUploaded) { downloadMockSK(r); return; } setSelected(r.id); setSelectedMatkul(r.mataKuliah ?? []); }} className="text-sm font-medium text-brand-500">{r.status === "Diterima" ? "Pilih Matkul" : r.status === "Terkonversi" && r.skUploaded ? "Unduh SK" : "Lihat Detail"}</button>} />
        {rows.filter((x) => x.status === "Ditolak").map((x) => <div key={`feedback-${x.id}`} className="mt-4 rounded-lg border border-error-200 bg-error-50 p-4 text-sm text-error-700"><b>Catatan Verifikator:</b> {x.feedback}</div>)}
        {rows.map((x) => <div key={`history-${x.id}`} className="mt-4 rounded-lg border border-gray-200 p-4 dark:border-gray-800"><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Jejak Status — {x.lomba}</p><div className="mt-3 space-y-2">{(x.history ?? [{ status: x.status, timestamp: x.tanggal }]).map((item, index) => <div key={`${x.id}-${index}`} className="flex items-start justify-between gap-4 text-xs text-gray-500"><span className="font-medium text-gray-700 dark:text-gray-300">{getStatusLabel(item.status, x.skUploaded)}</span><span>{item.timestamp.includes("T") ? new Date(item.timestamp).toLocaleString("id-ID") : item.timestamp}</span></div>)}</div></div>)}
      </Card>

      {selectedRow && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"><div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">{selectedRow.status === "Diterima" ? "Pilih Mata Kuliah Konversi" : "Detail Pengajuan"}</h2><p className="mt-1 text-sm text-gray-500">{selectedRow.mahasiswa} • {selectedRow.lomba}</p></div><button onClick={()=>setSelected(null)} className="text-xl text-gray-400">×</button></div><div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"><Input label="Program Studi" value={selectedRow.prodi} readOnly /><Input label="Bidang" value={selectedRow.bidang} readOnly /><Input label="Tingkatan" value={selectedRow.tingkatan} readOnly /><Input label="Tahapan" value={selectedRow.tahapan} readOnly /></div>{selectedRow.status === "Diterima" && <><div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">Pilihan mata kuliah tersedia setelah Verifikator menentukan Bidang. Pilihan mahasiswa bersifat input konversi dan dapat digunakan Tendik sebagai acuan read-only.</div><div className="mt-5 space-y-2">{available.length ? available.map((m)=><label key={m} className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm dark:border-gray-800"><input type="radio" name={`matkul-${selectedRow.id}`} checked={selectedMatkul[0] === m} onChange={()=>setSelectedMatkul([m])} />{m}</label>) : <p className="text-sm text-gray-500">Belum ada pemetaan mata kuliah untuk Bidang ini.</p>}</div><div className="mt-6 flex justify-end"><button onClick={()=>{ if(!selectedMatkul.length){alert("Pilih minimal satu mata kuliah.");return;} update(selectedRow.id,{mataKuliah:selectedMatkul, status:"Terkonversi"}); setSelected(null); alert("Pilihan mata kuliah berhasil disimpan."); }} className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white">Simpan Pilihan</button></div></>}{selectedRow.status === "Terkonversi" && <div className="mt-6 rounded-lg bg-success-50 p-4 text-sm text-success-700">Mata kuliah: {selectedRow.mataKuliah?.join(", ") || "-"}<br/>Nilai: {selectedRow.nilai?.join(", ") || "-"}</div>}</div></div>}
    </>
  );
}

export function MahasiswaProfil() {
  return <Profile role="Mahasiswa" editable />;
}

export function Profile({
  role,
  editable = false,
}: {
  role: string;
  editable?: boolean;
}) {
  return (
    <>
      <Title
        title="Profil"
        description={`Informasi akun ${role}.`}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <div className="flex flex-col items-center py-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-50 text-3xl font-semibold text-brand-500">
              C
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              {role === "Mahasiswa"
                ? "Chelsea Brilliant Syah Putra"
                : role}
            </h2>

            <p className="text-sm text-gray-500">
              {role}
            </p>
          </div>
        </Card>

        <Card className="p-6 xl:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Informasi Pribadi
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Nama Lengkap"
              value={
                role === "Mahasiswa"
                  ? "Chelsea Brilliant Syah Putra"
                  : role
              }
              readOnly={!editable}
            />

            <Input
              label={
                role === "Mahasiswa"
                  ? "NIM"
                  : "ID/Identitas"
              }
              value={
                role === "Mahasiswa"
                  ? "242410101079"
                  : "-"
              }
              readOnly={!editable}
            />

            <Input
              label="Email"
              value={
                role === "Mahasiswa"
                  ? "mahasiswa@example.com"
                  : "user@simpresma.ac.id"
              }
              readOnly={!editable}
            />

            <Input
              label="No. WhatsApp"
              value="081234567890"
              readOnly={!editable}
            />

            <div className="md:col-span-2">
              <Input
                label="Program Studi / Scope"
                value={
                  role === "Mahasiswa"
                    ? "Sistem Informasi"
                    : role === "Verifikator" || role === "Kaprodi"
                    ? "Sistem Informasi"
                    : role === "Wakil Dekan"
                    ? "Lintas Program Studi"
                    : "Fakultas Teknologi Informasi"
                }
                readOnly={!editable}
              />
            </div>
          </div>

          {editable && (
            <div className="mt-6 flex justify-end">
              <button className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white">
                Simpan Perubahan
              </button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export function DirektoriVerifikator() {
  const teams = [
    {
      prodi: "Sistem Informasi",
      count: 2,
      badge: "Prodi #1",
      verifiers: [
        { name: "Verifikator SI", nip: "NIP. 10001", email: "verif.si@test.com", phone: "08122220001" },
        { name: "Multi Role User", nip: "NIP. 30001", email: "multi@test.com", phone: "08144440001" },
      ],
    },
    {
      prodi: "Teknologi Informasi",
      count: 2,
      badge: "Prodi #2",
      verifiers: [
        { name: "Verifikator TI", nip: "NIP. 10002", email: "verif.ti@test.com", phone: "08122220002" },
        { name: "Dosen TI", nip: "NIP. 30002", email: "dosen.ti@test.com", phone: "08144440002" },
      ],
    },
    {
      prodi: "Informatika",
      count: 2,
      badge: "Prodi #3",
      verifiers: [
        { name: "Verifikator IF", nip: "NIP. 10003", email: "verif.if@test.com", phone: "08122220003" },
        { name: "Dosen IF", nip: "NIP. 30003", email: "dosen.if@test.com", phone: "08144440003" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-theme-purple-500 px-6 py-7 text-white shadow-theme-md sm:px-8">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/20">
            🛡 Direktori Resmi Fakultas
          </span>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Direktori Tim Dosen Verifikator</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
            Daftar dosen verifikator resmi untuk setiap Program Studi yang bertugas memvalidasi pengajuan konversi prestasi.
          </p>
        </div>
        <div className="relative z-10 mt-5 rounded-xl bg-white/10 px-5 py-4 text-center ring-1 ring-white/15 sm:absolute sm:right-7 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2">
          <div className="text-2xl font-bold">{teams.reduce((sum, t) => sum + t.count, 0)}</div>
          <div className="text-xs text-white/80">Dosen Verifikator Aktif</div>
        </div>
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
      </div>

      <Card className="p-4 sm:p-5">
        <div className="relative max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
          <input
            placeholder="Cari berdasarkan nama dosen atau NIP..."
            className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          />
        </div>
      </Card>

      <div className="space-y-5">
        {teams.map((team) => (
          <Card key={team.prodi} className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">▣</div>
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-white/90">{team.prodi}</h2>
                  <p className="text-xs text-gray-500">{team.count} dosen verifikator terdaftar</p>
                </div>
              </div>
              <span className="w-fit rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">{team.badge}</span>
            </div>

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              {team.verifiers.map((v) => (
                <div key={v.name} className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-200 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">{v.name}</h3>
                      <p className="mt-1 text-xs text-gray-400">{v.nip}</p>
                    </div>
                    <span className="rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">Aktif</span>
                  </div>
                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
                    <div className="flex items-center gap-2 text-gray-500"><span>✉</span><span>{v.email}</span></div>
                    <div className="flex items-center gap-2 text-success-600"><span>⌕</span><span>{v.phone}</span><span className="text-gray-400">↗</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

