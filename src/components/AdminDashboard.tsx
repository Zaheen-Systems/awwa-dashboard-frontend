import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Search, Plus } from 'lucide-react';
import { ClassData } from '../types/class';
import { useClasses, useCreateClass } from '../hooks/useClasses';
import { AddClassModal } from './AddClassModal';

interface AdminDashboardProps {
  onLogout: () => void;
  onProfileClick: () => void;
  onClassClick: (classData: ClassData) => void;
  onTeamMembersClick: () => void;
  onClientClick?: () => void;
}

interface ClassFormData {
  className: string;
  days: string;
  classTimings: string;
}

export function AdminDashboard({  onClassClick }: AdminDashboardProps) {
  const { data: classes } = useClasses();
  const createClassMutation = useCreateClass();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  const filteredClasses = classes?.filter(classItem => 
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.days.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClass = async (classData: ClassFormData) => {
    try {
      await createClassMutation.mutateAsync(classData);
      setIsAddClassModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    } catch (error) {
      console.error('Error creating class:', error);
      // You could add error handling UI here
    }
  };

  const handleOpenAddClassModal = () => {
    setIsAddClassModalOpen(true);
  };

  const handleCloseAddClassModal = () => {
    setIsAddClassModalOpen(false);
  };

  return (
    <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#3C3C3C' }}>Hi, {localStorage.getItem("name")}</h2>
          <div className="w-16 h-1 rounded" style={{ backgroundColor: '#FF8C42' }}></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: '#e65039' }}>
            <h3 className="font-medium mb-2" style={{ color: '#3C3C3C' }}>Total Classes</h3>
            <div className="text-3xl font-bold" style={{ color: '#e65039' }}>{classes?.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: '#4EAAC9' }}>
            <h3 className="font-medium mb-2" style={{ color: '#3C3C3C' }}>Total Students</h3>
            <div className="text-3xl font-bold" style={{ color: '#4EAAC9' }}>
              {classes?.reduce((sum, cls) => sum + cls.number_of_students, 0)}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: '#FF8C42' }}>
            <h3 className="font-medium mb-2" style={{ color: '#3C3C3C' }}>Total Staff</h3>
            <div className="text-3xl font-bold" style={{ color: '#FF8C42' }}>
              {classes?.reduce((sum, cls) => sum + cls.number_of_team_members + cls.number_of_cts, 0)}
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
              onFocus={(e) => e.target.style.borderColor = '#e65039'}
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
                {filteredClasses?.map((classItem, index) => (
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
                        style={{ color: '#e65039' }}
                      >
                        {classItem.name.replace(/,/g, ', ')}
                      </button>
                    </TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{classItem.days}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{classItem.class_timing}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }} className="text-center">{classItem.number_of_students}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }} className="text-center">{classItem.number_of_team_members}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }} className="text-center">{classItem.number_of_cts}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add Class Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={handleOpenAddClassModal}
            className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
            style={{ 
              backgroundColor: '#e65039', 
              color: 'white',
              borderColor: '#e65039'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </Button>
        </div>
      </div>

      {/* Add Class Modal */}
      <AddClassModal
        isOpen={isAddClassModalOpen}
        onClose={handleCloseAddClassModal}
        onSubmit={handleAddClass}
      />
    </div>
  );
}