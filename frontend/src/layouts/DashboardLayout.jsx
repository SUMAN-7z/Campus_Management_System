import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  LayoutDashboard, User, Briefcase, FileCheck, Calendar, Bell, 
  LogOut, Menu, X, Users, Building2, TrendingUp, Award, CheckSquare, MessageSquare
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch student's notifications if they are a student
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      if (user.role === 'ROLE_STUDENT') {
        const res = await API.get(`/api/student/notifications/${user.userId}/unread-count`);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notification count', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      if (user.role === 'ROLE_STUDENT') {
        const res = await API.get(`/api/student/notifications/${user.userId}`);
        setNotifications(res.data.slice(0, 5)); // Get latest 5
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const toggleNotifDropdown = () => {
    setShowNotifDropdown(!showNotifDropdown);
    if (!showNotifDropdown) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/api/student/notifications/${id}/read`);
      fetchUnreadCount();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to read notification', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Determine Sidebar links based on role
  const getSidebarLinks = () => {
    const role = user?.role;
    if (role === 'ROLE_STUDENT') {
      return [
        { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'My Profile', path: '/student/profile', icon: User },
        { label: 'Job Board', path: '/student/jobs', icon: Briefcase },
        { label: 'Applications', path: '/student/applications', icon: FileCheck },
        { label: 'Interviews', path: '/student/interviews', icon: Calendar },
        { label: 'Notifications', path: '/student/notifications', icon: Bell },
      ];
    } else if (role === 'ROLE_RECRUITER') {
      return [
        { label: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
        { label: 'Company Profile', path: '/recruiter/profile', icon: Building2 },
        { label: 'Post a Job', path: '/recruiter/post-job', icon: Briefcase },
        { label: 'Applicants', path: '/recruiter/applicants', icon: Users },
        { label: 'Interviews', path: '/recruiter/interviews', icon: Calendar },
      ];
    } else if (role === 'ROLE_OFFICER' || role === 'ROLE_ADMIN') {
      return [
        { label: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
        { label: 'Students', path: '/officer/students', icon: Users },
        { label: 'Companies', path: '/officer/companies', icon: Building2 },
        { label: 'Placement Drives', path: '/officer/drives', icon: TrendingUp },
        { label: 'Applications', path: '/officer/applications', icon: FileCheck },
      ];
    }
    return [];
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between shrink-0">
        <div className="flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <Award className="h-8 w-8 text-primary-500 mr-2" />
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
              PLACEMENT CELL
            </span>
          </div>
          
          <nav className="p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    active 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3 shrink-0" />
                  {link.label}
                  {link.label === 'Notifications' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-primary-400 shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role?.replace('ROLE_', '')}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Mobile Header / Sidebar drawer */}
      <div className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-slate-400 hover:text-slate-200 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center ml-3">
            <Award className="h-6 w-6 text-primary-500 mr-2" />
            <span className="font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
              Placement Cell
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications Trigger Mobile */}
          {user?.role === 'ROLE_STUDENT' && (
            <div className="relative">
              <button onClick={toggleNotifDropdown} className="p-1 text-slate-400 hover:text-slate-200 relative">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 h-2 w-2 rounded-full"></span>
                )}
              </button>
            </div>
          )}

          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-semibold text-primary-400">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            <div className="flex items-center">
              <Award className="h-7 w-7 text-primary-500 mr-2" />
              <span className="font-bold tracking-wider text-base bg-gradient-to-r from-primary-400 to-indigo-400 bg-clip-text text-transparent">
                PLACEMENT CELL
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-200">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active 
                      ? 'bg-primary-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {link.label}
                  {link.label === 'Notifications' && unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-primary-400">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.role?.replace('ROLE_', '')}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar for Desktop */}
        <header className="hidden md:flex h-16 bg-slate-900 border-b border-slate-800 items-center justify-between px-8 z-30 sticky top-0">
          <div>
            <h1 className="text-lg font-semibold text-slate-200">
              {links.find(l => l.path === location.pathname)?.label || 'Portal'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Student Notifications Bell */}
            {user?.role === 'ROLE_STUDENT' && (
              <div className="relative">
                <button 
                  onClick={toggleNotifDropdown}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                      <span className="font-semibold text-sm">Notifications</span>
                      {unreadCount > 0 && <span className="bg-primary-500/10 text-primary-400 text-xs px-2 py-0.5 rounded">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-500 text-xs">
                          No recent alerts
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => handleMarkAsRead(n.id)}
                            className={`p-3.5 border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/30 transition-colors flex flex-col space-y-1 ${!n.isRead ? 'bg-primary-500/5 border-l-2 border-l-primary-500' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-semibold text-xs text-slate-200">{n.title}</span>
                              <span className="text-[9px] text-slate-500">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2.5 border-t border-slate-800 bg-slate-950 text-center">
                      <Link 
                        to="/student/notifications" 
                        onClick={() => setShowNotifDropdown(false)}
                        className="text-xs text-primary-400 hover:text-primary-300 font-semibold"
                      >
                        See all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="h-8 w-px bg-slate-800" />

            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-primary-400 text-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="ml-2.5 text-sm font-semibold hidden lg:inline-block">
                {user?.name || 'User'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="p-6 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;