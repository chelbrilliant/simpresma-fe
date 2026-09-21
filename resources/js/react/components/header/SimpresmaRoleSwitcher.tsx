import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Account,
  getAccountForEmail,
  loadActiveAccount,
  rolePath,
  saveActiveAccount,
} from "../../pages/Simpresma/SimpresmaMockAccess";

type ActiveAccount = Account & { activeRole?: Account["roles"][number] };

function roleFromPath(path: string): Account["roles"][number] {
  if (path.startsWith("/verifikator")) return "Verifikator";
  if (path.startsWith("/tendik")) return "Tendik";
  if (path.startsWith("/wadek")) return "Wadek";
  if (path.startsWith("/kaprodi")) return "Kaprodi";
  return "Mahasiswa";
}

export default function SimpresmaRoleSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [account, setAccount] = useState<ActiveAccount | null>(() => loadActiveAccount() as ActiveAccount | null);
  const [open, setOpen] = useState(false);

  const refresh = () => {
    const active = loadActiveAccount() as ActiveAccount | null;
    if (!active) {
      setAccount(null);
      return;
    }
    const latest = getAccountForEmail(active.email);
    setAccount(latest ? { ...active, ...latest } : active);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("simpresma:accounts-update", refresh);
    return () => window.removeEventListener("simpresma:accounts-update", refresh);
  }, [location.pathname]);

  const currentRole = roleFromPath(location.pathname);
  const availableRoles = useMemo(() => {
    const roles = account?.roles ?? [];
    return roles.filter((role) => role !== "Mahasiswa" && role !== "Wadek");
  }, [account]);

  if (currentRole === "Wadek" || availableRoles.length < 2) return null;

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]">
        <span>Switch Role</span><span className="text-gray-400">•</span><span>{currentRole === "Wadek" ? "Wakil Dekan" : currentRole}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
          <p className="px-3 py-2 text-xs text-gray-400">Jabatan yang tersedia</p>
          {availableRoles.map((role) => (
            <button key={role} type="button" onClick={() => {
              setOpen(false);
              if (account) saveActiveAccount(account, role);
              navigate(rolePath[role]);
            }} className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${currentRole === role ? "bg-brand-50 font-medium text-brand-500 dark:bg-brand-500/10" : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.03]"}`}>
              {role === "Wadek" ? "Wakil Dekan" : role}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
