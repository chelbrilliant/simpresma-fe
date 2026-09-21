import React, { useEffect, useMemo, useState } from "react";
import { loadActiveAccount } from "./SimpresmaMockAccess";
import { getConversionMatrix, loadBidangMapping, masterCoursesByProdi } from "./SimpresmaMatrix";
import {
  Card,
  Input,
  Prestasi,
  PrestasiTable,
  SearchFilter,
  Section,
  StatusBadge,
  Textarea,
  Title,
  usePrestasi,
  prodiOptions,
} from "./SimpresmaShared";

function createMockPdfUrl(title: string) {
  const safe = title.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const stream = `BT\n/F1 14 Tf\n50 760 Td\n(${safe}) Tj\n/F1 10 Tf\n0 -28 Td\n(Preview PDF simulasi frontend SIMPRESMA) Tj\nET`;
  const objects = [
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj",
    "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>endobj",
    "4 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj",
    `5 0 obj<< /Length ${stream.length} >>stream\n${stream}\nendstream endobj`,
  ];
  let pdf = "%PDF-1.4\n"; const offsets = [0];
  for (const obj of objects) { offsets.push(pdf.length); pdf += obj + "\n"; }
  const xref = pdf.length; pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
}

function VerificationList({
  mode,
}: {
  mode: "pending" | "repair" | "history" | "all";
}) {
  const { data, update } = usePrestasi();

  const [q, setQ] = useState("");
  const [prodi, setProdi] = useState("");
  const [selected, setSelected] = useState<Prestasi | null>(null);
  const [feedback, setFeedback] = useState("");
  const [bidang, setBidang] = useState("");
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (!previewDoc) { setPreviewUrl(null); setPreviewLoading(false); return; }
    setPreviewLoading(true);
    const timer = window.setTimeout(() => {
      const url = createMockPdfUrl(previewDoc);
      setPreviewUrl(url);
      setPreviewLoading(false);
    }, 250);
    return () => {
      window.clearTimeout(timer);
    };
  }, [previewDoc]);

  const activeAccount = loadActiveAccount();
  const scopeProdi = activeAccount?.prodi ?? "Sistem Informasi";

  let rows = data.filter((r) => r.prodi === scopeProdi);

  if (mode === "pending") {
    rows = rows.filter((r) => r.status === "Pending");
  }

  if (mode === "repair") {
    rows = rows.filter((r) => r.status === "Ditolak");
  }

  if (mode === "history") {
    rows = rows.filter((r) => r.status !== "Pending");
  }

  if (mode === "all") {
    rows = rows.filter(
      (r) =>
        r.status === "Diterima" ||
        r.status === "Terkonversi" ||
        r.status === "Ditolak"
    );
  }

  rows = rows.filter((r) =>
    !q ||
    `${r.mahasiswa} ${r.lomba}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  const approve = (r: Prestasi) => {
    if (!bidang.trim()) {
      alert("Bidang wajib dipilih untuk menyetujui pengajuan.");
      return;
    }
    const matrix = getConversionMatrix(r.tingkatan, r.tahapan);
    update(r.id, {
      status: "Diterima",
      bidang,
      sks: matrix?.sks ?? "-",
      nilai: matrix?.nilai && matrix.nilai !== "-" ? [matrix.nilai] : [],
    });

    setSelected(null);
  };

  const reject = (r: Prestasi) => {
    if (!feedback.trim()) {
      alert("Feedback wajib diisi.");
      return;
    }

    update(r.id, {
      status: "Ditolak",
      feedback,
    });

    setFeedback("");
    setSelected(null);
  };

  return (
    <>
      <Title
        title={
          mode === "pending"
            ? "Menunggu Verifikasi"
            : mode === "repair"
              ? "Perlu Perbaikan"
              : mode === "history"
                ? "Riwayat Verifikasi"
                : "Data Prestasi"
        }
        description={
          mode === "pending"
            ? "Periksa dan verifikasi pengajuan prestasi mahasiswa yang masuk."
            : "Lihat dan kelola data prestasi mahasiswa sesuai scope program studi."
        }
      />

      <SearchFilter
        value={q}
        onChange={setQ}

      />

      <p className="mb-6 text-sm text-gray-500">
        Shared Inbox • Scope Program Studi: <span className="font-medium text-gray-700 dark:text-gray-300">{scopeProdi}</span>
      </p>

      <Card className="p-5">
        <PrestasiTable
          data={rows}
          action={(r) => (
            <button
              onClick={() => { setSelected(r); setBidang(r.bidang === "-" ? "" : r.bidang); setFeedback(""); setPreviewDoc(null); }}
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              {mode === "pending" ? "Periksa" : "Lihat Detail"}
            </button>
          )}
        />
      </Card>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {selected.lomba}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selected.mahasiswa} • {selected.prodi}
                </p>
              </div>

              <button
                onClick={() => { setSelected(null); setPreviewDoc(null); }}
                className="text-xl text-gray-400"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Nama Mahasiswa"
                value={selected.mahasiswa}
                readOnly
              />

              <Input
                label="NIM"
                value={selected.nim}
                readOnly
              />

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Bidang Lomba</span>
                <DropdownSelect
                value={bidang}
                onChange={setBidang}
                disabled={selected.status !== "Pending"}
                placeholder="Pilih bidang"
                options={[
                  { value: "", label: "Pilih bidang" },
                  ...['Pembelajaran','Komputasi','Seni','Olahraga','Penalaran','Kewirausahaan','Lainnya'].map((item) => ({ value: item, label: item })),
                ]}
              />
              </label>

              <Input label="SKS Otomatis" value={getConversionMatrix(selected.tingkatan, selected.tahapan)?.sks || "-"} readOnly />

              <Input label="Nilai Otomatis" value={getConversionMatrix(selected.tingkatan, selected.tahapan)?.nilai || "-"} readOnly />

              <Input
                label="Tingkatan"
                value={selected.tingkatan}
                readOnly
              />

              <Input
                label="Tahapan Saat Ini"
                value={selected.tahapan}
                readOnly
              />

              <Input
                label="Status"
                value={selected.status}
                readOnly
              />
            </div>

            {bidang && (
              <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Daftar Mata Kuliah Konversi</p>
                <p className="mt-1 text-xs text-gray-500">Opsi ditampilkan otomatis berdasarkan Bidang dan Program Studi. Mahasiswa memilih mata kuliah setelah pengajuan disetujui.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(loadBidangMapping()[bidang] || [])
                    .filter((course) => (masterCoursesByProdi[selected.prodi] || []).some((catalog) => catalog.includes(course) || course.includes(catalog)))
                    .map((course) => (
                      <span key={course} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">{course}</span>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dokumen Pendukung</p>
              <p className="mt-1 text-xs text-gray-500">Dokumen PDF dapat dipratinjau langsung tanpa mengunduh. Pada mock frontend, preview menggunakan contoh PDF untuk mensimulasikan Object Storage.</p>
              <div className="mt-3 space-y-2">
                {(selected.dokumen?.length ? selected.dokumen : ["Sertifikat / Bukti Tahapan Saat Ini.pdf", "Poster Lomba.pdf"]).map((doc) => (
                  <div key={doc} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800">
                    <span className="truncate text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                    <button type="button" onClick={() => setPreviewDoc(doc)} className="shrink-0 text-sm font-medium text-brand-500">Preview</button>
                  </div>
                ))}
              </div>
              {previewDoc && (
                <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between bg-gray-50 px-4 py-3 dark:bg-gray-800">
                    <span className="truncate text-sm font-medium">Preview: {previewDoc}</span>
                    <button type="button" onClick={() => setPreviewDoc(null)} className="text-sm text-gray-500">Tutup</button>
                  </div>
                  {previewLoading ? (
                    <div className="flex h-[420px] items-center justify-center bg-white text-sm text-gray-500">Loading Render...</div>
                  ) : previewUrl ? (
                    <iframe title={`Preview ${previewDoc}`} src={previewUrl} className="h-[420px] w-full bg-white" />
                  ) : null}
                </div>
              )}
            </div>

            {mode === "pending" && (
              <>
                <div className="mt-6">
                  <Textarea
                    label="Feedback / Alasan Penolakan (wajib jika Tolak)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    placeholder="Isi alasan jika pengajuan tidak memenuhi ketentuan."
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => reject(selected)}
                    className="rounded-lg border border-error-300 px-5 py-2.5 text-sm font-medium text-error-600"
                  >
                    Tolak
                  </button>

                  <button
                    onClick={() => approve(selected)}
                    className="rounded-lg bg-success-500 px-5 py-2.5 text-sm font-medium text-white"
                  >
                    Terima
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export const VerifikatorMenunggu = () => (
  <VerificationList mode="pending" />
);

export const VerifikatorPerbaikan = () => (
  <VerificationList mode="repair" />
);

export const VerifikatorRiwayat = () => (
  <VerificationList mode="history" />
);

export const VerifikatorDataPrestasi = () => (
  <VerificationList mode="all" />
);

export const VerifikatorProfil = () => <div />;
