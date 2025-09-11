// import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HubOption {
  id: string;
  name: string;
  location: string;
}

interface HeaderProps {
  selectedHub?: string;
  hubOptions?: HubOption[];
  hubConnected?: boolean;
  hubReady?: boolean;
  onHubSelection?: (hubId: string) => void;
  showHub?: boolean;
}


const Header = ({
  selectedHub,
  hubOptions,
  hubConnected,
  hubReady,
  onHubSelection,
  showHub
}: HeaderProps) => {
  // const router = useRouter();
  // const pathname = usePathname();
  // const items = [
  //   { icon: HelpCircle, label: "Help", link: "/help" },
  //   { icon: Settings, label: "Settings", link: "/settings" },
  // ];

  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-soft sticky top-0 z-10">
        <div className="flex items-center">
          <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">CW</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-foreground">Chloe Williams, LPN</h2>
                <p className="text-sm text-muted-foreground">Licensed Practical Nurse</p>
              </div>
          </div>
          <div className='ml-auto flex items-center gap-6'>
            {/* Hub Selection and Status in Header */}
            {showHub && (   
<div className='flex items-center gap-6'>
                {/* Hub Status Panel in Header */}
                {selectedHub && (
                    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${hubConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-xs text-foreground">
                            {hubConnected ? 'Connected' : 'Connecting...'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${hubReady ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-xs text-foreground">
                            {hubReady ? 'Ready' : 'Preparing...'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-l border-border pl-4">
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                            <span className="text-muted-foreground">Temp:</span>
                            <span className="text-foreground font-medium">23.4°C</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="text-muted-foreground">Voltage:</span>
                            <span className="text-foreground font-medium">4.1V</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <span className="text-muted-foreground">Signal:</span>
                            <div className="flex items-center gap-0.5">
                              <div className="w-1 h-2 bg-orange-500 rounded-sm"></div>
                              <div className="w-1 h-3 bg-orange-500 rounded-sm"></div>
                              <div className="w-1 h-2 bg-gray-300 rounded-sm"></div>
                              <div className="w-1 h-3 bg-gray-300 rounded-sm"></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                            <span className="text-muted-foreground">Notes:</span>
                            <span className="text-foreground font-medium">12</span>
                          </div>
                        </div>
                      </div>
                    </div>
                )}
                <div className="flex items-center gap-3">
                  <Select value={selectedHub} onValueChange={onHubSelection}>
                    <SelectTrigger className="w-64 border-border text-white">
                      <SelectValue placeholder="Select hub" />
                    </SelectTrigger>
                    <SelectContent>
                      {(hubOptions ?? []).map((hub) => (
                        <SelectItem key={hub.id} value={hub.id}>
                          {hub.name} - {hub.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            </div>
            )}
            
          </div>
        </div>
    </header>
  );
};

export { Header };
