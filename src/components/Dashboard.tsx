import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search, Edit } from 'lucide-react';
import { EditStudentModal } from './EditStudentModal';

interface Student {
  id: number;
  name: string;
  chronologicalAge: number;
  ageBand: string;
  primaryDiagnosis: string;
  secondaryDiagnosis: string;
  lastGCODate: string;
  status: string;
}

interface DashboardProps {
  onLogout: () => void;
  onStudentClick: (student: Student) => void;
  onProfileClick: () => void;
  onSwitchToAdminDashboard?: () => void;
  userType?: 'user' | 'admin';
}

// Mock data for students
const students: Student[] = [
  {
    id: 1,
    name: "Aarav Rajan",
    chronologicalAge: 60,
    ageBand: "61-72",
    primaryDiagnosis: "Autism Spectrum Disorder",
    secondaryDiagnosis: "Intellectual Disability",
    lastGCODate: "15.02.24",
    status: "Entry"
  },
  {
    id: 2,
    name: "Priya Sharma",
    chronologicalAge: 45,
    ageBand: "37-48",
    primaryDiagnosis: "Down Syndrome",
    secondaryDiagnosis: "Speech Delay",
    lastGCODate: "22.01.24",
    status: "Review"
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    chronologicalAge: 38,
    ageBand: "37-48",
    primaryDiagnosis: "Cerebral Palsy",
    secondaryDiagnosis: "Mobility Impairment",
    lastGCODate: "10.03.24",
    status: "Entry"
  },
  {
    id: 4,
    name: "Meera Patel",
    chronologicalAge: 52,
    ageBand: "49-60",
    primaryDiagnosis: "Autism Spectrum Disorder",
    secondaryDiagnosis: "Sensory Processing",
    lastGCODate: "28.02.24",
    status: "Review"
  },
  {
    id: 5,
    name: "Kiran Singh",
    chronologicalAge: 41,
    ageBand: "37-48",
    primaryDiagnosis: "Intellectual Disability",
    secondaryDiagnosis: "Behavioral Issues",
    lastGCODate: "05.03.24",
    status: "Exit"
  }
];

export function Dashboard({ onLogout, onStudentClick, onProfileClick, onSwitchToAdminDashboard, userType }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Student | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);

  const handleSort = (column: keyof Student) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.secondaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;
      
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entry':
        return { backgroundColor: '#D1F2EB', color: '#00695C', border: '1px solid #4EAAC9' };
      case 'review':
        return { backgroundColor: '#FFF3E0', color: '#E65100', border: '1px solid #FF8C42' };
      case 'exit':
        return { backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid #DC3545' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#3C3C3C', border: '1px solid #BDC3C7' };
    }
  };

  const handleEditStudent = (student: Student, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click navigation
    setSelectedStudentForEdit(student);
    setShowEditModal(true);
  };

  const handleEditStudentSubmit = (studentData: any) => {
    console.log('Student edited:', studentData);
    // In a real implementation, this would save to backend
    setShowEditModal(false);
    setSelectedStudentForEdit(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedStudentForEdit(null);
  };

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Message and Switch Button */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#3C3C3C' }}>Team Member / CT Dashboard</h2>
            <div className="w-16 h-1 rounded" style={{ backgroundColor: '#FF8C42' }}></div>
          </div>
          {userType === 'admin' && onSwitchToAdminDashboard && (
            <Button
              onClick={onSwitchToAdminDashboard}
              className="px-4 py-2 border-2 rounded-none font-medium transition-all duration-200 hover:opacity-90"
              style={{ 
                backgroundColor: '#4EAAC9', 
                color: 'white',
                borderColor: '#4EAAC9'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3B8BA8';
                e.currentTarget.style.borderColor = '#3B8BA8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4EAAC9';
                e.currentTarget.style.borderColor = '#4EAAC9';
              }}
            >
              Switch to Admin Dashboard
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="flex justify-start mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#6C757D' }} />
            <Input
              type="text"
              placeholder="Search students..."
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

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('chronologicalAge')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Chronological Age {sortColumn === 'chronologicalAge' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('ageBand')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Age Band {sortColumn === 'ageBand' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('primaryDiagnosis')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Primary Diagnosis {sortColumn === 'primaryDiagnosis' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('secondaryDiagnosis')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Secondary Diagnosis {sortColumn === 'secondaryDiagnosis' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('lastGCODate')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Last GCO {sortColumn === 'lastGCODate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Status {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedStudents.map((student, index) => (
                  <TableRow 
                    key={student.id} 
                    className={`${index < filteredAndSortedStudents.length - 1 ? "border-b" : ""} cursor-pointer hover:bg-gray-50 transition-colors`} 
                    style={{ borderColor: '#BDC3C7' }}
                    onClick={() => onStudentClick(student)}
                  >
                    <TableCell style={{ color: '#2C5F7C' }} className="hover:underline">
                      {student.name}
                    </TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.chronologicalAge}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.ageBand}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.primaryDiagnosis}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.secondaryDiagnosis}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.lastGCODate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="border-0"
                        style={getStatusBadgeStyle(student.status)}
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={(e) => handleEditStudent(student, e)}
                        className="flex items-center space-x-1 px-3 py-1 border-2 rounded-none font-medium transition-all duration-200 hover:opacity-90"
                        style={{ 
                          backgroundColor: 'white',
                          borderColor: '#BDC3C7',
                          color: '#3C3C3C'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F8F9FA';
                          e.currentTarget.style.borderColor = '#2C5F7C';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.borderColor = '#BDC3C7';
                        }}
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm" style={{ color: '#6C757D' }}>
          Showing {filteredAndSortedStudents.length} of {students.length} students
        </div>
      </div>

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSubmit={handleEditStudentSubmit}
        student={selectedStudentForEdit} // Pass selected student for editing
      />
    </div>
  );
}