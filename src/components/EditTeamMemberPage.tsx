import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
// import userIconImage from 'figma:asset/175b30eba12976a029330759350f9c338ba2c59d.png';

interface TeamMember {
  id: number;
  name: string;
  age: number;
  gender: string;
  idNumber: string;
  specialization: string;
  dateOfJoining: string;
  class: string;
  role: string;
  email?: string;
  dob?: string;
  photoUrl?: string;
}

interface EditTeamMemberPageProps {
  teamMember: TeamMember;
  onBack: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onSave: (updatedMember: TeamMember) => void;
  onDashboardClick?: () => void;
  onTeamMembersClick?: () => void;
  onClientClick?: () => void;
}

export function EditTeamMemberPage({ 
  teamMember, 
  onBack, 
  onLogout, 
  onProfileClick, 
  onSave,
  onDashboardClick,
  onTeamMembersClick,
  onClientClick
}: EditTeamMemberPageProps) {
  const [formData, setFormData] = useState<TeamMember>({
    ...teamMember,
    email: teamMember.email || '',
    dob: teamMember.dob || '',
    dateOfJoining: teamMember.dateOfJoining || new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field: keyof TeamMember, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleResetPassword = () => {
    // In a real implementation, this would trigger a password reset
    console.log('Password reset requested for:', formData.name);
  };

  const handlePhotoUpload = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real implementation, you would upload the file to a server
        // For now, we'll create a temporary URL
        const photoUrl = URL.createObjectURL(file);
        handleInputChange('photoUrl', photoUrl);
        console.log('Photo uploaded:', file.name);
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const isNewMember = !teamMember.name || teamMember.id === Date.now() || teamMember.name === '';

  return (
    <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white px-4 py-2 border" style={{ borderColor: '#2C5F7C' }}>
            <h2 className="text-lg font-bold" style={{ color: '#3C3C3C' }}>
              {isNewMember ? 'Add New Team member / CT' : 'Edit Team member / CT'}
            </h2>
          </div>
          
          <Button
            onClick={onBack}
            className="px-6 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: '#2C5F7C',
              color: 'white',
              border: 'none'
            }}
          >
            Back
          </Button>
        </div>

        {/* Edit Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                    required
                  />
                </div>

                {/* DOB */}
                <div>
                  <Label htmlFor="dob" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    DOB
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                {/* Specialisation */}
                <div>
                  <Label htmlFor="specialization" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Specialisation
                  </Label>
                  <Input
                    id="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Role */}
                <div>
                  <Label htmlFor="role" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Role
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className="w-full border-2 rounded-none" style={{ borderColor: '#BDC3C7' }}>
                      <SelectValue placeholder="Team member" />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-white border border-gray-200 shadow-lg rounded-md"
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: '#BDC3C7',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <SelectItem value="Team member" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Team member</SelectItem>
                      <SelectItem value="CT" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>CT</SelectItem>
                      <SelectItem value="Team member/ CT" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Team member/ CT</SelectItem>
                      <SelectItem value="Senior Team member" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Senior Team member</SelectItem>
                      <SelectItem value="Lead CT" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Lead CT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div>
                  <Label htmlFor="gender" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Gender
                  </Label>
                  <Input
                    id="gender"
                    type="text"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Classes */}
                <div>
                  <Label htmlFor="class" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Classes
                  </Label>
                  <Input
                    id="class"
                    type="text"
                    value={formData.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Date of joining */}
                <div>
                  <Label htmlFor="dateOfJoining" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Date of joining
                  </Label>
                  <Input
                    id="dateOfJoining"
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>
              </div>
            </div>

            {/* Photo Section */}
            <div className="flex flex-col items-center space-y-4 py-6">
              {/* Profile Image Display */}
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2" style={{ borderColor: '#BDC3C7' }}>
                {formData.photoUrl ? (
                  <img 
                    src={formData.photoUrl} 
                    alt={`${formData.name}'s photo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageWithFallback
                    src="/placeholder-user.png"
                    alt="Default user icon"
                    className="w-8 h-8"
                  />
                )}
              </div>
              
              {/* Change Photo Button */}
              <button
                type="button"
                onClick={handlePhotoUpload}
                className="flex items-center space-x-2 px-4 py-2 border-2 rounded-lg transition-all duration-200 hover:bg-blue-50"
                style={{ 
                  borderColor: '#4EAAC9',
                  color: '#4EAAC9',
                  backgroundColor: 'white'
                }}
              >
                <Upload className="w-4 h-4" />
                <span>Change photo</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                type="button"
                onClick={handleResetPassword}
                className="w-full border-2 px-4 py-3 rounded-none transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#BDC3C7',
                  color: '#3C3C3C'
                }}
              >
                Reset Password
              </Button>
              
              <Button
                type="submit"
                className="w-full px-4 py-3 rounded-none transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: '#2C5F7C',
                  color: 'white',
                  border: 'none'
                }}
              >
                {isNewMember ? 'Create' : 'Update'}
              </Button>
            </div>

            {/* Admin Note */}
            <div className="mt-6 pt-4">
              <div className="bg-yellow-100 px-4 py-3 border-l-4 rounded-r" style={{ borderColor: '#FF8C42' }}>
                <p className="text-sm" style={{ color: '#3C3C3C' }}>
                  ⚠️ Admin can reset the password of team members
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}