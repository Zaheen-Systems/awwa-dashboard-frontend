import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Plus, Minus } from 'lucide-react';

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

interface IEPGoal {
  id: number;
  text: string;
}

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSubmit: (updatedStudent: Student) => void;
}

export function EditStudentModal({ isOpen, onClose, student, onSubmit }: EditStudentModalProps) {
  const [formData, setFormData] = useState({
    // Populated fields - auto-filled with student data
    name: '',
    chronologicalAge: 0,
    ageBand: '',
    primaryDiagnosis: '',
    secondaryDiagnosis: '',
    // Entered fields - empty for manual input
    lastGCODate: '',
    status: 'Review',
    // Functional age fields - empty for manual selection
    gco1: '',
    gco2: '',
    gco3: ''
  });

  const [iepGoals, setIepGoals] = useState<IEPGoal[]>([
    { id: 1, text: '' } // Start empty for teacher input
  ]);

  // Update form data when student changes or modal opens
  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        // Populated fields - show existing student data
        name: student.name,
        chronologicalAge: student.chronologicalAge,
        ageBand: student.ageBand,
        primaryDiagnosis: student.primaryDiagnosis,
        secondaryDiagnosis: student.secondaryDiagnosis,
        // Entered fields - empty for manual input
        lastGCODate: '',
        status: student.status,
        // Functional age fields - empty for manual selection
        gco1: '',
        gco2: '',
        gco3: ''
      });
      
      // Reset IEP goals to empty for teacher input
      setIepGoals([{ id: 1, text: '' }]);
    }
  }, [student, isOpen]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addIEPGoal = () => {
    const newGoal: IEPGoal = {
      id: Math.max(...iepGoals.map(g => g.id), 0) + 1,
      text: ''
    };
    setIepGoals(prev => [...prev, newGoal]);
  };

  const removeIEPGoal = (id: number) => {
    // Don't allow removing if there's only one goal left
    if (iepGoals.length <= 1) return;
    
    setIepGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const updateIEPGoal = (id: number, text: string) => {
    setIepGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, text } : goal
    ));
  };

  const handleSubmit = () => {
    if (student) {
      const updatedStudent: Student = {
        ...student,
        name: formData.name,
        chronologicalAge: formData.chronologicalAge,
        ageBand: formData.ageBand,
        primaryDiagnosis: formData.primaryDiagnosis,
        secondaryDiagnosis: formData.secondaryDiagnosis,
        lastGCODate: formData.lastGCODate,
        status: formData.status
      };
      onSubmit(updatedStudent);
      onClose();
    }
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#F8F9FA' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#3C3C3C' }}>Edit Student Details</DialogTitle>
          <DialogDescription style={{ color: '#6C757D' }}>
            Update student information including diagnoses, functional age assessments, and IEP goals.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Child Name */}
            <div>
              <Label htmlFor="name" style={{ color: '#3C3C3C' }}>Child name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              />
            </div>

            {/* Functional Age */}
            <div>
              <Label style={{ color: '#3C3C3C' }}>Functional Age</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="gco1" className="text-sm" style={{ color: '#6C757D' }}>GCO 1</Label>
                  <Select value={formData.gco1} onValueChange={(value) => handleInputChange('gco1', value)}>
                    <SelectTrigger className="bg-white border-2" style={{ borderColor: '#BDC3C7' }}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-white border border-gray-200 shadow-lg rounded-md"
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: '#BDC3C7',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <SelectItem value="0-6" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>0 - 6 months</SelectItem>
                      <SelectItem value="7-12" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>7 - 12 months</SelectItem>
                      <SelectItem value="13-18" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>13 - 18 mths</SelectItem>
                      <SelectItem value="19-24" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>19 - 24 mths</SelectItem>
                      <SelectItem value="25-30" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>25 - 30 mths</SelectItem>
                      <SelectItem value="31-36" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>31 - 36 mths</SelectItem>
                      <SelectItem value="37-48" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>37 - 48 mths</SelectItem>
                      <SelectItem value="49-60" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>49 - 60 mths</SelectItem>
                      <SelectItem value="61-72" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>61 - 72 mths</SelectItem>
                      <SelectItem value="73-84" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>73 - 84 mths</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gco2" className="text-sm" style={{ color: '#6C757D' }}>GCO 2</Label>
                  <Select value={formData.gco2} onValueChange={(value) => handleInputChange('gco2', value)}>
                    <SelectTrigger className="bg-white border-2" style={{ borderColor: '#BDC3C7' }}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-white border border-gray-200 shadow-lg rounded-md"
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: '#BDC3C7',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <SelectItem value="0-6" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>0 - 6 months</SelectItem>
                      <SelectItem value="7-12" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>7 - 12 months</SelectItem>
                      <SelectItem value="13-18" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>13 - 18 mths</SelectItem>
                      <SelectItem value="19-24" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>19 - 24 mths</SelectItem>
                      <SelectItem value="25-30" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>25 - 30 mths</SelectItem>
                      <SelectItem value="31-36" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>31 - 36 mths</SelectItem>
                      <SelectItem value="37-48" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>37 - 48 mths</SelectItem>
                      <SelectItem value="49-60" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>49 - 60 mths</SelectItem>
                      <SelectItem value="61-72" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>61 - 72 mths</SelectItem>
                      <SelectItem value="73-84" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>73 - 84 mths</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gco3" className="text-sm" style={{ color: '#6C757D' }}>GCO 3</Label>
                  <Select value={formData.gco3} onValueChange={(value) => handleInputChange('gco3', value)}>
                    <SelectTrigger className="bg-white border-2" style={{ borderColor: '#BDC3C7' }}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-white border border-gray-200 shadow-lg rounded-md"
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: '#BDC3C7',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <SelectItem value="0-6" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>0 - 6 months</SelectItem>
                      <SelectItem value="7-12" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>7 - 12 months</SelectItem>
                      <SelectItem value="13-18" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>13 - 18 mths</SelectItem>
                      <SelectItem value="19-24" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>19 - 24 mths</SelectItem>
                      <SelectItem value="25-30" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>25 - 30 mths</SelectItem>
                      <SelectItem value="31-36" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>31 - 36 mths</SelectItem>
                      <SelectItem value="37-48" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>37 - 48 mths</SelectItem>
                      <SelectItem value="49-60" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>49 - 60 mths</SelectItem>
                      <SelectItem value="61-72" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>61 - 72 mths</SelectItem>
                      <SelectItem value="73-84" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>73 - 84 mths</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Primary Diagnosis */}
            <div>
              <Label htmlFor="primaryDiagnosis" style={{ color: '#3C3C3C' }}>Primary Diagnosis</Label>
              <Input
                id="primaryDiagnosis"
                value={formData.primaryDiagnosis}
                onChange={(e) => handleInputChange('primaryDiagnosis', e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              />
            </div>

            {/* Secondary Diagnosis */}
            <div>
              <Label htmlFor="secondaryDiagnosis" style={{ color: '#3C3C3C' }}>Secondary Diagnosis</Label>
              <Input
                id="secondaryDiagnosis"
                value={formData.secondaryDiagnosis}
                onChange={(e) => handleInputChange('secondaryDiagnosis', e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              />
            </div>

            {/* Date of last GCO */}
            <div>
              <Label htmlFor="lastGCODate" style={{ color: '#3C3C3C' }}>Date of last GCO</Label>
              <Input
                id="lastGCODate"
                type="date"
                value={formData.lastGCODate}
                onChange={(e) => handleInputChange('lastGCODate', e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                placeholder="Select date..."
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Chronological Age */}
            <div>
              <Label htmlFor="chronologicalAge" style={{ color: '#3C3C3C' }}>Chronological age (months)</Label>
              <Input
                id="chronologicalAge"
                type="number"
                value={formData.chronologicalAge}
                onChange={(e) => handleInputChange('chronologicalAge', parseInt(e.target.value) || 0)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                min="0"
                max="1000"
              />
            </div>

            {/* Age Band */}
            <div>
              <Label htmlFor="ageBand" style={{ color: '#3C3C3C' }}>Age band (months)</Label>
              <Input
                id="ageBand"
                value={formData.ageBand}
                onChange={(e) => handleInputChange('ageBand', e.target.value)}
                className="bg-white border-2 focus:outline-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e65039'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                placeholder="e.g., 20-24"
              />
            </div>

            {/* Entry/Review/Exit */}
            <div>
              <Label htmlFor="status" style={{ color: '#3C3C3C' }}>Entry / Review / Exit</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-white border-2" style={{ borderColor: '#BDC3C7' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white border border-gray-200 shadow-lg rounded-md"
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: '#BDC3C7',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  <SelectItem value="Entry" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Entry</SelectItem>
                  <SelectItem value="Review" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Review</SelectItem>
                  <SelectItem value="Exit" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Exit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* IEP Goals */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label style={{ color: '#3C3C3C' }}>IEP goals</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    onClick={addIEPGoal}
                    className="p-2 border-2 transition-all duration-200 hover:opacity-80"
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: '#e65039',
                      color: '#e65039'
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => iepGoals.length > 0 && removeIEPGoal(iepGoals[iepGoals.length - 1].id)}
                    disabled={iepGoals.length <= 1}
                    className="p-2 border-2 transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: iepGoals.length <= 1 ? '#BDC3C7' : '#e65039',
                      color: iepGoals.length <= 1 ? '#BDC3C7' : '#e65039'
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {iepGoals.map((goal, index) => (
                  <div key={goal.id}>
                    <Label className="text-sm" style={{ color: '#6C757D' }}>
                      Goal {index + 1}:
                    </Label>
                    <Textarea
                      value={goal.text}
                      onChange={(e) => updateIEPGoal(goal.id, e.target.value)}
                      className="bg-white border-2 min-h-[60px] focus:outline-none"
                      style={{ 
                        borderColor: '#BDC3C7',
                        color: '#3C3C3C'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#e65039'}
                      onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                      placeholder="Enter goal description..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-4">
          <Button
            onClick={onClose}
            className="px-12 py-3 border-2 rounded-none font-bold transition-all duration-200 hover:opacity-90"
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
            className="px-12 py-3 border-2 rounded-none font-bold transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: '#e65039', 
              color: 'white',
              borderColor: '#e65039'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d1452e';
              e.currentTarget.style.borderColor = '#d1452e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e65039';
              e.currentTarget.style.borderColor = '#e65039';
            }}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}