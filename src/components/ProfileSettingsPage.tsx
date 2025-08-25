import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Shield, Edit2, Camera, ChevronLeft } from 'lucide-react';

interface ProfileSettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onDashboardClick?: () => void;
  onTeamMembersClick?: () => void;
  onClientClick?: () => void;
}

export function ProfileSettingsPage({ 
  onBack, 
  onLogout, 
  onProfileClick, 
  onDashboardClick, 
  onTeamMembersClick, 
  onClientClick 
}: ProfileSettingsPageProps) {
  // Personal Information
  const [firstName, setFirstName] = useState('Ms.');
  const [lastName, setLastName] = useState('Arya');
  const [email, setEmail] = useState('arya@awwa.org');
  const [phone, setPhone] = useState('+65 9123 4567');
  const [jobTitle, setJobTitle] = useState('Special Education Teacher');
  const [department, setDepartment] = useState('Early Childhood');
  const [bio, setBio] = useState('Dedicated educator with 5+ years of experience in special education and behavior intervention.');

  // Security Settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI State
  const [activeTab, setActiveTab] = useState('personal');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', { 
      personal: { firstName, lastName, email, phone, jobTitle, department, bio },
      security: { passwordChanged: newPassword ? true : false }
    });
    // In a real implementation, this would save to backend
    onBack();
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    console.log('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordFields(false);
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
        console.log('Photo uploaded:', file.name);
        // In a real implementation, you would upload the file to a server
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  return (
    <div className="flex-1 px-6 py-8" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <ChevronLeft className="w-4 h-4" style={{ color: '#2C5F7C' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#3C3C3C' }}>
              Account Settings
            </h2>
          </div>
          
          <Button
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
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

        {/* Profile Header */}
        <Card className="mb-8 rounded-lg shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" alt="Profile picture" />
                  <AvatarFallback style={{ backgroundColor: '#4EAAC9', color: 'white' }}>
                    MA
                  </AvatarFallback>
                </Avatar>
                <button 
                  onClick={handlePhotoUpload}
                  className="absolute bottom-0 right-0 p-2 rounded-full shadow-lg transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#FF8C42' }}
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2" style={{ color: '#3C3C3C' }}>
                  {firstName} {lastName}
                </h1>
                <p className="mb-2" style={{ color: '#6C757D' }}>{jobTitle}</p>
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-1 rounded-lg"
                    style={{ backgroundColor: '#E8F4F8', color: '#2C5F7C' }}
                  >
                    {department}
                  </Badge>
                  <span className="text-sm" style={{ color: '#6C757D' }}>
                    Last login: Today at 9:30 AM
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white border-2 rounded-lg" style={{ borderColor: '#BDC3C7' }}>
            <TabsTrigger 
              value="personal" 
              className="flex items-center space-x-2 rounded-lg"
              style={{ 
                color: activeTab === 'personal' ? 'white' : '#3C3C3C',
                backgroundColor: activeTab === 'personal' ? '#2C5F7C' : 'transparent'
              }}
            >
              <User className="w-4 h-4" />
              <span>Personal Information</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex items-center space-x-2 rounded-lg"
              style={{ 
                color: activeTab === 'security' ? 'white' : '#3C3C3C',
                backgroundColor: activeTab === 'security' ? '#2C5F7C' : 'transparent'
              }}
            >
              <Shield className="w-4 h-4" />
              <span>Security Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#3C3C3C' }}>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" style={{ color: '#3C3C3C' }}>First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-2 border-2 rounded-none"
                      style={{ borderColor: '#BDC3C7' }}
                      onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                      onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" style={{ color: '#3C3C3C' }}>Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-2 border-2 rounded-none"
                      style={{ borderColor: '#BDC3C7' }}
                      onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                      onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" style={{ color: '#3C3C3C' }}>Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 border-2 rounded-none"
                      style={{ borderColor: '#BDC3C7' }}
                      onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                      onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" style={{ color: '#3C3C3C' }}>Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 border-2 rounded-none"
                      style={{ borderColor: '#BDC3C7' }}
                      onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                      onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="jobTitle" style={{ color: '#3C3C3C' }}>Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="mt-2 border-2 rounded-none"
                      style={{ borderColor: '#BDC3C7' }}
                      onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                      onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department" style={{ color: '#3C3C3C' }}>Department</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger className="mt-2 border-2 rounded-none" style={{ borderColor: '#BDC3C7' }}>
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
                        <SelectItem value="Early Childhood" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Early Childhood</SelectItem>
                        <SelectItem value="Elementary" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Elementary</SelectItem>
                        <SelectItem value="Secondary" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Secondary</SelectItem>
                        <SelectItem value="Vocational Training" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Vocational Training</SelectItem>
                        <SelectItem value="Administration" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio" style={{ color: '#3C3C3C' }}>Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="mt-2 border-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                    onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                    onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#3C3C3C' }}>Password & Security</CardTitle>
                <CardDescription>Manage your password and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border-2 rounded-lg" style={{ borderColor: '#BDC3C7' }}>
                  <div>
                    <h4 className="font-medium" style={{ color: '#3C3C3C' }}>Change Password</h4>
                    <p className="text-sm" style={{ color: '#6C757D' }}>
                      Last changed 3 months ago
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    variant="outline"
                    className="border-2 rounded-lg"
                    style={{ borderColor: '#2C5F7C', color: '#2C5F7C' }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                </div>

                {showPasswordFields && (
                  <div className="space-y-4 p-4 border-2 rounded-lg" style={{ borderColor: '#E8F4F8', backgroundColor: '#F8F9FA' }}>
                    <div>
                      <Label htmlFor="currentPassword" style={{ color: '#3C3C3C' }}>Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-2 border-2 rounded-none"
                        style={{ borderColor: '#BDC3C7' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" style={{ color: '#3C3C3C' }}>New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-2 border-2 rounded-none"
                        style={{ borderColor: '#BDC3C7' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" style={{ color: '#3C3C3C' }}>Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-2 border-2 rounded-none"
                        style={{ borderColor: '#BDC3C7' }}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={handlePasswordChange}
                        className="px-4 py-2 rounded-lg"
                        style={{ backgroundColor: '#2C5F7C', color: 'white' }}
                      >
                        Update Password
                      </Button>
                      <Button
                        onClick={() => setShowPasswordFields(false)}
                        variant="outline"
                        className="border-2 rounded-lg"
                        style={{ borderColor: '#BDC3C7' }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6 py-2 border-2 rounded-lg"
            style={{ borderColor: '#BDC3C7', color: '#3C3C3C' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg"
            style={{ backgroundColor: '#2C5F7C', color: 'white' }}
          >
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
}