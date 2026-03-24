import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '@/app/store/uiStore';

export default function DashboardLayout() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-healthcare-background overflow-hidden relative">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-gray-900/80 lg:hidden transition-opacity" 
          onClick={toggleSidebar} 
        />
      )}

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto w-full p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
