"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {  Home, Users, UserCheck, HelpCircle, Settings, User, LogOut, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

const sidebarItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Users, label: 'Residents', active: false },
  { icon: UserCheck, label: 'Care', active: false },
  { icon: HelpCircle, label: 'Help', active: false },
  { icon: Settings, label: 'Settings', active: false },
];



const SingleResidentPage = () => {
  const router = useRouter();
  const [vitals, setVitals] = useState<VitalType[]>([
    { id: 'blood-pressure', name: 'Blood Pressure', color: 'text-red-500', selected: true },
    { id: 'temperature', name: 'Temperature', color: 'text-orange-500', selected: false },
    { id: 'spo2', name: 'SpO2', color: 'text-blue-500', selected: false },
    { id: 'pain-assessment', name: 'Pain Assessment', color: 'text-pink-500', selected: false },
    { id: 'blood-glucose', name: 'Blood Glucose', color: 'text-purple-500', selected: false },
    { id: 'weight', name: 'Weight', color: 'text-orange-500', selected: false },
    { id: 'respiration', name: 'Respiration', color: 'text-blue-500', selected: false },
    { id: 'pulse', name: 'Pulse', color: 'text-green-500', selected: false },
  ]);

  const [observationMethod, setObservationMethod] = useState('sitting-left-arm');
  const [painLevel, setPainLevel] = useState<number | null>(null);

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

  const toggleVital = (vitalId: string) => {
    setVitals(prev => prev.map(vital => 
      vital.id === vitalId ? { ...vital, selected: !vital.selected } : vital
    ));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-20 bg-card border-r border-border flex flex-col items-center py-4 shadow-soft">
        <div className="mb-8">
          <div className="w-12 h-12">
            <img src="/ema-logo.png" alt="ema logo" />
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-4">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                item.active 
                  ? 'bg-primary text-primary-foreground shadow-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </nav>
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
                <h1 className="text-3xl font-bold text-foreground">John Smith</h1>
                <p className="text-muted-foreground"><span className="text-red-500">DOB: </span>05/09/1943 • <span className="text-orange-500">Main 201 - B</span> • <span className="text-blue-500">ID: </span>EX001</p>
              </div>
            </div>
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Select Vitals</h2>
                <p className="text-muted-foreground">Choose which vitals to measure for this resident</p>
              </div>
              {/* Vitals Grid */}
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
              {/* Blood Pressure Observation Method */}
              {vitals.find(v => v.id === 'blood-pressure')?.selected && (
                  <Card className="p-6 shadow-medium mt-6">
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
                {vitals.find(v => v.id === 'pain-assessment')?.selected && (
                  <Card className="p-6 shadow-medium mt-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleResidentPage;
