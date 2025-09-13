import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard"
import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { cookies } from "next/headers"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { Provider } from "jotai"

export const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookiStore = await cookies();
    const defaultOpen = cookiStore.get("sidebar_state")?.value === "true";


    return (
        <AuthGuard>
            <OrganizationGuard>
                <Provider>
                    <SidebarProvider defaultOpen={defaultOpen}>
                        <DashboardSidebar />
                        <main className="flex flex-1 flex-col">
                            {children}
                        </main>
                    </SidebarProvider>
                </Provider>
            </OrganizationGuard>
        </AuthGuard>
    )
}