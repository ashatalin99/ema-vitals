"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LogOut} from 'lucide-react';
import { Header } from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Sidebar } from '@/components/Sidebar';


interface Resident {
  id: string;
  name: string;
  dob: string;
  location: string;
  exId: string;
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

const ResidentsPage = () => {
  const router = useRouter();
  const [selectedResident, setSelectedResident] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const filteredResidents = mockResidents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.exId.includes(searchTerm)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredResidents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedResidents = filteredResidents.slice(startIndex, startIndex + recordsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };
  const [vitalsSubmitted, setVitalsSubmitted] = useState(false);
  const [showVitalsPanel, setShowVitalsPanel] = useState(true); 
  const [selectedHub, setSelectedHub] = useState<string>('');
  const [hubConnected, setHubConnected] = useState(false);
  const [hubReady, setHubReady] = useState(false);

  const hubOptions = [
    { id: 'hub-001', name: '860322067669751', location: 'Nursing Station A' },
    { id: 'hub-002', name: '860322068069456', location: 'Wing B' },
    { id: 'hub-003', name: '868032061499434', location: 'ICU' },
    { id: 'hub-004', name: '868032061505230', location: 'Available' },
    { id: 'hub-005', name: '860322067630076', location: 'Nursing Station B' },
    { id: 'hub-006', name: '868032061497644', location: 'Wing C' },
    { id: 'hub-007', name: '860322067642022', location: 'Wing J' }
  ];

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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header showHub={false} />

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Select Resident</h1>
              <p className="text-muted-foreground">Choose a resident to view their information and care plan</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7A7A81] w-5 h-5" />
                <Input
                  placeholder="Search by name, location, or ID..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 py-3 text-base bg-muted border-border rounded-l placeholder:text-[#7A7A81] text-white"
                />
              </div>
            </div>

            {/* Residents Table */}
            <Card className="shadow-medium animate-fade-in border-border rounded-l overflow-hidden">
              <div className="overflow-hidden">
                <div className="bg-accent px-6 py-4 border-b border-border">
                  <div className="grid grid-cols-4 gap-4 font-semibold text-accent-foreground">
                    <div>Name</div>
                    <div>Date of Birth</div>
                    <div>Location</div>
                    <div>External ID</div>
                  </div>
                </div>
                
                <div className="min-h-[500px]">
                  {paginatedResidents.map((resident) => (
                    <div
                      key={resident.id}
                      onClick={() => {
                        setSelectedResident(resident.id);
                        router.push(`/residents/${resident.id}`);
                    }}
                      className={`px-6 py-4 border-b border-border cursor-pointer transition-all duration-200 ${
                        selectedResident === resident.id
                          ? 'bg-selected-row border-l-4 border-l-primary'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="grid grid-cols-4 gap-4">
                        <div className="font-medium text-foreground">{resident.name}</div>
                        <div className="text-muted-foreground">{resident.dob}</div>
                        <div className="text-muted-foreground">{resident.location}</div>
                        <div className="text-muted-foreground font-mono">{resident.exId}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem className="text-[#8D8D8D]">
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-muted'}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index + 1} className="text-[#8D8D8D]">
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                        className="cursor-pointer border-1 border-color-[#8d8d8d]"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem className="text-[#8D8D8D]">
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-muted'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            
            {/* Results Info */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + recordsPerPage, filteredResidents.length)} of {filteredResidents.length} residents
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentsPage;
