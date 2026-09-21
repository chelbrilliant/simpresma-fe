import React, { useState } from "react";
import DropdownSelect from "../../components/form/DropdownSelect";
import { usePrestasi } from "./SimpresmaShared";

function FileField({
  label,
  required,
  onValid,
  previewUrl,
}: {
  label: string;
  required?: boolean;
  onValid: (name: string, url: string) => void;
  previewUrl?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-error-500">*</span>}
      </label>

      <input
        type="file"
        accept=".pdf,application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          if (
            file.type !== "application/pdf" ||
            file.size > 10 * 1024 * 1024
          ) {
            alert("Dokumen harus berformat PDF dengan ukuran maksimal 10MB.");
            e.currentTarget.value = "";
            return;
          }

          onValid(file.name, URL.createObjectURL(file));
        }}
        className="block w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-600 file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2.5 file:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:file:bg-gray-700"
      />

      {previewUrl && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            Preview dokumen
          </div>

          <iframe
            title={`Preview ${label}`}
            src={previewUrl}
            className="h-[280px] w-full bg-white"
          />
        </div>
      )}
    </div>
  );
}

export default function MahasiswaPengajuan() {
  const { add, data } = usePrestasi();

  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jenis, setJenis] = useState<"Individu" | "Kelompok">("Individu");
  const [namaTim, setNamaTim] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [namaLomba, setNamaLomba] = useState("");
  const [tingkatan, setTingkatan] = useState("");
  const [tahapan, setTahapan] = useState("");
  const [suratTugasMahasiswa, setSuratTugasMahasiswa] = useState("Tidak");
  const [suratTugasDosen, setSuratTugasDosen] = useState("Tidak");
  const [certificate, setCertificate] = useState("");
  const [suratMahasiswa, setSuratMahasiswa] = useState("");
  const [suratDosen, setSuratDosen] = useState("");
  const [poster, setPoster] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const steps = [
    { no: 1, title: "Informasi Lomba", desc: "Data & Capaian" },
    { no: 2, title: "Tautan Bukti", desc: "Sertifikat & Dokumen" },
    { no: 3, title: "Mata Kuliah", desc: "Pilihan Konversi SKS" },
    { no: 4, title: "Konfirmasi", desc: "Review & Submit" },
  ];

  const setPreview = (
    key: string,
    name: string,
    url: string,
    setter: (value: string) => void
  ) => {
    setPreviewFiles((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key]);
      return { ...prev, [key]: url };
    });

    setter(name);
  };

  const submit = () => {
    setShowValidation(true);

    const invalid =
      !whatsapp.trim() ||
      !namaLomba.trim() ||
      !tingkatan ||
      !tahapan ||
      !certificate ||
      !poster ||
      (jenis === "Kelompok" && !namaTim.trim()) ||
      (suratTugasMahasiswa === "Ada" && !suratMahasiswa) ||
      (suratTugasDosen === "Ada" && !suratDosen);

    if (invalid) {
      if (!whatsapp.trim() || !namaLomba.trim() || !tingkatan || !tahapan) {
        setStep(1);
      } else if (
        !certificate ||
        !poster ||
        (suratTugasMahasiswa === "Ada" && !suratMahasiswa) ||
        (suratTugasDosen === "Ada" && !suratDosen)
      ) {
        setStep(2);
      }

      return;
    }

    setShowConfirm(true);
  };

  const RequiredError = ({ show }: { show: boolean }) =>
    show ? (
      <span className="mt-1 block text-xs text-error-500">Wajib diisi</span>
    ) : null;

  const confirmSubmit = () => {
    setSubmitLoading(true);

    const nextId =
      data.reduce((max, item) => Math.max(max, item.id), 0) + 1;

    add({
      id: nextId,
      mahasiswa: "Chelsea Brilliant Syah Putra",
      nim: "242410101079",
      prodi: "Sistem Informasi",
      lomba: namaLomba,
      bidang: "-",
      tingkatan,
      tahapan,
      jenis,
      status: "Pending",
      tanggal: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      dokumen: [
        certificate,
        ...(suratTugasMahasiswa === "Ada" ? [suratMahasiswa] : []),
        ...(suratTugasDosen === "Ada" ? [suratDosen] : []),
        poster,
      ].filter(Boolean),
    });

    setShowConfirm(false);

    window.setTimeout(() => {
      setSubmitLoading(false);
      alert(
        "Pengajuan berhasil disubmit dan masuk ke Shared Inbox Verifikator."
      );
    }, 280);
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <div className="space-y-6">
      {submitLoading && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center bg-white/70 backdrop-blur-[1px] dark:bg-gray-950/70">
          <div className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-lg dark:bg-gray-900 dark:text-gray-200">
            Loading Render...
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Pengajuan Prestasi
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Lengkapi data lomba dan dokumen pendukung untuk mengajukan prestasi.
        </p>
      </div>

      {/* Stepper */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="grid grid-cols-4 gap-1 sm:gap-4">
          {steps.map((item, index) => (
            <button
              key={item.no}
              type="button"
              onClick={() => item.no <= step && setStep(item.no)}
              className="group relative text-center"
            >
              {index < steps.length - 1 && (
                <span
                  className={`absolute left-[calc(50%+22px)] right-[calc(-50%+22px)] top-5 hidden h-px sm:block ${
                    step > item.no
                      ? "bg-brand-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}

              <span
                className={`relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  step === item.no
                    ? "bg-brand-500 text-white shadow-sm"
                    : step > item.no
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {step > item.no ? "✓" : item.no}
              </span>

              <span
                className={`mt-2 block text-[11px] font-semibold sm:text-xs ${
                  step === item.no
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-gray-500"
                }`}
              >
                {item.title}
              </span>

              <span className="mt-0.5 hidden text-[10px] text-gray-400 sm:block">
                {item.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Informasi Perlombaan
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Masukkan rincian kegiatan lomba dan capaian prestasi yang Anda
              ikuti.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nama Kegiatan / Perlombaan{" "}
                <span className="text-error-500">*</span>
              </label>

              <input
                className={inputClass}
                value={namaLomba}
                onChange={(e) => setNamaLomba(e.target.value)}
                placeholder="Contoh: Pagelaran Mahasiswa Nasional Bidang TIK (GEMASTIK XVI)"
              />

              <RequiredError
                show={showValidation && !namaLomba.trim()}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bidang Perlombaan
              </label>

              <input
                className={inputClass + " bg-gray-50 dark:bg-gray-800"}
                value="Akan ditentukan Verifikator"
                readOnly
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Semester Mahasiswa Saat Mengikuti Lomba
              </label>

              <DropdownSelect
                defaultValue="Semester 1 (Tingkat Pertama)"
                options={[
                  { value: "Semester 1 (Tingkat Pertama)", label: "Semester 1 (Tingkat Pertama)" },
                  { value: "Semester 2", label: "Semester 2" },
                  { value: "Semester 3", label: "Semester 3" },
                  { value: "Semester 4", label: "Semester 4" },
                  { value: "Semester 5", label: "Semester 5" },
                  { value: "Semester 6", label: "Semester 6" },
                  { value: "Semester 7", label: "Semester 7" },
                  { value: "Semester 8", label: "Semester 8" },
                ]}
              />

              <p className="mt-1 text-xs text-gray-400">
                Mata kuliah konversi mengikuti semester saat mahasiswa
                mengikuti lomba.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nama Tim (Kosongkan jika Individu)
              </label>

              <input
                className={inputClass}
                value={namaTim}
                onChange={(e) => setNamaTim(e.target.value)}
                placeholder="Contoh: Tim Inovasi Fasilkom"
              />

              <p className="mt-1 text-xs text-gray-400">
                Jenis peserta: {jenis}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nomor WhatsApp Aktif{" "}
                <span className="text-error-500">*</span>
              </label>

              <input
                className={inputClass}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Contoh: 081234567890"
              />

              <RequiredError
                show={showValidation && !whatsapp.trim()}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tingkatan Lomba / Kompetisi{" "}
                <span className="text-error-500">*</span>
              </label>

              <DropdownSelect
                value={tingkatan}
                onChange={setTingkatan}
                placeholder="Pilih tingkatan..."
                options={[
                  { value: "", label: "Pilih tingkatan..." },
                  { value: "Internasional", label: "Internasional" },
                  { value: "Nasional Kementerian (Gemastik, LIDM, Satria Data, NUDC, KDMI, MTQMN)", label: "Nasional Kementerian (Gemastik, LIDM, Satria Data, NUDC, KDMI, MTQMN)" },
                  { value: "Nasional Kementerian (PKM, P2MW, PPK Ormawa, Pilmapres, Peksiminas)", label: "Nasional Kementerian (PKM, P2MW, PPK Ormawa, Pilmapres, Peksiminas)" },
                  { value: "Nasional Non Kementerian-Mandiri", label: "Nasional Non Kementerian-Mandiri" },
                  { value: "Wilayah-Regional-Provinsi", label: "Wilayah-Regional-Provinsi" },
                  { value: "Promahadesa", label: "Promahadesa" },
                ]}
              />

              <RequiredError show={showValidation && !tingkatan} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Capaian / Tahapan Juara{" "}
                <span className="text-error-500">*</span>
              </label>

              <DropdownSelect
                value={tahapan}
                onChange={setTahapan}
                placeholder="Pilih capaian..."
                options={[
                  { value: "", label: "Pilih capaian..." },
                  { value: "Mendaftar", label: "Mendaftar" },
                  { value: "Lolos Tahap Awal", label: "Lolos Tahap Awal" },
                  { value: "Finalis", label: "Finalis" },
                  { value: "Pemenang (Juara 1/2/3/Honorable Mention)", label: "Pemenang (Juara 1/2/3/Honorable Mention)" },
                ]}
              />

              <RequiredError show={showValidation && !tahapan} />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Keterangan Juara (Opsional)
              </label>

              <input
                className={inputClass}
                placeholder="Contoh: Juara 1 Kategori UX Design / Medali Emas"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Tautan Bukti & Dokumen
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Unggah dokumen pendukung dalam format PDF maksimal 10MB.
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <FileField
                label="Sertifikat / Bukti Tahapan Saat Ini"
                required
                onValid={(name, url) =>
                  setPreview(
                    "certificate",
                    name,
                    url,
                    setCertificate
                  )
                }
                previewUrl={previewFiles.certificate}
              />

              <RequiredError
                show={showValidation && !certificate}
              />
            </div>

            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Surat Tugas Mahasiswa
              </p>

              <div className="mt-3 flex gap-5">
                {["Ya", "Tidak"].map((x) => (
                  <label
                    key={x}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      checked={
                        suratTugasMahasiswa ===
                        (x === "Ya" ? "Ada" : "Tidak")
                      }
                      onChange={() =>
                        setSuratTugasMahasiswa(
                          x === "Ya" ? "Ada" : "Tidak"
                        )
                      }
                    />
                    {x}
                  </label>
                ))}
              </div>

              {suratTugasMahasiswa === "Ada" && (
                <div className="mt-4">
                  <FileField
                    label="Surat Tugas Mahasiswa"
                    required
                    onValid={(name, url) =>
                      setPreview(
                        "suratMahasiswa",
                        name,
                        url,
                        setSuratMahasiswa
                      )
                    }
                    previewUrl={previewFiles.suratMahasiswa}
                  />

                  <RequiredError
                    show={showValidation && !suratMahasiswa}
                  />
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Surat Tugas Dosen Pembimbing
              </p>

              <div className="mt-3 flex gap-5">
                {["Ya", "Tidak"].map((x) => (
                  <label
                    key={x}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      checked={
                        suratTugasDosen ===
                        (x === "Ya" ? "Ada" : "Tidak")
                      }
                      onChange={() =>
                        setSuratTugasDosen(
                          x === "Ya" ? "Ada" : "Tidak"
                        )
                      }
                    />
                    {x}
                  </label>
                ))}
              </div>

              {suratTugasDosen === "Ada" && (
                <div className="mt-4">
                  <FileField
                    label="Surat Tugas Dosen Pembimbing"
                    required
                    onValid={(name, url) =>
                      setPreview(
                        "suratDosen",
                        name,
                        url,
                        setSuratDosen
                      )
                    }
                    previewUrl={previewFiles.suratDosen}
                  />

                  <RequiredError
                    show={showValidation && !suratDosen}
                  />
                </div>
              )}
            </div>

            <div>
              <FileField
                label="Poster Lomba"
                required
                onValid={(name, url) =>
                  setPreview("poster", name, url, setPoster)
                }
                previewUrl={previewFiles.poster}
              />

              <RequiredError show={showValidation && !poster} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Link Sosmed Lomba
              </label>

              <input
                type="url"
                className={inputClass}
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Mata Kuliah Konversi
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Pilihan mata kuliah tersedia setelah pengajuan disetujui
              Verifikator.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-xl border border-brand-100 bg-brand-25 p-4 text-sm text-gray-600 dark:border-brand-900 dark:bg-brand-950/20 dark:text-gray-300">
              Mata kuliah, SKS, dan Nilai belum ditentukan pada tahap
              pengajuan. Setelah disetujui Verifikator, mahasiswa dapat
              memilih Mata Kuliah Konversi sesuai Bidang dan Program Studi.
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <p className="text-xs text-gray-500">Program Studi</p>
                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                  Sistem Informasi
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                <p className="text-xs text-gray-500">
                  Status Mata Kuliah
                </p>
                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                  Menunggu Verifikasi
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Review & Submit
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Pastikan seluruh data dan dokumen sudah benar sebelum dikirim.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:p-6 md:grid-cols-2">
            {[
              ["Nama Mahasiswa", "Chelsea Brilliant Syah Putra"],
              ["NIM", "242410101079"],
              ["Program Studi", "Sistem Informasi"],
              ["Nomor WhatsApp", whatsapp || "-"],
              ["Nama Lomba", namaLomba || "-"],
              ["Tingkatan", tingkatan || "-"],
              ["Capaian / Tahapan", tahapan || "-"],
              ["Jenis Peserta", jenis],
              ["Sertifikat", certificate || "Belum diunggah"],
              ["Poster", poster || "Belum diunggah"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-800/60"
              >
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-gray-800 dark:text-white/90">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              Bidang, SKS, dan Nilai akan ditentukan pada proses verifikasi
              sesuai matriks konversi SIMPRESMA.
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col-reverse gap-3 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() =>
            step > 1 ? setStep(step - 1) : window.history.back()
          }
          className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {step === 1 ? "Batal" : "← Kembali"}
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-theme-sm"
          >
            Lanjutkan →
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-theme-sm"
          >
            Submit Pengajuan
          </button>
        )}
      </div>

      {/* Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Konfirmasi Pengajuan
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Pastikan seluruh data dan dokumen yang diunggah sudah benar.
              Setelah dikirim, pengajuan masuk ke proses verifikasi.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmSubmit}
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white"
              >
                Ya, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
