import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  User, 
  Phone, 
  Calendar, 
  Briefcase, 
  FileText, 
  Mail, 
  Home, 
  MapPin, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertCircle,
  Eye,
  Database
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';
import { register as registerVolunteer } from '../../services/volunteerService';

export function CyberVolunteerRegistrationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const { register, handleSubmit, control, watch, formState: { errors }, trigger, getValues, setValue } = useForm({
    mode: 'onBlur',
    defaultValues: {
        title: 'Mr',
        volunteerName: '',
        mobile: '',
        relationName: '',
        gender: '',
        dob: '',
        occupation: '',
        qualification: '',
        certifications: [] as string[],
        email: '',
        homePhone: '',
        volunteershipTypes: [] as string[],
        houseNo: '',
        street: '',
        country: 'INDIA',
        state: '',
        district: '',
        city: '',
        pincode: '',
        reason: '',
        nationalIdType: 'Aadhaar',
        nationalIdNumber: ''
    }
  });

  const formData = watch();

  const fillDummyData = () => {
    setValue('title', 'Mr');
    setValue('volunteerName', 'Rajesh Koothrappali');
    setValue('mobile', '9876543210');
    setValue('relationName', 'V. Koothrappali');
    setValue('gender', 'Male');
    setValue('dob', '1990-01-01');
    setValue('occupation', 'Professional');
    setValue('qualification', 'Post Graduate');
    setValue('certifications', ['CEH', 'CISSP']);
    setValue('email', 'rajesh@caltech.edu');
    setValue('houseNo', '4A');
    setValue('street', 'Cyber Street');
    setValue('country', 'INDIA');
    setValue('state', 'Maharashtra');
    setValue('district', 'Mumbai');
    setValue('city', 'Mumbai');
    setValue('pincode', '400001');
    setValue('volunteershipTypes', ['CYBER_AWARENESS_PROMOTER']);
    setValue('reason', 'I want to help clean up the internet and prevent cyber fraud.');
    setValue('nationalIdType', 'Aadhaar');
    setValue('nationalIdNumber', '1234-5678-9012');
    
    // Create dummy files
    const dummyFile = new File(["dummy content"], "dummy_document.pdf", { type: "application/pdf" });
    const dummyImage = new File(["dummy image"], "dummy_photo.jpg", { type: "image/jpeg" });
    
    setResumeFile(dummyFile);
    setIdFile(dummyImage);
    setPhotoFile(dummyImage);
    
    toast.success("Dummy data filled! Files mocked.");
  };

  const onSubmit = async (data: any) => {
    if (!resumeFile) {
        toast.error("Please upload Resume");
        return;
    }
    if (!photoFile) {
        toast.error("Please upload Photo");
        return;
    }

    try {
        const dto = {
            title: data.title,
            volunteerName: data.volunteerName,
            fatherOrMotherName: data.relationName,
            mobileNo: data.mobile,
            email: data.email,
            gender: data.gender,
            dateOfBirth: data.dob,
            occupation: data.occupation,
            qualification: data.qualification,
            certifications: Array.isArray(data.certifications) ? data.certifications.join(', ') : data.certifications,
            volunteerType: Array.isArray(data.volunteershipTypes) ? data.volunteershipTypes.join(', ') : data.volunteershipTypes,
            homePhone: data.homePhone,
            nationalIdType: data.nationalIdType,
            nationalIdNumber: data.nationalIdNumber,
            houseNo: data.houseNo,
            streetName: data.street,
            country: data.country,
            state: data.state,
            district: data.district,
            cityOrVillage: data.city,
            pincode: data.pincode
        };

        await registerVolunteer(dto, resumeFile, photoFile);
        toast.success('Registration Submitted Successfully!');
        setTimeout(() => navigate('/'), 2000);
    } catch (error) {
        console.error(error);
        toast.error('Registration failed. Please try again.');
    }
  };

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep(s => s + 1);
      window.scrollTo(0,0);
    } else {
        toast.error('Please fill all required fields');
    }
  };

  const prevStep = () => {
    setStep(s => s - 1);
    window.scrollTo(0,0);
  };

  const StepTab = ({ num, label }: { num: number, label: string }) => (
    <div className={`flex items-center ${step === num ? 'text-blue-900 font-bold' : step > num ? 'text-green-700 font-medium' : 'text-slate-400'}`}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 text-sm
        ${step === num ? 'border-blue-900 bg-white' : step > num ? 'border-green-600 bg-green-100 text-green-700' : 'border-slate-300 bg-slate-50'}
      `}>
        {step > num ? <CheckCircle className="w-5 h-5" /> : num}
      </div>
      <span className="hidden sm:inline">{label}</span>
      {num < 3 && <div className="h-0.5 w-8 sm:w-16 mx-2 sm:mx-4 bg-slate-200" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex justify-end">
            <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={fillDummyData}
                className="bg-white text-blue-900 border-blue-200 hover:bg-blue-50"
            >
                <Database className="w-4 h-4 mr-1" /> Fill Demo Data
            </Button>
      </div>


      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Step Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
            <div className="flex items-center justify-center">
                <StepTab num={1} label="Registration Step-1" />
                <StepTab num={2} label="Registration Step-2" />
                <StepTab num={3} label="Preview & Final Submit" />
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
                
                {/* Personal Details */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-blue-50 px-6 py-3 border-b border-slate-200 flex items-center">
                        <User className="w-5 h-5 text-blue-800 mr-2" />
                        <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Personal Details</h2>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Title */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                            <select 
                                {...register('title', { required: true })}
                                className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Dr">Dr</option>
                                <option value="Mrs">Mrs</option>
                            </select>
                        </div>

                        {/* Volunteer Name */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Volunteer Name <span className="text-red-500">*</span></label>
                            <Input {...register('volunteerName', { required: 'Name is required' })} placeholder="Enter Full Name" />
                            {errors.volunteerName && <span className="text-xs text-red-500">{errors.volunteerName.message as string}</span>}
                        </div>

                        {/* Mobile No */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile No. <span className="text-red-500">*</span></label>
                            <Input {...register('mobile', { required: 'Mobile is required' })} placeholder="9876543210" />
                        </div>

                         {/* Father/Mother Name */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Father/Mother/Spouse Name <span className="text-red-500">*</span></label>
                            <Input {...register('relationName', { required: 'Required' })} placeholder="" />
                        </div>

                         {/* Gender */}
                         <div className="form-group">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender <span className="text-red-500">*</span></label>
                            <select 
                                {...register('gender', { required: true })}
                                className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">-- Select --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* DOB */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                            <Input type="date" {...register('dob', { required: 'DOB is required' })} />
                        </div>

                        {/* Occupation */}
                        <div className="form-group">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Occupation <span className="text-red-500">*</span></label>
                            <select 
                                {...register('occupation', { required: true })}
                                className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">-- Select --</option>
                                <option value="Student">Student</option>
                                <option value="Professional">Professional</option>
                                <option value="Self Employed">Self Employed</option>
                                <option value="Government Service">Government Service</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                         {/* Qualification */}
                         <div className="form-group">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Desired Qualification <span className="text-red-500">*</span></label>
                            <select 
                                {...register('qualification', { required: true })}
                                className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">-- Select --</option>
                                <option value="Under Graduate">Under Graduate</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Post Graduate">Post Graduate</option>
                                <option value="PhD">PhD</option>
                            </select>
                        </div>

                        {/* Certification (Multi Select Mock) */}
                        <div className="form-group md:col-span-2">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Certifications</label>
                             <div className="border border-slate-300 rounded-md p-3 max-h-32 overflow-y-auto bg-white">
                                <label className="flex items-center space-x-2 mb-1">
                                    <input type="checkbox" {...register('certifications')} value="CEH" className="rounded text-blue-600" />
                                    <span className="text-sm">Certified Ethical Hacker (CEH)</span>
                                </label>
                                <label className="flex items-center space-x-2 mb-1">
                                    <input type="checkbox" {...register('certifications')} value="CISSP" className="rounded text-blue-600" />
                                    <span className="text-sm">CISSP</span>
                                </label>
                                <label className="flex items-center space-x-2 mb-1">
                                    <input type="checkbox" {...register('certifications')} value="CISM" className="rounded text-blue-600" />
                                    <span className="text-sm">Certified Information Security Manager (CISM)</span>
                                </label>
                             </div>
                        </div>

                         {/* Resume Upload */}
                         <div className="form-group md:col-span-2">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Resume <span className="text-red-500">*</span></label>
                             <div className="flex items-center gap-2">
                                <Input type="file" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="flex-1" accept=".pdf,.doc,.docx" />
                                <Button type="button" variant="outline" className="shrink-0 bg-blue-50 text-blue-700 border-blue-200">
                                    <Upload className="w-4 h-4 mr-2" /> Upload
                                </Button>
                             </div>
                             {resumeFile && (
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Selected: {resumeFile.name}
                                </p>
                             )}
                             <p className="text-xs text-slate-500 mt-1">Allowed formats: PDF, DOC. Max size: 2MB</p>
                        </div>

                        {/* Contact Info */}
                        <div className="form-group">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Email ID <span className="text-red-500">*</span></label>
                             <Input type="email" {...register('email', { required: true })} />
                        </div>
                        <div className="form-group">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Home Phone</label>
                             <Input {...register('homePhone')} placeholder="Optional" />
                        </div>

                        {/* Type of Volunteership */}
                        <div className="md:col-span-2 bg-slate-50 p-4 rounded border border-slate-200 mt-2">
                            <label className="block text-sm font-bold text-slate-800 mb-2">Type of Volunteership <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <label className="flex items-start space-x-2 bg-white p-3 rounded border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400">
                                    <input type="checkbox" {...register('volunteershipTypes', { required: true })} value="CYBER_VOLUNTEER_UNLAWFUL_CONTENT" className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm">Cyber Volunteer unlawful content</span>
                                </label>
                                <label className="flex items-start space-x-2 bg-white p-3 rounded border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400">
                                    <input type="checkbox" {...register('volunteershipTypes', { required: true })} value="CYBER_AWARENESS_PROMOTER" className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm">Cyber awareness promoter</span>
                                </label>
                                <label className="flex items-start space-x-2 bg-white p-3 rounded border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400">
                                    <input type="checkbox" {...register('volunteershipTypes', { required: true })} value="CYBER_EXPERT" className="mt-1 rounded text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm">Cyber expert</span>
                                </label>
                            </div>
                            {errors.volunteershipTypes && <p className="text-xs text-red-500 mt-1">Please select at least one type.</p>}
                        </div>

                    </div>
                </div>

                {/* Documents Upload */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-blue-50 px-6 py-3 border-b border-slate-200 flex items-center">
                        <FileText className="w-5 h-5 text-blue-800 mr-2" />
                        <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Documents Upload</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">National ID Type <span className="text-red-500">*</span></label>
                            <select 
                                {...register('nationalIdType', { required: true })} 
                                className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm mb-2"
                            >
                                <option value="PAN Card">PAN Card</option>
                                <option value="Aadhaar">Aadhar Card</option>
                                <option value="Voter ID">Voter ID</option>
                                <option value="Passport">Passport</option>
                            </select>
                            
                            <label className="block text-sm font-medium text-slate-700 mb-1 mt-4">National ID Number <span className="text-red-500">*</span></label>
                            <Input {...register('nationalIdNumber', { required: true })} placeholder="Enter ID Number" className="mb-2" />

                            <label className="block text-sm font-medium text-slate-700 mb-1 mt-4">Upload ID Proof (Optional)</label>
                            <div className="flex items-center gap-2">
                                <Input type="file" onChange={(e) => setIdFile(e.target.files?.[0] || null)} className="flex-1" />
                                <Button type="button" variant="outline" className="shrink-0">Upload</Button>
                            </div>
                            {idFile && (
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Selected: {idFile.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Passport Size Photo <span className="text-red-500">*</span></label>
                            <div className="h-10 invisible">Spacer</div>
                            <div className="flex items-center gap-2 mt-2">
                                <Input type="file" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} className="flex-1" accept="image/*" />
                                <Button type="button" variant="outline" className="shrink-0">Upload</Button>
                            </div>
                            {photoFile && (
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Selected: {photoFile.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Volunteer Address */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-blue-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                         <div className="flex items-center">
                            <Home className="w-5 h-5 text-blue-800 mr-2" />
                            <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Volunteer Address</h2>
                         </div>
                    </div>
                    <div className="p-6 border-2 border-dashed border-slate-300 m-6 rounded-md bg-slate-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                             <div className="form-group">
                                 <label className="block text-sm font-medium text-slate-700 mb-1">House No. <span className="text-red-500">*</span></label>
                                 <Input {...register('houseNo', { required: true })} />
                             </div>
                             <div className="form-group">
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Street Name</label>
                                 <Input {...register('street')} />
                             </div>
                             <div className="form-group">
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Country <span className="text-red-500">*</span></label>
                                 <select {...register('country')} className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                                     <option value="India">India</option>
                                 </select>
                             </div>
                             <div className="form-group">
                                 <label className="block text-sm font-medium text-slate-700 mb-1">State <span className="text-red-500">*</span></label>
                                 <select {...register('state', { required: true })} className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                                     <option value="">--Select--</option>
                                     <option value="Tamil Nadu">Tamil Nadu</option>
                                     <option value="Maharashtra">Maharashtra</option>
                                     <option value="Delhi">Delhi</option>
                                     <option value="Karnataka">Karnataka</option>
                                 </select>
                             </div>
                             <div className="form-group">
                                 <label className="block text-sm font-medium text-slate-700 mb-1">District <span className="text-red-500">*</span></label>
                                 <select {...register('district', { required: true })} className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                                     <option value="">--Select--</option>
                                     <option value="Chennai">Chennai</option>
                                     <option value="Mumbai">Mumbai</option>
                                     <option value="Pune">Pune</option>
                                 </select>
                             </div>
                             <div className="form-group">
                                 <label className="block text-sm font-medium text-slate-700 mb-1">City/Town/Village</label>
                                 <Input {...register('city')} />
                             </div>
                             <div className="form-group">
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Pincode <span className="text-red-500">*</span></label>
                                 <Input {...register('pincode', { required: true, pattern: /^[0-9]{6}$/ })} maxLength={6} />
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="button" onClick={nextStep} className="bg-blue-900 hover:bg-blue-800 text-white px-8">
                        Save & Continue <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>

            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-blue-50 px-6 py-3 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Additional Details</h2>
                </div>
                <div className="p-8 space-y-6">
                    <div className="form-group">
                         <label className="block text-sm font-medium text-slate-700 mb-1">Why do you want to be a Cyber Volunteer? <span className="text-red-500">*</span></label>
                         <textarea 
                            {...register('reason', { required: true })}
                            className="w-full min-h-[150px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Please describe your motivation and how you can contribute..."
                         />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                        <label className="flex items-start space-x-3 cursor-pointer">
                            <input type="checkbox" required className="mt-1 w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm text-slate-800">
                                I hereby declare that the information provided above is true and correct to the best of my knowledge. 
                                I understand that any false information may lead to rejection of my application or legal action.
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={prevStep}>
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back
                        </Button>
                        <Button type="button" onClick={nextStep} className="bg-blue-900 hover:bg-blue-800 text-white px-8">
                            Save & Continue <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
             </div>
          )}

          {/* STEP 3 - PREVIEW */}
          {step === 3 && (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-blue-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Preview Application</h2>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)} className="text-blue-600 text-xs">Edit Details</Button>
                    </div>
                    <div className="p-8 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Personal Info</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium text-slate-700 w-24 inline-block">Name:</span> {getValues('title')} {getValues('volunteerName')}</p>
                                    <p><span className="font-medium text-slate-700 w-24 inline-block">Mobile:</span> {getValues('mobile')}</p>
                                    <p><span className="font-medium text-slate-700 w-24 inline-block">Email:</span> {getValues('email')}</p>
                                    <p><span className="font-medium text-slate-700 w-24 inline-block">Gender:</span> {getValues('gender')}</p>
                                    <p><span className="font-medium text-slate-700 w-24 inline-block">Occupation:</span> {getValues('occupation')}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Volunteership</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium text-slate-700 w-24 inline-block">Types:</span> {Array.isArray(getValues('volunteershipTypes')) ? getValues('volunteershipTypes').join(', ') : getValues('volunteershipTypes')}</p>
                                    <p><span className="font-medium text-slate-700 w-24 inline-block">Reason:</span> <span className="italic text-slate-600 block mt-1">{getValues('reason')}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4 mt-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Address</h3>
                            <p className="text-sm text-slate-700">
                                {getValues('houseNo')}, {getValues('street')}, {getValues('city')}, {getValues('district')}, {getValues('state')} - {getValues('pincode')}
                            </p>
                            <p className="text-sm text-slate-700 mt-2">
                                <span className="font-medium">ID Proof:</span> {getValues('nationalIdType')} ({getValues('nationalIdNumber')})
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={prevStep}>
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 h-12 text-lg">
                        Final Submit <CheckCircle className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
