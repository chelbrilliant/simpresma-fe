import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { GridIcon, FileIcon, UserCircleIcon, CheckCircleIcon, HorizontaLDots, ChevronUpIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { loadActiveAccount } from "../pages/Simpresma/SimpresmaMockAccess";

type NavItem = [string, React.ReactNode, string];

const items: Record<string, NavItem[]> = {
  Mahasiswa: [
    ["Dashboard", <GridIcon />, "/mahasiswa/dashboard"],
    ["Pengajuan Prestasi", <FileIcon />, "/mahasiswa/pengajuan"],
    ["Riwayat Prestasi", <GridIcon />, "/mahasiswa/riwayat"],
    ["Profil", <UserCircleIcon />, "/mahasiswa/profil"],
    ["Direktori Verifikator", <CheckCircleIcon />, "/direktori-verifikator"],
  ],
  Verifikator: [
    ["Dashboard", <GridIcon />, "/verifikator/dashboard"],
    ["Shared Inbox", <FileIcon />, "/verifikator/menunggu"],
    ["Riwayat Verifikasi", <GridIcon />, "/verifikator/riwayat"],
    ["Master Data SKS", <FileIcon />, "/verifikator/matriks-sks"],
    ["Master Data Nilai", <FileIcon />, "/verifikator/matriks-nilai"],
    ["Profil", <UserCircleIcon />, "/verifikator/profil"],
  ],
  Tendik: [
    ["Pengajuan & Upload SK", <FileIcon />, "/tendik/data-prestasi"],
  ],
  Wadek: [
    ["Dashboard", <GridIcon />, "/wadek/dashboard"],
    ["Peninjauan Prestasi", <FileIcon />, "/wadek/monitoring"],
    ["Resume & Rekap", <GridIcon />, "/wadek/rekap"],
    ["Resume Konversi", <GridIcon />, "/wadek/konversi"],
    ["Performa Verifikator", <GridIcon />, "/wadek/performa"],
    ["Manajemen Akses", <UserCircleIcon />, "/wadek/manajemen-akses"],
    ["Master Data Bidang", <FileIcon />, "/wadek/master-bidang"],
    ["Pemantauan Master Data SKS", <FileIcon />, "/wadek/matriks-sks"],
    ["Pemantauan Master Data Nilai", <FileIcon />, "/wadek/matriks-nilai"],
    ["Pelaporan Excel", <FileIcon />, "/wadek/pelaporan"],
    ["Profil", <UserCircleIcon />, "/wadek/profil"],
  ],
  Kaprodi: [
    ["Dashboard", <GridIcon />, "/kaprodi/dashboard"],
    ["Peninjauan Prestasi", <FileIcon />, "/kaprodi/monitoring"],
    ["Resume & Rekap", <GridIcon />, "/kaprodi/rekap"],
    ["Resume Konversi", <GridIcon />, "/kaprodi/konversi"],
    ["Performa Verifikator", <GridIcon />, "/kaprodi/performa"],
    ["Pelaporan Excel", <FileIcon />, "/kaprodi/pelaporan"],
    ["Profil", <UserCircleIcon />, "/kaprodi/profil"],
  ],
};

function roleFromPath(path: string) {
  if (path.startsWith("/verifikator")) return "Verifikator";
  if (path.startsWith("/tendik")) return "Tendik";
  if (path.startsWith("/wadek")) return "Wadek";
  if (path.startsWith("/kaprodi")) return "Kaprodi";
  return "Mahasiswa";
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const role = roleFromPath(location.pathname);
  const [isRoleOpen, setIsRoleOpen] = useState(true);
  const sidebarOpen = isExpanded || isHovered || isMobileOpen;
  const isActive = useCallback((p: string) => location.pathname === p, [location.pathname]);

  const handleRoleChange = (r: string) => {
    const paths: Record<string, string> = {
      Mahasiswa: "/mahasiswa/dashboard",
      Verifikator: "/verifikator/dashboard",
      Tendik: "/tendik/dashboard",
      Kaprodi: "/kaprodi/dashboard",
    };
    navigate(paths[r]);
  };

  const activeAccount = loadActiveAccount();
  const assignedTestingRoles = activeAccount?.roles.filter((item) => item !== "Wadek") ?? [];
  const canShowTestingRoleSwitch = role !== "Wadek" && assignedTestingRoles.length > 1;

  return (
    <aside
      className={`simpresma-sidebar fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${isMobileOpen ? "w-[290px] translate-x-0" : isExpanded || isHovered ? "w-[290px] translate-x-0" : "w-[90px] translate-x-0"}`} data-mobile-open={isMobileOpen}
      onMouseEnter={() => { if (window.innerWidth >= 1024 && !isExpanded) setIsHovered(true); }}
      onMouseLeave={() => { if (window.innerWidth >= 1024) setIsHovered(false); }}
    >
      <div className={`flex h-[90px] shrink-0 items-center ${!sidebarOpen ? "justify-center" : "justify-start"}`}>
        <Link to={`/${role.toLowerCase()}/dashboard`}>
          {sidebarOpen ? <span className="whitespace-nowrap text-xl font-bold text-brand-500">SIMPRESMA</span> : <span className="text-xl font-bold text-brand-500">S</span>}
        </Link>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden no-scrollbar">
        <nav>
          <h2 className={`mb-5 flex px-2 text-xs font-semibold uppercase leading-[20px] tracking-wider text-gray-400 ${!sidebarOpen ? "justify-center" : "justify-start"}`}>
            {sidebarOpen ? `Menu ${role === "Wadek" ? "Wakil Dekan" : role}` : <HorizontaLDots className="size-5" />}
          </h2>

          <ul className="flex flex-col gap-4">
            {items[role].map(([name, icon, path]) => (
              <li key={name}>
                <Link to={path} className={`menu-item group ${isActive(path) ? "menu-item-active" : "menu-item-inactive"} ${!sidebarOpen ? "lg:justify-center" : "lg:justify-start"}`}>
                  <span className={`menu-item-icon-size ${isActive(path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>{icon}</span>
                  {sidebarOpen && <span className="menu-item-text whitespace-nowrap">{name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {sidebarOpen && canShowTestingRoleSwitch && (
          <div className="mt-10 border-t border-gray-100 pt-6 dark:border-gray-800">
            <button type="button" onClick={() => setIsRoleOpen((p) => !p)} className="flex w-full items-center justify-between px-2">
              <h2 className="text-xs font-semibold uppercase leading-[20px] tracking-wider text-gray-400">Ganti Role</h2>
              <ChevronUpIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isRoleOpen ? "" : "rotate-180"}`} />
            </button>

            {isRoleOpen && (
              <div className="mt-5 flex flex-col gap-5 px-2">
                {assignedTestingRoles.map((r) => (
                  <button key={r} type="button" onClick={() => handleRoleChange(r)} className={`text-left text-theme-sm transition ${role === r ? "font-medium text-brand-500" : "text-gray-700 hover:text-brand-500 dark:text-gray-300"}`}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
