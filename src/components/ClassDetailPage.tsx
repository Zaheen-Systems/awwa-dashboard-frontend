import { useState } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface ClassDetailPageProps {
  classData: ClassData;
  onBack: () => void;
  onLogout: () => void;
  onDashboardClick?: () => void;
  onTeamMembersClick?: () => void;
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

interface Client {
  id: number;
  name: string;
  age: number;
  gender: 'M' | 'F';
  clientId: string;
  primaryDiagnosis: string;
  secondaryDiagnosis: string;
  dateOfEnrolment: string;
  ct: string;
}

interface TeamMember {
  id: number;
  name: string;
  age: number;
  gender: 'M' | 'F';
  memberId: string;
  specialization: string;
  dateOfJoining: string;
}

// Mock data for clients - matching the image
const mockClients: Client[] = [
  {
    id: 1,
    name: "Aarav",
    age: 24,
    gender: "M",
    clientId: "200XXX",
    primaryDiagnosis: "Speech and language",
    secondaryDiagnosis: "Speech and language",
    dateOfEnrolment: "01.01.2025",
    ct: "Jaylene"
  },
  {
    id: 2,
    name: "Mei Ling Tan",
    age: 28,
    gender: "F",
    clientId: "300XXX",
    primaryDiagnosis: "Speech and language",
    secondaryDiagnosis: "Speech and language",
    dateOfEnrolment: "05.07.2021",
    ct: ""
  },
  {
    id: 3,
    name: "Wei Zhang",
    age: 30,
    gender: "M",
    clientId: "400XX",
    primaryDiagnosis: "Speech and language",
    secondaryDiagnosis: "Speech and language",
    dateOfEnrolment: "13.06.2022",
    ct: "Kumar"
  },
  {
    id: 4,
    name: "Priya Sharma",
    age: 32,
    gender: "F",
    clientId: "100XXX",
    primaryDiagnosis: "Speech and language",
    secondaryDiagnosis: "Speech and language",
    dateOfEnrolment: "20.11.2023",
    ct: ""
  }
];

// Mock data for team members
const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Keerthana",
    age: 30,
    gender: "F",
    memberId: "SXXXX",
    specialization: "Speech Therapy",
    dateOfJoining: "01.01.2020"
  },
  {
    id: 2,
    name: "Dawn",
    age: 28,
    gender: "F",
    memberId: "SXXXX",
    specialization: "Social Worker",
    dateOfJoining: "03.07.2021"
  }
];

export function ClassDetailPage({ classData, onBack }: ClassDetailPageProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Content Area */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb and Back Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" style={{ color: '#e65039' }} />
              <span style={{ color: '#e65039' }}>Home &gt; {classData.name}</span>
            </div>
            
            <Button
              onClick={onBack}
              className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
              style={{ 
                backgroundColor: '#e65039', 
                color: 'white',
                borderColor: '#e65039'
              }}
            >
              Back
            </Button>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#3C3C3C' }}>{classData.name}</h2>
          </div>

          {/* Clients Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4" style={{ color: '#3C3C3C' }}>Clients</h3>
            
            <div className="bg-white rounded border overflow-hidden" style={{ borderColor: '#BDC3C7' }}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>N</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Name ↑</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Age</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Gender</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>ID</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Primary Diagnosis</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Secondary Diagnosis</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Date of enrolment</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>CT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClients.map((client, index) => (
                      <TableRow 
                        key={client.id} 
                        className={`${index < mockClients.length - 1 ? "border-b" : ""} hover:bg-gray-50 transition-colors`} 
                        style={{ borderColor: '#BDC3C7' }}
                      >
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{client.id}</TableCell>
                        <TableCell className="text-sm font-medium" style={{ color: '#3C3C3C' }}>{client.name}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{client.age}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{client.gender}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{client.clientId}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{client.primaryDiagnosis}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{client.secondaryDiagnosis}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{client.dateOfEnrolment}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{client.ct}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div>
            <h3 className="text-lg font-medium mb-4" style={{ color: '#3C3C3C' }}>Team members</h3>
            
            <div className="bg-white rounded border overflow-hidden" style={{ borderColor: '#BDC3C7' }}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>N</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Name</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Age</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Gender</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>ID</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Specialisation</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Date of joining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTeamMembers.map((member, index) => (
                      <TableRow 
                        key={member.id} 
                        className={`${index < mockTeamMembers.length - 1 ? "border-b" : ""} hover:bg-gray-50 transition-colors`} 
                        style={{ borderColor: '#BDC3C7' }}
                      >
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{member.id}</TableCell>
                        <TableCell className="text-sm font-medium" style={{ color: '#3C3C3C' }}>{member.name}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{member.age}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{member.gender}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{member.memberId}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{member.specialization}</TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>{member.dateOfJoining}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto flex justify-end">
          <Button
            onClick={() => setIsDeleteOpen(true)}
            className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#DC3545', color: 'white', borderColor: '#DC3545' }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Class
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md bg-white rounded-lg border-2" style={{ backgroundColor: 'white', borderColor: '#BDC3C7' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#3C3C3C' }}>Delete class?</DialogTitle>
            <DialogDescription style={{ color: '#6C757D' }}>
              This action cannot be undone. Do you want to permanently delete the class "{classData.name}"?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 border-2 transition-all duration-200"
              style={{ backgroundColor: 'white', borderColor: '#BDC3C7', color: '#3C3C3C' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => { console.log('Deleted class:', classData); setIsDeleteOpen(false); onBack(); }}
              className="px-4 py-2 transition-all duration-200"
              style={{ backgroundColor: '#DC3545', color: 'white', border: 'none' }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
