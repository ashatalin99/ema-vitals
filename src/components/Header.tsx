// import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDevice } from '@/contexts/DeviceContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BatteryFull, Thermometer } from 'lucide-react';

interface HubOption {
  id: string;
  name: string;
  location: string;
}

interface HeaderProps {
  showVitalsPanel?: boolean;
  vitalsSubmitted?: boolean;
  selectedHub?: string;
  hubOptions?: HubOption[];
  hubConnected?: boolean;
  hubReady?: boolean;
  onHubSelection?: (hubId: string) => void;
  showHub?: boolean;
}


const Header = ({
  showVitalsPanel = false,
  vitalsSubmitted = false,
  selectedHub = '',
  hubOptions = [],
  hubConnected = false,
  hubReady = false,
  onHubSelection,
  showHub
}: HeaderProps) => {

  const router = useRouter();
  const { connectedDevice } = useDevice();
  
  // Use device context data if available, otherwise fall back to props
  const deviceToShow = connectedDevice || {
    device: hubOptions.find(h => h.id === selectedHub),
    data: {
      temperature: '23.4°C',
      voltage: '4.1V',
      signal: 3,
      notes: 12,
    },
    isConnected: hubConnected,
    isReady: hubReady,
  };
  


  const renderSignalBars = (strength: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`w-1 ${bar % 2 === 0 ? 'h-3' : 'h-2'} rounded-sm ${
              bar <= strength ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
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
                  {(selectedHub || connectedDevice) && (
                      <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${deviceToShow.isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-xs text-foreground">
                              {deviceToShow.isConnected ? 'Connected' : 'Connecting...'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${deviceToShow.isReady ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <span className="text-xs text-foreground">
                              {deviceToShow.isReady ? 'Ready' : 'Preparing...'}
                            </span>
                          </div>
                        </div>
                        {connectedDevice && (
                          <div className="border-l border-border pl-4">
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <Thermometer className="h-4 w-4 text-cyan-500" />
                                <span className="text-muted-foreground">Temp:</span>
                                <span className="text-foreground font-medium">{connectedDevice?.data.temperature}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BatteryFull className="h-4 w-4 text-green-500" />
                                <span className="text-muted-foreground">Voltage:</span>
                                <span className="text-foreground font-medium">{connectedDevice?.data.voltage}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                <span className="text-muted-foreground">Signal:</span>
                                <div className="flex items-center gap-0.5">
                                  {connectedDevice ? renderSignalBars(connectedDevice.data.signal) : null}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                <span className="text-muted-foreground">Notes:</span>
                                <span className="text-foreground font-medium">12</span>
                              </div>
                              <div className="border-l border-border pl-4">
                            <div className="text-xs">
                              <span className="text-muted-foreground">Device:</span>
                              <span className="text-foreground font-medium ml-1">
                                {connectedDevice?.device.id} - {connectedDevice?.device.name}
                              </span>
                            </div>
                          </div>
                            </div>
                          </div>
                        )}
                        
                      </div>
                  )}
                  
              </div>
            )}
            <Button 
              onClick={() => router.push('/devices')}
              className="px-4 bg-primary text white"
            >
              Select Device
            </Button>
          </div>
        </div>
    </header>
  );
};

export { Header };
