import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
// import userIconImage from 'figma:asset/175b30eba12976a029330759350f9c338ba2c59d.png';

interface Client {
  id: number;
  name: string;
  age: number;
  gender: string;
  idNumber: string;
  primaryDiagnosis: string;
  secondaryDiagnosis: string;
  dateOfEnrollment: string;
  photoUrl?: string;
  email?: string;
  dob?: string;
  guardianName?: string;
  guardianContact?: string;
}

interface EditClientPageProps {
  client: Client;
  onBack: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onSave: (updatedClient: Client) => void;
  onDashboardClick?: () => void;
  onTeamMembersClick?: () => void;
  onClientClick?: () => void;
}

export function EditClientPage({ 
  client, 
  onBack, 
  onLogout, 
  onProfileClick, 
  onSave,
  onDashboardClick,
  onTeamMembersClick,
  onClientClick
}: EditClientPageProps) {
  const [formData, setFormData] = useState<Client>({
    ...client,
    email: client.email || '',
    dob: client.dob || '',
    guardianName: client.guardianName || '',
    guardianContact: client.guardianContact || '',
    dateOfEnrollment: client.dateOfEnrollment || new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field: keyof Client, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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

  const isNewClient = !client.name || client.id === Date.now() || client.name === '';

  return (
    <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-white px-4 py-2 border" style={{ borderColor: '#2C5F7C' }}>
            <h2 className="text-lg font-bold" style={{ color: '#3C3C3C' }}>
              {isNewClient ? 'Add New Client' : 'Edit Client'}
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

                {/* Primary Diagnosis */}
                <div>
                  <Label htmlFor="primaryDiagnosis" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Primary Diagnosis
                  </Label>
                  <Input
                    id="primaryDiagnosis"
                    type="text"
                    value={formData.primaryDiagnosis}
                    onChange={(e) => handleInputChange('primaryDiagnosis', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Guardian Name */}
                <div>
                  <Label htmlFor="guardianName" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Guardian Name
                  </Label>
                  <Input
                    id="guardianName"
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) => handleInputChange('guardianName', e.target.value)}
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
                {/* Age */}
                <div>
                  <Label htmlFor="age" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                    min="0"
                  />
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
                      <SelectItem value="M" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Male</SelectItem>
                      <SelectItem value="F" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Female</SelectItem>
                      <SelectItem value="Other" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Diagnosis */}
                <div>
                  <Label htmlFor="secondaryDiagnosis" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Secondary Diagnosis
                  </Label>
                  <Input
                    id="secondaryDiagnosis"
                    type="text"
                    value={formData.secondaryDiagnosis}
                    onChange={(e) => handleInputChange('secondaryDiagnosis', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Guardian Contact */}
                <div>
                  <Label htmlFor="guardianContact" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Guardian Contact
                  </Label>
                  <Input
                    id="guardianContact"
                    type="tel"
                    value={formData.guardianContact}
                    onChange={(e) => handleInputChange('guardianContact', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Date of Enrollment */}
                <div>
                  <Label htmlFor="dateOfEnrollment" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Date of Enrollment
                  </Label>
                  <Input
                    id="dateOfEnrollment"
                    type="date"
                    value={formData.dateOfEnrollment}
                    onChange={(e) => handleInputChange('dateOfEnrollment', e.target.value)}
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
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1646670244979-305554fbdd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBpY29uJTIwcGxhY2Vob2xkZXIlMjBwaG90b3xlbnwxfHx8fDE3NTU1OTE5ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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

            {/* ID Number */}
            <div className="max-w-md mx-auto">
              <Label htmlFor="idNumber" className="block mb-2" style={{ color: '#3C3C3C' }}>
                ID Number
              </Label>
              <Input
                id="idNumber"
                type="text"
                value={formData.idNumber}
                onChange={(e) => handleInputChange('idNumber', e.target.value)}
                className="w-full border-2 px-3 py-2 rounded-none"
                style={{ borderColor: '#BDC3C7' }}
                placeholder="Auto-generated or manual entry"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full px-4 py-3 rounded-none transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: '#2C5F7C',
                  color: 'white',
                  border: 'none'
                }}
              >
                {isNewClient ? 'Create Client' : 'Update Client'}
              </Button>
            </div>

            {/* Info Note */}
            <div className="mt-6 pt-4">
              <div className="bg-blue-50 px-4 py-3 border-l-4 rounded-r" style={{ borderColor: '#4EAAC9' }}>
                <p className="text-sm" style={{ color: '#3C3C3C' }}>
                  ℹ️ Client information will be used for personalized care plans and progress tracking
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}