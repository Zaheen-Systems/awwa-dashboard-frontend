import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Upload, User, Trash2 } from 'lucide-react';
import { StudentBaseRead } from '../types/class';
import { useCreateStudent, useUpdateStudent, useDeleteStudent } from '../hooks/useStudents';
import { useUploadStudentPhoto } from '../hooks/useUploadFile';
import { useClasses } from '../hooks/useClasses';
// import userIconImage from 'figma:asset/175b30eba12976a029330759350f9c338ba2c59d.png';

interface EditClientPageProps {
  client: StudentBaseRead;
  onBack: () => void;
  onSave: (updatedClient: StudentBaseRead) => void;
}

export function EditClientPage({ 
  client, 
  onBack, 
  onSave
}: EditClientPageProps) {
  const [formData, setFormData] = useState<StudentBaseRead>({
    ...client,
    email: client.email || '',
    dob: client.dob || '',
    guardian_name: client.guardian_name || '',
    guardian_contact: client.guardian_contact || '',
    date_of_enrollment: client.date_of_enrollment || new Date().toISOString().split('T')[0]
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const { data: classes } = useClasses();

  const availableClasses: string[] = classes? classes.map(e => e.name): []

  const uploadMutation = useUploadStudentPhoto();

  const handleInputChange = (field: keyof StudentBaseRead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    if (formData.id  && formData.id != 0) {
      updateStudent.mutate(
        { id: formData.id, data: formData },
        { onSuccess: () => onSave(formData) }
      );
    } else {
      createStudent.mutate(formData, { onSuccess: () => onSave(formData) });
    }
    onSave(formData);
  };

  const handleDelete = () => {
    console.log(formData)
    if (formData.id && formData.id !== 0) {
      deleteStudent.mutate(formData.id, {
        onSuccess: () => {
          onBack(); // Go back to the previous page after successful deletion
        },
        onError: (error) => {
          console.error('Error deleting client:', error);
        }
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handlePhotoUpload = (studentId: number) => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadMutation.mutate(
          { studentId, file },
          {
            onSuccess: (data) => {
              console.log("Uploaded:", data);
              setIsDialogOpen(true);
              queryClient.invalidateQueries({ queryKey: ["allstudents"] });
            },
            onError: (error) => {
              console.error("Upload failed", error);
            },
          }
        );
        const photoUrl = URL.createObjectURL(file);
        handleInputChange('photo', photoUrl);
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
          <div className="bg-white px-4 py-2 border" style={{ borderColor: '#e65039' }}>
            <h2 className="text-lg font-bold" style={{ color: '#3C3C3C' }}>
              {isNewClient ? 'Add New Client' : 'Edit Client'}
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
                  <Label htmlFor="primary_diagnosis" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Primary Diagnosis
                  </Label>
                  <Input
                    id="primary_diagnosis"
                    type="text"
                    value={formData.primary_diagnosis}
                    onChange={(e) => handleInputChange('primary_diagnosis', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Guardian Name */}
                <div>
                  <Label htmlFor="guardian_name" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Guardian Name
                  </Label>
                  <Input
                    id="guardian_name"
                    type="text"
                    value={formData.guardian_name}
                    onChange={(e) => handleInputChange('guardian_name', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Date of Enrollment */}
                <div>
                  <Label htmlFor="date_of_enrollment" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Date of Enrollment
                  </Label>
                  <Input
                    id="date_of_enrollment"
                    type="date"
                    value={formData.date_of_enrollment}
                    onChange={(e) => handleInputChange('date_of_enrollment', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Email */}
                {/* <div>
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
                </div> */}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Age */}
                <div>
                  <Label htmlFor="chronological_age" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Age
                  </Label>
                  <Input
                    id="chronological_age"
                    type="number"
                    value={formData.chronological_age}
                    onChange={(e) => handleInputChange('chronological_age', parseInt(e.target.value) || 0)}
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
                      <SelectItem value="O" className="hover:bg-gray-100 focus:bg-gray-100" style={{ color: '#3C3C3C' }}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Secondary Diagnosis */}
                <div>
                  <Label htmlFor="secondary_diagnosis" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Secondary Diagnosis
                  </Label>
                  <Input
                    id="secondary_diagnosis"
                    type="text"
                    value={formData.secondary_diagnosis}
                    onChange={(e) => handleInputChange('secondary_diagnosis', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Guardian Contact */}
                <div>
                  <Label htmlFor="guardian_contact" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Guardian Contact
                  </Label>
                  <Input
                    id="guardian_contact"
                    type="tel"
                    value={formData.guardian_contact}
                    onChange={(e) => handleInputChange('guardian_contact', e.target.value)}
                    className="w-full border-2 px-3 py-2 rounded-none"
                    style={{ borderColor: '#BDC3C7' }}
                  />
                </div>

                {/* Classes */}
                <div>
                  <Label htmlFor="class_name" className="block mb-2" style={{ color: '#3C3C3C' }}>
                    Class
                  </Label>
                  <Select value={formData.class_name} onValueChange={(value) => handleInputChange('class_name', value)}>
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


                {/* Delete Button */}
                {!isNewClient && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="px-6 py-2 font-medium transition-all duration-200 hover:opacity-90 flex items-center space-x-2"
                      style={{ 
                        backgroundColor: '#DC3545', 
                        color: 'white',
                        borderColor: '#DC3545'
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Client</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Photo Section */}
            <div className="flex flex-col items-center space-y-4 py-6">
              {/* Profile Image Display */}
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2" style={{ borderColor: '#BDC3C7' }}>
                {formData.photo ? (
                  <img 
                    src={formData.photo} 
                    alt={`${formData.name}'s photo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If the image fails to load, hide it and show the generic icon
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <User 
                  className={`w-8 h-8 ${formData.photo ? 'hidden' : ''}`}
                  style={{ color: '#BDC3C7' }}
                />
              </div>
              
              {/* Change Photo Button */}
              <button
                type="button"
                onClick={() => handlePhotoUpload(formData.id)}
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

            {/* ID Number */}
            <div className="max-w-md mx-auto">
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
                placeholder="Auto-generated or manual entry"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full px-4 py-3 rounded-none transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: '#e65039',
                  color: 'white',
                  border: 'none'
                }}
              >
                {isNewClient ? 'Create Client' : 'Update Client'}
              </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-md bg-white rounded-lg border-2" style={{ backgroundColor: 'white', borderColor: '#BDC3C7' }}>
                <DialogHeader>
                  <DialogTitle style={{ color: '#3C3C3C' }}>Photo Update</DialogTitle>
                  <DialogDescription style={{ color: '#6C757D' }}>
                    Photo has been successfully updated.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 border-2 transition-all duration-200"
                    style={{ backgroundColor: 'white', borderColor: '#BDC3C7', color: '#3C3C3C' }}
                  >
                    Ok
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="max-w-md bg-white rounded-lg border-2" style={{ backgroundColor: 'white', borderColor: '#DC3545' }}>
                <DialogHeader>
                  <DialogTitle style={{ color: '#DC3545' }}>Delete Client</DialogTitle>
                  <DialogDescription style={{ color: '#6C757D' }}>
                    Are you sure you want to delete {formData.name}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="px-4 py-2 border-2 transition-all duration-200"
                    style={{ backgroundColor: 'white', borderColor: '#BDC3C7', color: '#3C3C3C' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="px-4 py-2 transition-all duration-200"
                    style={{ backgroundColor: '#DC3545', color: 'white', borderColor: '#DC3545' }}
                  >
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Info Note */}
            <div className="mt-6 pt-4">
              <div className="bg-blue-50 px-4 py-3 border-l-4 rounded-r" style={{ borderColor: '#e65039' }}>
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