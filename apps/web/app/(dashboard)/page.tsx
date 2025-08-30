"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { Button } from "@workspace/ui/components/button";

export default function page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
      <div className="flex flex-col items-center justify-center min-h-svh">
        <p>apps/web</p>
        <UserButton />
        <OrganizationSwitcher hidePersonal />
        <Button onClick={() => addUser()}>Add</Button>
        <div className="max-w-sm w-full mx-auto">
          {JSON.stringify(users, null, 2)}
        </div>
      </div>
  )
}
