import { useState } from 'react';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onProfileClick: () => void;
  onClassClick: (classData: ClassData) => void;
  onTeamMembersClick: () => void;
  onClientClick?: () => void;
}

interface ClassData {
  id: number;
  name: string;
  days: string;
  classTime: string;
  numStudents: number;
  numTeamMembers: number;
  numCTs: number;
}

// Mock data for classes
const mockClasses: ClassData[] = [
  {
    id: 1,
    name: "Class 1",
    days: "M,W,F",
    classTime: "9 a.m-11.30 a.m",
    numStudents: 14,
    numTeamMembers: 4,
    numCTs: 2
  },
  {
    id: 2,
    name: "Class 1.2",
    days: "M,W,F",
    classTime: "2p.m - 5 p.m",
    numStudents: 8,
    numTeamMembers: 2,
    numCTs: 2
  },
  {
    id: 3,
    name: "Class 1.3",
    days: "T, Th",
    classTime: "9 a.m-12 a.m",
    numStudents: 10,
    numTeamMembers: 3,
    numCTs: 2
  },
  {
    id: 4,
    name: "Class 2.1",
    days: "T, Th",
    classTime: "2p.m - 5 p.m",
    numStudents: 9,
    numTeamMembers: 3,
    numCTs: 2
  }
];

export function AdminDashboard({  onClassClick }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClasses = mockClasses.filter(classItem => 
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.days.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#3C3C3C' }}>Hi, Ms. Jamila</h2>
          <div className="w-16 h-1 rounded" style={{ backgroundColor: '#FF8C42' }}></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: '#4EAAC9' }}>
            <h3 className="font-medium mb-2" style={{ color: '#3C3C3C' }}>Total Classes</h3>
            <div className="text-3xl font-bold" style={{ color: '#2C5F7C' }}>{mockClasses.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: '#FF8C42' }}>
            <h3 className="font-medium mb-2" style={{ color: '#3C3C3C' }}>Total Students</h3>
            <div className="text-3xl font-bold" style={{ color: '#2C5F7C' }}>
              {mockClasses.reduce((sum, cls) => sum + cls.numStudents, 0)}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: '#6C757D' }}>
            <h3 className="font-medium mb-2" style={{ color: '#3C3C3C' }}>Total Staff</h3>
            <div className="text-3xl font-bold" style={{ color: '#2C5F7C' }}>
              {mockClasses.reduce((sum, cls) => sum + cls.numTeamMembers + cls.numCTs, 0)}
            </div>
          </div>
        </div>



        {/* Search */}
        <div className="flex justify-start mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#6C757D' }} />
            <Input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-2 rounded-none focus:outline-none"
              style={{ 
                backgroundColor: 'white',
                borderColor: '#BDC3C7',
                color: '#3C3C3C'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
              onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
            />
          </div>
        </div>

        {/* Class Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                  <TableHead style={{ color: '#3C3C3C' }}>No</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Name</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Days</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Class timing</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Number of students</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Number of Team member</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Number of CTs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((classItem, index) => (
                  <TableRow 
                    key={classItem.id} 
                    className={`${index < filteredClasses.length - 1 ? "border-b" : ""} hover:bg-gray-50 transition-colors`} 
                    style={{ borderColor: '#BDC3C7' }}
                  >
                    <TableCell style={{ color: '#3C3C3C' }}>{classItem.id}</TableCell>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => onClassClick(classItem)}
                        className="hover:underline transition-all duration-200"
                        style={{ color: '#2C5F7C' }}
                      >
                        {classItem.name}
                      </button>
                    </TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{classItem.days}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{classItem.classTime}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }} className="text-center">{classItem.numStudents}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }} className="text-center">{classItem.numTeamMembers}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }} className="text-center">{classItem.numCTs}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}