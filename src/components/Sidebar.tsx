"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Users, UserCheck, HelpCircle, Settings } from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Home", link: "/" },
  { icon: Users, label: "Residents", link: "/residents" },
  { icon: UserCheck, label: "Care", link: "/care" },
  { icon: HelpCircle, label: "Help", link: "/help" },
  { icon: Settings, label: "Settings", link: "/settings" },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4">
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
  );
}

export { Sidebar }
