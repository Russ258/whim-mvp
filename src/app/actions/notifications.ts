"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function upsertNotificationPreference(input: {
  email: string;
  wantsPush: boolean;
  wantsSms: boolean;
}) {
  await prisma.notificationPreference.upsert({
    where: { email: input.email },
    update: {
      wantsPush: input.wantsPush,
      wantsSms: input.wantsSms,
    },
    create: input,
  });

  revalidatePath("/profile");
  return { ok: true };
}
