import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { User, ChevronLeft, Settings, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ImageWithFallback } from './figma/ImageWithFallback';
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

interface BehaviorDescriptorDetailPageProps {
  student: Student;
  behaviorDescriptor: BehaviorDescriptor;
  onBack: () => void;
  onSave: (comments: string) => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

export function BehaviorDescriptorDetailPage({ 
  student, 
  behaviorDescriptor, 
  onBack, 
  onSave, 
  onLogout,
  onProfileClick 
}: BehaviorDescriptorDetailPageProps) {
  const [comments, setComments] = useState('');

  const handleSave = () => {
    onSave(comments);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8" style={{ backgroundColor: '#E8F4F8' }}>
        <div className="max-w-7xl mx-auto">
          {/* Tabs and Back Button Row */}
          <div className="flex items-center justify-between">
            {/* Left: Inactive Tabs */}
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

      {/* Breadcrumb Navigation */}
      <div className="px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto">
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Video Player Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="aspect-video bg-black flex items-center justify-center">
              <div className="text-white text-lg">Video Player</div>
            </div>
          </div>

          {/* Behavior Descriptor Info Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-6">
            <h3 className="font-medium mb-4" style={{ color: '#3C3C3C' }}>
              Behavior Descriptor Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-3">
                  <strong style={{ color: '#3C3C3C' }}>Date:</strong>
                  <span className="ml-2" style={{ color: '#3C3C3C' }}>{behaviorDescriptor.date}</span>
                </div>
                <div className="mb-3">
                  <strong style={{ color: '#3C3C3C' }}>Time:</strong>
                  <span className="ml-2" style={{ color: '#3C3C3C' }}>{behaviorDescriptor.time}</span>
                </div>
                <div className="mb-3">
                  <strong style={{ color: '#3C3C3C' }}>Source:</strong>
                  <span className="ml-2" style={{ color: '#3C3C3C' }}>{behaviorDescriptor.source}</span>
                </div>
                <div className="mb-3">
                  <strong style={{ color: '#3C3C3C' }}>GCO:</strong>
                  <span className="ml-2" style={{ color: '#3C3C3C' }}>{behaviorDescriptor.gco}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <strong style={{ color: '#3C3C3C' }}>Action:</strong>
                  <div className="mt-1" style={{ color: '#3C3C3C' }}>{behaviorDescriptor.action}</div>
                </div>
                <div className="mb-3">
                  <strong style={{ color: '#3C3C3C' }}>Trigger:</strong>
                  <div className="mt-1" style={{ color: '#3C3C3C' }}>{behaviorDescriptor.trigger}</div>
                </div>
                <div className="mb-3">
                  <strong style={{ color: '#3C3C3C' }}>Context:</strong>
                  <div className="mt-1" style={{ color: '#3C3C3C' }}>{behaviorDescriptor.context}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
            <h3 className="font-medium mb-4" style={{ color: '#3C3C3C' }}>
              Comments
            </h3>
            
            <div className="mb-6">
              <Label htmlFor="comments" style={{ color: '#3C3C3C' }}>
                Add your comments
              </Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter your observations and comments about this behavior descriptor..."
                className="mt-2 min-h-32 bg-white border-2 focus:outline-none resize-none"
                style={{ 
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
                onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={onBack}
                className="px-6 py-2 font-medium border-2 transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: '#2C5F7C', 
                  color: 'white',
                  borderColor: '#2C5F7C'
                }}
              >
                Save Comments
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}