"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Wifi, WifiOff, BatteryFull, Thermometer, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// interface Device {
//   id: string;
//   name: string;
//   location: string;
//   isAvailable: boolean;
// }

// interface DeviceData {
//   temperature: string;
//   voltage: string;
//   signal: number; // 0-4 signal strength
//   notes: number;
// }
import { useDevice } from '@/contexts/DeviceContext';
import { Device, DeviceData } from '@/types/device';

const mockDevices: Device[] = [
  { id: 'hub-001', name: '860322067669751', location: 'Nursing Station A', isAvailable: true },
  { id: 'hub-002', name: '860322068069456', location: 'Wing B', isAvailable: true },
  { id: 'hub-003', name: '868032061499434', location: 'ICU', isAvailable: true },
  { id: 'hub-004', name: '868032061505230', location: 'Available', isAvailable: false },
  { id: 'hub-005', name: '860322067630076', location: 'Nursing Station B', isAvailable: true },
  { id: 'hub-006', name: '868032061497644', location: 'Wing C', isAvailable: true },
  { id: 'hub-007', name: '860322067642022', location: 'Wing J', isAvailable: true }
];

const Devices = () => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { setConnectedDevice } = useDevice();

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setIsConnected(false);
    setIsReady(false);
    setDeviceData(null);
  };

  const handleConnect = async () => {
    if (!selectedDevice) {
      toast({
        title: "No Device Selected",
        description: "Please select a device to connect.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Device Connected",
        description: "Successfully connected to the device.",
      });

      // Simulate getting device ready with data
      setTimeout(() => {
        setIsReady(true);
        const newDeviceData: DeviceData = {
          temperature: '23.4°C',
          voltage: '4.1V',
          signal: 3,
          notes: 12,
        }
        setDeviceData(newDeviceData);
        // Update global device context
        const selectedDeviceInfo = mockDevices.find(d => d.id === selectedDevice);
        if (selectedDeviceInfo) {
          setConnectedDevice({
            device: selectedDeviceInfo,
            data: newDeviceData,
            isConnected: true,
            isReady: true,
          });
        }
        toast({
          title: "Device Ready",
          description: "Device is ready for measurements.",
        });
      }, 2000);
    }, 3000);
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

  const handleContinue = () => {
    router.push('/residents');
  };

  const selectedDeviceInfo = mockDevices.find(d => d.id === selectedDevice);

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="w-[600px] mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2 ">Device Selection</h1>
          <p className="text-muted-foreground">Select and connect to a measurement device to continue</p>
        </div>

        <div className="grid gap-6">
          {/* Device Selection */}
          <Card className="shadow-medium border-border text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Available Devices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedDevice} onValueChange={handleDeviceSelect}>
                <SelectTrigger className="w-full border-border text-white">
                  <SelectValue placeholder="Select a device..." />
                </SelectTrigger>
                <SelectContent>
                  {mockDevices.map((device) => (
                    <SelectItem 
                      key={device.id} 
                      value={device.id}
                      disabled={!device.isAvailable}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <span className="font-medium">{device.id} - {device.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">({device.location})</span>
                        </div>
                        {!device.isAvailable && (
                          <Badge variant="secondary" className="ml-2">Offline</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedDevice && selectedDeviceInfo && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Selected Device</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDeviceInfo.id} - {selectedDeviceInfo.name} ({selectedDeviceInfo.location})
                  </p>
                </div>
              )}

              <Button 
                onClick={handleConnect}
                disabled={!selectedDevice || isConnecting || isConnected}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  'Connected'
                ) : (
                  'Connect to Device'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Connection Status */}
          {(isConnecting || isConnected) && (
            <Card className='border-border text-white shadow-medium'>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm font-medium">
                      {isConnected ? 'Connected' : 'Connecting...'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm font-medium">
                      {isReady ? 'Ready' : 'Preparing...'}
                    </span>
                  </div>
                </div>

                {deviceData && (
                  <>
                    <Separator className="my-4 bg-border" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Temp: {deviceData.temperature}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BatteryFull className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Voltage: {deviceData.voltage}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Signal:</span>
                        {renderSignalBars(deviceData.signal)}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Notes: {deviceData.notes}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Continue Button */}
          {isReady && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-green-600 font-medium">
                    Device is connected and ready for use
                  </div>
                  <Button onClick={handleContinue} size="lg" className="w-full md:w-auto">
                    <Users className="mr-2 h-4 w-4" />
                    Continue to Residents
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices;