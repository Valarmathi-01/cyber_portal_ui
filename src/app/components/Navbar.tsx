import React from 'react';
import { toast } from 'sonner';
import { Shield, Menu, User, Bell } from 'lucide-react';
import { Button } from './ui/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuth(auth);
    };
    checkAuth();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuth(false);
    navigate('/');
  };

  // Determine if logged in (check localStorage or dashboard path)
  const isLoggedIn = isAuth || location.pathname.includes('dashboard');

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-slate-900 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-slate-900 leading-tight">National Cyber Crime</h1>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Reporting Portal</p>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            
            {localStorage.getItem('adminAuthenticated') === 'true' ? (
              <>
                {/* <Link to="/admin/dashboard" className="text-slate-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50">Dashboard</Link> */}
                <Link to="/admin/analytics" className="text-slate-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50">Analytics</Link>
                <Link to="/admin/volunteers" className="text-slate-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50">Volunteers</Link>
                <Link to="/admin/suspects" className="text-slate-700 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50">Suspects</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard/analytics" className="text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium">Analytics</Link>
                <div className="relative group">
                  <button 
                    className="text-slate-700 hover:bg-blue-50 hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Report & Check Suspect
                    <svg className="ml-1 h-4 w-4 text-slate-500 group-hover:text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-lg hidden group-hover:block z-50">
                    <div className="py-2">
                      <Link to="/suspect-repository/search" className="block px-4 py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-800 border-l-4 border-transparent hover:border-orange-500 transition-colors">
                        Suspect Repository
                      </Link>
                      <Link to="/report-suspect" className="block px-4 py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-800 border-l-4 border-transparent hover:border-orange-500 transition-colors">
                        Report Suspect
                      </Link>
                      <a href="https://gac.gov.in/" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-800 border-l-4 border-transparent hover:border-orange-500 transition-colors">
                        File Appeal with GAC
                      </a>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <Link 
                    to="/cyber-volunteer"
                    className="text-slate-700 group-hover:text-blue-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center focus:outline-none"
                  >
                    Cyber Volunteer
                    <svg className="ml-1 h-4 w-4 text-slate-500 group-hover:text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  <div className="absolute left-0 top-full mt-1 w-60 bg-white border border-slate-200 rounded-md shadow-lg hidden group-hover:block z-50">
                    <div className="py-2">
                      <Link to="/cyber-volunteer/register" className="block px-4 py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-800 border-l-4 border-transparent hover:border-orange-500 transition-colors">
                        Register as Volunteer
                      </Link>
                      <Link to="/cyber-volunteer" className="block px-4 py-3 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-800 border-l-4 border-transparent hover:border-orange-500 transition-colors">
                        About Cyber Volunteer
                      </Link>
                    </div>
                  </div>
                </div>
                <Link to="/contact" className="text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium">Contact Us</Link>
              </>
            )}
            
            <div className="h-6 w-px bg-slate-300 mx-2" />
            
            {(isLoggedIn || localStorage.getItem('adminAuthenticated') === 'true') ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  toast.custom((t) => (
                    <div className="bg-white p-4 rounded-lg shadow-xl border border-slate-200 w-80 animate-in fade-in zoom-in duration-300">
                      <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                          <User size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-sm">Confirm Logout</h3>
                          <p className="text-xs text-slate-500 mt-1 mb-3">Are you sure you want to logout?</p>
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
                                 localStorage.removeItem('adminAuthenticated');
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
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <User className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link to="/login" state={{ returnTo: "/" }}>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50">Home</Link>
            <Link to="/report" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50">Report Crime</Link>
            <Link to="/resources" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50">Resources</Link>
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50">Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
