import { useState } from "react";
import DropdownSelect from "../../components/form/DropdownSelect";
import { Card, Title } from "./SimpresmaShared";
import { loadMatrixRows, saveMatrixRows } from "./SimpresmaMatrix";

const LEVELS = [
  "Internasional",
  "Nasional Kementerian (Gemastik, LIDM, Satria Data, NUDC, KDMI, MTQMN)",
  "Nasional Kementerian (PKM, P2MW, PPK Ormawa, Pilmapres, Peksiminas)",
  "Nasional Non Kementerian-Mandiri",
  "Wilayah-Regional-Provinsi",
  "Promahadesa",
];
const STAGES = ["Mendaftar", "Lolos Tahap Awal", "Finalis", "Pemenang (Juara 1/2/3/Honorable Mention)"];

function MatrixEditor({ field, title, description }: { field: "sks" | "nilai"; title: string; description: string }) {
  const [rows, setRows] = useState(loadMatrixRows);
  const [showAdd, setShowAdd] = useState(false);
  const [tingkatan, setTingkatan] = useState(LEVELS[0]);
  const [tahapan, setTahapan] = useState(STAGES[0]);
  const [value, setValue] = useState("");

  const persist = (next: typeof rows) => { setRows(next); saveMatrixRows(next); };

  const edit = (index: number) => {
    const current = rows[index][field];
    const next = window.prompt(field === "sks" ? "Rentang SKS baru" : "Huruf Nilai baru", current);
    if (next === null || !next.trim()) return;
    persist(rows.map((row, i) => (i === index ? { ...row, [field]: next.trim() } : row)));
  };

  const remove = (index: number) => {
    if (!window.confirm("Hapus data master ini?")) return;
    persist(rows.map((row, i) => i === index ? { ...row, [field]: "-" } : row));
  };

  const add = () => {
    if (!value.trim()) { alert(field === "sks" ? "Rentang SKS wajib diisi." : "Huruf Nilai wajib diisi."); return; }
    const existingIndex = rows.findIndex((r) => r.tingkatan === tingkatan && r.tahapan === tahapan);
    if (existingIndex >= 0) {
      persist(rows.map((row, index) => index === existingIndex ? { ...row, [field]: value.trim() } : row));
    } else {
      const nextRow = { tingkatan, tahapan, sks: field === "sks" ? value.trim() : "-", nilai: field === "nilai" ? value.trim() : "-" };
      persist([...rows, nextRow]);
    }
    setValue("");
    setShowAdd(false);
  };

  return (
    <>
      <Title title={title} description={description} />
      <Card className="p-5">
        <div className="mb-5 flex justify-end">
          <button type="button" onClick={() => setShowAdd((v) => !v)} className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white">{showAdd ? "Batal" : `Tambah ${field === "sks" ? "SKS" : "Nilai"}`}</button>
        </div>
        {showAdd && (
          <div className="mb-6 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tingkatan Lomba</span><DropdownSelect value={tingkatan} onChange={setTingkatan} options={LEVELS.map((x) => ({ value: x, label: x }))} /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tahapan</span><DropdownSelect value={tahapan} onChange={setTahapan} options={STAGES.map((x) => ({ value: x, label: x }))} /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{field === "sks" ? "Rentang SKS" : "Huruf Nilai"}</span><input value={value} onChange={(e)=>setValue(e.target.value)} placeholder={field === "sks" ? "Contoh: 4–6" : "Contoh: A"} className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" /></label>
            </div>
            <button type="button" onClick={add} className="mt-4 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white">Simpan</button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="simpresma-table w-full min-w-[980px]">
            <thead><tr className="border-b border-gray-200 dark:border-gray-800">{['Tingkatan Lomba', 'Tahapan', field === "sks" ? 'Rentang SKS' : 'Huruf Nilai', 'Aksi'].map((h) => <th key={h} className="pb-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
            <tbody>{rows.map((row, index) => <tr key={`${row.tingkatan}-${row.tahapan}`} className="border-b border-gray-200 dark:border-gray-800"><td className="py-3 text-sm text-gray-700 dark:text-gray-300">{row.tingkatan}</td><td className="py-3 text-sm text-gray-700 dark:text-gray-300">{row.tahapan}</td><td className="py-3 text-sm font-medium text-gray-800 dark:text-white/90">{row[field]}</td><td className="py-3"><div className="flex gap-4"><button type="button" onClick={() => edit(index)} className="text-sm text-brand-500">Edit</button><button type="button" onClick={() => remove(index)} className="text-sm text-error-500">Hapus</button></div></td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-500">Master data ini dikelola Verifikator. Wadek dan Kaprodi hanya dapat melihatnya (Read-Only).</p>
      </Card>
    </>
  );
}

export function VerifikatorMatriksSKS() { return <MatrixEditor field="sks" title="Master Data SKS" description="Tambah, ubah, hapus, dan lihat aturan SKS berdasarkan kombinasi Tingkatan Lomba dan Tahapan." />; }
export function VerifikatorMatriksNilai() { return <MatrixEditor field="nilai" title="Master Data Nilai" description="Tambah, ubah, hapus, dan lihat huruf Nilai berdasarkan kombinasi Tingkatan Lomba dan Tahapan." />; }
