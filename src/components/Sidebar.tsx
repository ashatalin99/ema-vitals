"use client";

import { useRouter, usePathname } from "next/navigation";
import { Users, HelpCircle, Settings, LogOut } from "lucide-react";
import Image from 'next/image';
const sidebarItems = [
  { icon: Users, label: "Residents", link: "/residents" },
  { icon: HelpCircle, label: "Help", link: "/help" },
  { icon: Settings, label: "Settings", link: "/settings" },
  { icon: LogOut, label: "Log Out", link: "/logout" },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-20 bg-card border-r border-border flex flex-col items-center py-4 shadow-soft sticky top-0 left-0 h-screen">
      <div className="mb-8">
        <div className="w-12 h-12 flex justify-center items-center">
          <Image src="/ema-logo.png" alt="ema logo" width={40} height={40} />
        </div>
      </div>
      <nav className="flex flex-col gap-4 h-full">
        {sidebarItems.map((item, index) => {
          const isActive =
            pathname === item.link ||
            (item.link !== "/" && pathname.startsWith(item.link));

          return (
            <button
              key={index}
              onClick={() => router.push(item.link)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export { Sidebar }


