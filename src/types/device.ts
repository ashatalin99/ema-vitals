export interface Device {
  id: string;
  name: string;
  location: string;
  isAvailable: boolean;
}

export interface DeviceData {
  temperature: string;
  voltage: string;
  signal: number; // 0-4 signal strength
  notes: number;
}

export interface ConnectedDevice {
  device: Device;
  data: DeviceData;
  isConnected: boolean;
  isReady: boolean;
}