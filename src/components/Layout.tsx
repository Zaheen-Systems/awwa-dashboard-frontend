import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  userType: 'teacher' | 'admin' | 'ct';
  onDashboardClick: () => void;
  onTeamMembersClick: () => void;
  onClientClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

export function Layout({ 
  children, 
  currentPage, 
  userType, 
  onDashboardClick, 
  onTeamMembersClick, 
  onClientClick,
  onProfileClick,
  onLogout
}: LayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Static Sidebar */}
      <Sidebar
        currentPage={currentPage}
        userType={userType}
        onDashboardClick={onDashboardClick}
        onTeamMembersClick={onTeamMembersClick}
        onClientClick={onClientClick}
        onProfileClick={onProfileClick}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col border-l border-gray-300">
        {/* Pink Top Bar */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-300" style={{ backgroundColor: '#FFF5F3' }}>
          <div className="flex items-center justify-between relative">
            {/* Left: Empty space for balance */}
            <div className="w-16"></div>
            
            {/* Center: Beacon (absolutely centered) */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold whitespace-nowrap" style={{ color: '#3C3C3C' }}>
                Beacon
              </h1>
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

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}