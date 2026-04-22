"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReceiptText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Gastos", icon: ReceiptText },
  { href: "/pnl", label: "PnL", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="border-t bg-background">
      <div className="flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
