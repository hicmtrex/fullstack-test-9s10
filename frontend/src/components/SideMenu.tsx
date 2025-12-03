import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Search } from 'lucide-react';

/**
 * SideMenu component
 * Displays the main navigation sidebar with menu items
 * Highlights the active route
 */
function SideMenu() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/factures', label: 'Factures', icon: FileText },
    { path: '/reservations', label: 'Reservations', icon: Calendar },
    { path: '/moteur-reservation', label: 'Moteur Reservation', icon: Search },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-[250px] bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-50">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Travel Agency</h2>
        <p className="text-sm text-gray-400 mt-1">Hotel Reservations</p>
      </div>
      <ul className="p-4 space-y-2">
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
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
    </nav>
  );
}

export default SideMenu;
