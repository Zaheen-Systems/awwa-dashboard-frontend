import { useState, lazy, Suspense } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';

import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import api from "./lib/axios";
import { useMutation } from "@tanstack/react-query";


// Lazy load heavy components
const StudentDetailPage = lazy(() => import('./components/StudentDetailPage').then(module => ({ default: module.StudentDetailPage })));
const BehaviorDescriptorDetailPage = lazy(() => import('./components/BehaviorDescriptorDetailPage').then(module => ({ default: module.BehaviorDescriptorDetailPage })));
const ReportGenerationPage = lazy(() => import('./components/ReportGenerationPage').then(module => ({ default: module.ReportGenerationPage })));
const ProfileSettingsPage = lazy(() => import('./components/ProfileSettingsPage').then(module => ({ default: module.ProfileSettingsPage })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ClassDetailPage = lazy(() => import('./components/ClassDetailPage').then(module => ({ default: module.ClassDetailPage })));
const TeamMembersCTPage = lazy(() => import('./components/TeamMembersCTPage').then(module => ({ default: module.TeamMembersCTPage })));
const EditTeamMemberPage = lazy(() => import('./components/EditTeamMemberPage').then(module => ({ default: module.EditTeamMemberPage })));
const ClientPage = lazy(() => import('./components/ClientPage').then(module => ({ default: module.ClientPage })));
const EditClientPage = lazy(() => import('./components/EditClientPage').then(module => ({ default: module.EditClientPage })));

interface IndividualIEPGoal {
  id: number;
  student_id: string; // UUID as string
  description?: string | null;
  goal_met?: string | null;     // will become boolean later
  processed?: string | null;    // will become boolean later
  gco?: string | null;    // will become boolean later
}

interface Student {
  id: string; // UUID
  name: string;
  chronological_age: number;
  age_band?: string | null;
  functional_age?: string | null;
  primary_diagnosis?: string | null;
  secondary_diagnosis?: string | null;
  entry_type: string;
  ct?: string | null;
  last_gco_date?: string | null; // ISO date string
  gco_1_functional_age?: string | null;
  gco_2_functional_age?: string | null;
  gco_3_functional_age?: string | null;
  created_at: string; // ISO datetime string
  iep_goals: IndividualIEPGoal[];
}

interface IEPGoalBasic {
  id: number;
  description?: string | null;
  gco?: string | null;    // will become boolean later
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
  gco_id: string;
  created_at: string;
  iep_goal?: IEPGoalBasic;
  video_url?: string;
}

interface BehaviorComment {
  id: number;
  text: string;
  author: string;
  authorType: 'team_member' | 'ct';
  timestamp: string;
}

interface ClassData {
  id: number;
  name: string;
  days: string;
  classTime: string;
  numStudents: number;
  numTeamMembers: number;
  numCTs: number;
}

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

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_type: "admin" | "teacher";
  name: string;
}

const loginApi = async (username: string, password: string): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/api/auth/login", { username, password });
  return data;
};

type CurrentPage = 'login' | 'dashboard' | 'admin-dashboard' | 'class-detail' | 'student-detail' | 'behavior-detail' | 'report-generation' | 'profile-settings' | 'team-members-ct' | 'edit-team-member' | 'client' | 'edit-client';
type UserType = 'teacher' | 'admin' | null;
type NavigationContext = 'dashboard' | 'admin-dashboard' | 'client' | 'student-detail' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('login');
  const [userType, setUserType] = useState<UserType>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [selectedBehaviorDescriptor, setSelectedBehaviorDescriptor] = useState<BehaviorDescriptor | null>(null);
  const [selectedBDsForReport, setSelectedBDsForReport] = useState<BehaviorDescriptor[]>([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [navigationContext, setNavigationContext] = useState<NavigationContext>(null);
  const [error, setError] = useState("");

    const loginMutation = useMutation({
      mutationFn: () => loginApi(username, password),
      onSuccess: (data) => {
        // Save token (localStorage/sessionStorage or context)
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("name", data.name);

        // Use user_type instead of checking username
        setUserType(data.user_type);

        if (data.user_type === "admin") {
          setCurrentPage("admin-dashboard");
        } else {
          setCurrentPage("dashboard");
        }
      },
      onError: () => {
        setError("Invalid username or password");
      },
    });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', { username, password });
    
    setError(""); // clear old error

    // validation
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Enter valid username and password.");
      return;
    }

    loginMutation.mutate();
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setUserType(null);
    setSelectedStudent(null);
    setSelectedClass(null);
    setSelectedBehaviorDescriptor(null);
    setSelectedBDsForReport([]);
    setSelectedTeamMember(null);
    setSelectedClient(null);
    setNavigationContext(null);
    setCurrentPage('login');
  };

  const handleProfileClick = () => {
    // Set navigation context based on current page
    if (currentPage === 'client') {
      setNavigationContext('client');
    } else if (currentPage === 'admin-dashboard') {
      setNavigationContext('admin-dashboard');
    } else if (currentPage === 'student-detail') {
      setNavigationContext('student-detail');
    } else {
      setNavigationContext('dashboard');
    }
    setCurrentPage('profile-settings');
  };

  const handleBackFromProfile = () => {
    // Return based on navigation context
    if (navigationContext === 'client') {
      setCurrentPage('client');
    } else if (navigationContext === 'admin-dashboard') {
      setCurrentPage('admin-dashboard');
    } else if (navigationContext === 'student-detail' && selectedStudent) {
      setCurrentPage('student-detail');
    } else {
      // Default fallback based on user type
      if (userType === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    }
    setNavigationContext(null); // Clear context after navigation
  };

  const handleClientClick = () => {
    // Clear any navigation context when explicitly clicking client
    setNavigationContext(null);
    setCurrentPage('client');
  };



  const handleTeamMembersCTClick = () => {
    // Set navigation context based on current page
    if (currentPage === 'client') {
      setNavigationContext('client');
    } else if (currentPage === 'admin-dashboard') {
      setNavigationContext('admin-dashboard');
    } else if (currentPage === 'student-detail') {
      setNavigationContext('student-detail');
    } else {
      setNavigationContext('dashboard');
    }
    setCurrentPage('team-members-ct');
  };



  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setCurrentPage('student-detail');
  };

  const handleClassClick = (classData: ClassData) => {
    setSelectedClass(classData);
    setCurrentPage('class-detail');
  };

  const handleBackToDashboard = () => {
    // If we're already on admin-dashboard and user clicks admin dashboard button, stay there
    if (currentPage === 'admin-dashboard' && userType === 'admin') {
      return;
    }
    
    // Return based on navigation context if it exists
    if (navigationContext === 'client') {
      setCurrentPage('client');
      setNavigationContext(null);
      return;
    }
    
    // Clear selected items
    setSelectedStudent(null);
    setSelectedBehaviorDescriptor(null);
    setSelectedBDsForReport([]);
    setSelectedTeamMember(null);
    setSelectedClient(null);
    setNavigationContext(null);
    
    // Route to appropriate dashboard based on user type
    if (userType === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  // Sidebar dashboard navigation should always go to the appropriate dashboard
  // regardless of any saved navigation context (e.g., from Client page).
  const handleGoToDashboardFromSidebar = () => {
    // Clear transient selections and contexts
    setSelectedStudent(null);
    setSelectedBehaviorDescriptor(null);
    setSelectedBDsForReport([]);
    setSelectedTeamMember(null);
    setSelectedClient(null);
    setSelectedClass(null);
    setNavigationContext(null);

    if (userType === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleBackToAdminDashboard = () => {
    setSelectedClass(null);
    setCurrentPage('admin-dashboard');
  };


  const handleSwitchToAdminDashboard = () => {
    // Clear team member-specific data
    setSelectedStudent(null);
    setSelectedBehaviorDescriptor(null);
    setSelectedBDsForReport([]);
    setCurrentPage('admin-dashboard');
  };

  const handleBehaviorDescriptorClick = (behaviorDescriptor: BehaviorDescriptor) => {
    setSelectedBehaviorDescriptor(behaviorDescriptor);
    setCurrentPage('behavior-detail');
  };

  const handleBackToStudentDetail = () => {
    setSelectedBehaviorDescriptor(null);
    setSelectedBDsForReport([]);
    setCurrentPage('student-detail');
  };

  const handleSaveBehaviorDescriptor = (comments: BehaviorComment[]) => {
    console.log('Behavior descriptor saved with comments:', comments);
    // In a real implementation, this would save to backend
    handleBackToStudentDetail();
  };

  // const handleGenerateReport = (selectedBDs: BehaviorDescriptor[]) => {
  //   setSelectedBDsForReport(selectedBDs);
  //   setCurrentPage('report-generation');
  // };

  const handleBackFromReport = () => {
    setSelectedBDsForReport([]);
    setCurrentPage('student-detail');
  };

  const handleEditTeamMember = (teamMember: TeamMember) => {
    // Preserve navigation context when editing team member
    setSelectedTeamMember(teamMember);
    setCurrentPage('edit-team-member');
  };

  const handleAddTeamMember = () => {
    // Create a new team member with default values
    const newTeamMember: TeamMember = {
      id: Date.now(), // Temporary ID for new member
      name: '',
      age: 0,
      gender: '',
      idNumber: '',
      specialization: '',
      dateOfJoining: new Date().toISOString().split('T')[0], // Today's date
      class: '',
      role: 'Team member',
      email: '',
      dob: '',
      photoUrl: ''
    };
    setSelectedTeamMember(newTeamMember);
    setCurrentPage('edit-team-member');
  };

  const handleBackFromEditTeamMember = () => {
    setSelectedTeamMember(null);
    setCurrentPage('team-members-ct');
    // Navigation context is preserved for team members page
  };

  const handleSaveTeamMember = (updatedMember: TeamMember) => {
    console.log('Team member updated:', updatedMember);
    // In a real implementation, this would save to backend
    setSelectedTeamMember(null);
    setCurrentPage('team-members-ct');
  };

  // Client management functions
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setCurrentPage('edit-client');
  };

  const handleAddClient = () => {
    // Create a new client with default values
    const newClient: Client = {
      id: Date.now(), // Temporary ID for new client
      name: '',
      age: 0,
      gender: '',
      idNumber: '',
      primaryDiagnosis: '',
      secondaryDiagnosis: '',
      dateOfEnrollment: new Date().toISOString().split('T')[0], // Today's date
      photoUrl: '',
      email: '',
      dob: '',
      guardianName: '',
      guardianContact: ''
    };
    setSelectedClient(newClient);
    setCurrentPage('edit-client');
  };

  const handleBackFromEditClient = () => {
    setSelectedClient(null);
    setCurrentPage('client');
  };

  const handleSaveClient = (updatedClient: Client) => {
    console.log('Client updated:', updatedClient);
    // In a real implementation, this would save to backend
    setSelectedClient(null);
    setCurrentPage('client');
  };

  // Show login page if not logged in
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
        {/* Header Section */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8" style={{ backgroundColor: '#fff5f3' }}>
          <div className="max-w-7xl mx-auto relative">
            <div className="flex items-center justify-between">
              {/* Left: AWWA Logo */}
              <div className="flex items-center space-x-1 sm:space-x-2 z-10">
                <div 
                  className="px-4 py-3 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#FFF5F3' }}
                >
                  <img 
                    src="/AWWA Logo_Full Colour.png" 
                    alt="AWWA Logo" 
                    className="h-8 w-auto sm:h-10"
                  />
                </div>
              </div>

              {/* Center: Beacon (absolutely centered) */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold whitespace-nowrap" style={{ color: '#3C3C3C' }}>Beacon</h1>
              </div>

              {/* Right: Zaheen Logo */}
              <div className="flex items-center">
                <img 
                  src="/Picture1.png" 
                  alt="Zaheen Logo" 
                  className="h-8 w-auto sm:h-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="flex justify-center px-4 sm:px-6 py-8 sm:py-16">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#3C3C3C' }}>
                LOGIN
              </h2>
              
              <form onSubmit={handleLogin} className="space-y-6">
                  {error && (
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  )}
                <div>
                  <Label 
                    htmlFor="username" 
                    className="block mb-2"
                    style={{ color: '#3C3C3C' }}
                  >
                    Username/Email
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter 'admin' for admin portal"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-none focus:outline-none"
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: '#BDC3C7',
                      color: '#3C3C3C'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#e65039'}
                    onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                  />
                </div>

                <div>
                  <Label 
                    htmlFor="password" 
                    className="block mb-2"
                    style={{ color: '#3C3C3C' }}
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-none focus:outline-none"
                    style={{ 
                      backgroundColor: 'white',
                      borderColor: '#BDC3C7',
                      color: '#3C3C3C'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#e65039'}
                    onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto px-8 sm:px-12 py-2 sm:py-3 border-2 rounded-none font-bold transition-all duration-200 hover:opacity-90"
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
                    LOGIN
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile settings is now handled in the main layout switch statement below

  // All other pages use the Layout with sidebar
  if (!userType) {
    return null; // Should not happen
  }

  let pageContent: React.ReactNode;

  switch (currentPage) {
    case 'client':
      pageContent = (
        <ClientPage
          onEditClient={handleEditClient}
          onAddClient={handleAddClient}
        />
      );
      break;

    case 'edit-client':
      if (selectedClient) {
        pageContent = (
          <EditClientPage
            client={selectedClient}
            onBack={handleBackFromEditClient}
            onSave={handleSaveClient}
          />
        );
      }
      break;
    
    case 'edit-team-member':
      if (selectedTeamMember) {
        pageContent = (
          <EditTeamMemberPage
            teamMember={selectedTeamMember}
            onBack={handleBackFromEditTeamMember}
            onSave={handleSaveTeamMember}
          />
        );
      }
      break;

    case 'team-members-ct':
      pageContent = (
        <TeamMembersCTPage
          onEditTeamMember={handleEditTeamMember}
          onAddTeamMember={handleAddTeamMember}
        />
      );
      break;

    case 'class-detail':
      if (selectedClass) {
        pageContent = (
          <ClassDetailPage
            classData={selectedClass}
            onBack={handleBackToAdminDashboard}
            onLogout={handleLogout}
            onDashboardClick={handleBackToAdminDashboard}
            onTeamMembersClick={handleTeamMembersCTClick}
          />
        );
      }
      break;

    case 'admin-dashboard':
      pageContent = (
        <AdminDashboard
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onClassClick={handleClassClick}
          onTeamMembersClick={handleTeamMembersCTClick}
          onClientClick={handleClientClick}
        />
      );
      break;

    case 'report-generation':
      if (selectedStudent && selectedBDsForReport.length > 0) {
        pageContent = (
          <ReportGenerationPage
            student={selectedStudent}
            selectedBDs={selectedBDsForReport}
            onBack={handleBackFromReport}
          />
        );
      }
      break;

    case 'behavior-detail':
      if (selectedStudent && selectedBehaviorDescriptor) {
        pageContent = (
          <BehaviorDescriptorDetailPage 
            student={selectedStudent}
            behaviorDescriptor={selectedBehaviorDescriptor}
            currentUser={{ name: username, type: 'team_member' }}
            existingComments={[]}
            onBack={handleBackToStudentDetail}
            onSave={(comments: BehaviorComment[]) => handleSaveBehaviorDescriptor(comments)}
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
          />
        );
      }
      break;

    case 'student-detail':
      if (selectedStudent) {
        pageContent = (
          <StudentDetailPage 
            student={selectedStudent} 
            onBack={handleBackToDashboard}
            onBehaviorDescriptorClick={handleBehaviorDescriptorClick}
            // onGenerateReport={handleGenerateReport}
          />
        );
      }
      break;

    case 'profile-settings':
      pageContent = (
        <ProfileSettingsPage
          onBack={handleBackFromProfile}
        />
      );
      break;

    case 'dashboard':
    default:
      pageContent = (
        <Dashboard 
          onStudentClick={handleStudentClick}
          onSwitchToAdminDashboard={handleSwitchToAdminDashboard}
          userType={userType}
        />
      );
      break;
  }

  return (
    <Layout
      currentPage={currentPage}
      userType={userType}
      onDashboardClick={handleGoToDashboardFromSidebar}
      onTeamMembersClick={handleTeamMembersCTClick}
      onClientClick={userType === 'admin' ? handleClientClick : () => {}}
      onProfileClick={handleProfileClick}
      onLogout={handleLogout}
    >
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        {pageContent}
      </Suspense>
    </Layout>
  );
}