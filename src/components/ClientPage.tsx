import { useState } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { User, Upload, Plus, Edit, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
// import logoImage from 'figma:asset/71b57c03c5488fc89f49e890a42dd4691fd017ee.png';

interface Client {
  id: number;
  name: string;
  age: number;
  gender: string;
  idNumber: string;
  primaryDiagnosis: string;
  secondaryDiagnosis: string;
  dateOfEnrollment: string;
  photoUrl?: string;
  email?: string;
  dob?: string;
  guardianName?: string;
  guardianContact?: string;
}

interface ClientPageProps {
  onBack: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onDashboardClick?: () => void;
  onTeamMembersClick?: () => void;
  onClientClick?: () => void;
  onEditClient?: (client: Client) => void;
  onAddClient?: () => void;
}

// Mock data for clients
const clients: Client[] = [
  {
    id: 1,
    name: "Aaron Kumar",
    age: 24,
    gender: "M",
    idNumber: "S0001",
    primaryDiagnosis: "Speech and Language Difficulty",
    secondaryDiagnosis: "Speech and Language Difficulty",
    dateOfEnrollment: "21.01.2020",
    photoUrl: "/placeholder-logo.png",
    email: "aaron.kumar@example.com",
    dob: "1999-03-15",
    guardianName: "Priya Kumar",
    guardianContact: "+65 9123 4567"
  },
  {
    id: 2,
    name: "Mei Ling Tan",
    age: 28,
    gender: "F",
    idNumber: "S0002",
    primaryDiagnosis: "Speech and Language Difficulty",
    secondaryDiagnosis: "Speech and Language Difficulty",
    dateOfEnrollment: "03.07.2021",
    photoUrl: "/placeholder-logo.png",
    email: "meiling.tan@example.com",
    dob: "1995-11-22",
    guardianName: "David Tan",
    guardianContact: "+65 8765 4321"
  }
];

export function ClientPage({ 
  onBack, 
  onLogout, 
  onProfileClick, 
  onDashboardClick, 
  onTeamMembersClick, 
  onClientClick, 
  onEditClient, 
  onAddClient 
}: ClientPageProps) {
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);
  const [uploadStep, setUploadStep] = useState<'template' | 'upload'>('template');

  const handleDownloadTemplate = () => {
    console.log('Downloading Excel template...');
    // In a real implementation, this would trigger a file download
    setUploadStep('upload');
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
        console.log('Excel file uploaded:', file.name);
        // In a real implementation, this would process the Excel file
        setShowBulkUploadDialog(false);
        setUploadStep('template'); // Reset for next time
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleEditClient = (client: Client, event: React.MouseEvent) => {
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
    setUploadStep('template');
    setShowBulkUploadDialog(false);
  };

  return (
    <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 px-3 py-1 rounded transition-all duration-200 hover:bg-blue-50"
            style={{ color: '#4EAAC9' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Educator</span>
          </button>
        </div>

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
                {clients.map((client, index) => (
                  <TableRow 
                    key={client.id} 
                    className={`${index < clients.length - 1 ? "border-b" : ""} hover:bg-gray-50 transition-colors`} 
                    style={{ borderColor: '#BDC3C7' }}
                  >
                    <TableCell style={{ color: '#3C3C3C' }}>{index + 1}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.name}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.age}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.gender}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.idNumber}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.primaryDiagnosis}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.secondaryDiagnosis}</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{client.dateOfEnrollment}</TableCell>
                    <TableCell>
                      <div className="w-8 h-8 rounded border overflow-hidden flex items-center justify-center" 
                        style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                        {client.photoUrl ? (
                          <ImageWithFallback 
                            src={client.photoUrl} 
                            alt={`${client.name}'s photo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4" style={{ color: '#BDC3C7' }} />
                        )}
                      </div>
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
          <Dialog open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center space-x-2 px-6 py-2 transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: '#4EAAC9',
                  color: 'white',
                  border: 'none'
                }}
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold" style={{ color: '#3C3C3C' }}>
                  Bulk Upload Clients
                </DialogTitle>
                <DialogDescription className="text-sm" style={{ color: '#6C757D' }}>
                  Upload multiple clients at once using an Excel file. Follow the two-step process below.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {uploadStep === 'template' ? (
                  <>
                    {/* Step 1: Download Template */}
                    <div className="space-y-3">
                      <h3 className="font-medium" style={{ color: '#3C3C3C' }}>Step 1: Download Excel Template</h3>
                      <p className="text-sm" style={{ color: '#6C757D' }}>
                        Download the template file with the required format for client data.
                      </p>
                      <Button
                        onClick={handleDownloadTemplate}
                        className="w-full border-2 border-dashed px-4 py-6 transition-all duration-200 hover:bg-blue-50 flex flex-col items-center justify-center space-y-2 min-h-[100px]"
                        style={{ 
                          backgroundColor: 'white',
                          borderColor: '#4EAAC9',
                          color: '#4EAAC9'
                        }}
                      >
                        <FileSpreadsheet className="w-6 h-6 flex-shrink-0" />
                        <div className="text-center space-y-1 max-w-full">
                          <p className="font-medium text-sm leading-tight">Download Template</p>
                          <p className="text-xs leading-tight break-words" style={{ color: '#6C757D' }}>
                            Excel file with required columns
                          </p>
                        </div>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Step 2: Upload File */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium" style={{ color: '#3C3C3C' }}>Step 2: Upload Filled Template</h3>
                        <Button
                          onClick={() => setUploadStep('template')}
                          className="p-1"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#6C757D',
                            border: 'none'
                          }}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm" style={{ color: '#6C757D' }}>
                        Upload your completed Excel file with client information.
                      </p>
                      <Button
                        onClick={handleExcelUpload}
                        className="w-full border-2 border-dashed px-6 py-6 transition-all duration-200 hover:bg-blue-50 flex flex-col items-center justify-center space-y-3 min-h-[120px]"
                        style={{ 
                          backgroundColor: 'white',
                          borderColor: '#4EAAC9',
                          color: '#4EAAC9'
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
                    </div>
                  </>
                )}
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

          <Button
            onClick={handleAddClient}
            className="flex items-center space-x-2 px-6 py-2 transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: '#2C5F7C',
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