import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {  ChevronLeft } from 'lucide-react';

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

interface Comment {
  id: number;
  text: string;
  author: string;
  authorType: 'team_member' | 'ct';
  timestamp: string;
}

interface BehaviorDescriptorDetailPageProps {
  student: Student;
  behaviorDescriptor: BehaviorDescriptor;
  currentUser: {
    name: string;
    type: 'team_member' | 'ct';
  };
  existingComments?: Comment[];
  onBack: () => void;
  onSave: (comments: Comment[]) => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

export function BehaviorDescriptorDetailPage({ 
  student, 
  behaviorDescriptor, 
  currentUser,
  existingComments = [],
  onBack, 
  onSave, 
  
}: BehaviorDescriptorDetailPageProps) {
  const [newComment, setNewComment] = useState('');
  const [allComments, setAllComments] = useState<Comment[]>(existingComments);

  const handleSave = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        text: newComment.trim(),
        author: currentUser.name,
        authorType: currentUser.type,
        timestamp: new Date().toISOString()
      };
      
      const updatedComments = [...allComments, comment];
      setAllComments(updatedComments);
      onSave(updatedComments);
      setNewComment('');
    }
  };

  const getAuthorDisplayName = (author: string, authorType: 'team_member' | 'ct') => {
    return authorType === 'ct' ? `${author} (CT)` : author;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8" style={{ backgroundColor: '#E8F4F8' }}>
        <div className="max-w-7xl mx-auto">
          {/* Tabs Row */}
          <div className="flex space-x-2 sm:space-x-4">
            <div 
              className="px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 transition-all duration-200"
              style={{ 
                borderColor: '#2C5F7C',
                color: 'white',
                backgroundColor: '#2C5F7C'
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
        <div className="max-w-4xl mx-auto">
          {/* Video Player Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="aspect-video bg-black flex items-center justify-center">
              <div className="text-white text-lg">Video Player</div>
            </div>
          </div>

          {/* Behavior Descriptor Info Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-6">
            <h3 className="font-bold mb-4" style={{ color: '#3C3C3C' }}>
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
            
            {/* Existing Comments */}
            {allComments.length > 0 && (
              <div className="mb-6 space-y-4">
                {allComments.map((comment) => (
                  <div key={comment.id} className="p-4 border-2 rounded-lg" style={{ borderColor: '#E8F4F8', backgroundColor: '#F8F9FA' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm" style={{ color: '#2C5F7C' }}>
                        {getAuthorDisplayName(comment.author, comment.authorType)}
                      </span>
                      <span className="text-xs" style={{ color: '#6C757D' }}>
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: '#3C3C3C' }}>{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add New Comment */}
            <div className="mb-6">
              <Label htmlFor="newComment" style={{ color: '#3C3C3C' }}>
                Add your comments
              </Label>
              <Textarea
                id="newComment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
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
                disabled={!newComment.trim()}
                className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                style={{ 
                  backgroundColor: newComment.trim() ? '#2C5F7C' : '#BDC3C7', 
                  color: 'white',
                  borderColor: newComment.trim() ? '#2C5F7C' : '#BDC3C7'
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