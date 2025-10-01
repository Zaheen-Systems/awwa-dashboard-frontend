import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Filter, ArrowLeft } from 'lucide-react';
import { AddNewBDModal } from './AddNewBDModal';
import { SelectBDsModal } from './SelectBDsModal';
import { BDsFilterModal, BDFilters } from './BDsFilterModal';
import api from "../lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Student } from '../types/students';
// import awwaLogo from 'figma:asset/71b57c03c5488fc89f49e890a42dd4691fd017ee.png';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

interface IEPGoalBasic {
  id: number;
  description?: string | null;
  gco?: string | null;    // will become boolean later
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
  gco_classification: string;
  created_at: string;
  iep_goal?: IEPGoalBasic;
  video_url?: string;
}

interface BehavioralDescriptorUI extends BehaviorDescriptor {
  selected: boolean;
  date: string;
  time: string;
}

interface BDFormData {
  date: string;
  action: string;
  trigger: string;
  source: string;
  time: string;
  staff: string;
  gcoClassification: string;
  iep_goal_id: string;
}

interface StudentDetailPageProps {
  student: Student;
  onBack: () => void;
  onBehaviorDescriptorClick: (behaviorDescriptor: BehaviorDescriptor) => void;
  // onGenerateReport: (selectedBDs: BehaviorDescriptor[]) => void;
}


interface GroupedDescriptors {
  "gco1": string[];
  "gco2": string[];
  "gco3": string[];
};

// const fetchStudentDetail = async (id: number): Promise<Student> => {
//   const response = await axios.get(`/api/students/${id}`);
//   return response.data;
// };

function useBehavioralDescriptors(studentId: number) {
  return useQuery<BehavioralDescriptorUI[]>({
    queryKey: ["behavioralDescriptors", studentId],
    queryFn: async () => {
      const { data } = await api.get<BehaviorDescriptor[]>(
        `/api/students/${studentId}/behavioral_descriptors`
      );

      return data.map((item) => {
        const createdAt = new Date(item.created_at);

        return {
          ...item,
          selected: false,
          date: format(createdAt, "dd.MM.yy"),
          time: format(createdAt, "h:mm a"),
        };
      });
    },
  });
}

const fetchGroupedDescriptors = async (studentId: number) => {
  const { data } = await api.get(`/api/behavioral-descriptors/grouped_gcos/${studentId}`);
  return data;
};

export function StudentDetailPage({ student, onBack, onBehaviorDescriptorClick }: StudentDetailPageProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isRangeMode, setIsRangeMode] = useState(false);
  const [showNoSelectDialog, setShowNoSelectDialog] = useState(false);
  const queryClient = useQueryClient();
  const [behaviourDescriptors, setBehaviourDescriptors] = useState<BehavioralDescriptorUI[]>([]);
  const [iepBehaviourDescriptors, setIepBehaviourDescriptors] = useState<BehaviorDescriptor[]>([]);

  const { data: behaviourDescriptorsAll } = useBehavioralDescriptors(parseInt(student.id));

  // Filter states
  const [gcoFilters, setGcoFilters] = useState<BDFilters>({
    trigger: '',
    source: 'all',
    context: '',
    startDate: '',
    endDate: '',
    gcoClassification: 'all',
    hasAction: false,
    hasTrigger: false
  });
  const [iepFilters, setIepFilters] = useState<BDFilters>({
    trigger: '',
    source: 'all',
    context: '',
    startDate: '',
    endDate: '',
    gcoClassification: 'all',
    hasAction: false,
    hasTrigger: false
  });

  // Filter behavior descriptors based on date range or single date
  const filterDescriptorsByDateRange = (descriptors: BehavioralDescriptorUI[]) => {
    if (!startDate && !endDate) return descriptors;

    return descriptors.filter(descriptor => {
      const descriptorDate = new Date(descriptor.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (isRangeMode) {
        // Range mode: both start and end dates must be present
        if (start && end) {
          return descriptorDate >= start && descriptorDate <= end;
        }
        // If only one date in range mode, use it as start date
        else if (start) {
          return descriptorDate >= start;
        }
        else if (end) {
          return descriptorDate <= end;
        }
      } else {
        // Single date mode: if only startDate is provided, show that specific date
        if (start && !end) {
          const descriptorDateStr = descriptorDate.toISOString().split('T')[0];
          const startDateStr = start.toISOString().split('T')[0];
          return descriptorDateStr === startDateStr;
        }
        // If both dates are provided in single mode, treat as range
        else if (start && end) {
          return descriptorDate >= start && descriptorDate <= end;
        }
      }
      return true;
    });
  };

  useEffect(() => {
    if (behaviourDescriptorsAll) {
      const filteredAll = filterDescriptorsByDateRange(behaviourDescriptorsAll);

      // Apply GCO filters to non-IEP descriptors
      const gcoFiltered = applyFilters(filteredAll.filter(bd => !bd.iep_goal), gcoFilters);
      setBehaviourDescriptors(gcoFiltered);

      // Apply IEP filters to IEP descriptors
      const iepFiltered = applyFilters(filteredAll.filter(bd => Boolean(bd.iep_goal)), iepFilters);
      setIepBehaviourDescriptors(iepFiltered);
    }
  }, [behaviourDescriptorsAll, startDate, endDate, isRangeMode, gcoFilters, iepFilters]);

  const { data: mockGCOData } = useQuery<GroupedDescriptors>({
    queryKey: ["groupedDescriptors", student.id],
    queryFn: () => fetchGroupedDescriptors(parseInt(student.id)),
    enabled: !!student.id, // don't run until we have a studentId
  });

  // Count behavior descriptors for specific GCO items (e.g., "1.2.2")
  const getCountForGCOItem = (gcoItem: string) => {
    if (!behaviourDescriptors) return 0;

    const count = behaviourDescriptors.filter(descriptor => {
      if (!descriptor.action || descriptor.action.trim() === '' ||
        !descriptor.trigger || descriptor.trigger.trim() === '') {
        return false;
      }

      // Check if the descriptor's gco_classification matches the specific GCO item
      return String(descriptor.gco_classification) === String(gcoItem);
    }).length;

    return count;
  };

  // Modal states
  const [showAddBDModal, setShowAddBDModal] = useState(false);
  const [showSelectBDsModal, setShowSelectBDsModal] = useState(false);
  const [showGCOFilterModal, setShowGCOFilterModal] = useState(false);
  const [showIEPFilterModal, setShowIEPFilterModal] = useState(false);


  const handleBehaviourSelect = (id: number, selected: boolean) => {
    console.log(id, selected)
    setBehaviourDescriptors(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected } : item
      )
    );
  };

  const handleIepBehaviourSelect = (id: number, selected: boolean) => {
    console.log(id, selected)
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

  const createBehaviorDescriptor = async (data: BDFormData) => {
    const payload = {
      source: data.source,
      action: data.action,
      trigger: data.trigger,
      timestamp: data.time,               // maps to Time column
      gco_classification: data.gcoClassification,    // maps to FK
      iep_goal_id: Number(data.iep_goal_id), // ensure it's number
      student_id: student.id,
    };

    const res = await api.post("/api/behavioral-descriptors/", payload);
    return res.data;
  };

  const useCreateBD = () => {
    return useMutation({ mutationFn: createBehaviorDescriptor });
  };

  const { mutate: submitBD } = useCreateBD();

  const handleBDSubmit = (bdData: BDFormData) => {
    console.log("Team Member BD submitted:", bdData);

    submitBD(bdData, {
      onSuccess: (res) => {
        console.log("BD saved:", res);

        queryClient.invalidateQueries({
          queryKey: ["behavioralDescriptors", parseInt(student.id)],
        });
      },
      onError: (err) => {
        console.error("Error saving BD:", err);
      }
    });

    // const newBD = {
    //   id: Math.max(...behaviourDescriptors.map(bd => bd.id)) + 1,
    //   selected: false,
    //   date: bdData.date,
    //   time: bdData.time || "N/A",
    //   source: bdData.source,
    //   action: bdData.action,
    //   trigger: bdData.trigger,
    //   context: "During " + bdData.source.toLowerCase(),
    //   gco_id: bdData.gcoClassification
    // };
    // setBehaviourDescriptors(prev => [...prev, newBD]);
  };

  const handleResetDates = () => {
    setStartDate("");
    setEndDate("");
    setIsRangeMode(false);
  };

  // Filter behavior descriptors based on applied filters
  const applyFilters = (descriptors: BehavioralDescriptorUI[], filters: BDFilters): BehavioralDescriptorUI[] => {
    return descriptors.filter(descriptor => {
      // Trigger filter
      if (filters.trigger && !descriptor.trigger.toLowerCase().includes(filters.trigger.toLowerCase())) {
        return false;
      }

      // Source filter
      if (filters.source && filters.source !== 'all' && descriptor.source !== filters.source) {
        return false;
      }

      // Context filter
      if (filters.context && !descriptor.context.toLowerCase().includes(filters.context.toLowerCase())) {
        return false;
      }

      // GCO Classification filter
      if (filters.gcoClassification && filters.gcoClassification !== 'all' && descriptor.gco_classification !== filters.gcoClassification) {
        return false;
      }

      // Date range filter
      if (filters.startDate || filters.endDate) {
        const descriptorDate = new Date(descriptor.created_at);
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;

        if (start && descriptorDate < start) {
          return false;
        }
        if (end && descriptorDate > end) {
          return false;
        }
      }

      // Has action filter
      if (filters.hasAction && (!descriptor.action || descriptor.action.trim() === '')) {
        return false;
      }

      // Has trigger filter
      if (filters.hasTrigger && (!descriptor.trigger || descriptor.trigger.trim() === '')) {
        return false;
      }

      return true;
    });
  };

  // Handler for GCO filter modal
  const handleGCOFilterApply = (filters: BDFilters) => {
    setGcoFilters(filters);
  };

  const handleGCOFilterClear = () => {
    setGcoFilters({
      trigger: '',
      source: 'all',
      context: '',
      startDate: '',
      endDate: '',
      gcoClassification: 'all',
      hasAction: false,
      hasTrigger: false
    });
  };

  // Handler for IEP filter modal
  const handleIEPFilterApply = (filters: BDFilters) => {
    setIepFilters(filters);
  };

  const handleIEPFilterClear = () => {
    setIepFilters({
      trigger: '',
      source: 'all',
      context: '',
      startDate: '',
      endDate: '',
      gcoClassification: 'all',
      hasAction: false,
      hasTrigger: false
    });
  };

  console.log(behaviourDescriptors.filter(d => d.selected));

  const handleGenerateReportClick = () => {
    const selectedIds = behaviourDescriptors.filter(d => d.selected).map(d => d.id);
    const selectediepIds = iepBehaviourDescriptors.filter(d => d.selected).map(d => d.id);
    const allIds = [...selectedIds, ...selectediepIds];

    if (allIds.length === 0) {
      setShowNoSelectDialog(true); // just show popup
      return;
    }

    generateReport({ studentId: student.id, ids: allIds });
  };

  function useGenerateReport() {
    return useMutation({
      mutationFn: async ({ studentId, ids }: { studentId: string; ids: number[] }) => {
        const queryParams = ids && ids.length > 0
          ? `?${ids.map(id => `ids=${id}`).join("&")}`
          : "";
        const response = await api.get(`/api/students/${studentId}/gcowmr${queryParams}`);
        return response.data; // expects { download_url: string }
      },
      onSuccess: (data) => {
        const { download_url } = data;
        if (!download_url) return;

        // trigger download automatically
        const link = document.createElement("a");
        link.href = download_url;
        link.setAttribute("download", "report.xlsx"); // optional filename
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
    });
  }

  const { mutate: generateReport, isPending: isReportPending } = useGenerateReport();

  const handleReportGenerate = (selectedBDs: BehaviorDescriptor[]) => {
    console.log(selectedBDs)
    // onGenerateReport(selectedBDs);
    // generateReport(student.id)
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Tabs Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8" style={{ backgroundColor: '#fff5f3' }}>
        <div className="max-w-7xl mx-auto">
          {/* Navigation buttons in header */}
          {/* <div className="flex justify-start space-x-2 sm:space-x-4">
            <button
              className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 transition-all duration-200"
              style={{ 
                borderColor: '#e65039',
                color: 'white',
                backgroundColor: '#e65039'
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
          </div> */}
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" style={{ color: '#e65039' }} />
              <span style={{ color: '#e65039' }}>Home &gt; {student?.name}</span>
            </div>

            <Button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: '#e65039',
                color: 'white',
                borderColor: '#e65039'
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
                  <TableCell style={{ color: '#3C3C3C' }}>{student?.name}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Chronological age (months)</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student?.chronological_age}</TableCell>
                </TableRow>
                <TableRow className="border-b" style={{ borderColor: '#BDC3C7' }}>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Primary Diagnosis</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student?.primary_diagnosis}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Age band (months)</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student?.age_band}</TableCell>
                </TableRow>
                <TableRow className="border-b" style={{ borderColor: '#BDC3C7' }}>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Secondary Diagnosis</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student?.secondary_diagnosis}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Functional Age</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}></TableCell>
                </TableRow>
                <TableRow className="border-b" style={{ borderColor: '#BDC3C7' }}>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Entry/Review/Exit</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student?.entry_type}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>GCO 1</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.gco_1_functional_age}</TableCell>
                </TableRow>
                <TableRow className="border-b" style={{ borderColor: '#BDC3C7' }}>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>CT</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.ct?.first_name}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>GCO 2</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.gco_2_functional_age}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>Last GCO</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student?.last_gco_date}</TableCell>
                  <TableCell className="font-medium" style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>GCO 3</TableCell>
                  <TableCell style={{ color: '#3C3C3C' }}>{student.gco_3_functional_age}</TableCell>
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
                {student.iep_goals.map((goal, index) => (
                  <TableRow key={goal.id} className={index < student.iep_goals.length - 1 ? "border-b" : ""} style={{ borderColor: '#BDC3C7' }}>
                    <TableCell style={{ color: '#3C3C3C' }}>{index + 1}.</TableCell>
                    <TableCell style={{ color: '#3C3C3C' }}>{goal.description}</TableCell>
                    <TableCell style={{ color: '#3C3C3C', backgroundColor: '#F8F9FA' }}>GCO {goal.gco_number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Date Selection */}
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col space-y-4">
                {/* Mode Selection */}
                <div className="flex items-center space-x-4">
                  <Label className="text-sm font-medium" style={{ color: '#3C3C3C' }}>Date Filter Mode:</Label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={!isRangeMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setIsRangeMode(false);
                        setEndDate(""); // Clear end date when switching to single mode
                      }}
                      className="text-xs"
                      style={{
                        backgroundColor: !isRangeMode ? '#e65039' : 'transparent',
                        color: !isRangeMode ? 'white' : '#3C3C3C',
                        borderColor: '#e65039'
                      }}
                    >
                      Single Date
                    </Button>
                    <Button
                      type="button"
                      variant={isRangeMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsRangeMode(true)}
                      className="text-xs"
                      style={{
                        backgroundColor: isRangeMode ? '#e65039' : 'transparent',
                        color: isRangeMode ? 'white' : '#3C3C3C',
                        borderColor: '#e65039'
                      }}
                    >
                      Date Range
                    </Button>
                  </div>
                </div>

                {/* Date Inputs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="startDate" style={{ color: '#3C3C3C' }}>
                      {isRangeMode ? 'Start Date' : 'Date'}
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white border-2 focus:outline-none"
                      style={{
                        borderColor: '#BDC3C7',
                        color: '#3C3C3C'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                      onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                    />
                  </div>

                  {isRangeMode && (
                    <div className="flex-1">
                      <Label htmlFor="endDate" style={{ color: '#3C3C3C' }}>End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-white border-2 focus:outline-none"
                        style={{
                          borderColor: '#BDC3C7',
                          color: '#3C3C3C'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                        onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                      />
                    </div>
                  )}
                </div>

                {/* Helper Text and Reset Button */}
                <div className="flex justify-between items-center">
                  <div className="text-sm" style={{ color: '#6C757D' }}>
                    {isRangeMode
                      ? "Select a date range to filter behavior descriptors"
                      : "Select a specific date to view behavior descriptors for that day"
                    }
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetDates}
                    className="text-xs"
                    style={{
                      borderColor: '#BDC3C7',
                      color: '#3C3C3C'
                    }}
                  >
                    Reset Dates
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable GCO Progress Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
              <h3 className="font-medium" style={{ color: '#3C3C3C' }}>BDs Collected For GCOs</h3>
            </div>
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
                  {mockGCOData?.gco1.map((_, index) => (
                    <TableRow key={index} className={index < mockGCOData.gco1.length - 1 ? "border-b" : ""} style={{ borderColor: '#BDC3C7' }}>
                      <TableCell className="w-12 text-center text-sm" style={{
                        color: '#3C3C3C',
                        backgroundColor: 'transparent'
                      }}>
                        {index + 1}
                      </TableCell>
                      <TableCell
                        className="text-center"
                        style={{
                          color: '#3C3C3C',
                          backgroundColor: 'transparent'
                        }}
                      >
                        {(() => {
                          const itemText = mockGCOData.gco1[index];
                          const count = getCountForGCOItem(itemText);
                          return count > 0 ? `${itemText}(${count})` : itemText;
                        })()}
                      </TableCell>
                      <TableCell
                        className="text-center"
                        style={{
                          color: '#3C3C3C',
                          backgroundColor: 'transparent'
                        }}
                      >
                        {(() => {
                          const itemText = mockGCOData.gco2[index];
                          const count = getCountForGCOItem(itemText);
                          return count > 0 ? `${itemText}(${count})` : itemText;
                        })()}
                      </TableCell>
                      <TableCell
                        className="text-center"
                        style={{
                          color: '#3C3C3C',
                          backgroundColor: 'transparent'
                        }}
                      >
                        {(() => {
                          const itemText = mockGCOData.gco3[index];
                          const count = getCountForGCOItem(itemText);
                          return count > 0 ? `${itemText}(${count})` : itemText;
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Behaviour Descriptors for GCO Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
              <h3 className="font-medium" style={{ color: '#3C3C3C' }}>Behaviour descriptors for GCO</h3>
              <Button
                onClick={() => setShowGCOFilterModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                style={{
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>
            <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
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
                  {behaviourDescriptors?.filter(descriptor =>
                    descriptor.action && descriptor.action.trim() !== '' &&
                    descriptor.trigger && descriptor.trigger.trim() !== ''
                  ).map((descriptor, index, filteredArray) => (
                    <TableRow
                      key={descriptor.id}
                      className={`${index < filteredArray.length - 1 ? "border-b" : ""} cursor-pointer hover:bg-gray-50 transition-colors`}
                      style={{
                        borderColor: '#BDC3C7',
                        backgroundColor: descriptor.selected ? '#e65039' : 'transparent'
                      }}
                      onClick={(e) => handleRowClick(descriptor, e)}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={descriptor.selected}
                          onCheckedChange={(checked) => handleBehaviourSelect(descriptor.id, checked as boolean)}
                          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          style={{
                            borderColor: descriptor.selected ? '#e65039' : '#BDC3C7',
                            backgroundColor: descriptor.selected ? '#e65039' : 'transparent'
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.date}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.time}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.source}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.action}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.trigger}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.context}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.gco_classification}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Behaviour Descriptors for IEP Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
              <h3 className="font-medium" style={{ color: '#3C3C3C' }}>Behaviour descriptors for IEP</h3>
              <Button
                onClick={() => setShowIEPFilterModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                style={{
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
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
                  {iepBehaviourDescriptors?.map((descriptor, index) => (
                    <TableRow
                      key={descriptor.id}
                      className={`${index < iepBehaviourDescriptors.length - 1 ? "border-b" : ""} cursor-pointer hover:bg-gray-50 transition-colors`}
                      style={{
                        borderColor: '#BDC3C7',
                        backgroundColor: descriptor.selected ? '#e65039' : 'transparent'
                      }}
                      onClick={(e) => handleRowClick(descriptor, e)}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={descriptor.selected}
                          onCheckedChange={(checked) => handleIepBehaviourSelect(descriptor.id, checked as boolean)}
                          className="border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          style={{
                            borderColor: descriptor.selected ? '#e65039' : '#BDC3C7',
                            backgroundColor: descriptor.selected ? '#e65039' : 'transparent'
                          }}
                        />
                      </TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.date}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.time}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.source}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.action}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.trigger}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>{descriptor.context}</TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>
                        {descriptor.iep_goal ? `Goal ${student.iep_goals.findIndex(goal => goal.id === descriptor.iep_goal?.id) + 1}` : 'N/A'}
                      </TableCell>
                      <TableCell style={{ color: descriptor.selected ? 'white' : '#3C3C3C' }}>GCO {descriptor.gco_classification}</TableCell>
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
                backgroundColor: '#e65039',
                color: 'white',
                borderColor: '#e65039'
              }}
            >
              Add New BDs
            </Button>

            <Button
              onClick={handleGenerateReportClick}
              className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
              disabled={isReportPending}
              style={{
                backgroundColor: '#e65039',
                color: 'white',
                borderColor: '#e65039'
              }}
            >
              {isReportPending ? "Generating..." : "Generate Report"}
            </Button>

            <Dialog open={showNoSelectDialog} onOpenChange={setShowNoSelectDialog}>
              <DialogContent
                className="sm:max-w-md rounded-2xl bg-white shadow-lg border border-gray-200 p-6"
              >
                <DialogHeader className="space-y-2">
                  <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <span className="text-yellow-500">
                      ⚠️
                    </span>
                    No Selection
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Please select at least one behaviour descriptor before generating a report.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button
                    onClick={() => setShowNoSelectDialog(false)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg px-4"
                  >
                    Okay
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>
      </div>

      {/* Modals */}
      <AddNewBDModal
        isOpen={showAddBDModal}
        onClose={() => setShowAddBDModal(false)}
        onSubmit={handleBDSubmit}
        iepGoals={student.iep_goals}
        studentId={student.id}
      />

      <SelectBDsModal
        isOpen={showSelectBDsModal}
        onClose={() => setShowSelectBDsModal(false)}
        behaviourDescriptors={behaviourDescriptors ? behaviourDescriptors : []}
        iepBehaviourDescriptors={iepBehaviourDescriptors ? iepBehaviourDescriptors : []}
        onGenerate={handleReportGenerate}
      />

      {/* Filter Modals */}
      <BDsFilterModal
        isOpen={showGCOFilterModal}
        onClose={() => setShowGCOFilterModal(false)}
        onApplyFilters={handleGCOFilterApply}
        onClearFilters={handleGCOFilterClear}
        behaviorDescriptors={behaviourDescriptorsAll || []}
        title="GCO Behaviour Descriptors"
      />

      <BDsFilterModal
        isOpen={showIEPFilterModal}
        onClose={() => setShowIEPFilterModal(false)}
        onApplyFilters={handleIEPFilterApply}
        onClearFilters={handleIEPFilterClear}
        behaviorDescriptors={behaviourDescriptorsAll || []}
        title="IEP Behaviour Descriptors"
      />
    </div>
  );
}