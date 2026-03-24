import { NavLink } from 'react-router-dom';
import { Home, Users, BarChart2, Settings, Activity, LogOut } from 'lucide-react';
import { useUIStore } from '@/app/store/uiStore';
import { auth } from '@/services/firebase';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: Home, end: true },
  { name: 'Patients', to: '/dashboard/patients', icon: Users },
  { name: 'Analytics', to: '/dashboard/analytics', icon: BarChart2 },
  { name: 'Settings', to: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  const handleLogout = () => auth.signOut();

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col w-64 border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <Activity className="w-8 h-8 text-primary-600 mr-3" />
        <span className="text-xl font-bold tracking-tight text-gray-900">HealthDash Pro</span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.end}
            onClick={handleNavClick}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                    isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-gray-600 hover:text-gray-900">
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
