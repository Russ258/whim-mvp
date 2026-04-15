import { cookies } from "next/headers";

export type Role = "consumer" | "salon" | "admin";

export const ROLE_COOKIE = "whim_role";

export async function getActiveRole(): Promise<Role | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ROLE_COOKIE)?.value as Role | undefined;
}

export async function isRole(role: Role): Promise<boolean> {
  return (await getActiveRole()) === role;
}

export async function getActiveSalonId(): Promise<number | null> {
  const cookieStore = await cookies();
  const id = cookieStore.get("whim_salon_id")?.value;
  return id ? Number(id) : null;
}
