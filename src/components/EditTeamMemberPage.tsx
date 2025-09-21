import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, User } from 'lucide-react';
import { TeamMember } from '../types/users';
import { useCreateUser, useUpdateUser } from '../hooks/useUsers';
// import userIconImage from 'figma:asset/175b30eba12976a029330759350f9c338ba2c59d.png';

interface EditTeamMemberPageProps {
  teamMember: TeamMember;
  onBack: () => void;
  onSave: (updatedMember: TeamMember) => void;
}

export function EditTeamMemberPage({ 
  teamMember, 
  onBack, 
  onSave
}: EditTeamMemberPageProps) {
  const [formData, setFormData] = useState<TeamMember>({
    ...teamMember,
    email: teamMember.email || '',
    dob: teamMember.dob || '',
  });

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  // Available classes for assignment (should come from backend in real app)
  const availableClasses: string[] = [
    'Class 1',
  ];

  const handleInputChange = (field: keyof TeamMember, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    if (formData.id) {
      updateUser.mutate(
        { id: formData.id, data: formData },
        { onSuccess: () => onSave(formData) }
      );
    } else {
      createUser.mutate(formData, { onSuccess: () => onSave(formData) });
    }
    onSave(formData);
  };

  const handleResetPassword = () => {
    // In a real implementation, this would trigger a password reset
    console.log('Password reset requested for:', formData.first_name);
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
        // handleInputChange('photo', photoUrl);
        console.log('Photo uploaded:', file.name, photoUrl);
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const isNewMember = !teamMember.first_name || teamMember.id === Date.now() || teamMember.first_name === '';

  return (
    <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white px-4 py-2 border" style={{ borderColor: '#e65039' }}>
            <h2 className="text-lg font-bold" style={{ color: '#3C3C3C' }}>
              {isNewMember ? 'Add New Team member / CT' : 'Edit Team member / CT'}
            </h2>
          </div>
          
          <Button
            onClick={onBack}
            className="px-6 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: '#e65039',
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
                {/* First Name */}
                <div>
                  <Label htmlFor="first_name" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label htmlFor="last_name" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                    required
                  />
                </div>

                {/* ID Number */}
                <div>
                  <Label htmlFor="id_number" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    ID Number
                  </Label>
                  <Input
                    id="id_number"
                    type="text"
                    value={formData.id_number}
                    onChange={(e) => handleInputChange('id_number', e.target.value)}
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
                      <SelectItem value="teacher" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Team member</SelectItem>
                      <SelectItem value="ct" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>CT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div>
                  <Label htmlFor="gender" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Gender
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="w-full border-2 rounded-none" style={{ borderColor: '#BDC3C7' }}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-white border border-gray-200 shadow-lg rounded-md"
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: '#BDC3C7',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <SelectItem value="Male" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Male</SelectItem>
                      <SelectItem value="Female" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Female</SelectItem>
                      <SelectItem value="Other" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Classes */}
                <div>
                  <Label htmlFor="class" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Classes
                  </Label>
                  <Select value={formData.classes} onValueChange={(value) => handleInputChange('classes', value)}>
                    <SelectTrigger className="w-full border-2 rounded-none" style={{ borderColor: '#BDC3C7' }}>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent 
                      className="bg-white border border-gray-200 shadow-lg rounded-md"
                      style={{ 
                        backgroundColor: 'white',
                        borderColor: '#BDC3C7',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      {availableClasses.map((cls) => (
                        <SelectItem key={cls} value={cls} className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date of joining */}
                <div>
                  <Label htmlFor="date_of_joining" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Date of joining
                  </Label>
                  <Input
                    id="date_of_joining"
                    type="date"
                    value={formData.date_of_joining}
                    onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
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
                    alt={`${formData.first_name}'s photo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If the image fails to load, hide it and show the generic icon
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <User 
                  className={`w-8 h-8 ${formData.photoUrl ? 'hidden' : ''}`}
                  style={{ color: '#BDC3C7' }}
                />
              </div>
              
              {/* Change Photo Button */}
              <button
                type="button"
                onClick={handlePhotoUpload}
                className="flex items-center space-x-2 px-4 py-2 border-2 rounded-lg transition-all duration-200 hover:bg-blue-50"
                style={{ 
                  borderColor: '#e65039',
                  color: '#e65039',
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
                  backgroundColor: '#e65039',
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