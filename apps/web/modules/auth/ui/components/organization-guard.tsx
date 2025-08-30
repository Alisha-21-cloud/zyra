"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout"
import { OrgSelectionView } from "../view/org-select-view";

export const OrganizationGuard = ({ children }: { children: React.ReactNode; }) => {
    const { organization } = useOrganization();

    if(!organization){
        return (
            <AuthLayout>
                <OrgSelectionView />
            </AuthLayout>
        )
    }

    return (
        <>
            {children}
        </>
    );
};
