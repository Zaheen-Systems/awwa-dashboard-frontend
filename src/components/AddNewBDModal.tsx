import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface AddNewBDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bdData: BDFormData) => void;
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

const mockGCOOptions = [
  "GCO 1.1.1",
  "GCO 1.1.2",
  "GCO 1.1.3",
  "GCO 1.2.1",
  "GCO 1.2.2",
  "GCO 1.3.1",
  "GCO 1.3.2",
  "GCO 2.1.1",
  "GCO 2.1.2",
  "GCO 2.2.1",
  "GCO 2.3.1",
  "GCO 3.1.1",
  "GCO 3.1.2",
  "GCO 3.2.1"
];

const mockIEPGoals = [
  "blank",
  "Goal 1: Will participate in Play Time in EC",
  "Goal 2: Will communicate basic needs verbally",
  "Goal 3: Will follow simple two-step instructions",
  "Goal 4: Will demonstrate appropriate social interaction"
];

export function AddNewBDModal({ isOpen, onClose, onSubmit }: AddNewBDModalProps) {
  const [formData, setFormData] = useState<BDFormData>({
    date: '',
    action: '',
    trigger: '',
    source: '',
    time: '',
    staff: 'Ms. Arya Stark', // Prefilled with current user name
    gcoClassification: '',
    iepGoal: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: '',
        action: '',
        trigger: '',
        source: '',
        time: '',
        staff: 'Ms. Arya Stark',
        gcoClassification: '',
        iepGoal: ''
      });
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof BDFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Convert "blank" back to empty string for IEP goal if needed
    const submissionData = {
      ...formData,
      iepGoal: formData.iepGoal === 'blank' ? '' : formData.iepGoal
    };
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
                onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
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
                onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
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
                onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
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
                onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
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
                onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
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
                onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
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
                <SelectContent>
                  {mockGCOOptions.map((gco, index) => (
                    <SelectItem key={index} value={gco}>{gco}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* IEP Goals */}
            <div>
              <Label htmlFor="iepGoal" style={{ color: '#3C3C3C' }}>IEP Goals</Label>
              <Select value={formData.iepGoal} onValueChange={(value) => handleInputChange('iepGoal', value)}>
                <SelectTrigger className="bg-white border-2" style={{ borderColor: '#BDC3C7' }}>
                  <SelectValue placeholder="Drop down with all IEP goals, include blank" />
                </SelectTrigger>
                <SelectContent>
                  {mockIEPGoals.map((goal, index) => (
                    <SelectItem key={index} value={goal}>
                      {goal === 'blank' ? '(Blank)' : goal}
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
              backgroundColor: '#2C5F7C', 
              color: 'white',
              borderColor: '#2C5F7C'
            }}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}