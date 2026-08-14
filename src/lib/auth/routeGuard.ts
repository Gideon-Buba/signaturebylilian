import { redirect } from "@tanstack/react-router";

import { meFn } from "@/server-fns/auth";

// Shared beforeLoad for every protected /admin/* route.
export async function requireAdminForRoute() {
  const user = await meFn();
  if (!user) {
    throw redirect({ to: "/admin/login" });
  }
  return { user };
}
