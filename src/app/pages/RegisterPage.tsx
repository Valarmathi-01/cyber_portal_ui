import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, User, MapPin, Phone, Calendar, Mail, Lock, FileText, Home, Flag, Map, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import authService from '../../services/authService';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    trigger 
  } = useForm({
    mode: 'onBlur'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        titleType: data.title,
        dob: data.dob,
        mobileNo: data.mobile,
        name: data.name,
        email: data.email,
        password: data.password,
        gender: data.gender.toUpperCase(),
        role: "CITIZEN",
        address: data.address
      };

      await authService.register(payload);
      
      toast.success('Registration Successful! Please login with your Mobile Number.', { duration: 1000 });
      navigate('/login');
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.', { duration: 1000 });
    }
  };

  // Helper for consistent label with icon
  const FormLabel = ({ icon: Icon, label, required = false }: any) => (
    <div className="flex items-center text-slate-700 font-medium min-w-[180px]">
      <Icon className="h-4 w-4 mr-2 text-slate-500" />
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      <span className="ml-auto mr-4">:</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-md rounded-md overflow-hidden border border-slate-200">
          
          {/* Header */}
          <div className="bg-blue-700 text-white px-4 py-3 flex items-center">
            <User className="h-5 w-5 mr-2" />
            <h1 className="font-bold uppercase tracking-wide text-sm">User Profile Details</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            
            {/* 1. Personal Details Div */}
            <div className="space-y-4">
              
              {/* Title */}
              <div className="flex items-start">
                <div className="pt-2"><FormLabel icon={User} label="Title" required /></div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-4">
                    {['Mr', 'Ms', 'Dr', 'Shri', 'Smt', 'Prof', 'Miss'].map((title) => (
                      <label key={title} className="flex items-center space-x-2 text-sm cursor-pointer hover:text-blue-700 border border-slate-200 rounded px-3 py-1 bg-slate-50">
                        <input 
                          type="radio" 
                          value={title} 
                          {...register('title', { required: 'Title is required' })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>{title}</span>
                      </label>
                    ))}
                  </div>
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
                </div>
              </div>

              {/* Name */}
              <div className="flex items-center">
                <FormLabel icon={User} label="Name" required />
                <div className="flex-1">
                  <Input 
                    className={`max-w-xl h-9 ${errors.name ? 'border-red-500 focus:ring-red-200' : ''}`}
                    {...register('name', { 
                      required: 'Full Name is required',
                      minLength: { value: 3, message: 'Name must be at least 3 characters' },
                      pattern: { value: /^[a-zA-Z\s.]+$/, message: 'Only alphabets, spaces and dots allowed' }
                    })} 
                  />
                  {errors.name && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
                </div>
              </div>

              {/* Mobile */}
              <div className="flex items-center">
                <FormLabel icon={Phone} label="Mobile" required />
                <div className="flex-1">
                  <Input 
                    type="tel" 
                    maxLength={10}
                    className={`max-w-xl h-9 ${errors.mobile ? 'border-red-500 focus:ring-red-200' : ''}`}
                    {...register('mobile', { 
                      required: 'Mobile number is required', 
                      pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit Indian mobile number' }
                    })} 
                  />
                  {errors.mobile && <span className="text-xs text-red-500">{errors.mobile.message as string}</span>}
                </div>
              </div>

              {/* DOB */}
              <div className="flex items-center">
                <FormLabel icon={Calendar} label="DOB" required />
                <div className="flex-1">
                  <Input 
                    type="date" 
                    max={new Date().toISOString().split('T')[0]}
                    className={`max-w-xl h-9 ${errors.dob ? 'border-red-500 focus:ring-red-200' : ''}`}
                    {...register('dob', { 
                      required: 'Date of Birth is required',
                      validate: (value) => {
                        const date = new Date(value);
                        const today = new Date();
                        let age = today.getFullYear() - date.getFullYear();
                        const m = today.getMonth() - date.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
                          age--;
                        }
                        return age >= 10 || "You must be at least 10 years old";
                      }
                    })} 
                  />
                  {errors.dob && <span className="text-xs text-red-500">{errors.dob.message as string}</span>}
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-center">
                <FormLabel icon={User} label="Gender" required />
                <div className="flex-1">
                  <select 
                    {...register('gender', { required: 'Gender is required' })}
                    className={`flex h-9 w-full max-w-xl rounded-md border ${errors.gender ? 'border-red-500' : 'border-slate-300'} bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="text-xs text-red-500">{errors.gender.message as string}</span>}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center">
                <FormLabel icon={Mail} label="Email Id" required />
                <div className="flex-1">
                  <Input 
                    type="email" 
                    className={`max-w-xl h-9 ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
                    {...register('email', { 
                      required: 'Email ID is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                    })} 
                  />
                  {errors.email && <span className="text-xs text-red-500">{errors.email.message as string}</span>}
                </div>
              </div>

              {/* Relation */}
              <div className="flex items-center">
                <FormLabel icon={User} label="Father/Mother/Spouse" required />
                <div className="flex-1 flex flex-col gap-1 max-w-xl">
                  <div className="flex gap-2">
                    <select 
                      {...register('relationType', { required: true })}
                      className="w-1/3 flex h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                    </select>
                    <Input 
                      className={`w-2/3 h-9 ${errors.relationName ? 'border-red-500 focus:ring-red-200' : ''}`}
                      placeholder="Name" 
                      {...register('relationName', { 
                        required: 'Relation Name is required',
                        pattern: { value: /^[a-zA-Z\s.]+$/, message: 'Only alphabets allowed' }
                      })} 
                    />
                  </div>
                  {errors.relationName && <span className="text-xs text-red-500">{errors.relationName.message as string}</span>}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center">
                <FormLabel icon={MapPin} label="Address" required />
                <div className="flex-1">
                  <Input 
                    className={`max-w-xl h-9 ${errors.address ? 'border-red-500 focus:ring-red-200' : ''}`}
                    {...register('address', { 
                      required: 'Address is required',
                      minLength: { value: 5, message: 'Address must be at least 5 characters' }
                    })} 
                  />
                  {errors.address && <span className="text-xs text-red-500">{errors.address.message as string}</span>}
                </div>
              </div>

              {/* Password */}
              <div className="flex items-center">
                <FormLabel icon={Lock} label="Password" required />
                <div className="flex-1 relative max-w-xl">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    className={`h-9 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
                    placeholder="Min 8 chars, 1 Special Char, 1 Number"
                    {...register('password', { 
                      required: 'Password is required', 
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      pattern: { 
                        value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
                        message: 'Must contain at least 1 number and 1 special character'
                      }
                    })} 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {errors.password && <span className="text-xs text-red-500">{errors.password.message as string}</span>}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex items-center">
                <FormLabel icon={Lock} label="Confirm Password" required />
                <div className="flex-1 relative max-w-xl">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"}
                    className={`h-9 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200' : ''}`}
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password', 
                      validate: (val: string) => {
                        if (watch('password') != val) return "Passwords do not match";
                      }
                    })} 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message as string}</span>}
                </div>
              </div>

            </div>

            {/* 2. Address Details Div (Dashed Border) */}


            {/* Note & Submit */}
            <div className="space-y-4">
              <div className="text-center text-xs text-red-500 mt-2">
                (AlphaNumeric and Symbols like @ . _ ( ) / : ; - are allowed, Do not use any special characters.)
              </div>

              <div>
                <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded font-medium">
                  Save & Continue
                </Button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}