import { useState } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, Trash2, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

import { ClassData } from '../types/class';
import { useClassDetail } from '../hooks/useClasses';
import { StudentBaseRead, UserRead } from '../types/class';

interface ClassDetailPageProps {
  classData: ClassData;
  onBack: () => void;
  onLogout: () => void;
  onDashboardClick?: () => void;
  onTeamMembersClick?: () => void;
}

export function ClassDetailPage({ classData, onBack }: ClassDetailPageProps) {
  const { data: clients } = useClassDetail(classData.id);

  const [selectedPhoto, setSelectedPhoto] = useState<{ name: string; photo?: string } | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handlePhotoClick = (person: StudentBaseRead | UserRead) => {
    // Use a sensible display name: prefer first/last name if present, else fall back to id
    const name =
      ('first_name' in person && 'last_name' in person && person.first_name && person.last_name)
        ? `${person.first_name} ${person.last_name}`
        : String(person.id);
    setSelectedPhoto({ name, photo: (person as any).photo });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Content Area */}
      <div className="px-6 py-4">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb and Back Button */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" style={{ color: '#e65039' }} />
              <span style={{ color: '#e65039' }}>Home &gt; {classData.name}</span>
            </div>

            <Button
              onClick={onBack}
              className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: '#e65039',
                color: 'white',
                borderColor: '#e65039',
              }}
            >
              Back
            </Button>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#3C3C3C' }}>
              {classData.name}
            </h2>
          </div>

          {/* Clients Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="text-lg font-medium" style={{ color: '#3C3C3C' }}>
                Clients
              </h3>
              <span className="text-sm text-gray-500">
                {clients?.students?.length ?? 0} total
              </span>
            </div>

            <div className="overflow-hidden rounded border bg-white" style={{ borderColor: '#BDC3C7' }}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>#</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Name ↑</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Age</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Gender</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>ID</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Primary Diagnosis</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Secondary Diagnosis</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Date of Enrolment</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>CT</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Photo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients?.students?.map((client, index) => (
                      <TableRow
                        key={client.id}
                        className={`${index < (clients.students.length - 1) ? 'border-b' : ''} transition-colors hover:bg-gray-50`}
                        style={{ borderColor: '#BDC3C7' }}
                      >
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
                          {client.name}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {client.chronological_age}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {client.gender}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {client.id_number}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {client.primary_diagnosis}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {client.secondary_diagnosis}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {client.date_of_enrollment}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {client.ct}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handlePhotoClick(client)}
                            className="flex h-8 w-10 items-center justify-center rounded border border-red-500 bg-red-50 transition-colors hover:bg-red-100"
                          >
                            <Camera className="h-4 w-4" style={{ color: '#DC3545' }} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {!clients?.students?.length && (
                      <TableRow>
                        <TableCell colSpan={10} className="py-6 text-center text-sm text-gray-500">
                          No clients found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="text-lg font-medium" style={{ color: '#3C3C3C' }}>
                Team members
              </h3>
              <span className="text-sm text-gray-500">
                {clients?.users?.length ?? 0} total
              </span>
            </div>

            <div className="overflow-hidden rounded border bg-white" style={{ borderColor: '#BDC3C7' }}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>#</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Name</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Gender</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>ID</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Role</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Specialisation</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Date of Joining</TableHead>
                      <TableHead className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Photo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients?.users?.map((member, index) => (
                      <TableRow
                        key={member.id}
                        className={`${index < (clients.users.length - 1) ? 'border-b' : ''} transition-colors hover:bg-gray-50`}
                        style={{ borderColor: '#BDC3C7' }}
                      >
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
                          {member.first_name} {member.last_name}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {member.gender}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {member.id_number}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {member.role}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {member.specialization}
                        </TableCell>
                        <TableCell className="text-sm" style={{ color: '#3C3C3C' }}>
                          {member.date_of_joining}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handlePhotoClick(member)}
                            className="flex h-8 w-10 items-center justify-center rounded border border-red-500 bg-red-50 transition-colors hover:bg-red-100"
                          >
                            <Camera className="h-4 w-4" style={{ color: '#DC3545' }} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {!clients?.users?.length && (
                      <TableRow>
                        <TableCell colSpan={8} className="py-6 text-center text-sm text-gray-500">
                          No team members found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-6 pb-8">
        <div className="mx-auto max-w-7xl flex justify-end">
          <Button
            onClick={() => setIsDeleteOpen(true)}
            className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#DC3545', color: 'white', borderColor: '#DC3545' }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Class
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-lg border-2 bg-white" style={{ borderColor: '#BDC3C7' }}>
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
              onClick={() => {
                console.log('Deleted class:', classData);
                setIsDeleteOpen(false);
                onBack();
              }}
              className="px-4 py-2 transition-all duration-200"
              style={{ backgroundColor: '#DC3545', color: 'white', border: 'none' }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo preview dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-lg rounded-lg border-2 bg-white" style={{ borderColor: '#BDC3C7' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#3C3C3C' }}>{selectedPhoto?.name}</DialogTitle>
            <DialogDescription style={{ color: '#6C757D' }}>
              Photo preview
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center">
            {selectedPhoto?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedPhoto.photo}
                alt={selectedPhoto.name}
                className="max-h-[60vh] max-w-full rounded"
              />
            ) : (
              <p className="py-8 text-sm text-gray-500">No photo available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
