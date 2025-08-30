import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";


const Layout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <AuthGuard>
      <OrganizationGuard>
        {children}
      </OrganizationGuard>
    </AuthGuard>
  );
};

export default Layout;
