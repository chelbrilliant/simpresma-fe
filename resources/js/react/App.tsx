import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import DashboardPage from "./pages/Simpresma/DashboardPage";
import MahasiswaPengajuan from "./pages/Simpresma/MahasiswaPengajuan";
import MahasiswaRiwayat from "./pages/Simpresma/MahasiswaRiwayat";
import MahasiswaProfil from "./pages/Simpresma/MahasiswaProfil";
import DirektoriVerifikator from "./pages/Simpresma/DirektoriVerifikator";
import VerifikatorMenunggu from "./pages/Simpresma/VerifikatorMenunggu";
import VerifikatorPerbaikan from "./pages/Simpresma/VerifikatorPerbaikan";
import VerifikatorRiwayat from "./pages/Simpresma/VerifikatorRiwayat";
import VerifikatorDataPrestasi from "./pages/Simpresma/VerifikatorDataPrestasi";
import { VerifikatorMatriksSKS, VerifikatorMatriksNilai } from "./pages/Simpresma/VerifikatorMasterData";
import TendikDataPrestasi from "./pages/Simpresma/TendikDataPrestasi";
import TendikProfil from "./pages/Simpresma/TendikProfil";
import { WadekMatriksSKS, WadekMatriksNilai, WadekMasterBidang } from "./pages/Simpresma/WadekMasterData";
import { WadekMonitoring, WadekKonversi, WadekPelaporan, WadekPerforma, WadekRekap } from "./pages/Simpresma/WadekPages";
import WadekAccessManagement from "./pages/Simpresma/WadekAccessManagement";
import { KaprodiDashboard, KaprodiKonversi, KaprodiMonitoring, KaprodiPelaporan, KaprodiPerforma, KaprodiRekap } from "./pages/Simpresma/KaprodiPages";
import { Profile } from "./pages/Simpresma/MahasiswaPages";
import MockAccess from "./pages/Simpresma/MockAccess";
import SimpresmaRoleGuard from "./pages/Simpresma/SimpresmaRoleGuard";
import { Role } from "./pages/Simpresma/SimpresmaMockAccess";

function Guard({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  return <SimpresmaRoleGuard roles={roles}>{children}</SimpresmaRoleGuard>;
}

export default function App() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const nativeAlert = window.alert;

    window.alert = (message?: unknown) => {
      setAlertMessage(String(message ?? ""));
    };

    return () => {
      window.alert = nativeAlert;
    };
  }, []);

  return (
    <>
      <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/mock-access" replace />} />
          <Route path="/dashboard" element={<Navigate to="/mock-access" replace />} />

          <Route path="/mahasiswa/dashboard" element={<Guard roles={["Mahasiswa"]}><DashboardPage role="Mahasiswa" /></Guard>} />
          <Route path="/mahasiswa/pengajuan" element={<Guard roles={["Mahasiswa"]}><MahasiswaPengajuan /></Guard>} />
          <Route path="/mahasiswa/riwayat" element={<Guard roles={["Mahasiswa"]}><MahasiswaRiwayat /></Guard>} />
          <Route path="/mahasiswa/profil" element={<Guard roles={["Mahasiswa"]}><MahasiswaProfil /></Guard>} />
          <Route path="/profile" element={<Guard roles={["Mahasiswa"]}><MahasiswaProfil /></Guard>} />
          <Route path="/direktori-verifikator" element={<Guard roles={["Mahasiswa"]}><DirektoriVerifikator /></Guard>} />

          <Route path="/verifikator/dashboard" element={<Guard roles={["Verifikator"]}><DashboardPage role="Verifikator" /></Guard>} />
          <Route path="/verifikator/menunggu" element={<Guard roles={["Verifikator"]}><VerifikatorMenunggu /></Guard>} />
          <Route path="/verifikator/perbaikan" element={<Guard roles={["Verifikator"]}><VerifikatorPerbaikan /></Guard>} />
          <Route path="/verifikator/riwayat" element={<Guard roles={["Verifikator"]}><VerifikatorRiwayat /></Guard>} />
          <Route path="/verifikator/data-prestasi" element={<Guard roles={["Verifikator"]}><VerifikatorDataPrestasi /></Guard>} />
          <Route path="/verifikator/matriks-sks" element={<Guard roles={["Verifikator"]}><VerifikatorMatriksSKS /></Guard>} />
          <Route path="/verifikator/matriks-nilai" element={<Guard roles={["Verifikator"]}><VerifikatorMatriksNilai /></Guard>} />
          <Route path="/verifikator/profil" element={<Guard roles={["Verifikator"]}><Profile role="Verifikator" editable /></Guard>} />

          <Route path="/tendik/dashboard" element={<Guard roles={["Tendik"]}><DashboardPage role="Tendik" /></Guard>} />
          <Route path="/tendik/data-prestasi" element={<Guard roles={["Tendik"]}><TendikDataPrestasi /></Guard>} />
          <Route path="/tendik/profil" element={<Guard roles={["Tendik"]}><TendikProfil /></Guard>} />

          <Route path="/wadek/dashboard" element={<Guard roles={["Wadek"]}><DashboardPage role="Wadek" /></Guard>} />
          <Route path="/wadek/monitoring" element={<Guard roles={["Wadek"]}><WadekMonitoring /></Guard>} />
          <Route path="/wadek/rekap" element={<Guard roles={["Wadek"]}><WadekRekap /></Guard>} />
          <Route path="/wadek/konversi" element={<Guard roles={["Wadek"]}><WadekKonversi /></Guard>} />
          <Route path="/wadek/performa" element={<Guard roles={["Wadek"]}><WadekPerforma /></Guard>} />
          <Route path="/wadek/manajemen-akses" element={<Guard roles={["Wadek"]}><WadekAccessManagement /></Guard>} />
          <Route path="/wadek/master-bidang" element={<Guard roles={["Wadek"]}><WadekMasterBidang /></Guard>} />
          <Route path="/wadek/matriks-sks" element={<Guard roles={["Wadek"]}><WadekMatriksSKS /></Guard>} />
          <Route path="/wadek/matriks-nilai" element={<Guard roles={["Wadek"]}><WadekMatriksNilai /></Guard>} />
          <Route path="/wadek/pelaporan" element={<Guard roles={["Wadek"]}><WadekPelaporan /></Guard>} />
          <Route path="/wadek/profil" element={<Guard roles={["Wadek"]}><Profile role="Wakil Dekan" editable /></Guard>} />

          <Route path="/kaprodi/dashboard" element={<Guard roles={["Kaprodi"]}><KaprodiDashboard /></Guard>} />
          <Route path="/kaprodi/monitoring" element={<Guard roles={["Kaprodi"]}><KaprodiMonitoring /></Guard>} />
          <Route path="/kaprodi/rekap" element={<Guard roles={["Kaprodi"]}><KaprodiRekap /></Guard>} />
          <Route path="/kaprodi/konversi" element={<Guard roles={["Kaprodi"]}><KaprodiKonversi /></Guard>} />
          <Route path="/kaprodi/performa" element={<Guard roles={["Kaprodi"]}><KaprodiPerforma /></Guard>} />
          <Route path="/kaprodi/pelaporan" element={<Guard roles={["Kaprodi"]}><KaprodiPelaporan /></Guard>} />
          <Route path="/kaprodi/profil" element={<Guard roles={["Kaprodi"]}><Profile role="Kaprodi" editable /></Guard>} />
        </Route>

        <Route path="/mock-access" element={<MockAccess />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Router>

      {alertMessage !== null && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-[2px]">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="simpresma-alert-title"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 10.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="7.5" r="1" fill="currentColor" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h2 id="simpresma-alert-title" className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Informasi
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {alertMessage}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setAlertMessage(null)}
                className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-sm transition hover:bg-brand-600 focus:outline-none focus:ring-3 focus:ring-brand-500/20"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
