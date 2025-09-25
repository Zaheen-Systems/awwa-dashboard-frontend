import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: ClassFormData) => void;
}

interface ClassFormData {
  className: string;
  days: string;
  classTimings: string;
}

export function AddClassModal({ isOpen, onClose, onSubmit }: AddClassModalProps) {
  const [formData, setFormData] = useState<ClassFormData>({
    className: '',
    days: '',
    classTimings: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        className: '',
        days: '',
        classTimings: ''
      });
      setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof ClassFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.className.trim()) {
      setError("Class name is required.");
      return;
    }
    if (!formData.days.trim()) {
      setError("Days is required.");
      return;
    }
    if (!formData.classTimings.trim()) {
      setError("Class timings is required.");
      return;
    }

    setError(null);
    onSubmit(formData);
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
          <DialogTitle style={{ color: '#3C3C3C' }}>Add New Class</DialogTitle>
          <DialogDescription style={{ color: '#6C757D' }}>
            Fill in the details for the new class.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Class Name */}
          <div>
            <Label htmlFor="className" style={{ color: '#3C3C3C' }}>Class Name</Label>
            <Input
              id="className"
              type="text"
              value={formData.className}
              onChange={(e) => handleInputChange('className', e.target.value)}
              className="bg-white border-2 focus:outline-none"
              style={{ 
                borderColor: '#BDC3C7',
                color: '#3C3C3C'
              }}
              onFocus={(e) => e.target.style.borderColor = '#e65039'}
              onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              placeholder="Enter class name..."
            />
          </div>

          {/* Days */}
          <div>
            <Label htmlFor="days" style={{ color: '#3C3C3C' }}>Days</Label>
            <Input
              id="days"
              type="text"
              value={formData.days}
              onChange={(e) => handleInputChange('days', e.target.value)}
              className="bg-white border-2 focus:outline-none"
              style={{ 
                borderColor: '#BDC3C7',
                color: '#3C3C3C'
              }}
              onFocus={(e) => e.target.style.borderColor = '#e65039'}
              onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              placeholder="e.g., Monday, Wednesday, Friday"
            />
          </div>

          {/* Class Timings */}
          <div>
            <Label htmlFor="classTimings" style={{ color: '#3C3C3C' }}>Class Timings</Label>
            <Input
              id="classTimings"
              type="text"
              value={formData.classTimings}
              onChange={(e) => handleInputChange('classTimings', e.target.value)}
              className="bg-white border-2 focus:outline-none"
              style={{ 
                borderColor: '#BDC3C7',
                color: '#3C3C3C'
              }}
              onFocus={(e) => e.target.style.borderColor = '#e65039'}
              onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              placeholder="e.g., 9:00 AM - 11:00 AM"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          )}
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
            Add Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
