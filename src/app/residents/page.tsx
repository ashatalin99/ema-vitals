"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, Users, UserCheck, HelpCircle, Settings, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

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

const sidebarItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Users, label: 'Residents', active: false },
  { icon: UserCheck, label: 'Care', active: false },
  { icon: HelpCircle, label: 'Help', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const ResidentsPage = () => {
  const router = useRouter();
  const [selectedResident, setSelectedResident] = useState<string>('6');
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
