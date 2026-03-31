"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ROLE_COOKIE, Role } from "@/lib/auth";
import { ADMIN_ROLE_PASSCODE, SALON_ROLE_PASSCODE } from "@/lib/constants";

export async function selectRole(formData: FormData) {
  const role = formData.get("role") as Role;
  const passcode = (formData.get("passcode") as string) ?? "";

  if (!role) {
    return { ok: false, message: "Choose a role" };
  }

  if (role === "salon" && passcode !== SALON_ROLE_PASSCODE) {
    return { ok: false, message: "Incorrect salon passcode" };
  }

  if (role === "admin" && passcode !== ADMIN_ROLE_PASSCODE) {
    return { ok: false, message: "Incorrect admin passcode" };
  }

  cookies().set(ROLE_COOKIE, role, {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24,
  });

  revalidatePath("/");
  revalidatePath("/salon");
  revalidatePath("/admin");
  return { ok: true, role };
}

export async function signOutRole() {
  cookies().delete(ROLE_COOKIE);
  revalidatePath("/");
  revalidatePath("/salon");
  revalidatePath("/admin");
}
