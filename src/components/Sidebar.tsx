import { Home, Users, UserCheck, Settings, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface SidebarProps {
  currentPage: string;
  userType: 'user' | 'admin';
  onDashboardClick: () => void;
  onTeamMembersClick: () => void;
  onClientClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

export function Sidebar({ 
  currentPage, 
  userType, 
  onDashboardClick, 
  onTeamMembersClick, 
  onClientClick,
  onProfileClick,
  onLogout 
}: SidebarProps) {
  return (
    <div className="w-64 flex-shrink-0 flex flex-col" style={{ backgroundColor: '#4EAAC9' }}>
      <div className="p-6 flex-1">
        {/* AWWA Logo - Same as login page */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FF8C42' }}>
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div className="text-xl font-bold text-white">AWWA</div>
            <div className="text-xs text-white opacity-80">PEOPLE GIVING TO PEOPLE</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-3">
          {/* Dashboard Button - Different text for admin vs team member */}
          <button
            onClick={onDashboardClick}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              currentPage === 'dashboard' || currentPage === 'admin-dashboard'
                ? 'bg-white text-gray-800'
                : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">
              {userType === 'admin' ? 'Admin Dashboard' : 'Team Member / CT Dashboard'}
            </span>
          </button>

          {/* Team Members Button - Only show for admin */}
          {userType === 'admin' && (
            <button
              onClick={onTeamMembersClick}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                currentPage === 'team-members-ct' || currentPage === 'edit-team-member'
                  ? 'bg-white text-gray-800'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Team members / CTs</span>
            </button>
          )}

          {/* Client Button - Only show for admin */}
          {userType === 'admin' && (
            <button
              onClick={onClientClick}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                currentPage === 'client' || currentPage === 'edit-client'
                  ? 'bg-white text-gray-800'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span className="font-medium">Client</span>
            </button>
          )}
        </nav>
      </div>

      {/* User Profile Section at Bottom */}
      <div className="p-4 border-t border-white border-opacity-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-white hover:bg-white hover:bg-opacity-20">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Settings className="w-4 h-4" style={{ color: '#2C5F7C' }} />
              </div>
              <div className="flex-1">
                <div className="font-medium">User Settings</div>
                <div className="text-xs opacity-80">{userType === 'admin' ? 'Administrator' : 'Team Member'}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 bg-white border-2 rounded-lg shadow-lg p-2"
            style={{ borderColor: '#BDC3C7' }}
          >
            <DropdownMenuItem 
              onClick={onProfileClick}
              className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-200 rounded"
              style={{ backgroundColor: '#6C757D', color: 'white' }}
            >
              <Settings className="w-4 h-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-200 rounded mt-1"
              style={{ backgroundColor: '#FF8C42', color: 'white' }}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}