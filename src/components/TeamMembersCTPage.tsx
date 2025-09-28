import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Upload, Plus, Edit, Camera, FileSpreadsheet, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useUsers } from '../hooks/useUsers';
import { TeamMember } from '../types/users';
import { useUploadUsersCSV, useUploadUserPhoto } from '../hooks/useUploadFile';

// import noPhotoImage from 'figma:asset/59199c214065bea516a2cb6b06390172087b4e22.png';

interface TeamMembersCTPageProps {
  onEditTeamMember?: (member: TeamMember) => void;
  onAddTeamMember?: () => void;
}

export function TeamMembersCTPage({ onEditTeamMember, onAddTeamMember }: TeamMembersCTPageProps) {
  const { data: users } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedMemberPhoto, setSelectedMemberPhoto] = useState<{ 
    name: string; 
    hasPhoto: boolean; 
    photoUrl?: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const uploadMutation = useUploadUsersCSV();

  const uploadMutationPhoto = useUploadUserPhoto();
  
  const handlePhotoClick = (memberName: string) => {
    // In a real implementation, this would check if the member has a photo
    // For demo purposes, assign photos based on name for consistency
    const membersWithPhotos = ['Dr. Emily Carter', 'Sarah Johnson', 'Mark Thompson']; // Some have photos
    const hasPhoto = membersWithPhotos.includes(memberName);
    
    // Sample photo URLs for members with photos
    const memberPhotoUrls: { [key: string]: string } = {
      'Dr. Emily Carter': 'https://images.unsplash.com/photo-1666886573230-2b730505f298?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBtZWRpY2FsJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1NTU3NTY5N3ww&ixlib=rb-4.1.0&q=80&w=400',
      'Sarah Johnson': 'https://images.unsplash.com/photo-1752649935791-46de93c304f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwZWR1Y2F0b3IlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU1NTg0MDM5fDA&ixlib=rb-4.1.0&q=80&w=400',
      'Mark Thompson': 'https://images.unsplash.com/photo-1739298061757-7a3339cee982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMGJ1c2luZXNzJTIwcGVyc29ufGVufDF8fHx8MTc1NTQ3NTEwMXww&ixlib=rb-4.1.0&q=80&w=400'
    };
    
    setSelectedMemberPhoto({ 
      name: memberName, 
      hasPhoto,
      photoUrl: hasPhoto ? memberPhotoUrls[memberName] : undefined
    });
  };

  const handlePhotoUpload = (userId: number) => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadMutationPhoto.mutate(
          { userId, file },
          {
            onSuccess: (data) => {
              console.log("Uploaded:", data);
              setIsDialogOpen(true);
              queryClient.invalidateQueries({ queryKey: ["users"] });
            },
            onError: (error) => {
              console.error("Upload failed", error);
            },
          }
        );
        // const photo = URL.createObjectURL(file);
        // handleInputChange('photo', photo);
        // console.log('Photo uploaded:', file.name);
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleExcelUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls,.csv';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setUploadedFile(file);
        console.log('Excel file uploaded:', file.name);
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleBulkUploadSubmit = () => {
    if (uploadedFile) {
      console.log('Processing bulk upload for file:', uploadedFile.name);
      if (uploadedFile) {
        uploadMutation.mutate(uploadedFile);
      }
      // In a real implementation, this would process the Excel file
      // and bulk import team members
      setUploadedFile(null);
      setIsBulkUploadOpen(false);
      // Show success message or refresh the team members list
    }
  };

  const getRole = (member: TeamMember) => {
    if( member.role == "ct")
      return "CT"
    else if (member.role == "teacher")
      return member.is_ct? "Team member/ CT": "Team member"
  }

  const handleDownloadTemplate = () => {
    // In a real implementation, this would download an Excel template
    console.log('Downloading Excel template for bulk upload');
    // Create a sample CSV content for demonstration
    const csvContent =
      'Name,Age,Gender,ID Number,Specialization,Date of Joining,Class,Role,Email,DOB\n' +
      'John Doe,25,Male,TM001,Speech Therapy,2024-01-15,Class A,Team member,john@awwa.org,1999-03-15\n' +
      'Jane Smith,30,Female,CT001,Occupational Therapy,2023-08-20,Class B,CT,jane@awwa.org,1994-07-22\n' +
      'Michael Tan,28,Male,TMCT001,Physiotherapy,2024-05-12,Class A,Team member/CT,michael@awwa.org,1996-11-03';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team_members_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header spacing */}
        <div className="mb-6"></div>

        {/* Page Title */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#3C3C3C' }}>
          Team members/CT
        </h2>

        {/* Team Members Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: '#F8F9FA', borderColor: '#BDC3C7' }}>
                <TableHead className="text-center w-12" style={{ color: '#3C3C3C' }}>S</TableHead>
                <TableHead style={{ color: '#3C3C3C' }}>Name</TableHead>
                <TableHead className="text-center" style={{ color: '#3C3C3C' }}>Age (Yr)</TableHead>
                <TableHead className="text-center" style={{ color: '#3C3C3C' }}>Gender</TableHead>
                <TableHead className="text-center" style={{ color: '#3C3C3C' }}>ID</TableHead>
                <TableHead style={{ color: '#3C3C3C' }}>Specialization</TableHead>
                <TableHead style={{ color: '#3C3C3C' }}>Date of Joining</TableHead>
                <TableHead style={{ color: '#3C3C3C' }}>Class</TableHead>
                <TableHead style={{ color: '#3C3C3C' }}>Role</TableHead>
                <TableHead className="text-center" style={{ color: '#3C3C3C' }}>Photo</TableHead>
                <TableHead className="text-center" style={{ color: '#3C3C3C' }}>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((member, index) => (
                <TableRow 
                  key={member.id} 
                  style={{ 
                    borderColor: '#BDC3C7',
                    backgroundColor: 'white'
                  }}
                >
                  <TableCell className="text-center" style={{ color: '#3C3C3C' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{member.first_name} {member.last_name}</TableCell>
                  <TableCell className="text-center" style={{ color: '#3C3C3C' }}>
                    {member.age}
                  </TableCell>
                  <TableCell className="text-center" style={{ color: '#3C3C3C' }}>
                    {member.gender}
                  </TableCell>
                  <TableCell className="text-center" style={{ color: '#3C3C3C' }}>
                    {member.id_number}
                  </TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{member.specialization}</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>
                    {member.date_of_joining}
                  </TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{member.classes}</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{getRole(member)}</TableCell>
                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button 
                          className="w-10 h-8 border border-red-500 bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors rounded"
                          onClick={() => handlePhotoClick(member.first_name)}
                          title={`View/Upload photo for ${member.first_name}`}
                        >
                          <Camera className="w-4 h-4" style={{ color: '#DC3545' }} />
                        </button>
                      </DialogTrigger>
                      <DialogContent 
                        className="max-w-md mx-auto bg-white rounded-lg shadow-xl border-2 p-6"
                        style={{ borderColor: '#BDC3C7', backgroundColor: 'white' }}
                      >
                        {selectedMemberPhoto && (
                          <>
                            <DialogHeader className="pb-4 text-left">
                              <DialogTitle 
                                className="text-lg font-bold"
                                style={{ color: '#3C3C3C' }}
                              >
                                {selectedMemberPhoto.name} - Photo
                              </DialogTitle>
                              <DialogDescription 
                                className="text-sm mt-2"
                                style={{ color: '#6C757D' }}
                              >
                                View the photo for {selectedMemberPhoto.name}. Click outside to close this dialog.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="flex justify-center py-6">
                              <div 
                                className="rounded-lg flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: '#E8F4F8' }}
                              >
                                {member.photo ? (
                                  <img 
                                    src={member.photo}
                                    key={member.photo}
                                    alt={`Photo of ${member.first_name}`}
                                    className="max-w-full h-auto rounded-lg"
                                    style={{ maxHeight: '300px', maxWidth: '300px' }}
                                  />
                                ) : (
                                  <img 
                                    src="/placeholder-user.png" 
                                    alt="No photo available"
                                    className="max-w-full h-auto"
                                    style={{ maxHeight: '300px' }}
                                  />
                                )}
                              </div>
                            </div>

                            <div className="flex justify-center space-x-3 pt-4">
                                <Button
                                  className="px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                                  onClick={() => handlePhotoUpload(member.id)}
                                  style={{ 
                                    backgroundColor: '#e65039',
                                    color: 'white',
                                    border: 'none'
                                  }}
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload New Photo
                                </Button>
                              {selectedMemberPhoto.hasPhoto && (
                                <Button
                                  variant="outline"
                                  className="px-4 py-2 rounded-lg border-2 transition-all duration-200 hover:opacity-90"
                                  style={{ 
                                    borderColor: '#DC3545',
                                    color: '#DC3545',
                                    backgroundColor: 'white'
                                  }}
                                >
                                  Remove Photo
                                </Button>
                              )}
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-center">
                    <button 
                      onClick={() => onEditTeamMember && onEditTeamMember(member)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title={`Edit ${member.first_name}`}
                    >
                      <Edit className="w-4 h-4" style={{ color: '#3C3C3C' }} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center space-x-2 px-6 py-2 transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: '#e65039',
                  color: 'white',
                  border: 'none'
                }}
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" style={{ backgroundColor: 'white' }}>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold" style={{ color: '#3C3C3C' }}>
                  Bulk Upload Team Members
                </DialogTitle>
                <DialogDescription className="text-sm" style={{ color: '#6C757D' }}>
                  Upload multiple team members at once using an Excel file. Follow the two-step process below.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 p-4">
                {/* Download Template Section */}
                <div className="space-y-3">
                  <h4 className="font-medium" style={{ color: '#3C3C3C' }}>
                    Step 1: Download Template
                  </h4>
                  <Button
                    onClick={handleDownloadTemplate}
                    className="w-full flex items-center space-x-2 border-2 px-4 py-2 transition-all duration-200 hover:bg-blue-50"
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: '#e65039',
                      color: '#e65039'
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Excel Template</span>
                  </Button>
                </div>

                {/* Upload Section */}
                <div className="space-y-3">
                  <h4 className="font-medium" style={{ color: '#3C3C3C' }}>
                    Step 2: Upload Completed File
                  </h4>
                  
                  {uploadedFile ? (
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                        <div className="flex items-center space-x-2">
                          <FileSpreadsheet className="w-5 h-5" style={{ color: '#e65039' }} />
                          <span className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
                            {uploadedFile.name}
                          </span>
                        </div>
                        <p className="text-xs mt-1" style={{ color: '#6C757D' }}>
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleExcelUpload}
                          className="flex-1 border-2 px-4 py-2 transition-all duration-200 hover:bg-blue-50"
                          style={{ 
                            backgroundColor: 'white',
                            borderColor: '#e65039',
                            color: '#e65039'
                          }}
                        >
                          Change File
                        </Button>
                        <Button
                          onClick={handleBulkUploadSubmit}
                          className="flex-1 px-4 py-2 transition-all duration-200 hover:opacity-90"
                          style={{ 
                            backgroundColor: '#e65039',
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          Upload
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleExcelUpload}
                      className="w-full border-2 border-dashed px-6 py-6 transition-all duration-200 hover:bg-blue-50 flex flex-col items-center justify-center space-y-3 min-h-[120px]"
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: '#e65039',
                        color: '#e65039'
                      }}
                    >
                      <Upload className="w-6 h-6 flex-shrink-0" />
                      <div className="text-center space-y-1 max-w-full">
                        <p className="font-medium text-sm leading-tight">Choose Excel File</p>
                        <p className="text-xs leading-tight break-words" style={{ color: '#6C757D' }}>
                          Supports .xlsx, .xls, .csv files
                        </p>
                      </div>
                    </Button>
                  )}
                </div>

                {/* Information Section */}
                <div className="bg-yellow-100 p-3 border-l-4" style={{ borderColor: '#FF8C42' }}>
                  <p className="text-xs" style={{ color: '#3C3C3C' }}>
                    <strong>Note:</strong> The Excel file should contain columns for Name, Age, Gender, ID Number, Specialization, Date of Joining, Class, Role, Email, and DOB.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md bg-white rounded-lg border-2" style={{ backgroundColor: 'white', borderColor: '#BDC3C7' }}>
              <DialogHeader>
                <DialogTitle style={{ color: '#3C3C3C' }}>Photo Update</DialogTitle>
                <DialogDescription style={{ color: '#6C757D' }}>
                  Photo has been successfully updated.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border-2 transition-all duration-200"
                  style={{ backgroundColor: 'white', borderColor: '#BDC3C7', color: '#3C3C3C' }}
                >
                  Ok
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            onClick={onAddTeamMember}
            className="flex items-center space-x-2 px-6 py-2 transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: '#e65039',
              color: 'white',
              border: 'none'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member / CT</span>
          </Button>
        </div>
      </div>
    </div>
  );
}