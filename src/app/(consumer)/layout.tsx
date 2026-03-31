import type { ReactNode } from "react";
import { BottomNav } from "@/components/consumer/BottomNav";

export default function ConsumerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-charcoal pb-28 text-surface">
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-8">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
