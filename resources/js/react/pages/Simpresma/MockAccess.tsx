import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Account,
  loadManagedAccounts,
  mahasiswaMockAccount,
  rolePath,
  saveActiveAccount,
  wadekMockAccount,
} from "./SimpresmaMockAccess";

export default function MockAccess() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("mahasiswa@fasilkom.unej.ac.id");

  const refresh = () => {
    setAccounts([
      mahasiswaMockAccount,
      wadekMockAccount,
      ...loadManagedAccounts(),
    ]);
  };

  useEffect(() => {
    refresh();
    window.addEventListener("simpresma:accounts-update", refresh);
    return () => window.removeEventListener("simpresma:accounts-update", refresh);
  }, []);

  const selected = accounts.find((account) => account.email === selectedEmail) ?? accounts[0];

  const enterSystem = () => {
    if (!selected) return;
    saveActiveAccount(selected, selected.roles[0]);
    navigate(rolePath[selected.roles[0]]);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Simulasi Akses SIMPRESMA</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Halaman mock frontend untuk menggantikan proses SSO saat pengujian. Pada implementasi nyata, lima role mengikuti RBAC dari SSO Kampus.
          </p>
        </div>

        <div className="space-y-3">
          {accounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => setSelectedEmail(account.email)}
              className={`w-full rounded-xl border p-4 text-left transition ${selectedEmail === account.email ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-gray-200 hover:border-brand-300 dark:border-gray-700"}`}
            >
              <div className="font-medium text-gray-800 dark:text-white">{account.name}</div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{account.email}</div>
              {account.prodi && <div className="mt-1 text-xs text-gray-400">Scope: {account.prodi}</div>}
              <div className="mt-3 flex flex-wrap gap-2">
                {account.roles.map((role) => (
                  <span key={role} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">{role}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
          <span className="font-medium">Catatan:</span> Ini hanya simulasi frontend. Tidak ada SSO/API/backend baru yang ditambahkan. Wadek merupakan Superadmin dan tidak menggunakan Switch Role.
        </div>

        <button type="button" onClick={enterSystem} className="mt-6 w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600">Masuk ke SIMPRESMA</button>
      </div>
    </div>
  );
}
