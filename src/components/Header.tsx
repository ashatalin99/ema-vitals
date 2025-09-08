// import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { HelpCircle, Settings } from "lucide-react";
import Image from 'next/image';

const Header = () => {
  // const router = useRouter();
  // const pathname = usePathname();
  // const items = [
  //   { icon: HelpCircle, label: "Help", link: "/help" },
  //   { icon: Settings, label: "Settings", link: "/settings" },
  // ];

  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-soft sticky top-0 z-10">
        <div className="flex items-center">
          {/* <div className="w-12 h-12">
            <Image src="/ema-logo.png" alt="ema logo" width={35} height={35} />
          </div> */}
          <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground">CW</AvatarFallback>
              </Avatar>
              <div>
              <h2 className="font-semibold text-foreground">Chloe Williams, LPN</h2>
              <p className="text-sm text-muted-foreground">Licensed Practical Nurse</p>
              </div>
          </div>
          {/* <nav className="flex gap-2 items-center ml-auto">
            {items.map((item, index) => {
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
            <Button variant="destructive" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
          </Button>
          </nav> */}
          <Button variant="destructive" size="sm" className="gap-2 ml-auto">
              <LogOut className="w-4 h-4" />
              Logout
          </Button>
        </div>

    </header>
  );
};

export { Header };
