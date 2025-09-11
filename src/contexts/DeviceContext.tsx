"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConnectedDevice, Device, DeviceData } from '@/types/device';

interface DeviceContextType {
  connectedDevice: ConnectedDevice | null;
  setConnectedDevice: (device: ConnectedDevice | null) => void;
  updateDeviceData: (data: DeviceData) => void;
  disconnectDevice: () => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [connectedDevice, setConnectedDeviceState] = useState<ConnectedDevice | null>(null);

  const setConnectedDevice = (device: ConnectedDevice | null) => {
    setConnectedDeviceState(device);
  };

  const updateDeviceData = (data: DeviceData) => {
    if (connectedDevice) {
      setConnectedDeviceState({
        ...connectedDevice,
        data,
      });
    }
  };

  const disconnectDevice = () => {
    setConnectedDeviceState(null);
  };

  return (
    <DeviceContext.Provider
      value={{
        connectedDevice,
        setConnectedDevice,
        updateDeviceData,
        disconnectDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};