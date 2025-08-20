import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  userType: 'user' | 'admin';
  onDashboardClick: () => void;
  onTeamMembersClick: () => void;
  onClientClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  showHeader?: boolean;
  headerContent?: ReactNode;
}

export function Layout({ 
  children, 
  currentPage, 
  userType, 
  onDashboardClick, 
  onTeamMembersClick, 
  onClientClick,
  onProfileClick,
  onLogout,
  showHeader = true,
  headerContent
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
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        {showHeader && (
          <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8" style={{ backgroundColor: '#E8F4F8' }}>
            <div className="max-w-7xl mx-auto">
              {headerContent || (
                <div className="flex items-center justify-center">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold" style={{ color: '#3C3C3C' }}>
                    Beacon
                  </h1>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}