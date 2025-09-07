"use client";
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { IconSpO2, IconRespiration, IconBloodGlucose, IconWeight, IconHeight, IconBloodPressure, IconTemperature } from '@/components/icons/icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sidebar } from '@/components/Sidebar';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
interface Resident {
  id: string;
  name: string;
  dob: string;
  location: string;
  exId: string;
}

interface VitalType {
  id: string;
  name: string;
  color: string;
  selected: boolean;
}

const mockResidents: Resident[] = [
  { id: '1', name: 'Abreu, Shari', dob: '11-25-1953', location: 'Main 418 - C', exId: '7557' },
  { id: '2', name: 'Acevedo, Inge', dob: '04-04-2015', location: 'Main 323 - A', exId: '9575' },
  { id: '3', name: 'Adam, Versie', dob: '07-03-1936', location: 'Main 112 - B', exId: '8835' },
  { id: '4', name: 'Adamson, Faustino', dob: '12-04-1950', location: 'Main 209 - B', exId: '8418' },
  { id: '5', name: 'Adcock, Linnea', dob: '09-14-2018', location: 'Main 214 - A', exId: '2054' },
  { id: '6', name: 'Akin, Jarrod', dob: '05-05-1943', location: 'Main 201 - B', exId: '2440' },
  { id: '7', name: 'Albertson, Florentin', dob: '02-02-2029', location: 'Main 415 - B', exId: '9953' },
];

const SingleResidentPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [vitals, setVitals] = useState<VitalType[]>([
    { id: 'blood-pressure', name: 'Blood Pressure', color: 'text-red-500', selected: true },
    { id: 'temperature', name: 'Temperature', color: 'text-orange-500', selected: false },
    { id: 'spo2', name: 'SpO2', color: 'text-blue-500', selected: false },
    { id: 'pain-assessment', name: 'Pain Assessment', color: 'text-pink-500', selected: false },
    { id: 'blood-glucose', name: 'Blood Glucose', color: 'text-purple-500', selected: false },
    { id: 'weight', name: 'Weight', color: 'text-orange-500', selected: false },
    { id: 'respiration', name: 'Respiration', color: 'text-blue-500', selected: false },
    { id: 'height', name: 'Height', color: 'text-green-500', selected: false },
  ]);

  const [observationMethod, setObservationMethod] = useState('sitting-left-arm');
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [manualDevice, setManualDevice] = useState('');
  const [manualReading, setManualReading] = useState('');
  const [selectedVitalForEdit, setSelectedVitalForEdit] = useState<string | null>(null);
  const [vitalsSubmitted, setVitalsSubmitted] = useState(false);
  const [showVitalsPanel, setShowVitalsPanel] = useState(true);

  interface VitalReading {
    device: string;
    reading: string;
    timestamp: Date;
  }

  type VitalKey =
  | "blood-pressure"
  | "temperature"
  | "spo2"
  | "weight"
  | "blood-glucose"
  | "respiration"
  | "height"
  | "pain-assessment";

type VitalReadings = Record<VitalKey, VitalReading>;

  const [vitalReadings, setVitalReadings] = useState<VitalReadings>({
  "blood-pressure": {
    device: "Omron BP7350",
    reading: "118/88 PR 81",
    timestamp: new Date(),
  },
  temperature: {
    device: "ThermoScan Pro",
    reading: "98.6°F",
    timestamp: new Date(),
  },
  spo2: {
    device: "Pulse Oximeter",
    reading: "98% PR 72",
    timestamp: new Date(),
  },
  weight: {
    device: "Digital Scale",
    reading: "165.2 lbs",
    timestamp: new Date(),
  },
  "blood-glucose": {
    device: "Glucometer",
    reading: "95 mg/dL",
    timestamp: new Date(),
  },
  respiration: {
    device: "Chest Monitor",
    reading: "16 bpm",
    timestamp: new Date(),
  },
  height: {
    device: "Stadiometer",
    reading: "5'8\"",
    timestamp: new Date(),
  },
  "pain-assessment": {
    device: "Manual Assessment",
    reading: "3/10",
    timestamp: new Date(),
  },
});

  const painLevels = [
    { value: 0, emoji: '😊', label: 'No Pain', color: 'bg-green-100 border-green-300 text-green-800' },
    { value: 1, emoji: '🙂', label: 'Slight', color: 'bg-green-100 border-green-300 text-green-800' },
    { value: 2, emoji: '😐', label: 'Mild', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { value: 3, emoji: '😕', label: 'Uncomfortable', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    { value: 4, emoji: '😟', label: 'Moderate', color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { value: 5, emoji: '😣', label: 'Annoying', color: 'bg-orange-100 border-orange-300 text-orange-800' },
    { value: 6, emoji: '😖', label: 'Distressing', color: 'bg-red-100 border-red-300 text-red-800' },
    { value: 7, emoji: '😫', label: 'Strong', color: 'bg-red-100 border-red-300 text-red-800' },
    { value: 8, emoji: '😭', label: 'Intense', color: 'bg-red-200 border-red-400 text-red-900' },
    { value: 9, emoji: '😱', label: 'Severe', color: 'bg-red-200 border-red-400 text-red-900' },
    { value: 10, emoji: '🤯', label: 'Worst', color: 'bg-red-300 border-red-500 text-red-950' },
  ];
  
  const { id } = useParams<{ id: string }>();
  const resident = mockResidents.find(r => r.id === id);

  const toggleVital = (vitalId: string) => {
    setVitals(prev => prev.map(vital => 
      vital.id === vitalId ? { ...vital, selected: !vital.selected } : vital
    ));
  };

  const updateVitalReading = (vitalId: VitalKey, field: string, value: string) => {
    setVitalReadings(prev => ({
      ...prev,
      [vitalId]: {
        ...prev[vitalId],
        [field]: value,
        timestamp: new Date()
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-20 bg-card border-r border-border flex flex-col items-center py-4 shadow-soft">
        <div className="mb-8">
          <div className="w-12 h-12">
            <Image src="/ema-logo.png" alt="ema logo" width={40} height={40} />
          </div>
        </div>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">CW</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-foreground">Chloe Williams, LPN</h2>
                <p className="text-sm text-muted-foreground">Licensed Practical Nurse</p>
              </div>
            </div>
            
            <Button variant="destructive" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.back()}
                  className='text-white border-border mr-4'
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Abreu Shari</h1>
                <p className="text-muted-foreground"><span className="text-red-500">DOB: </span>11/25/1953 • <span className="text-orange-500">Main 418 - C</span> • <span className="text-blue-500">ID: </span>7557</p>
              </div>
            </div>
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Select Vitals</h2>
                  <p className="text-muted-foreground">Choose which vitals to measure for this resident</p>
                </div>
                <div className='flex gap-3'>
                  {vitalsSubmitted && (
                    <Button 
                      onClick={() => {
                        setShowVitalsPanel(true);
                        setVitalsSubmitted(false);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium"
                    >
                      Start New Measurement
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      const selectedVitals = vitals.filter(v => v.selected);
                      if (selectedVitals.length > 0) {
                        setSelectedVitalForEdit(selectedVitals[0].id);
                        setManualDevice(vitalReadings[selectedVitals[0].id as VitalKey]?.device || '');
                        setManualReading(vitalReadings[selectedVitals[0].id as VitalKey]?.reading || '');
                        setIsDialogOpen(true);
                      }
                    }} 
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium"
                    disabled={!vitals.some(v => v.selected)} 
                    >
                    Manual Entry
                  </Button>
                </div>
              </div>
              {/* Vitals Grid */}
              {showVitalsPanel && !vitalsSubmitted && (
                <Card className="p-6 shadow-medium border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vitals.map((vital) => (
                      <div 
                        key={vital.id}
                        onClick={() => toggleVital(vital.id)}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`text-2xl font-bold ${vital.color}`}>
                            {vital.name}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Checkbox 
                            checked={vital.selected}
                            onCheckedChange={() => toggleVital(vital.id)}
                            className="w-6 h-6 text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              
              {/* Blood Pressure Observation Method */}
              {showVitalsPanel && !vitalsSubmitted && vitals.find(v => v.id === 'blood-pressure')?.selected && (
                  <Card className="p-6 shadow-medium mt-6 border-border">
                    <h3 className="text-xl font-bold text-foreground mb-6">Blood Pressure Observation Method</h3>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-red-500">
                          Observation Method
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Select value={observationMethod} onValueChange={setObservationMethod}>
                          <SelectTrigger className="w-[200px] border-border text-white">
                            <SelectValue placeholder="Select method" className='text-white' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sitting-left-arm">Sitting l/arm (Default)</SelectItem>
                            <SelectItem value="sitting-right-arm">Sitting r/arm</SelectItem>
                            <SelectItem value="standing-left-arm">Standing l/arm</SelectItem>
                            <SelectItem value="standing-right-arm">Standing r/arm</SelectItem>
                            <SelectItem value="lying-left-arm">Lying l/arm</SelectItem>
                            <SelectItem value="lying-right-arm">Lying r/arm</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>
              )}
              {/* Pain Assessment Levels */}
              {showVitalsPanel && !vitalsSubmitted && vitals.find(v => v.id === 'pain-assessment')?.selected && (
                <Card className="p-6 shadow-medium mt-6 border-border">
                  <h3 className="text-xl font-bold text-foreground">Pain Level Assessment</h3>
                  <div className="mb-6">
                    <Label className="text-lg font-medium text-foreground mb-4 block text-pink-500">
                      Pain Level: {painLevel !== null ? `${painLevel} - ${painLevels[painLevel].label}` : 'Not Selected'}
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-white">
                      {painLevels.map((level) => (
                        <button
                          key={level.value}
                          onClick={() => setPainLevel(level.value)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-center hover:scale-105 ${
                            painLevel === level.value 
                              ? `${level.color} scale-105 shadow-md` 
                              : 'bg-background border-border hover:bg-muted/50'
                          }`}
                        >
                          <div className="text-3xl mb-2">{level.emoji}</div>
                          <div className="text-sm font-medium">{level.value}</div>
                          <div className="text-xs">{level.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Select the number that best describes your pain level (0 = No Pain, 10 = Worst Pain)
                    </p>
                  </div>
                </Card>
              )}
              {/* Bluetooth Device Readings */}
              {vitals.some(v => v.selected) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {vitals.filter(v => v.selected).map((vital) => {
                    const getVitalConfig = (vitalId: string) => {
                      switch (vitalId) {
                        case 'blood-pressure':
                          return {
                            bg: 'bg-red-500',
                            iconBg: 'bg-red-400',
                            icon: <IconBloodPressure className="w-6 h-6 text-primary" />,
                            abbreviation: 'BLOOD PRESSURE',
                            device: vitalReadings[vitalId]?.device || 'Omron BP7350',
                            reading: vitalReadings[vitalId]?.reading || '118/88 PR 81',
                            unit: 'SYS/DIA mmHg'
                          };
                        case 'temperature':
                          return {
                            bg: 'bg-orange-500',
                            iconBg: 'bg-orange-400',
                            icon: <IconTemperature className="w-6 h-6 text-primary" />,
                            abbreviation: 'TEMPERATURE',
                            device: vitalReadings[vitalId]?.device || 'ThermoScan Pro',
                            reading: vitalReadings[vitalId]?.reading || '98.6°F',
                            unit: 'Body Temperature'
                          };
                        case 'spo2':
                          return {
                            bg: 'bg-blue-500',
                            iconBg: 'bg-blue-400',
                            icon: <IconSpO2 className="w-6 h-6 text-primary" />,
                            abbreviation: 'SpO2',
                            device: vitalReadings[vitalId]?.device || 'Pulse Oximeter',
                            reading: vitalReadings[vitalId]?.reading || '98% PR 72',
                            unit: 'Oxygen Saturation'
                          };
                        case 'weight':
                          return {
                            bg: 'bg-green-500',
                            iconBg: 'bg-green-400',
                            icon: <IconWeight className="w-6 h-6 text-primary" />,
                            abbreviation: 'WEIGHT',
                            device: vitalReadings[vitalId]?.device || 'Digital Scale',
                            reading: vitalReadings[vitalId]?.reading || '165.2 lbs',
                            unit: 'Body Weight'
                          };
                        case 'blood-glucose':
                          return {
                            bg: 'bg-purple-500',
                            iconBg: 'bg-purple-400',
                            icon: <IconBloodGlucose className="w-6 h-6 text-primary" />,
                            abbreviation: 'BG',
                            device: vitalReadings[vitalId]?.device || 'Glucometer',
                            reading: vitalReadings[vitalId]?.reading || '95 mg/dL',
                            unit: 'Blood Sugar'
                          };
                        case 'respiration':
                          return {
                            bg: 'bg-cyan-500',
                            iconBg: 'bg-cyan-400',
                            icon: <IconRespiration className="w-6 h-6 text-primary" />,
                            abbreviation: 'RESPIRATION',
                            device: vitalReadings[vitalId]?.device || 'Chest Monitor',
                            reading: vitalReadings[vitalId]?.reading || '16 bpm',
                            unit: 'Breathing Rate'
                          };
                        case 'height':
                          return {
                            bg: 'bg-teal-500',
                            iconBg: 'bg-teal-400',
                            icon: <IconHeight className="w-6 h-6 text-primary" />,
                            abbreviation: 'HT',
                            device: vitalReadings[vitalId]?.device || 'Height Meter',
                            reading: vitalReadings[vitalId]?.reading || '5\'8"',
                            unit: 'Body Height'
                          };
                        case 'pain-assessment':
                          return {
                            bg: 'bg-pink-500',
                            iconBg: 'bg-pink-400',
                            icon: (
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            ),
                            abbreviation: 'PAIN',
                            device: 'Pain Scale',
                            reading: painLevel !== null ? `${painLevel}/10` : '--',
                            unit: 'Pain Level'
                          };
                        default:
                          return {
                            bg: 'bg-gray-500',
                            iconBg: 'bg-gray-400',
                            icon: <div className="w-6 h-6">•</div>,
                            abbreviation: 'N/A',
                            device: 'Unknown',
                            reading: '--',
                            unit: 'Unknown'
                          };
                      }
                    };

                    const config = getVitalConfig(vital.id);

                    return (
                      <Card key={vital.id} className={`p-5 ${config.bg} text-white shadow-lg border-0`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 ${config.iconBg} rounded-lg flex items-center justify-center shadow-sm`}>
                              {config.icon}
                            </div>
                            <div>
                              <div className="text-xl font-bold tracking-wide">
                                {config.abbreviation}
                              </div>
                              <div className="text-sm text-white/90 font-medium">
                                {config.device}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-white/80 mb-3 font-mono tracking-wider">
                          {vital.id === 'blood-pressure' && observationMethod.replace('-', ' ')}
                          <br />00:5f:bf:30:3c:36
                        </div>
                        
                        <div className="text-3xl font-bold mb-2 tracking-tight shadow-text">
                          {config.reading}
                        </div>
                        
                        <div className="text-sm text-white/90 mb-3 font-medium">
                          {config.unit}
                        </div>
                        
                        <div className="text-xs text-white/80 font-mono">
                          {new Date().toLocaleTimeString('en-US', { 
                            hour12: false, 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} / {new Date().toLocaleDateString('en-GB')}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Action Buttons */}
            {showVitalsPanel && !vitalsSubmitted && (
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  size="lg"
                  className='border-border text-white px-8'
                >
                  Cancel
                </Button>
                <Button 
                  size="lg"
                  className="px-8"
                  disabled={!vitals.some(v => v.selected)}
                  onClick={() => {
                    console.log("Toast firing...");
                    try {
                      const selectedCount = vitals.filter(v => v.selected).length;
                      console.log(`${resident?.name}`);
                      setVitalsSubmitted(true);
                      setShowVitalsPanel(false);
                      toast({
                        title: "Success",
                        description: `Successfully submitted ${selectedCount} vital measurement${selectedCount !== 1 ? 's' : ''} for ${resident?.name}`,
                      });
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: `${error} Failed to submit vital measurements. Please try again.`,
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Submit Vital Measurements
                </Button>
              </div>
            )}
            
          </div>
        </div>
      </div>
      {/* Manual Entry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md border-border text-white bg-[#151515]">
          <DialogHeader>
            <DialogTitle>Manual Entry - {selectedVitalForEdit && vitals.find(v => v.id === selectedVitalForEdit)?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="vital-select">Select Vital</Label>
              <Select value={selectedVitalForEdit || ''} onValueChange={(value) => {
                setSelectedVitalForEdit(value);
                setManualDevice(vitalReadings[value as VitalKey]?.device || '');
                setManualReading(vitalReadings[value as VitalKey]?.reading || '');
              }}>
                <SelectTrigger className="mt-1 border-border">
                  <SelectValue placeholder="Select a vital to edit" />
                </SelectTrigger>
                <SelectContent>
                  {vitals.filter(v => v.selected).map((vital) => (
                    <SelectItem key={vital.id} value={vital.id}>{vital.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reading-value">Device Name</Label>
              <Input
                id="device-name"
                value={manualDevice}
                onChange={(e) => setManualDevice(e.target.value)}
                placeholder="Enter device name"
                className="mt-1 border-border"
              />
            </div>
            <div>
              <Label htmlFor="reading-value">Reading Value</Label>
              <Input
                id="reading-value"
                value={manualReading}
                onChange={(e) => setManualReading(e.target.value)}
                placeholder="Enter reading value"
                className="mt-1 border-border"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                  onClick={() => {
                  setIsDialogOpen(false);
                  setManualDevice('');
                  setManualReading('');
                  setSelectedVitalForEdit(null);
                }} 
                className='border-border text-white'
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                if (selectedVitalForEdit && manualDevice && manualReading) {
                  updateVitalReading(selectedVitalForEdit as VitalKey, 'device', manualDevice);
                  updateVitalReading(selectedVitalForEdit as VitalKey, 'reading', manualReading);
                  setIsDialogOpen(false);
                  setManualDevice('');
                  setManualReading('');
                  setSelectedVitalForEdit(null);
                }
              }}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SingleResidentPage;
