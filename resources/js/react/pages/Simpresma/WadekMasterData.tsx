import { useState } from "react";
import DropdownSelect from "../../components/form/DropdownSelect";
import { Card, Input, Title } from "./SimpresmaShared";
import { loadBidangMapping, loadMatrixRows, masterCoursesByProdi, saveBidangMapping } from "./SimpresmaMatrix";

export function WadekMatriksSKS() {
  const rows = loadMatrixRows();
  return (
    <>
      <Title title="Master Data SKS" description="Pemantauan read-only aturan SKS yang dikelola oleh Verifikator." />
      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="simpresma-table w-full min-w-[980px]">
            <thead><tr className="border-b border-gray-200 dark:border-gray-800">{['Tingkatan Lomba','Tahapan','Rentang SKS'].map((h)=><th key={h} className="pb-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
            <tbody>{rows.map((row)=><tr key={`${row.tingkatan}-${row.tahapan}`} className="border-b border-gray-200 dark:border-gray-800"><td className="py-3 text-sm text-gray-700 dark:text-gray-300">{row.tingkatan}</td><td className="py-3 text-sm text-gray-700 dark:text-gray-300">{row.tahapan}</td><td className="py-3 text-sm font-medium text-gray-800 dark:text-white/90">{row.sks}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-500">Read-only. Perubahan Master Data SKS dilakukan oleh Verifikator.</p>
      </Card>
    </>
  );
}

export function WadekMatriksNilai() {
  const rows = loadMatrixRows();
  return (
    <>
      <Title title="Master Data Nilai" description="Pemantauan read-only aturan huruf nilai yang dikelola oleh Verifikator." />
      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="simpresma-table w-full min-w-[980px]">
            <thead><tr className="border-b border-gray-200 dark:border-gray-800">{['Tingkatan Lomba','Tahapan','Huruf Nilai'].map((h)=><th key={h} className="pb-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
            <tbody>{rows.map((row)=><tr key={`${row.tingkatan}-${row.tahapan}`} className="border-b border-gray-200 dark:border-gray-800"><td className="py-3 text-sm text-gray-700 dark:text-gray-300">{row.tingkatan}</td><td className="py-3 text-sm text-gray-700 dark:text-gray-300">{row.tahapan}</td><td className="py-3 text-sm font-medium text-gray-800 dark:text-white/90">{row.nilai}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-500">Read-only. Perubahan Master Data Nilai dilakukan oleh Verifikator.</p>
      </Card>
    </>
  );
}

export function WadekMasterBidang() {
  const [mapping, setMapping] = useState(loadBidangMapping);
  const [newBidang, setNewBidang] = useState("");
  const [selectedBidang, setSelectedBidang] = useState(Object.keys(mapping)[0] ?? "");
  const [matkul, setMatkul] = useState("");
  const [prodi, setProdi] = useState("Sistem Informasi");

  const persist = (next: Record<string, string[]>) => {
    setMapping(next);
    saveBidangMapping(next);
  };

  const addBidang = () => {
    const name = newBidang.trim();
    if (!name || mapping[name]) return;
    const next = { ...mapping, [name]: [] };
    persist(next);
    setSelectedBidang(name);
    setNewBidang("");
  };

  const editBidang = (oldName: string) => {
    const nextName = window.prompt("Nama bidang baru", oldName)?.trim();
    if (!nextName || nextName === oldName || mapping[nextName]) return;
    const next: Record<string, string[]> = {};
    Object.entries(mapping).forEach(([key, value]) => { next[key === oldName ? nextName : key] = value; });
    persist(next);
    setSelectedBidang(nextName);
  };

  const removeBidang = (name: string) => {
    if (Object.keys(mapping).length <= 1) return;
    const next = { ...mapping };
    delete next[name];
    persist(next);
    setSelectedBidang(Object.keys(next)[0] ?? "");
  };

  const addMapping = () => {
    const value = matkul.trim();
    if (!selectedBidang || !value) return;
    const next = { ...mapping, [selectedBidang]: [...(mapping[selectedBidang] ?? []), value] };
    persist(next);
    setMatkul("");
  };

  const editMapping = (course: string) => {
    const nextCourse = window.prompt("Nama Mata Kuliah baru", course)?.trim();
    if (!nextCourse || nextCourse === course) return;
    const next = { ...mapping, [selectedBidang]: (mapping[selectedBidang] ?? []).map((item) => item === course ? nextCourse : item) };
    persist(next);
  };

  const removeMapping = (course: string) => {
    const next = { ...mapping, [selectedBidang]: (mapping[selectedBidang] ?? []).filter((item) => item !== course) };
    persist(next);
  };

  return (
    <>
      <Title title="Master Data Bidang & Pemetaan Mata Kuliah" description="Wadek mengelola kategori Bidang dan pemetaan Mata Kuliah ke Bidang. Daftar mata kuliah berasal dari katalog master per program studi." />
      <Card className="p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input label="Tambah Kategori Bidang" value={newBidang} onChange={(e) => setNewBidang(e.target.value)} placeholder="Nama bidang baru" />
          <button type="button" onClick={addBidang} className="h-11 self-end rounded-lg bg-brand-500 px-5 text-sm font-medium text-white">Tambah Bidang</button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="simpresma-table w-full min-w-[760px]">
            <thead><tr className="border-b border-gray-200 dark:border-gray-800"><th className="pb-3 text-left text-xs font-medium text-gray-500">Bidang</th><th className="pb-3 text-left text-xs font-medium text-gray-500">Jumlah Mata Kuliah</th><th className="pb-3 text-left text-xs font-medium text-gray-500">Aksi</th></tr></thead>
            <tbody>{Object.entries(mapping).map(([field, courses])=><tr key={field} className="border-b border-gray-200 dark:border-gray-800"><td className="py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{field}</td><td className="py-3 text-sm text-gray-500">{courses.length}</td><td className="py-3"><div className="flex gap-4"><button type="button" onClick={()=>setSelectedBidang(field)} className="text-sm text-brand-500">Kelola</button><button type="button" onClick={()=>editBidang(field)} className="text-sm text-brand-500">Edit</button><button type="button" onClick={()=>removeBidang(field)} className="text-sm text-error-500">Hapus</button></div></td></tr>)}</tbody>
          </table>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Bidang Aktif</span><DropdownSelect value={selectedBidang} onChange={setSelectedBidang} options={Object.keys(mapping).map((item) => ({ value: item, label: item }))} /></label>
            <label className="block"><span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Program Studi</span><DropdownSelect value={prodi} onChange={setProdi} options={Object.keys(masterCoursesByProdi).map((item) => ({ value: item, label: item }))} /></label>
            <Input label="Mata Kuliah dari Katalog" value={matkul} onChange={(e)=>setMatkul(e.target.value)} placeholder="Pilih/tulis nama mata kuliah" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">{masterCoursesByProdi[prodi].map((course)=><button key={course} type="button" onClick={()=>setMatkul(course)} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600 hover:bg-brand-50 hover:text-brand-500 dark:bg-gray-800 dark:text-gray-300">{course}</button>)}</div>
          <button type="button" onClick={addMapping} className="mt-4 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white">Tambah Pemetaan</button>

          <div className="mt-6 space-y-2">{(mapping[selectedBidang] ?? []).map((course)=><div key={course} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800"><span className="text-gray-700 dark:text-gray-300">{course}</span><div className="flex gap-3"><button type="button" onClick={()=>editMapping(course)} className="text-brand-500">Edit</button><button type="button" onClick={()=>removeMapping(course)} className="text-error-500">Hapus</button></div></div>)}</div>
        </div>

        <p className="mt-4 text-xs text-gray-500">Kewenangan Bidang dan pemetaan Mata Kuliah adalah milik Wadek. Master SKS/Nilai tetap read-only di sisi Wadek.</p>
      </Card>
    </>
  );
}
