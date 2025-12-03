import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '@/shared/providers/AuthProvider';
import { useNotification } from '@/shared/providers/NotificationProvider';

/**
 * SideMenu component
 * Displays the main navigation sidebar with menu items
 * Highlights the active route
 */
function SideMenu(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSuccess } = useNotification();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/factures', label: 'Factures', icon: FileText },
    { path: '/reservations', label: 'Reservations', icon: Calendar },
    { path: '/moteur-reservation', label: 'Moteur Reservation', icon: Search },
  ];

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      showSuccess('Successfully logged out');
      navigate('/login', { replace: true });
    } catch (error) {
      // Error handling is done in the logout function
    }
  };

  return (
    <nav className="fixed left-0 top-0 h-full w-[250px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-50 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Travel Agency</h2>
            <p className="text-xs text-slate-400">Hotel Reservations</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default SideMenu;
