import React, { useState } from "react";
import { Card, Input, PrestasiTable, SearchFilter, StatusBadge, Title, usePrestasi } from "./SimpresmaShared";

export function TendikDataPrestasi() {
  const { data, update } = usePrestasi();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [skFile, setSkFile] = useState("");

  const rows = data
    .filter((r) => r.status === "Terkonversi")
    .filter((r) => !q || `${r.mahasiswa} ${r.lomba} ${r.prodi}`.toLowerCase().includes(q.toLowerCase()));

  const row = data.find((r) => r.id === selected);

  const uploadSK = () => {
    if (!row) return;
    if (!skFile) {
      alert("Pilih berkas SK final terlebih dahulu.");
      return;
    }
    update(row.id, { skUploaded: true, skFileName: skFile });
    setSelected(null);
    setSkFile("");
    alert("SK final berhasil diunggah.");
  };

  return (
    <>
      <Title title="Pengajuan & Upload SK" description="Tendik hanya melihat detail konversi secara read-only dan mengunggah SK final yang telah ditandatangani Dekan di luar sistem." />
      <SearchFilter value={q} onChange={setQ} placeholder="Cari mahasiswa, prestasi, atau prodi..." />
      <Card className="p-5">
        <PrestasiTable
          data={rows}
          action={(r) => (
            <button onClick={() => { setSelected(r.id); setSkFile(""); }} className="text-sm font-medium text-brand-500">
              {r.skUploaded ? "Lihat / SK Terunggah" : "Lihat & Upload SK"}
            </button>
          )}
        />
      </Card>

      {row && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Detail Konversi</h2>
                <p className="mt-1 text-sm text-gray-500">{row.mahasiswa} • {row.lomba}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl text-gray-400">×</button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Program Studi" value={row.prodi} readOnly />
              <Input label="Status" value={row.status} readOnly />
              <Input label="Bidang" value={row.bidang} readOnly />
              <Input label="Tingkatan" value={row.tingkatan} readOnly />
              <Input label="Tahapan" value={row.tahapan} readOnly />
              <Input label="Mata Kuliah" value={row.mataKuliah?.join(", ") || "Belum dipilih"} readOnly />
              <Input label="SKS" value={row.sks || "-"} readOnly />
              <Input label="Nilai" value={row.nilai?.join(", ") || "-"} readOnly />
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hak Akses Tendik</p>
              <p className="mt-1 text-xs text-gray-500">Seluruh data konversi di atas bersifat read-only. Tendik tidak mengubah Bidang, SKS, Nilai, maupun Mata Kuliah.</p>
            </div>

            <div className="mt-6">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">SK Final (PDF)</span>
                <input type="file" accept=".pdf,application/pdf" disabled={row.skUploaded} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.type !== "application/pdf" || file.size > 10 * 1024 * 1024) {
                    alert("SK final harus PDF dengan ukuran maksimal 10MB.");
                    e.currentTarget.value = "";
                    return;
                  }
                  setSkFile(file.name);
                }} className="block w-full text-sm text-gray-500" />
              </label>
              {row.skUploaded && <p className="mt-2 text-xs text-success-600">SK terunggah: {row.skFileName || "Berkas SK"}</p>}
              {!row.skUploaded && skFile && <p className="mt-2 text-xs text-gray-500">File dipilih: {skFile}</p>}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm">Tutup</button>
              {!row.skUploaded && <button onClick={uploadSK} className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white">Upload SK Final</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function TendikMonitoring() {
  const { data } = usePrestasi();
  const rows = data.filter((x) => x.status === "Terkonversi");
  return (
    <>
      <Title title="Monitoring Konversi" description="Pemantauan read-only pengajuan yang telah disetujui Verifikator." />
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat label="Menunggu SK" value={rows.filter((x) => !x.skUploaded).length} />
        <Stat label="SK Terunggah" value={rows.filter((x) => x.skUploaded).length} />
        <Stat label="Total Pengajuan" value={rows.length} />
      </div>
      <Card className="p-5"><PrestasiTable data={rows} /></Card>
    </>
  );
}

export function TendikReward() { return null; }

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">{value}</p></div>;
}
