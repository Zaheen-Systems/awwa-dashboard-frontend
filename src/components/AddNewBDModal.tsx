import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import api from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

interface IEPGoalBasic {
  id: number;
  description?: string | null;
  gco?: string | null;    // will become boolean later
}

interface AddNewBDModalProps {
  studentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bdData: BDFormData) => void;
  iepGoals: IEPGoalBasic[];
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

export function AddNewBDModal({ isOpen, onClose, onSubmit, iepGoals, studentId }: AddNewBDModalProps) {
  const name = localStorage.getItem("name")
  const [formData, setFormData] = useState<BDFormData>({
    date: '',
    action: '',
    trigger: '',
    source: '',
    time: '',
    staff: name? name: "", // Prefilled with current user name
    gcoClassification: '',
    iep_goal_id: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const name = localStorage.getItem("name")
      setFormData({
        date: '',
        action: '',
        trigger: '',
        source: '',
        time: '',
        staff: name? name: "",
        gcoClassification: '',
        iep_goal_id: ''
      });
    }
  }, [isOpen]);

  const fetchIds = async (): Promise<string[]> => {
    const res = await api.get<string[]>(`/api/students/${studentId}/gcos`); // adjust URL to your API route
    return res.data;
  };

  const { data: gcoIds } = useQuery({
    queryKey: ["gcoIds"],
    queryFn: fetchIds,
  });

  const handleInputChange = (field: keyof BDFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Convert "blank" back to empty string for IEP goal if needed
    if (!formData.gcoClassification.trim()) {
      setError("GCO classification is required.");
      return;
    }

    setError(null); // clear error if everything is fine
    const submissionData = {
      ...formData,
      iepGoal: formData.iep_goal_id === 'blank' ? '' : formData.iep_goal_id
    };
    console.log(submissionData)
    onSubmit(submissionData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'white' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#3C3C3C' }}>Add New Behavior Descriptor</DialogTitle>
          <DialogDescription style={{ color: '#6C757D' }}>
            Fill in the details for the new behavior descriptor entry.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Date */}
            <div>
              <Label htmlFor="date" style={{ color: '#3C3C3C' }}>Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              />
            </div>

            {/* Action */}
            <div>
              <Label htmlFor="action" style={{ color: '#3C3C3C' }}>Action</Label>
              <Textarea
                id="action"
                value={formData.action}
                onChange={(e) => handleInputChange('action', e.target.value)}
                className="bg-white border-2 focus:outline-none min-h-[60px] resize-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                placeholder="Describe the action observed..."
              />
            </div>

            {/* Trigger */}
            <div>
              <Label htmlFor="trigger" style={{ color: '#3C3C3C' }}>Trigger</Label>
              <Textarea
                id="trigger"
                value={formData.trigger}
                onChange={(e) => handleInputChange('trigger', e.target.value)}
                className="bg-white border-2 focus:outline-none min-h-[60px] resize-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                placeholder="What triggered this behavior..."
              />
            </div>

            {/* Source */}
            <div>
              <Label htmlFor="source" style={{ color: '#3C3C3C' }}>Source</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                placeholder="e.g., Snack time, Free play..."
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Time */}
            <div>
              <Label htmlFor="time" style={{ color: '#3C3C3C' }}>Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              />
              <p className="text-sm mt-1" style={{ color: '#6C757D' }}>Not mandatory</p>
            </div>

            {/* Staff */}
            <div>
              <Label htmlFor="staff" style={{ color: '#3C3C3C' }}>Staff</Label>
              <Input
                id="staff"
                value={formData.staff}
                onChange={(e) => handleInputChange('staff', e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                readOnly
              />
              <p className="text-sm mt-1" style={{ color: '#6C757D' }}>Prefilled with name</p>
            </div>

            {/* GCO Classification */}
            <div>
              <Label htmlFor="gcoClassification" style={{ color: '#3C3C3C' }}>GCO classification</Label>
              <Select value={formData.gcoClassification} onValueChange={(value) => handleInputChange('gcoClassification', value)}>
                <SelectTrigger className="bg-white border-2" style={{ borderColor: '#BDC3C7' }}>
                  <SelectValue placeholder="Drop down with all GCOs" />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white border border-gray-200 shadow-lg rounded-md max-h-60 overflow-y-auto"
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: '#BDC3C7',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  position="popper"
                  side="bottom"
                  align="start"
                >
                  {gcoIds?.map((gco, index) => (
                    <SelectItem 
                      key={index} 
                      value={gco}
                      className="hover:bg-gray-100 focus:bg-gray-100"
                      style={{ color: '#3C3C3C' }}
                    >
                      {gco}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && (
                <p className="text-sm mt-1 text-red-500">{error}</p>
              )}
            </div>

            {/* IEP Goals */}
            <div>
              <Label htmlFor="iepGoal" style={{ color: '#3C3C3C' }}>IEP Goals</Label>
              <Select value={formData.iep_goal_id} onValueChange={(value) => handleInputChange('iep_goal_id', value)}>
                <SelectTrigger className="bg-white border-2" style={{ borderColor: '#BDC3C7' }}>
                  <SelectValue placeholder="Drop down with all IEP goals, include blank" />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white border border-gray-200 shadow-lg rounded-md"
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: '#BDC3C7',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  position="popper"
                  side="bottom"
                  align="start"
                >
                  {iepGoals?.map((goal, index) => (
                    <SelectItem 
                      key={index} 
                      value={goal.id.toString()}
                      className="hover:bg-gray-100 focus:bg-gray-100"
                      style={{ color: '#3C3C3C' }}
                    >
                      {goal.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            onClick={handleSubmit}
            className="px-8 py-2 font-medium transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: '#e65039', 
              color: 'white',
              borderColor: '#e65039'
            }}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}