export type Role = "Mahasiswa" | "Verifikator" | "Tendik" | "Wadek" | "Kaprodi";

export type ManagedRole = "Verifikator" | "Tendik" | "Kaprodi";

export type Account = {
  name: string;
  email: string;
  roles: Role[];
  prodi?: "Sistem Informasi" | "Teknologi Informasi" | "Informatika";
};

export const rolePath: Record<Role, string> = {
  Mahasiswa: "/mahasiswa/dashboard",
  Verifikator: "/verifikator/dashboard",
  Tendik: "/tendik/dashboard",
  Wadek: "/wadek/dashboard",
  Kaprodi: "/kaprodi/dashboard",
};

export const initialManagedAccounts: Account[] = [
  {
    name: "Dosen Verifikator",
    email: "verifikator@fasilkom.unej.ac.id",
    roles: ["Verifikator"],
    prodi: "Teknologi Informasi",
  },
  {
    name: "Tendik FASILKOM",
    email: "tendik@fasilkom.unej.ac.id",
    roles: ["Tendik"],
  },
  {
    name: "Kaprodi Sistem Informasi",
    email: "kaprodi.si@fasilkom.unej.ac.id",
    roles: ["Kaprodi"],
    prodi: "Sistem Informasi",
  },
  {
    name: "Kaprodi Teknologi Informasi",
    email: "kaprodi.ti@fasilkom.unej.ac.id",
    roles: ["Kaprodi"],
    prodi: "Teknologi Informasi",
  },
  {
    name: "Kaprodi Informatika",
    email: "kaprodi.if@fasilkom.unej.ac.id",
    roles: ["Kaprodi"],
    prodi: "Informatika",
  },
];

export const wadekMockAccount: Account = {
  name: "Wakil Dekan FASILKOM",
  email: "wadek@fasilkom.unej.ac.id",
  roles: ["Wadek"],
};

export const mahasiswaMockAccount: Account = {
  name: "Mahasiswa Demo",
  email: "mahasiswa@fasilkom.unej.ac.id",
  roles: ["Mahasiswa"],
  prodi: "Sistem Informasi",
};

const ACCOUNT_KEY = "simpresma_wadek_accounts";
const ACTIVE_KEY = "simpresma_mock_account";

export function loadManagedAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return initialManagedAccounts;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : initialManagedAccounts;
  } catch {
    return initialManagedAccounts;
  }
}

export function saveManagedAccounts(accounts: Account[]) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
  window.dispatchEvent(new Event("simpresma:accounts-update"));
}

export function saveActiveAccount(account: Account, activeRole?: Role) {
  localStorage.setItem(
    ACTIVE_KEY,
    JSON.stringify({ ...account, activeRole: activeRole ?? account.roles[0] })
  );
}

export function loadActiveAccount(): (Account & { activeRole?: Role }) | null {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAccountForEmail(email: string): Account | null {
  if (email === wadekMockAccount.email) return wadekMockAccount;
  if (email === mahasiswaMockAccount.email) return mahasiswaMockAccount;
  return loadManagedAccounts().find((account) => account.email === email) ?? null;
}
