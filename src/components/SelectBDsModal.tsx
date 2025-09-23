import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';


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
  gco_id: string;
  created_at: string;
  iepGoal?: IEPGoalBasic;
}

interface BehavioralDescriptorUI extends BehaviorDescriptor {
  selected: boolean;
  date: string;
  time: string;
}

interface SelectBDsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (selectedBDs: BehaviorDescriptor[]) => void;
  behaviourDescriptors: BehavioralDescriptorUI[];
  iepBehaviourDescriptors: BehaviorDescriptor[];
}

export function SelectBDsModal({ 
  isOpen, 
  onClose, 
  onGenerate, 
  behaviourDescriptors,
  iepBehaviourDescriptors 
}: SelectBDsModalProps) {
  const [selectedGCOBDs, setSelectedGCOBDs] = useState<BehaviorDescriptor[]>([]);
  const [selectedIEPBDs, setSelectedIEPBDs] = useState<BehaviorDescriptor[]>([]);

  // Check for already selected BDs when modal opens
  useEffect(() => {
    if (isOpen) {
      // Get already selected BDs from both tables
      const alreadySelectedGCO = behaviourDescriptors.filter(bd => bd.selected);
      const alreadySelectedIEP = iepBehaviourDescriptors.filter(bd => bd.selected);
      
      // If there are already selected BDs, automatically generate report
      if (alreadySelectedGCO.length > 0 || alreadySelectedIEP.length > 0) {
        const allSelectedBDs = [...alreadySelectedGCO, ...alreadySelectedIEP];
        onGenerate(allSelectedBDs);
        onClose();
        return;
      }
      
      // If no BDs are selected, reset selections for modal
      setSelectedGCOBDs([]);
      setSelectedIEPBDs([]);
    }
  }, [isOpen, behaviourDescriptors, iepBehaviourDescriptors, onGenerate, onClose]);

  const handleGCOBDSelect = (bd: BehaviorDescriptor, selected: boolean) => {
    if (selected) {
      setSelectedGCOBDs(prev => [...prev, bd]);
    } else {
      setSelectedGCOBDs(prev => prev.filter(item => item.id !== bd.id));
    }
  };

  const handleIEPBDSelect = (bd: BehaviorDescriptor, selected: boolean) => {
    if (selected) {
      setSelectedIEPBDs(prev => [...prev, bd]);
    } else {
      setSelectedIEPBDs(prev => prev.filter(item => item.id !== bd.id));
    }
  };

  const isGCOBDSelected = (bd: BehaviorDescriptor) => {
    return selectedGCOBDs.some(item => item.id === bd.id);
  };

  const isIEPBDSelected = (bd: BehaviorDescriptor) => {
    return selectedIEPBDs.some(item => item.id === bd.id);
  };

  const handleGenerate = () => {
    const allSelectedBDs = [...selectedGCOBDs, ...selectedIEPBDs];
    onGenerate(allSelectedBDs);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const totalSelected = selectedGCOBDs.length + selectedIEPBDs.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[98vw] w-full max-h-[95vh] overflow-y-auto sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] xl:max-w-[75vw]"
        style={{ backgroundColor: 'white' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#3C3C3C' }}>Select BDs to Export</DialogTitle>
          <DialogDescription style={{ color: '#6C757D' }}>
            Choose which behavior descriptors to include in your report.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* GCO Behavior Descriptors */}
          <div>
            <h3 className="font-medium mb-4" style={{ color: '#3C3C3C' }}>
              Behaviour descriptors for GCO ({selectedGCOBDs.length} selected)
            </h3>
            <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#BDC3C7' }}>
              <div className="overflow-x-auto min-w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b-2" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                      <TableHead className="w-16 min-w-16" style={{ color: '#3C3C3C' }}>Select</TableHead>
                      <TableHead className="w-24 min-w-24" style={{ color: '#3C3C3C' }}>Date</TableHead>
                      <TableHead className="w-20 min-w-20" style={{ color: '#3C3C3C' }}>Time</TableHead>
                      <TableHead className="w-32 min-w-32" style={{ color: '#3C3C3C' }}>Source</TableHead>
                      <TableHead className="w-64 min-w-64" style={{ color: '#3C3C3C' }}>Action</TableHead>
                      <TableHead className="w-64 min-w-64" style={{ color: '#3C3C3C' }}>Trigger</TableHead>
                      <TableHead className="w-48 min-w-48" style={{ color: '#3C3C3C' }}>Context</TableHead>
                      <TableHead className="w-20 min-w-20" style={{ color: '#3C3C3C' }}>GCO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {behaviourDescriptors.map((descriptor, index) => {
                      const isSelected = isGCOBDSelected(descriptor);
                      return (
                        <TableRow 
                          key={descriptor.id} 
                          className={index < behaviourDescriptors.length - 1 ? "border-b" : ""} 
                          style={{ 
                            borderColor: '#BDC3C7',
                            backgroundColor: isSelected ? '#4EAAC9' : 'transparent'
                          }}
                        >
                          <TableCell className="text-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleGCOBDSelect(descriptor, checked as boolean)}
                              className="border-2"
                              style={{ 
                                borderColor: isSelected ? '#e65039' : '#BDC3C7',
                                backgroundColor: isSelected ? '#e65039' : 'transparent'
                              }}
                            />
                          </TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }}>{descriptor.date}</TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }}>{descriptor.time}</TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }}>{descriptor.source}</TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }} className="max-w-64 truncate">
                            <div title={descriptor.action}>{descriptor.action}</div>
                          </TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }} className="max-w-64 truncate">
                            <div title={descriptor.trigger}>{descriptor.trigger}</div>
                          </TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }} className="max-w-48 truncate">
                            <div title={descriptor.context}>{descriptor.context}</div>
                          </TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }}>{descriptor.gco_id}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* IEP Behavior Descriptors */}
          <div>
            <h3 className="font-medium mb-4" style={{ color: '#3C3C3C' }}>
              Behaviour descriptors for IEP ({selectedIEPBDs.length} selected)
            </h3>
            <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#BDC3C7' }}>
              <div className="overflow-x-auto min-w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b-2" style={{ borderColor: '#BDC3C7', backgroundColor: '#F8F9FA' }}>
                      <TableHead className="w-16 min-w-16" style={{ color: '#3C3C3C' }}>Select</TableHead>
                      <TableHead className="w-24 min-w-24" style={{ color: '#3C3C3C' }}>Date</TableHead>
                      <TableHead className="w-20 min-w-20" style={{ color: '#3C3C3C' }}>Time</TableHead>
                      <TableHead className="w-32 min-w-32" style={{ color: '#3C3C3C' }}>Source</TableHead>
                      <TableHead className="w-56 min-w-56" style={{ color: '#3C3C3C' }}>Action</TableHead>
                      <TableHead className="w-56 min-w-56" style={{ color: '#3C3C3C' }}>Trigger</TableHead>
                      <TableHead className="w-40 min-w-40" style={{ color: '#3C3C3C' }}>Context</TableHead>
                      <TableHead className="w-32 min-w-32" style={{ color: '#3C3C3C' }}>IEP Goal</TableHead>
                      <TableHead className="w-20 min-w-20" style={{ color: '#3C3C3C' }}>GCO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {iepBehaviourDescriptors.map((descriptor, index) => {
                      const isSelected = isIEPBDSelected(descriptor);
                      return (
                        <TableRow 
                          key={descriptor.id} 
                          className={index < iepBehaviourDescriptors.length - 1 ? "border-b" : ""} 
                          style={{ 
                            borderColor: '#BDC3C7',
                            backgroundColor: isSelected ? '#e65039' : 'transparent'
                          }}
                        >
                          <TableCell className="text-center">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleIEPBDSelect(descriptor, checked as boolean)}
                              className="border-2"
                              style={{ 
                                borderColor: isSelected ? '#e65039' : '#BDC3C7',
                                backgroundColor: isSelected ? '#e65039' : 'transparent'
                              }}
                            />
                          </TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }}>{descriptor.date}</TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }}>{descriptor.time}</TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }}>{descriptor.source}</TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }} className="max-w-56 truncate">
                            <div title={descriptor.action}>{descriptor.action}</div>
                          </TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }} className="max-w-56 truncate">
                            <div title={descriptor.trigger}>{descriptor.trigger}</div>
                          </TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }} className="max-w-40 truncate">
                            <div title={descriptor.context}>{descriptor.context}</div>
                          </TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }}>{descriptor.iepGoal?.description}</TableCell>
                          <TableCell style={{ color: isSelected ? 'white' : '#3C3C3C' }}>{descriptor.iepGoal?.gco}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-4">
          <Button
            onClick={handleCancel}
            className="px-8 py-2 font-medium border-2 transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#BDC3C7',
              color: '#3C3C3C'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={totalSelected === 0}
            className="px-8 py-2 font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ 
              backgroundColor: totalSelected > 0 ? '#e65039' : '#BDC3C7', 
              color: 'white',
              borderColor: totalSelected > 0 ? '#e65039' : '#BDC3C7'
            }}
          >
            Generate ({totalSelected} selected)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}