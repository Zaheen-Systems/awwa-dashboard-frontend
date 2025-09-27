import { useState } from 'react';
// import { useQueryClient } from "@tanstack/react-query";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Search, Edit } from 'lucide-react';
import { EditStudentModal } from './EditStudentModal';
import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { Student } from '../types/students';

interface DashboardProps {
  onStudentClick: (student: Student) => void;
  onSwitchToAdminDashboard?: () => void;
  userType?: 'teacher' | 'admin' | 'ct';
  is_ct?: string;
}

export function Dashboard({ onStudentClick, onSwitchToAdminDashboard, userType, is_ct }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Student | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<"team" | "ct">(userType == "teacher"? "team": "ct");
  // const queryClient = useQueryClient();


  async function fetchStudents(): Promise<Student[]> {
    console.log("ctct", activeTab)
    const queryparam = activeTab == "ct"? "?filter_ct_students=true": ""
    const res = await api.get(`/api/students/${queryparam}`);
    return res.data;
  }

  const { 
      data: students = [], 
      // isLoading, 
      // isError
     } = useQuery<Student[]>({
    queryKey: ["students", activeTab],
    queryFn: fetchStudents,
  });

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
      student?.primary_diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.secondary_diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;
      
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      // if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      // if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
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
                backgroundColor: '#e65039', 
                color: 'white',
                borderColor: '#e65039'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d1452e';
                e.currentTarget.style.borderColor = '#d1452e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e65039';
                e.currentTarget.style.borderColor = '#e65039';
              }}
            >
              Switch to Admin Dashboard
            </Button>
          )}
        </div>

          <div
            className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8"
            style={{ backgroundColor: "#fff5f3" }}
          >
            <div className="max-w-7xl mx-auto">
              {/* Tabs Row */}
              <div className="flex space-x-2 sm:space-x-4">
                {/* Team Member */}
                <div
                  onClick={() => setActiveTab("team")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 transition-all duration-200 cursor-pointer ${
                    activeTab === "team"
                      ? "bg-[#e65039] text-white border-[#e65039]"
                      : "bg-white text-[#6C757D] border-[#BDC3C7]"
                  } ${userType != 'teacher'? 'hidden': ''}`}
                >
                  Team member
                </div>

                {/* Core Team */}
                <div
                  onClick={() => setActiveTab("ct")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 transition-all duration-200 cursor-pointer ${
                    activeTab === "ct"
                      ? "bg-[#e65039] text-white border-[#e65039]"
                      : "bg-white text-[#6C757D] border-[#BDC3C7]"
                  } ${is_ct == 'false'? 'hidden': ''}`}
                >
                  Core Team (CT)
                </div>
              </div>
            </div>
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
              onFocus={(e) => e.target.style.borderColor = '#e65039'}
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
                    onClick={() => handleSort('class_name')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Class {sortColumn === 'chronological_age' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('class_name')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Chronological Age (months) {sortColumn === 'chronological_age' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('age_band')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Age Band (Months) {sortColumn === 'age_band' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('primary_diagnosis')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Primary Diagnosis {sortColumn === 'primary_diagnosis' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('secondary_diagnosis')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Secondary Diagnosis {sortColumn === 'secondary_diagnosis' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('ct')}
                    style={{ color: '#3C3C3C' }}
                  >
                    CT Assigned {sortColumn === 'ct' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('last_gco_date')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Last GCO {sortColumn === 'last_gco_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('entry_type')}
                    style={{ color: '#3C3C3C' }}
                  >
                    Status {sortColumn === 'entry_type' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                    <TableCell style={{ color: '#e65039' }} className="hover:underline">
                      {student.name}
                    </TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student?.class_name}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student?.chronological_age}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.age_band}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.primary_diagnosis}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.secondary_diagnosis}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.ct?.first_name}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{student.last_gco_date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className="border-0"
                        style={getStatusBadgeStyle(student.entry_type)}
                      >
                        {student.entry_type}
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
                          e.currentTarget.style.borderColor = '#e65039';
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