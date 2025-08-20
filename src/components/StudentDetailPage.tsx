import { useState } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Filter, ArrowLeft } from 'lucide-react';
import { AddNewBDModal } from './AddNewBDModal';
import { SelectBDsModal } from './SelectBDsModal';
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

interface BDFormData {
  date: string;
  action: string;
  trigger: string;
  source: string;
  time: string;
  staff: string;
  gcoClassification: string;
  iepGoal: string;
}

interface StudentDetailPageProps {
  student: Student;
  onBack: () => void;
  onLogout: () => void;
  onBehaviorDescriptorClick: (behaviorDescriptor: BehaviorDescriptor) => void;
  onGenerateReport: (selectedBDs: BehaviorDescriptor[]) => void;
  onProfileClick: () => void;
  onTeamMembersCTClick: () => void;
}

// Mock GCO data structure - expanded for scrolling
const mockGCOData = {
  gco1: [
    "1.1.1 - 2",
    "1.1.2 - 3", 
    "1.1.3 - 4",
    "1.2.1 - 3",
    "1.2.2 - 1",
    "1.3.1 - 1",
    "1.3.2 - 2",
    "1.4.1 - 0"
  ],
  gco2: [
    "2.1.1 - 4",
    "2.1.2 - 0",
    "2.2.1 - 5",
    "2.3.1 - 1",
    "",
    "",
    "",
    ""
  ],
  gco3: [
    "3.1.1 - 4",
    "3.1.2 - 3",
    "3.1.3 - 2", 
    "3.2.1 - 5",
    "3.2.1 - 5",
    "3.3.1 - 5",
    "",
    ""
  ]
};

const mockGCOFunctionalAges = {
  gco1: "18-24 months",
  gco2: "13 - 18 months", 
  gco3: "19 - 24 months"
};

const mockIEPGoals = [
  { id: 1, text: "Aarav will participate in Play Time in EC", gco: "GCO 1" },
  { id: 2, text: "", gco: "GCO 2" }
];

// Mock behaviour descriptors data for GCO
const mockBehaviourDescriptors = [
  {
    id: 1,
    selected: false,
    date: "02.03.24",
    time: "8:03 am",
    source: "Snack time",
    action: "Child 'X' pointed 'west more wheat crackers'",
    trigger: "When teacher asked 'What do you want?'",
    context: "During snack time",
    gco: "3.1.1"
  },
  {
    id: 2,
    selected: false,
    date: "02.03.24",
    time: "8:03 am",
    source: "Snack time",
    action: "Child 'X' pointed 'west more wheat crackers'",
    trigger: "When teacher asked 'What do you want?'",
    context: "During snack time",
    gco: "3.1.2"
  },
  {
    id: 3,
    selected: false,
    date: "05.03.24",
    time: "10:15 am",
    source: "Free play",
    action: "Child initiated eye contact and smiled",
    trigger: "When peer approached with toy",
    context: "During free play time",
    gco: "2.1.1"
  },
  {
    id: 4,
    selected: false,
    date: "05.03.24", 
    time: "2:30 pm",
    source: "Circle time",
    action: "Child raised hand to answer question",
    trigger: "When teacher asked about colors",
    context: "During circle time activity",
    gco: "1.2.1"
  },
  {
    id: 5,
    selected: false,
    date: "06.03.24",
    time: "9:45 am", 
    source: "Art activity",
    action: "Child requested help using gesture",
    trigger: "When struggling with scissors",
    context: "During art and craft time",
    gco: "3.2.1"
  }
];

// Mock behaviour descriptors data for IEP
const mockIEPBehaviourDescriptors = [
  {
    id: 1,
    selected: false,
    date: "02.03.24",
    time: "9:00 am",
    source: "Snack time",
    action: "Child 'X' pointed 'west more wheat crackers'",
    trigger: "When teacher asked 'What do you want?'",
    context: "During snack time",
    iepGoal: "Goal 1",
    gco: "1"
  },
  {
    id: 2,
    selected: false,
    date: "02.03.24",
    time: "9:00 am",
    source: "Snack time",
    action: "Child 'X' pointed 'west more wheat crackers'",
    trigger: "When teacher asked 'What do you want?'",
    context: "During snack time",
    iepGoal: "Goal 2",
    gco: "2"
  }
];

export function StudentDetailPage({ student, onBack, onLogout, onBehaviorDescriptorClick, onGenerateReport, onProfileClick, onTeamMembersCTClick }: StudentDetailPageProps) {
  const [date, setDate] = useState("");
  const [behaviourDescriptors, setBehaviourDescriptors] = useState(mockBehaviourDescriptors);
  const [iepBehaviourDescriptors, setIepBehaviourDescriptors] = useState(mockIEPBehaviourDescriptors);

  // Modal states
  const [showAddBDModal, setShowAddBDModal] = useState(false);
  const [showSelectBDsModal, setShowSelectBDsModal] = useState(false);

  const handleBehaviourSelect = (id: number, selected: boolean) => {
    setBehaviourDescriptors(prev => 
      prev.map(item => 
        item.id === id ? { ...item, selected } : item
      )
    );
  };

  const handleIepBehaviourSelect = (id: number, selected: boolean) => {
    setIepBehaviourDescriptors(prev => 
      prev.map(item => 
        item.id === id ? { ...item, selected } : item
      )
    );
  };

  const handleRowClick = (descriptor: BehaviorDescriptor, event: React.MouseEvent) => {
    // Don't navigate if clicking on checkbox
    if ((event.target as HTMLElement).closest('input[type="checkbox"]') || 
        (event.target as HTMLElement).closest('[role="checkbox"]')) {
      return;
    }
    onBehaviorDescriptorClick(descriptor);
  };

  const handleAddNewBDs = () => {
    setShowAddBDModal(true);
  };

  const handleBDSubmit = (bdData: BDFormData) => {
    console.log("Team Member BD submitted:", bdData);
    const newBD = {
      id: Math.max(...behaviourDescriptors.map(bd => bd.id)) + 1,
      selected: false,
      date: bdData.date,
      time: bdData.time || "N/A",
      source: bdData.source,
      action: bdData.action,
      trigger: bdData.trigger,
      context: "During " + bdData.source.toLowerCase(),
      gco: bdData.gcoClassification
    };
    setBehaviourDescriptors(prev => [...prev, newBD]);
  };

  const handleGenerateReportClick = () => {
    setShowSelectBDsModal(true);
  };

  const handleReportGenerate = (selectedBDs: BehaviorDescriptor[]) => {
    onGenerateReport(selectedBDs);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Tabs Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8" style={{ backgroundColor: '#E8F4F8' }}>
        <div className="max-w-7xl mx-auto">
          {/* Navigation buttons in header */}
          <div className="flex justify-start space-x-2 sm:space-x-4">
            <button
              className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 transition-all duration-200"
              style={{ 
                borderColor: '#2C5F7C',
                color: 'white',
                backgroundColor: '#2C5F7C'
              }}
            >
              Team member
            </button>
            <button
              className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 transition-all duration-200 opacity-50 cursor-not-allowed"
              style={{ 
                borderColor: '#BDC3C7',
                color: '#6C757D',
                backgroundColor: 'white'
              }}
            >
              Core Team (CT)
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" style={{ color: '#2C5F7C' }} />
              <span style={{ color: '#2C5F7C' }}>Home &gt; {student.name}</span>
            </div>
            
            <Button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
              style={{ 
                backgroundColor: '#4EAAC9', 
                color: 'white',
                borderColor: '#4EAAC9'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Student Information Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <Table>
              <TableBody>
                <TableRow className="border-b" style={{ borderColor: '#BDC3C7' }}>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Name</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.name}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Chronological age (months)</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.chronologicalAge}</TableCell>
                </TableRow>
                <TableRow className="border-b" style={{ borderColor: '#BDC3C7' }}>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Primary Diagnosis</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.primaryDiagnosis}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Age band (months)</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.ageBand}</TableCell>
                </TableRow>
                <TableRow className="border-b" style={{ borderColor: '#BDC3C7' }}>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Secondary Diagnosis</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.secondaryDiagnosis}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Functional Age</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}></TableCell>
                </TableRow>
                <TableRow className="border-b" style={{ borderColor: '#BDC3C7' }}>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Entry/Review/Exit</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.status}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>GCO 1</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{mockGCOFunctionalAges.gco1}</TableCell>
                </TableRow>
                <TableRow className="border-b" style={{ borderColor: '#BDC3C7' }}>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>CT</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>Jaylene</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>GCO 2</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{mockGCOFunctionalAges.gco2}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Last GCO</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.lastGCODate}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>GCO 3</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{mockGCOFunctionalAges.gco3}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* IEP Goals Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
              <h3 className="font-medium" style={{ color: '#3C3C3C' }}>IEP Goals</h3>
            </div>
            <Table>
              <TableBody>
                {mockIEPGoals.map((goal, index) => (
                  <TableRow key={goal.id} className={index < mockIEPGoals.length - 1 ? "border-b" : ""} style={{ borderColor: '#BDC3C7' }}>
                    <TableCell style={{ color: '#3C3C3C' }}>{index + 1}.</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{goal.text}</TableCell>
                    <TableCell style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>{goal.gco}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Date Input */}
          <div className="mb-6">
            <div className="w-64">
              <Label htmlFor="date" style={{ color: '#3C3C3C' }}>Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              />
            </div>
          </div>

          {/* Scrollable GCO Progress Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="max-h-64 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow className="border-b-2" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                    <TableHead className="w-12" style={{ color: '#3C3C3C' }}></TableHead>
                    <TableHead className="text-center" style={{ color: '#3C3C3C' }}>GCO 1</TableHead>
                    <TableHead className="text-center" style={{ color: '#3C3C3C' }}>GCO 2</TableHead>
                    <TableHead className="text-center" style={{ color: '#3C3C3C' }}>GCO 3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGCOData.gco1.map((_, index) => (
                    <TableRow key={index} className={index < mockGCOData.gco1.length - 1 ? "border-b" : ""} style={{ borderColor: '#BDC3C7' }}>
                      <TableCell className="w-12 text-center text-sm" style={{ 
                        color: '#3C3C3C', 
                        backgroundColor: index === 0 ? '#4EAAC9' : 'transparent' 
                      }}>
                        {index === 0 ? '1' : ''}
                      </TableCell>
                      <TableCell 
                        className="text-center" 
                        style={{ 
                          color: '#3C3C3C', 
                          backgroundColor: index === 0 ? '#4EAAC9' : 'transparent' 
                        }}
                      >
                        {mockGCOData.gco1[index]}
                      </TableCell>
                      <TableCell 
                        className="text-center" 
                        style={{ 
                          color: '#3C3C3C', 
                          backgroundColor: index === 0 ? '#4EAAC9' : 'transparent' 
                        }}
                      >
                        {mockGCOData.gco2[index]}
                      </TableCell>
                      <TableCell 
                        className="text-center" 
                        style={{ 
                          color: '#3C3C3C', 
                          backgroundColor: index === 0 ? '#4EAAC9' : 'transparent' 
                        }}
                      >
                        {mockGCOData.gco3[index]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Behaviour Descriptors for GCO Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
              <h3 className="font-medium" style={{ color: '#3C3C3C' }}>Behaviour descriptors for GCO</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                    <TableHead className="w-16" style={{ color: '#3C3C3C' }}>Select</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Date</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Time</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Source</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Action</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Trigger</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Context</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>GCO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {behaviourDescriptors.map((descriptor, index) => (
                    <TableRow 
                      key={descriptor.id} 
                      className={`${index < behaviourDescriptors.length - 1 ? "border-b" : ""} cursor-pointer hover:bg-gray-50 transition-colors`} 
                      style={{ 
                        borderColor: '#BDC3C7',
                        backgroundColor: descriptor.selected ? '#4EAAC9' : 'transparent'
                      }}
                      onClick={(e) => handleRowClick(descriptor, e)}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={descriptor.selected}
                          onCheckedChange={(checked) => handleBehaviourSelect(descriptor.id, checked as boolean)}
                          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          style={{ 
                            borderColor: descriptor.selected ? '#2C5F7C' : '#BDC3C7',
                            backgroundColor: descriptor.selected ? '#2C5F7C' : 'transparent'
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.date}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.time}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.source}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.action}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.trigger}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.context}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.gco}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Behaviour Descriptors for IEP Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
              <h3 className="font-medium" style={{ color: '#3C3C3C' }}>Behaviour descriptors for IEP</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                    <TableHead className="w-16" style={{ color: '#3C3C3C' }}>Select</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Date</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Time</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Source</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Action</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Trigger</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>Source</TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>
                      <div className="flex items-center space-x-1">
                        <span>IEP Goal</span>
                        <Filter className="w-4 h-4" style={{ color: '#6C757D' }} />
                      </div>
                    </TableHead>
                    <TableHead style={{ color: '#3C3C3C' }}>
                      <div className="flex items-center space-x-1">
                        <span>GCO</span>
                        <Filter className="w-4 h-4" style={{ color: '#6C757D' }} />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {iepBehaviourDescriptors.map((descriptor, index) => (
                    <TableRow 
                      key={descriptor.id} 
                      className={`${index < iepBehaviourDescriptors.length - 1 ? "border-b" : ""} cursor-pointer hover:bg-gray-50 transition-colors`} 
                      style={{ 
                        borderColor: '#BDC3C7',
                        backgroundColor: descriptor.selected ? '#4EAAC9' : 'transparent'
                      }}
                      onClick={(e) => handleRowClick(descriptor, e)}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={descriptor.selected}
                          onCheckedChange={(checked) => handleIepBehaviourSelect(descriptor.id, checked as boolean)}
                          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          style={{ 
                            borderColor: descriptor.selected ? '#2C5F7C' : '#BDC3C7',
                            backgroundColor: descriptor.selected ? '#2C5F7C' : 'transparent'
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.date}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.time}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.source}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.action}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.trigger}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.context}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.iepGoal}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.gco}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={handleAddNewBDs}
              className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
              style={{ 
                backgroundColor: '#4EAAC9', 
                color: 'white',
                borderColor: '#4EAAC9'
              }}
            >
              Add New BDs
            </Button>
            
            <Button
              onClick={handleGenerateReportClick}
              className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
              style={{ 
                backgroundColor: '#2C5F7C', 
                color: 'white',
                borderColor: '#2C5F7C'
              }}
            >
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddNewBDModal
        isOpen={showAddBDModal}
        onClose={() => setShowAddBDModal(false)}
        onSubmit={handleBDSubmit}
      />

      <SelectBDsModal
        isOpen={showSelectBDsModal}
        onClose={() => setShowSelectBDsModal(false)}
        behaviourDescriptors={behaviourDescriptors}
        iepBehaviourDescriptors={iepBehaviourDescriptors}
        onGenerate={handleReportGenerate}
      />
    </div>
  );
}