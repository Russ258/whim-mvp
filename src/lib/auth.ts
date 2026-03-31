import { cookies } from "next/headers";

export type Role = "consumer" | "salon" | "admin";

export const ROLE_COOKIE = "whim_role";

export function getActiveRole() {
  return cookies().get(ROLE_COOKIE)?.value as Role | undefined;
}

export function isRole(role: Role) {
  return getActiveRole() === role;
}
