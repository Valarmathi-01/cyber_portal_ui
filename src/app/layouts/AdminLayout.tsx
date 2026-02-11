import React, { useState } from 'react';
import { toast } from 'sonner';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart2, 
  Users, 
  UserX, 
  UserCheck,
  LogOut, 
  Menu, 
  X,
  Shield,
  Bell
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      toast.error('Please login to access the admin portal');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Complaint Management', path: '/admin/complaints', icon: FileText },
    // { label: 'Volunteer Registrations', path: '/admin/volunteer-registrations', icon: UserCheck },
    // { label: 'Volunteer List', path: '/admin/volunteers', icon: Users },
    // { label: 'Suspect Report List', path: '/admin/suspects', icon: UserX },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-blue-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-full">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                  alt="Emblem" 
                  className="w-8 h-8"
                />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">CyberCrime</h1>
                <p className="text-xs text-blue-200">Admin Portal</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-white hover:bg-blue-800 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-blue-800 bg-blue-950">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold border border-blue-700">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Super Admin</p>
                <p className="text-xs text-blue-300 truncate">official@gov.in</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-300 border-red-900/30 hover:bg-red-900/20 hover:text-red-200"
              onClick={() => {
                toast.custom((t) => (
                  <div className="bg-white p-4 rounded-lg shadow-xl border border-slate-200 w-80 animate-in fade-in zoom-in duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                        <LogOut size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-sm">Confirm Logout</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-3">Are you sure you want to end your session?</p>
                        <div className="flex gap-2 justify-end">
                           <button 
                             onClick={() => toast.dismiss(t)}
                             className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                           >
                             No, Stay
                           </button>
                           <button 
                             onClick={() => {
                               toast.dismiss(t);
                               handleLogout();
                             }}
                             className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded-md shadow-sm transition-colors"
                           >
                             Yes, Logout
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ), { position: 'top-center', duration: Infinity });
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-6 z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate-500 hover:text-blue-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Bell Icon Removed */}
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-600">Secure Session</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
