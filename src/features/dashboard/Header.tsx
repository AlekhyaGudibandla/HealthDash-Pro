import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, CheckCircle2 } from 'lucide-react';
import { useUIStore } from '@/app/store/uiStore';
import { useAuthStore } from '@/app/store/authStore';
import { useNotificationStore } from '@/app/store/notificationStore';
import { Button } from '@/components/ui/Button';

export function Header() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotificationStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleSidebar}>
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>

      <div className="flex flex-1 justify-between items-center sm:justify-end gap-x-4 self-stretch lg:gap-x-6">
        <div className="lg:hidden font-bold text-gray-900 tracking-tight text-lg">HealthDash Pro</div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="relative" ref={notifRef}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-gray-400 hover:text-gray-500 rounded-full"
              onClick={() => setShowNotifs(!showNotifs)}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              {unreadCount() > 0 && (
                <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount()}
                </span>
              )}
            </Button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  {unreadCount() > 0 && (
                    <button 
                      onClick={() => markAllAsRead()}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                          onClick={() => markAsRead(n.id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-semibold text-gray-900">{n.title}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold border border-primary-200 shadow-inner">
              {user?.email?.charAt(0).toUpperCase() || 'D'}
            </div>
            <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
              {user?.email || 'Dr. Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
