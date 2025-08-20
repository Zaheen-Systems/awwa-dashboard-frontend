import { useState, lazy, Suspense } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
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

type CurrentPage = 'login' | 'dashboard' | 'admin-dashboard' | 'class-detail' | 'student-detail' | 'behavior-detail' | 'report-generation' | 'profile-settings' | 'team-members-ct' | 'edit-team-member' | 'client' | 'edit-client';
type UserType = 'user' | 'admin' | null;
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted with:', { username, password });
    
    // Check if admin login
    if (username.toLowerCase().includes('admin')) {
      setUserType('admin');
      setCurrentPage('admin-dashboard');
    } else {
      setUserType('user');
      setCurrentPage('dashboard');
    }
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
    } else if (userType === 'admin') {
      if (selectedClass) {
        setCurrentPage('class-detail');
      } else {
        setCurrentPage('admin-dashboard');
      }
    } else if (selectedStudent && selectedBDsForReport.length > 0) {
      setCurrentPage('report-generation');
    } else if (selectedStudent && selectedBehaviorDescriptor) {
      setCurrentPage('behavior-detail');
    } else if (selectedStudent) {
      setCurrentPage('student-detail');
    } else {
      setCurrentPage('dashboard');
    }
    setNavigationContext(null); // Clear context after navigation
  };

  const handleClientClick = () => {
    setCurrentPage('client');
  };

  const handleBackFromClient = () => {
    // Clear any selected items to ensure clean navigation
    setSelectedStudent(null);
    setSelectedBehaviorDescriptor(null);
    setSelectedBDsForReport([]);
    setSelectedTeamMember(null);
    setSelectedClient(null);
    
    if (userType === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
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

  const handleBackFromTeamMembersCT = () => {
    // Return based on navigation context
    if (navigationContext === 'client') {
      setCurrentPage('client');
    } else if (navigationContext === 'student-detail' && selectedStudent) {
      setCurrentPage('student-detail');
    } else {
      // Clear selected items when going back to dashboard
      setSelectedStudent(null);
      setSelectedBehaviorDescriptor(null);
      setSelectedBDsForReport([]);
      setSelectedTeamMember(null);
      setSelectedClient(null);
      
      if (userType === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    }
    setNavigationContext(null); // Clear context after navigation
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

  const handleBackToAdminDashboard = () => {
    setSelectedClass(null);
    setCurrentPage('admin-dashboard');
  };

  const handleSwitchToTeamMemberDashboard = () => {
    // Clear admin-specific data
    setSelectedClass(null);
    setSelectedTeamMember(null);
    setCurrentPage('dashboard');
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

  const handleSaveBehaviorDescriptor = (comments: string) => {
    console.log('Behavior descriptor saved with comments:', comments);
    // In a real implementation, this would save to backend
    handleBackToStudentDetail();
  };

  const handleGenerateReport = (selectedBDs: BehaviorDescriptor[]) => {
    setSelectedBDsForReport(selectedBDs);
    setCurrentPage('report-generation');
  };

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
        <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8" style={{ backgroundColor: '#E8F4F8' }}>
          <div className="max-w-7xl mx-auto relative">
            <div className="flex items-center justify-between">
              {/* Left: AWWA Logo */}
              <div className="flex items-center space-x-1 sm:space-x-2 z-10">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF8C42' }}>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#3C3C3C' }}>AWWA</div>
                  <div className="text-xs" style={{ color: '#6C757D' }}>PEOPLE GIVING TO PEOPLE</div>
                </div>
              </div>

              {/* Center: Beacon (absolutely centered) */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold whitespace-nowrap" style={{ color: '#3C3C3C' }}>Beacon</h1>
              </div>

              {/* Right: User Icon (invisible on login page but maintains space) */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 opacity-0"></div>
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
                    onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
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
                    onFocus={(e) => e.target.style.borderColor = '#2C5F7C'}
                    onBlur={(e) => e.target.style.borderColor = '#BDC3C7'}
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto px-8 sm:px-12 py-2 sm:py-3 border-2 rounded-none font-bold transition-all duration-200 hover:opacity-90"
                    style={{ 
                      backgroundColor: '#2C5F7C', 
                      color: 'white',
                      borderColor: '#2C5F7C'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1F4A66';
                      e.currentTarget.style.borderColor = '#1F4A66';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2C5F7C';
                      e.currentTarget.style.borderColor = '#2C5F7C';
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
  let pageTitle = 'Beacon';

  switch (currentPage) {
    case 'client':
      pageContent = (
        <ClientPage
          onBack={handleBackFromClient}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onDashboardClick={handleBackToDashboard}
          onTeamMembersClick={handleTeamMembersCTClick}
          onClientClick={handleClientClick}
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
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
            onSave={handleSaveClient}
            onDashboardClick={() => {
              setSelectedClient(null);
              if (userType === 'admin') {
                setCurrentPage('admin-dashboard');
              } else {
                setCurrentPage('dashboard');
              }
            }}
            onTeamMembersClick={handleTeamMembersCTClick}
            onClientClick={handleClientClick}
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
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
            onSave={handleSaveTeamMember}
            onDashboardClick={() => {
              setSelectedTeamMember(null);
              if (navigationContext === 'client') {
                setCurrentPage('client');
              } else if (userType === 'admin') {
                setCurrentPage('admin-dashboard');
              } else {
                setCurrentPage('dashboard');
              }
              setNavigationContext(null);
            }}
            onTeamMembersClick={handleBackFromEditTeamMember}
            onClientClick={handleClientClick}
          />
        );
      }
      break;

    case 'team-members-ct':
      pageContent = (
        <TeamMembersCTPage
          onBack={handleBackFromTeamMembersCT}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onEditTeamMember={handleEditTeamMember}
          onAddTeamMember={handleAddTeamMember}
          onDashboardClick={handleBackToDashboard}
          onClientClick={handleClientClick}
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
            onProfileClick={handleProfileClick}
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
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
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
            onBack={handleBackToStudentDetail}
            onSave={handleSaveBehaviorDescriptor}
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
            onLogout={handleLogout}
            onBehaviorDescriptorClick={handleBehaviorDescriptorClick}
            onGenerateReport={handleGenerateReport}
            onProfileClick={handleProfileClick}
            onTeamMembersCTClick={handleTeamMembersCTClick}
          />
        );
      }
      break;

    case 'profile-settings':
      pageContent = (
        <ProfileSettingsPage
          onBack={handleBackFromProfile}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onDashboardClick={handleBackToDashboard}
          onTeamMembersClick={handleTeamMembersCTClick}
          onClientClick={handleClientClick}
        />
      );
      break;

    case 'dashboard':
    default:
      pageContent = (
        <Dashboard 
          onLogout={handleLogout} 
          onStudentClick={handleStudentClick}
          onProfileClick={handleProfileClick}
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
      onDashboardClick={handleBackToDashboard}
      onTeamMembersClick={handleTeamMembersCTClick}
      onClientClick={userType === 'admin' ? handleClientClick : () => {}}
      onProfileClick={handleProfileClick}
      onLogout={handleLogout}
      showHeader={!currentPage.includes('edit-')}
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