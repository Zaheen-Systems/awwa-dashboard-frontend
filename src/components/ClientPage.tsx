import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Upload, Plus, Edit, FileSpreadsheet, Download, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { StudentBaseRead } from '../types/class';
import { useStudents } from '../hooks/useStudents';
import { useUploadStudentsCSV } from '../hooks/useUploadFile';
import { useUploadStudentPhoto } from '../hooks/useUploadFile';
// import logoImage from 'figma:asset/71b57c03c5488fc89f49e890a42dd4691fd017ee.png';

interface ClientPageProps {
  onEditClient?: (client: StudentBaseRead) => void;
  onAddClient?: () => void;
}

export function ClientPage({ 
  onEditClient, 
  onAddClient 
}: ClientPageProps) {
  const [selectedClientPhoto, setSelectedClientPhoto] = useState<{ 
    name: string; 
    hasPhoto: boolean; 
    photoUrl?: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: clients } = useStudents();

  const uploadMutation = useUploadStudentsCSV();
  

  const handlePhotoClick = (clientName: string) => {
    // In a real implementation, this would check if the client has a photo
    // For now, no clients have photos
    setSelectedClientPhoto({
      name: clientName,
      hasPhoto: false,
      photoUrl: undefined
    });
  };

  const handleDownloadTemplate = () => {
    // Download a simple CSV template for clients with Class Name column
    const csvContent = 'Name,Age,Gender,ID Number,Primary Diagnosis,Secondary Diagnosis,Date of Enrollment,Email,DOB,Guardian Name,Guardian Contact,Class Name\n' +
                      'John Doe,25,M,CL001,Speech and Language,,2024-01-15,john@example.com,1999-03-15,Jane Doe,+65 9123 4567,Class A';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExcelUpload = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls,.csv';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Excel file selected:', file.name);
        setUploadedFile(file);
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleBulkUploadSubmit = () => {
    if (uploadedFile) {
      console.log('Processing client bulk upload for file:', uploadedFile.name);
      if (uploadedFile) {
        uploadMutation.mutate(uploadedFile);
      }
      // In a real implementation, process the Excel and import clients here
      setUploadedFile(null);
      setIsBulkUploadOpen(false);
    }
  };

  const handleEditClient = (client: StudentBaseRead, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEditClient) {
      onEditClient(client);
    }
  };

  const handleAddClient = () => {
    if (onAddClient) {
      onAddClient();
    }
  };

  const resetUploadDialog = () => {
    setUploadedFile(null);
    setIsBulkUploadOpen(false);
  };

  const uploadMutationPhoto = useUploadStudentPhoto();

  const handlePhotoUpload = (studentId: number) => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadMutationPhoto.mutate(
          { studentId, file },
          {
            onSuccess: (data) => {
              console.log("Uploaded:", data);
              setIsDialogOpen(true);
              queryClient.invalidateQueries({ queryKey: ["allstudents"] });
            },
            onError: (error) => {
              console.error("Upload failed", error);
            },
          }
        );
        // const photoUrl = URL.createObjectURL(file);
        // handleInputChange('photo', photoUrl);
        // console.log('Photo uploaded:', file.name);
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  return (
    <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb removed intentionally */}

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#3C3C3C' }}>
            Clients
          </h2>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                  <TableHead style={{ color: '#3C3C3C' }}>No.</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Name</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Age</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Gender</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>ID</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Primary Diagnosis</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Secondary Diagnosis</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Date of Enrollment</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Photo</TableHead>
                  <TableHead style={{ color: '#3C3C3C' }}>Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients?.map((client, index) => (
                  <TableRow 
                    key={client.id} 
                    className={`${index < clients.length - 1 ? "border-b" : ""} hover:bg-gray-50 transition-colors`} 
                    style={{ borderColor: '#BDC3C7' }}
                  >
                    <TableCell style={{ color: '#3C3C3C' }}>{index + 1}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.name}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.chronological_age}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.gender}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.id_number}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.primary_diagnosis}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.secondary_diagnosis}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.date_of_enrollment}</TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button 
                            className="w-10 h-8 border border-red-500 bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors rounded"
                            onClick={() => handlePhotoClick(client.name)}
                            title={`View/Upload photo for ${client.name}`}
                          >
                            <Camera className="w-4 h-4" style={{ color: '#DC3545' }} />
                          </button>
                        </DialogTrigger>
                        <DialogContent 
                          className="max-w-md mx-auto bg-white rounded-lg shadow-xl border-2 p-6"
                          style={{ borderColor: '#BDC3C7', backgroundColor: 'white' }}
                        >
                          {selectedClientPhoto && (
                            <>
                              <DialogHeader className="pb-4 text-left">
                                <DialogTitle 
                                  className="text-lg font-bold"
                                  style={{ color: '#3C3C3C' }}
                                >
                                  {selectedClientPhoto.name} - Photo
                                </DialogTitle>
                                <DialogDescription 
                                  className="text-sm mt-2"
                                  style={{ color: '#6C757D' }}
                                >
                                  View the photo for {selectedClientPhoto.name}. Click outside to close this dialog.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="flex justify-center py-6">
                                <div 
                                  className="rounded-lg flex items-center justify-center overflow-hidden"
                                  style={{ backgroundColor: '#E8F4F8' }}
                                >
                                  {client.photo ? (
                                    <img
                                      key={client.photo}
                                      src={client.photo} 
                                      alt={`Photo of ${client.name}`}
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
                                  onClick={() => handlePhotoUpload(client.id)}
                                  style={{ 
                                    backgroundColor: '#e65039',
                                    color: 'white',
                                    border: 'none'
                                  }}
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload New Photo
                                </Button>
                                {selectedClientPhoto.hasPhoto && (
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
                    <TableCell>
                      <Button
                        onClick={(e) => handleEditClient(client, e)}
                        className="p-1 border rounded transition-all duration-200 hover:opacity-90"
                        style={{ 
                          backgroundColor: 'white',
                          borderColor: '#BDC3C7',
                          color: '#3C3C3C'
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
                  Bulk Upload Clients
                </DialogTitle>
                <DialogDescription className="text-sm" style={{ color: '#6C757D' }}>
                  Upload multiple clients at once using an Excel file. Follow the two-step process below.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 p-4">
                {/* Step 1: Download Template */}
                <div className="space-y-3">
                  <h4 className="font-medium" style={{ color: '#3C3C3C' }}>Step 1: Download Template</h4>
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

                {/* Step 2: Upload Completed File */}
                <div className="space-y-3">
                  <h4 className="font-medium" style={{ color: '#3C3C3C' }}>Step 2: Upload Completed File</h4>

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
                    <strong>Note:</strong> The Excel file should contain columns for Name, Age, Gender, ID Number, Primary Diagnosis, Secondary Diagnosis, Date of Enrollment, Email, DOB, Guardian Name, and Guardian Contact.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button
                    onClick={resetUploadDialog}
                    className="px-4 py-2"
                    style={{ 
                      backgroundColor: '#BDC3C7',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    Cancel
                  </Button>
                </DialogClose>
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
            onClick={handleAddClient}
            className="flex items-center space-x-2 px-6 py-2 transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: '#e65039',
              color: 'white',
              border: 'none'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Clients</span>
          </Button>
        </div>
      </div>
    </div>
  );
}