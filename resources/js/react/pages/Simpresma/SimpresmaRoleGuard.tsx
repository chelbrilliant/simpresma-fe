import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { loadActiveAccount, Role, rolePath } from "./SimpresmaMockAccess";

export default function SimpresmaRoleGuard({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentRole = (): Role => {
    if (location.pathname.startsWith("/verifikator")) return "Verifikator";
    if (location.pathname.startsWith("/tendik")) return "Tendik";
    if (location.pathname.startsWith("/wadek")) return "Wadek";
    if (location.pathname.startsWith("/kaprodi")) return "Kaprodi";
    return "Mahasiswa";
  };

  const currentRole = getCurrentRole();
  const account = loadActiveAccount();

  useEffect(() => {
    if (!account) {
      navigate("/mock-access", { replace: true });
      return;
    }

    if (!roles.includes(currentRole) || !account.roles.includes(currentRole)) {
      const fallback = account.roles.find((role) => roles.includes(role)) ?? account.roles[0];
      if (fallback) navigate(rolePath[fallback], { replace: true });
      else navigate("/mock-access", { replace: true });
    }
  }, [account, currentRole, location.pathname, navigate, roles]);

  if (!account || !roles.includes(currentRole) || !account.roles.includes(currentRole)) {
    return null;
  }

  return <>{children}</>;
}
