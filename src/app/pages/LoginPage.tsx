import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { toast } from 'sonner';
import authService from '../../services/authService';

export function LoginPage() {
  const [activeTab, setActiveTab] = React.useState<'citizen' | 'official'>('citizen');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoginError(null);
    console.log('Login Form Data:', data);
    
    let inputUsername = data.username.trim();
    const inputPassword = data.password ? data.password.trim() : '';

    if (activeTab === 'citizen') {
      if (!inputUsername.includes('@')) {
         const digits = inputUsername.replace(/\D/g, '');
         if (digits.length > 10) {
            if (digits.startsWith('91') && digits.length === 12) {
                inputUsername = digits.substring(2);
            } else if (digits.startsWith('0') && digits.length === 11) {
                inputUsername = digits.substring(1);
            } else {
                inputUsername = digits;
            }
         } else {
             inputUsername = digits;
         }
      }

      try {
        const payload = {
            email: inputUsername,
            password: inputPassword
        };
        
        const response = await authService.login(payload);
        
        if (response.statusCode === 200) {
            localStorage.setItem('isAuthenticated', 'true');
            // Store entire user object as requested
            localStorage.setItem('user', JSON.stringify(response.data));
            
            // Maintain compatibility with existing code
            localStorage.setItem('userType', response.data.role?.toLowerCase() || 'citizen');
            localStorage.setItem('userName', response.data.name);

            if (response.token) {
               localStorage.setItem('token', response.token);
            }

            toast.success(`Welcome back, ${response.data.name}!`, { duration: 1000 });

            if (location.state?.returnTo) {
              navigate(location.state.returnTo, { state: { step: location.state.step } });
            } else {
              navigate('/');
            }
        } else {
             setLoginError(response.message || 'Login failed');
             toast.error(response.message || 'Login Failed', { duration: 1000 });
        }
      } catch (error: any) {
        console.error('Login error:', error);
        setLoginError(error.response?.data?.message || 'Invalid Credentials! Please check your Mobile/Email and Password.');
        toast.error('Login Failed', { duration: 1000 });
      }
    } else {
      // OFFICIAL LOGIN VALIDATION
      if (
        (inputUsername === 'official@gmail.com' || inputUsername === 'admin' || inputUsername === 'officer@cybercrime.gov.in') && 
        (inputPassword === 'password123' || inputPassword === 'admin123')
      ) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'official');
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('userName', 'Inspector Sharma');
        toast.success('Welcome back, Inspector Sharma!', { duration: 1000 });
        navigate('/admin/dashboard');
      } else {
        setLoginError('Invalid Official Credentials! Try: official@gmail.com / password123');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center">
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Secure access for Citizens and Law Enforcement Officials
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => { setActiveTab('citizen'); setLoginError(null); }}
              className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                activeTab === 'citizen' 
                  ? 'bg-white text-orange-600 border-b-2 border-orange-600' 
                  : 'bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              Citizen Login
            </button>
            <button
              onClick={() => { setActiveTab('official'); setLoginError(null); }}
              className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                activeTab === 'official' 
                  ? 'bg-white text-blue-900 border-b-2 border-blue-900' 
                  : 'bg-slate-50 text-slate-500 hover:text-slate-700'
              }`}
            >
              Official Login
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {activeTab === 'citizen' ? (
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-800 mb-6 flex justify-between items-start">
                  <div>
                    <strong>Note:</strong> Citizens can login using their Mobile Number.
                  </div>
                </div>
              ) : (
                 <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-800 mb-6 flex justify-between items-start">
                   <div>
                     <strong>Official Login:</strong> Use provided credentials.
                   </div>
                 </div>
              )}

              {loginError && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md animate-pulse">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {loginError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">
                  {activeTab === 'citizen' ? 'Mobile Number / Email' : 'Officer ID / Email'}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="username"
                    placeholder={activeTab === 'citizen' ? "Enter your mobile number" : "Enter your ID"}
                    className="pl-10"
                    {...register('username', { required: true })}
                  />
                </div>
                {errors.username && <span className="text-xs text-red-500">This field is required</span>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...register('password', { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <span className="text-xs text-red-500">This field is required</span>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-slate-600">
                  <input type="checkbox" className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>

<Button
  type="submit"
  className={`w-full gap-2 transition-colors ${
    activeTab === 'official'
      ? 'bg-blue-700 hover:bg-blue-800 text-white'
      : 'bg-orange-600 hover:bg-orange-700 text-white'
  }`}
>
  Sign In <ArrowRight className="h-4 w-4" />
</Button>


            </form>
            
            {activeTab === 'citizen' && (
              <div className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  onClick={(e) => { e.preventDefault(); navigate('/register'); }} 
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Register New User
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-4">
          <p>Protected by reCAPTCHA and subject to the Google Privacy Policy and Terms of Service.</p>
        </div>
      </div>
    </div>
  );
}