import { useEffect, useState } from "react";
import { Card, SearchFilter, Title } from "./SimpresmaShared";
import { Account, ManagedRole, loadManagedAccounts, saveManagedAccounts } from "./SimpresmaMockAccess";

export default function WadekAccessManagement() {
  const [accounts, setAccounts] = useState<Account[]>(loadManagedAccounts);
  const [q, setQ] = useState("");

  useEffect(() => {
    saveManagedAccounts(accounts);
  }, [accounts]);

  const toggleRole = (email: string, role: ManagedRole) => {
    setAccounts((current) => current.map((account) => {
      if (account.email !== email) return account;
      const roles = account.roles.includes(role)
        ? account.roles.filter((item) => item !== role)
        : [...account.roles, role];
      return { ...account, roles };
    }));
  };

  const filtered = accounts.filter((account) =>
    `${account.name} ${account.email} ${account.prodi ?? ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <Title title="Manajemen Hak Akses" description="Wadek sebagai Superadmin memberikan atau mencabut role Verifikator, Tendik, dan Kaprodi." />
      <Card className="p-5">
        <SearchFilter value={q} onChange={setQ} placeholder="Cari pengguna..." />
        <div className="mt-5 overflow-x-auto">
          <table className="simpresma-table min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 font-medium text-gray-500">Pengguna</th>
                <th className="px-4 py-3 font-medium text-gray-500">Program Studi</th>
                <th className="px-4 py-3 font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((account) => (
                <tr key={account.email} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-800 dark:text-white">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-500">{account.prodi ?? "Lintas Prodi"}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {account.roles.map((role) => <span key={role} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">{role}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(["Verifikator", "Tendik", "Kaprodi"] as ManagedRole[]).map((role) => (
                        <label key={role} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                          <input type="checkbox" checked={account.roles.includes(role)} onChange={() => toggleRole(account.email, role)} />
                          {role}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-500">Role Wadek tidak dikelola melalui halaman ini. Master Data SKS dan Nilai juga tidak dikelola Wadek; kewenangan tersebut berada pada Verifikator.</p>
      </Card>
    </>
  );
}
