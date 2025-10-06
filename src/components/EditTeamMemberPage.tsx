import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandGroup, CommandItem } from "./ui/command"
import { Upload, User, Trash2 } from 'lucide-react';
import { TeamMember } from '../types/users';
import { useCreateUser, useUpdateUser, useDeleteUser, useResetUserPassword } from '../hooks/useUsers';
import { useUploadUserPhoto } from '../hooks/useUploadFile';
import { useClasses } from '../hooks/useClasses';
import { Check, ChevronsUpDown } from "lucide-react"
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { data: classes } = useClasses();

  const queryClient = useQueryClient();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const resetPasswordUser = useResetUserPassword();

  const uploadMutation = useUploadUserPhoto();

  // Available classes for assignment (should come from backend in real app)
  const availableClasses: string[] = classes? classes.map(e => e.name): []

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(
    formData.classes
      ? formData.classes.split(",").map((cls) => cls.trim())
      : []
  )

  const toggleClass = (cls: string) => {
    let updated: string[]
    if (selected.includes(cls.trim())) {
      updated = selected.filter((c) => c !== cls.trim())
    } else {
      updated = [...selected, cls.trim()]
    }
    console.log(selected)
    setSelected(updated)
    handleInputChange("classes", updated.join(",")) // 🔹 update as comma string
  }

  const handleInputChange = (field: keyof TeamMember, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    if (formData.id && formData.id != 0) {
      updateUser.mutate(
        { id: formData.id, data: formData },
        { onSuccess: () => onSave(formData) }
      );
    } else {
      console.log("creating")
      createUser.mutate(formData, {
      onSuccess: (data) => {
        console.log("✅ User created:", data);
        console.log("sending photo");

        if (data?.user?.id) {
          handlePhotoUpload(data.id);
        }

        onSave(data);
      },
      onError: (error) => {
        console.error("❌ Error creating user:", error);
      },
      onSettled: () => {
        console.log("ℹ️ createUser.mutate finished (success or error)");
      },
    });
    }
    onSave(formData);
  };

  const handleResetPassword = () => {
    // In a real implementation, this would trigger a password reset
    if (formData.id && formData.id !== 0) {
      resetPasswordUser.mutate(formData.id, {
        onSuccess: () => {
          console.log('Successfully password rest of team member:');
          setIsPasswordDialogOpen(true);
          // onBack(); // Go back to the previous page after successful deletion
        },
        onError: (error) => {
          console.error('Error deleting team member:', error);
          // Keep dialog open on error so user can try again
          // You could also show a toast notification here
        }
      });
    }
    console.log('Password reset requested for:', formData.first_name);
  };

  const handleDelete = () => {
    if (formData.id && formData.id !== 0) {
      deleteUser.mutate(formData.id, {
        onSuccess: (data) => {
          console.log('Successfully deleted team member:', data);
          setIsDeleteDialogOpen(false);
          onBack(); // Go back to the previous page after successful deletion
        },
        onError: (error) => {
          console.error('Error deleting team member:', error);
          // Keep dialog open on error so user can try again
          // You could also show a toast notification here
        }
      });
    }
  };

  const handlePhotoUpload = (userId: number) => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (userId != 0) {
          uploadMutation.mutate(
          { userId, file },
          {
            onSuccess: (data) => {
              console.log("Uploaded:", data);
              setIsDialogOpen(true);
              queryClient.invalidateQueries({ queryKey: ["users"] });
            },
            onError: (error) => {
              console.error("Upload failed", error);
            },
          }
        );
        }
        const photo = URL.createObjectURL(file);
        handleInputChange('photo', photo);
        console.log('Photo uploaded:', file.name);
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

                {/* CT Toggle (only shown if role is teacher or ct) */}
                {(formData.role === "teacher" || formData.role === "ct") && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_ct"
                      checked={formData.is_ct? formData.is_ct: false}
                      onCheckedChange={(checked) => handleInputChange("is_ct", checked)}
                      disabled={formData.role === "ct"} // lock toggle ON when role is CT
                    />
                    <Label htmlFor="is_ct" className="text-sm text-gray-700">
                      Also CT
                    </Label>
                  </div>
                )}

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

                <div>
                  <Label htmlFor="class" className="block mb-2" style={{ color: "#3C3C3C" }}>
                    Classes
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between border-2 rounded-none"
                        style={{ borderColor: "#BDC3C7" }}
                      >
                        {selected.length > 0 ? selected.join(", ") : "Select class"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white">
                      <Command>
                        <CommandGroup>
                          {availableClasses.map((cls: string) => (
                            <CommandItem
                              key={cls}
                              onSelect={() => toggleClass(cls)}
                              className="cursor-pointer"
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  selected.join(",").includes(cls) ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {cls}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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

                {/* Delete Button */}
                {!isNewMember && (
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
                      <span>Delete Team Member</span>
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

            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogContent className="max-w-md bg-white rounded-lg border-2" style={{ backgroundColor: 'white', borderColor: '#BDC3C7' }}>
                <DialogHeader>
                  <DialogTitle style={{ color: '#3C3C3C' }}>Password Update</DialogTitle>
                  <DialogDescription style={{ color: '#6C757D' }}>
                    Password has been reset succesfully.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button
                    onClick={() => setIsPasswordDialogOpen(false)}
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
                  <DialogTitle style={{ color: '#DC3545' }}>Delete Team Member</DialogTitle>
                  <DialogDescription style={{ color: '#6C757D' }}>
                    Are you sure you want to delete {formData.first_name} {formData.last_name}? This action cannot be undone.
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
                    disabled={deleteUser.isPending}
                    className="px-4 py-2 transition-all duration-200"
                    style={{ backgroundColor: '#DC3545', color: 'white', borderColor: '#DC3545' }}
                  >
                    {deleteUser.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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