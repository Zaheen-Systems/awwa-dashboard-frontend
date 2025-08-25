import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { ChevronLeft } from 'lucide-react';
// import awwaLogo from 'figma:asset/71b57c03c5488fc89f49e890a42dd4691fd017ee.png';

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

interface BehaviorDescriptor {
  id: number;
  selected: boolean;
  date: string;
  time: string;
  source: string;
  action: string;
  trigger: string;
  context: string;
  gco: string;
  iepGoal?: string;
}

interface ReportGenerationPageProps {
  student: Student;
  selectedBDs: BehaviorDescriptor[];
  onBack: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

export function ReportGenerationPage({ 
  student, 
  selectedBDs, 
  onBack, 
  onLogout,
  onProfileClick 
}: ReportGenerationPageProps) {

  const handleDownloadReport = () => {
    // In a real implementation, this would generate and download the actual report
    console.log('Downloading report for BDs:', selectedBDs);
    
    // Simulate file download
    const element = document.createElement('a');
    const file = new Blob(['GCOWMR Report Data'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GCOWMR_Report_${student.name.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Tabs Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8" style={{ backgroundColor: '#E8F4F8' }}>
        <div className="max-w-7xl mx-auto">
          {/* Tabs Row */}
          <div className="flex space-x-2 sm:space-x-4">
            <div 
              className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 opacity-50 cursor-not-allowed"
              style={{ 
                borderColor: '#BDC3C7',
                color: '#6C757D',
                backgroundColor: 'white'
              }}
            >
              Team member
            </div>
            <div 
              className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 opacity-50 cursor-not-allowed"
              style={{ 
                borderColor: '#BDC3C7',
                color: '#6C757D',
                backgroundColor: 'white'
              }}
            >
              Core Team (CT)
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation and Back Button */}
      <div className="px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left: Breadcrumb Navigation */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={onBack}
                style={{ color: '#2C5F7C' }}
                className="hover:underline"
              >
                Home
              </button>
              <span style={{ color: '#2C5F7C' }}> &gt; </span>
              <span style={{ color: '#2C5F7C' }}>{student.name}</span>
              <span style={{ color: '#2C5F7C' }}> &gt; </span>
              <span style={{ color: '#2C5F7C' }}>BD</span>
              <span style={{ color: '#2C5F7C' }}> &gt; </span>
              <span style={{ color: '#2C5F7C' }}>Download</span>
            </div>

            {/* Right: Back Button */}
            <Button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
              style={{ 
                backgroundColor: '#4EAAC9', 
                color: 'white',
                borderColor: '#4EAAC9'
              }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Download Section */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-sm p-8 border-2" style={{ borderColor: '#BDC3C7' }}>
              <Button
                onClick={handleDownloadReport}
                className="px-8 py-4 font-medium border-2 transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#3C3C3C',
                  color: '#3C3C3C'
                }}
              >
                Download GCOWMR
              </Button>
            </div>
          </div>

          {/* Selected Behavior Descriptors Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
              <h3 className="font-medium" style={{ color: '#3C3C3C' }}>Behaviour descriptors</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                    <TableHead className="w-16" style={{ color: '#3C3C3C' }}>select</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Data</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Time</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Source</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Action</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Trigger</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Context</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>GCO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBDs.map((descriptor, index) => (
                    <TableRow 
                      key={descriptor.id} 
                      className={index < selectedBDs.length - 1 ? "border-b" : ""} 
                      style={{ 
                        borderColor: '#BDC3C7',
                        backgroundColor: '#4EAAC9' // Turquoise background for selected items
                      }}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={true}
                          disabled={true}
                          className="border-2"
                          style={{ borderColor: '#BDC3C7' }}
                        />
                      </TableCell>
                      <TableCell style={{ color: 'white' }}>{descriptor.date}</TableCell>
                      <TableCell style={{ color: 'white' }}>{descriptor.time}</TableCell>
                      <TableCell style={{ color: 'white' }}>{descriptor.source}</TableCell>
                      <TableCell style={{ color: 'white' }}>{descriptor.action}</TableCell>
                      <TableCell style={{ color: 'white' }}>{descriptor.trigger}</TableCell>
                      <TableCell style={{ color: 'white' }}>{descriptor.context}</TableCell>
                      <TableCell style={{ color: 'white' }}>{descriptor.gco}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}