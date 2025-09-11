"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit3, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  IconSpO2, 
  IconRespiration, 
  IconBloodGlucose, 
  IconWeight, 
  IconHeight, 
  IconBloodPressure, 
  IconTemperature, 
  IconPainAssessment } from '@/components/icons/icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Sidebar } from '@/components/Sidebar';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
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
  observationMethod?: string;
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

const SingleResident = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [vitals, setVitals] = useState<VitalType[]>([
    { id: 'blood-pressure', name: 'Blood Pressure', color: 'text-red-500', selected: true, observationMethod: 'sitting-left-arm' },
    { id: 'temperature', name: 'Temperature', color: 'text-orange-500', selected: false, observationMethod: 'oral' },
    { id: 'spo2', name: 'SpO2', color: 'text-blue-500', selected: false, observationMethod: 'finger' },
    // { id: 'pain-assessment', name: 'Pain Assessment', color: 'text-pink-500', selected: false, observationMethod: 'visual-scale' },
    { id: 'blood-glucose', name: 'Blood Glucose', color: 'text-purple-500', selected: false, observationMethod: 'fingerstick' },
    { id: 'weight', name: 'Weight', color: 'text-orange-500', selected: false, observationMethod: 'standing' },
    { id: 'respiration', name: 'Respiration', color: 'text-blue-500', selected: false, observationMethod: 'visual-count' },
    { id: 'height', name: 'Height', color: 'text-green-500', selected: false, observationMethod: 'standing' },
  ]);

  const [observationMethod, setObservationMethod] = useState('sitting-left-arm');
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [manualDevice, setManualDevice] = useState('');
  const [manualReading, setManualReading] = useState('');
  const [selectedVitalForEdit, setSelectedVitalForEdit] = useState<string | null>(null);
  const [vitalsSubmitted, setVitalsSubmitted] = useState(false);
  const [showVitalsPanel, setShowVitalsPanel] = useState(true);
  const [selectedHub, setSelectedHub] = useState<string>('');
  const [hubConnected, setHubConnected] = useState(false);
  const [hubReady, setHubReady] = useState(false);

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

  const hubOptions = [
    { id: 'hub-001', name: '860322067669751', location: 'Nursing Station A' },
    { id: 'hub-002', name: '860322068069456', location: 'Wing B' },
    { id: 'hub-003', name: '868032061499434', location: 'ICU' },
    { id: 'hub-004', name: '868032061505230', location: 'Available' },
    { id: 'hub-005', name: '860322067630076', location: 'Nursing Station B' },
    { id: 'hub-006', name: '868032061497644', location: 'Wing C' },
    { id: 'hub-007', name: '860322067642022', location: 'Wing J' }
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

  const updateVitalObservationMethod = (vitalId: string, method: string) => {
    setVitals(prev => prev.map(vital => 
      vital.id === vitalId ? { ...vital, observationMethod: method } : vital
    ));
  };

  const getObservationMethodOptions = (vitalId: string) => {
    switch (vitalId) {
      case 'blood-pressure':
        return [
          { value: 'sitting-left-arm', label: 'Sitting l/arm (Default)' },
          { value: 'sitting-right-arm', label: 'Sitting r/arm' },
          { value: 'standing-left-arm', label: 'Standing l/arm' },
          { value: 'standing-right-arm', label: 'Standing r/arm' },
          { value: 'lying-left-arm', label: 'Lying l/arm' },
          { value: 'lying-right-arm', label: 'Lying r/arm' },
          { value: 'other', label: 'Other' }
        ];
      case 'temperature':
        return [
          { value: 'oral', label: 'Oral' },
          { value: 'axillary', label: 'Axillary (Armpit)' },
          { value: 'rectal', label: 'Rectal' },
          { value: 'temporal', label: 'Temporal (Forehead)' },
          { value: 'tympanic', label: 'Tympanic (Ear)' }
        ];
      case 'spo2':
        return [
          { value: 'finger', label: 'Finger' },
          { value: 'toe', label: 'Toe' },
          { value: 'earlobe', label: 'Earlobe' },
          { value: 'forehead', label: 'Forehead' }
        ];
      case 'pain-assessment':
        return [
          { value: 'visual-scale', label: 'Visual Scale (0-10)' },
          { value: 'faces-scale', label: 'Faces Scale' },
          { value: 'verbal', label: 'Verbal Description' },
          { value: 'behavioral', label: 'Behavioral Assessment' }
        ];
      case 'blood-glucose':
        return [
          { value: 'fingerstick', label: 'Fingerstick' },
          { value: 'alternate-site', label: 'Alternate Site' },
          { value: 'continuous-monitor', label: 'Continuous Monitor' }
        ];
      case 'weight':
        return [
          { value: 'standing', label: 'Standing Scale' },
          { value: 'wheelchair', label: 'Wheelchair Scale' },
          { value: 'bed', label: 'Bed Scale' },
          { value: 'chair', label: 'Chair Scale' }
        ];
      case 'respiration':
        return [
          { value: 'visual-count', label: 'Visual Count' },
          { value: 'auscultation', label: 'Auscultation' },
          { value: 'monitor', label: 'Electronic Monitor' }
        ];
      case 'height':
        return [
          { value: 'standing', label: 'Standing (Stadiometer)' },
          { value: 'recumbent', label: 'Recumbent (Lying Down)' },
          { value: 'knee-height', label: 'Knee Height Estimation' },
          { value: 'arm-span', label: 'Arm Span Estimation' }
        ];
      default:
        return [{ value: 'standard', label: 'Standard Method' }];
    }
  };

  const deleteVitalReading = (vitalId: VitalKey) => {
    setVitalReadings(prev => {
      const updated = { ...prev };
      delete updated[vitalId];
      return updated;
    });
    
    // Also unselect the vital
    setVitals(prev => prev.map(vital => 
      vital.id === vitalId ? { ...vital, selected: false } : vital
    ));

    toast({
      title: "Data deleted",
      description: "Vital measurement has been removed.",
    });
  };

  const retakeVitalReading = (vitalId: VitalKey) => {
    setVitalReadings(prev => {
      const updated = { ...prev };
      delete updated[vitalId];
      return updated;
    });

    toast({
      title: "Retaking measurement",
      description: "Previous data cleared. Ready to collect new measurement.",
    });
  };

  // Simulate hub connection when hub is selected
  const handleHubSelection = (hubId: string) => {
    setSelectedHub(hubId);
    setHubConnected(false);
    setHubReady(false);
    
    // Simulate connection process
    setTimeout(() => {
      setHubConnected(true);
      setTimeout(() => {
        setHubReady(true);
      }, 1500);
    }, 1000);
  };

  const handleNext = () => {
    const selectedVitals = vitals.filter(v => v.selected);
    if (selectedVitals.length === 0) {
      toast({
        title: "No vitals selected",
        description: "Please select at least one vital to measure.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedHub) {
      toast({
        title: "No hub selected",
        description: "Please select a measurement hub.",
        variant: "destructive",
      });
      return;
    }

    if (!hubReady) {
      toast({
        title: "Hub not ready",
        description: "Please wait for the hub to connect and become ready.",
        variant: "destructive",
      });
      return;
    }

    setVitalsSubmitted(true);
    setShowVitalsPanel(false);
    toast({
      title: "Measurements ready",
      description: "Proceeding to data collection display.",
    });
  };

  const handleSubmit = () => {
    // Simulate submission process
    const hasError = Math.random() < 0.1; // 10% chance of error for demo
    
    if (hasError) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting the vital measurements. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Vitals submitted successfully",
      description: "All vital measurements have been recorded for the resident.",
    });

    // Navigate back to residents page after a short delay
    setTimeout(() => {
      router.push('/residents');
    }, 2000);
  };

  // Navigate back if no vitals are selected
  useEffect(() => {
    const selectedVitals = vitals.filter(v => v.selected);
    const hasVitalReadings = Object.keys(vitalReadings).length > 0;
    
    // Only navigate back if we're in the measurement view and have no selected vitals or readings
    if (vitalsSubmitted && selectedVitals.length === 0 && !hasVitalReadings) {
      router.push(`/resident/${id}`);
    }
  }, [vitals, vitalReadings, vitalsSubmitted, router, id]);

  // if (!resident) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-foreground mb-4">Resident Not Found</h2>
  //         <Button onClick={() => router.push('/residents')}>
  //           <ArrowLeft className="mr-2 h-4 w-4" />
  //           Back to Residents
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          selectedHub={selectedHub}
          hubOptions={hubOptions}
          hubConnected={hubConnected}
          hubReady={hubReady}
          onHubSelection={handleHubSelection}
          showHub={true}
        />

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
                </div>
              {/* {!hubReady && !vitalsSubmitted && (
                
              )} */}
              
              {/* Vitals Grid */}
              {showVitalsPanel && !vitalsSubmitted && (
                <Card className="p-6 shadow-medium border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vitals.map((vital) => (
                      <div key={vital.id} className="space-y-3">
                        <div 
                          onClick={() => toggleVital(vital.id)}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 focus-visible:border-border cursor-pointer transition-all duration-200"
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
                        {vital.selected && vital.id !== 'pain-assessment' && (
                          <div className="ml-4 p-3 bg-muted/30 rounded-lg border border-border focus-visible:border-border outline-none">
                            <Label className="text-sm font-medium text-foreground mb-2 block">
                              Observation Method
                            </Label>
                            <Select 
                              value={vital.observationMethod} 
                              onValueChange={(value) => updateVitalObservationMethod(vital.id, value)}
                            >
                              <SelectTrigger className="w-full border border-border focus:border-border focus-visible:border-border outline-none text-white ">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent className='bg-muted border-border'>
                                {getObservationMethodOptions(vital.id).map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Pain Assessment Levels */}
              {/* {showVitalsPanel && !vitalsSubmitted && vitals.find(v => v.id === 'pain-assessment')?.selected && (
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
              )} */}
             
            </div>
            {/* Action Buttons */}
            {showVitalsPanel && !vitalsSubmitted && (
              <div >
                <div className='mt-6 mb-4 text-center'><p className='text-blue-500'>Please select hub option in the header</p></div>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className='border-border text-white px-8 py-3'
                    onClick={() => router.push('/residents')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="px-8 py-3 text-lg font-medium bg-primary hover:bg-primary/90"
                    disabled={!vitals.some(v => v.selected) || !selectedHub || !hubReady}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            
            {/* Device Readings */}
            {hubReady && vitalsSubmitted && (
              <div>
                {/* Hub Information */}
                <Card className="p-6 shadow-medium border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Measurement Hub</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Hub Selected</div>
                      <div className="text-lg font-semibold text-foreground">
                        {hubOptions.find(hub => hub.id === selectedHub)?.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Location</div>
                      <div className="text-lg font-semibold text-foreground">
                        {hubOptions.find(hub => hub.id === selectedHub)?.location}
                      </div>
                    </div>
                  </div>
                </Card>
                {/* Vital Readings Grid */}
                {
                  vitals.some(v => v.selected) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {vitals.filter(v => v.selected).map((vital) => {
                      const getVitalConfig = (vitalId: string) => {
                        switch (vitalId) {
                          case 'blood-pressure':
                            return {
                              bg: 'bg-red-500',
                              iconBg: 'bg-red-400',
                              icon: <IconBloodPressure className="w-6 h-6 text-primary" />,
                              observationMethod: vital.observationMethod || 'sitting-left-arm',
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
                              observationMethod: vital.observationMethod || 'oral',
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
                              observationMethod: vital.observationMethod || 'finger',
                              abbreviation: 'SpO2',
                              device: vitalReadings[vitalId]?.device || 'finger',
                              reading: vitalReadings[vitalId]?.reading || '98% PR 72',
                              unit: 'Oxygen Saturation'
                            };
                          case 'weight':
                            return {
                              bg: 'bg-green-500',
                              iconBg: 'bg-green-400',
                              icon: <IconWeight className="w-6 h-6 text-primary" />,
                              observationMethod: vital.observationMethod || 'visual-scale',
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
                              observationMethod: vital.observationMethod || 'fingerstick',
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
                              observationMethod: vital.observationMethod || 'standing',
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
                              observationMethod: vital.observationMethod || 'standing',
                              abbreviation: 'HT',
                              device: vitalReadings[vitalId]?.device || 'Height Meter',
                              reading: vitalReadings[vitalId]?.reading || '5\'8"',
                              unit: 'Body Height'
                            };
                          case 'pain-assessment':
                            return {
                              bg: 'bg-pink-500',
                              iconBg: 'bg-pink-400',
                              icon: <IconPainAssessment className="w-6 h-6 text-primary" />,
                              observationMethod: vital.observationMethod || 'visual-count',
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
                          
                          <div className="text-xs text-white/80 mb-3 font-semibold tracking-wider">
                            { config.observationMethod?.replace('-', ' ')}
                          </div>
                          <div className="text-xs text-white/80 mb-3 font-mono tracking-wider">
                            00:5f:bf:30:3c:36
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
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              className={`text-white/80 ${config.bg} shadow-sm`}
                              onClick={() => retakeVitalReading(vital.id as VitalKey)}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className={`text-white/80 ${config.bg} shadow-sm`}
                              onClick={() => {
                                setSelectedVitalForEdit(vital.id);
                                setManualDevice(vitalReadings[vital.id as VitalKey]?.device || '');
                                setManualReading(vitalReadings[vital.id as VitalKey]?.reading || '');
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className={`text-white/80 ${config.bg} shadow-sm`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="sm:max-w-sm border-border text-white bg-[#151515]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Vital Measurement</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this {vital.name.toLowerCase()} measurement? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className='border-border'>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => deleteVitalReading(vital.id as VitalKey)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </Card>
                        
                      );
                    })}
                  </div>
                )
                }
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
                {/* Submit Button - Only show if there are vitals selected or readings */}
                {(vitals.some(v => v.selected) || Object.keys(vitalReadings).length > 0) && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={handleSubmit}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium text-lg"
                      size="lg"
                    >
                      Submit Vitals
                    </Button>
                  </div>
                )}
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
            {selectedVitalForEdit && (
              <div>
                <Label htmlFor="observation-method">Observation Method</Label>
                <Select value={observationMethod} onValueChange={setObservationMethod}>
                  <SelectTrigger className="mt-1 border-border text-white">
                    <SelectValue className='text-white' placeholder="Select observation method" />
                  </SelectTrigger>
                  <SelectContent>
                    {getObservationMethodOptions(selectedVitalForEdit).map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
                  updateVitalObservationMethod(selectedVitalForEdit, observationMethod);
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

export default SingleResident;
