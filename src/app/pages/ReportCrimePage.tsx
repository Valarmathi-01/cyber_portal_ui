import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, User, FileText, Upload, Users, CheckCircle, ChevronRight, ChevronLeft, AlertTriangle, Calendar as CalendarIcon, Loader2, WifiOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { toast } from 'sonner';
import complaintService from '../../services/complaintService';

const steps = [
  { id: 1, title: 'Category', icon: Shield },
  { id: 2, title: 'Incident Details', icon: FileText },
  { id: 3, title: 'Suspect Details', icon: Users },
  { id: 4, title: 'Review & Submit', icon: CheckCircle },
];

export function ReportCrimePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ackNumber, setAckNumber] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Restore state if returning from login
  React.useEffect(() => {
    if (location.state?.step) {
      setCurrentStep(location.state.step);
    }
    // Load draft data if available
    const draft = localStorage.getItem('draftCrimeReport');
    if (draft) {
      setFormData(JSON.parse(draft));
    }
  }, [location.state]);

  const nextStep = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    // Check Auth when moving from Category (Step 1) to Incident (Step 2)
    if (currentStep === 1) {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (!isAuthenticated) {
        // Save draft and redirect to login
        localStorage.setItem('draftCrimeReport', JSON.stringify(updatedData));
        navigate('/login', { state: { returnTo: '/report', step: 2 } });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitFinal = (ackNo?: string) => {
    setIsSubmitted(true);
    if (ackNo) setAckNumber(ackNo);
    localStorage.removeItem('draftCrimeReport');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full" />
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-orange-500 -z-10 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center bg-slate-50 px-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive || isCompleted 
                        ? 'bg-orange-600 border-orange-600 text-white' 
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`mt-2 text-xs font-medium ${isActive ? 'text-orange-600' : 'text-slate-500'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="min-h-[500px] flex flex-col shadow-lg border-t-4 border-t-orange-500">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Please provide accurate information for quick resolution.</p>
              </div>
              <div className="flex items-center gap-2">
                 {isOfflineMode && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1"><WifiOff className="h-3 w-3" /> Offline Mode</Badge>}
                 <Badge variant="outline" className="text-slate-500">Step {currentStep} of {steps.length}</Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-8">
            <AnimatePresence mode='wait'>
              {!isSubmitted ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Online Fraud",
                            "Banking Fraud",
                            "Financial Fraud",
                            "Social Media Fraud",
                            "Cyber Bullying",
                            "Women / Children Related Crime",
                            "Hacking",
                            "Other Cyber Crime"
                        ].map((cat) => (
                          <label key={cat} className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                              (formData as any).category === cat 
                              ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' 
                              : 'border-slate-200 hover:border-orange-200 hover:bg-orange-50'
                          }`}>
                            <input 
                              type="radio" 
                              name="category"
                              value={cat} 
                              checked={(formData as any).category === cat}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300"
                            />
                            <span className="ml-3 text-slate-700 font-medium">{cat}</span>
                          </label>
                        ))}
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button 
                            onClick={() => {
                                if((formData as any).category) nextStep({});
                                else toast.error("Please select a category");
                            }} 
                            className="gap-2 w-full sm:w-auto"
                        >
                            Next Step <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && <StepIncident onNext={nextStep} onPrev={prevStep} defaultValues={formData} />}
                  {currentStep === 3 && <StepSuspect onNext={nextStep} onPrev={prevStep} defaultValues={formData} />}
                  {currentStep === 4 && <StepReview 
                    formData={formData} 
                    onPrev={prevStep}
                    isSubmitting={isSubmitting}
                    onSubmit={async () => {
                      setIsSubmitting(true);
                      try {
                        const data = formData as any;
                        
                        // Map Category Strings to Backend Codes
                        const getCategoryCode = (cat: string) => {
                            switch (cat) {
                                case "Online Fraud": return "ONLINE_FRAUD";
                                case "Banking Fraud": return "BANKING_FRAUD";
                                case "Financial Fraud": return "FINANCIAL_FRAUD";
                                case "Social Media Fraud": return "SOCIAL_MEDIA_FRAUD";
                                case "Cyber Bullying": return "CYBER_BULLYING";
                                case "Women / Children Related Crime": return "WOMEN_CHILDREN_CRIME";
                                case "Hacking": return "HACKING";
                                case "Other Cyber Crime": return "OTHER_CYBERCRIME";
                                default: return "OTHER_CYBERCRIME";
                            }
                        };

                        // Construct DateTime
const incidentDateTime =
  data.incidentDate && data.incidentTime
    ? `${format(new Date(data.incidentDate), "yyyy-MM-dd")}T${data.incidentTime}:00`
    : new Date().toISOString().slice(0, 19);


                        // Construct the payload for the API based on the new requirements
                        const payload = {
                          category: getCategoryCode(data.category),
                          incidentDate: incidentDateTime,
                          reasonForDelay: "I was not aware of the cyber crime reporting portal", // Default/Hardcoded as per request
                          additionalInfo: data.incidentDescription || "Money debited through fake UPI link",
                          incidentLocation: "Chennai", // Hardcoded/Mapped as per request
                          state: "TAMIL_NADU", // Hardcoded as per request
                          district: "Chennai", // Hardcoded as per request
                          policeStation: "T Nagar Police Station", // Hardcoded as per request
                          citizenId: JSON.parse(localStorage.getItem('user') || '{}').id || 1 // Use user.id from localStorage
                        };

                        console.log('Submitting complaint:', payload);
                        
                        let resultData;
                        try {
                           const response = await complaintService.submitComplaint(payload);
                           if (typeof response.data === 'string') {
                               resultData = { acknowledgementNo: response.data };
                           } else {
                               resultData = response.data;
                           }
                           toast.success(response.message || "Complaint submitted successfully!");
                        } catch (error: any) {
                           // Network Error / Offline Handling
                           if (!error.response || error.code === 'ERR_NETWORK') {
                              console.warn("Backend unreachable. Switching to Offline Mode.");
                              setIsOfflineMode(true);
                              toast.warning("Backend unreachable. Saved to local records.");
                              
                              // Create mock response for offline mode
                              resultData = {
                                  acknowledgementNo: `OFFLINE-${Math.floor(100000 + Math.random() * 900000)}`,
                                  ...payload
                              };
                           } else {
                              // Real API validation error, throw to outer catch
                              throw error;
                           }
                        }
                        
                        // Save to local storage (Persistence for both Online and Offline modes)
                        const user = JSON.parse(localStorage.getItem('user') || '{}');
                        const newComplaint = {
                          id: resultData?.acknowledgementNo || `CYB-${Math.floor(100000 + Math.random() * 900000)}`,
                          citizenName: user.name || "Anonymous Citizen",
                          category: payload.category,
                          date: payload.incidentDate,
                          status: 'SUBMITTED',
                          priority: 'Medium',
                          description: payload.additionalInfo,
                          officer: "Pending Assignment",
                          evidence: [],
                          remarks: [],
                          isOffline: isOfflineMode
                        };
                        
                        const existing = JSON.parse(localStorage.getItem('officialComplaints') || '[]');
                        localStorage.setItem('officialComplaints', JSON.stringify([newComplaint, ...existing]));

                        // Proceed to success screen
                        handleSubmitFinal(resultData?.acknowledgementNo);
                        
                      } catch (error: any) {
                        console.error('Submission error:', error);
                        const errorMsg = error.response?.data?.message || "Failed to submit complaint. Please try again.";
                        toast.error(errorMsg);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }} 
                  />}
                </motion.div>
              ) : (
                <SuccessMessage ackNumber={ackNumber} isOffline={isOfflineMode} />
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Step Components ---

function StepCategory({ onNext, defaultValues }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  const categories = [
    "Financial Fraud (Banking, UPI)", "Social Media Related", "Cyber Bullying / Stalking", 
    "Job Fraud", "Email Hacking", "Data Breach / Theft", "Cryptocurrency Fraud", "Other Cyber Crime"
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <label key={cat} className="relative flex items-center p-4 rounded-lg border border-slate-200 hover:border-orange-200 hover:bg-orange-50 cursor-pointer transition-all">
            <input 
              type="radio" 
              value={cat} 
              {...register('category', { required: true })} 
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300"
            />
            <span className="ml-3 text-slate-700 font-medium">{cat}</span>
          </label>
        ))}
      </div>
      {errors.category && <p className="text-red-500 text-sm">Please select a category</p>}
      
      <div className="flex justify-end pt-4">
        <Button type="submit" className="gap-2 w-full sm:w-auto">Next Step <ChevronRight className="h-4 w-4" /></Button>
      </div>
    </form>
  );
}

function StepIncident({ onNext, onPrev, defaultValues }: any) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });
  
  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Category Display - Read Only */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
        <div>
           <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Selected Category</p>
           <p className="text-blue-900 font-bold text-lg">{defaultValues.category || "Not Selected"}</p>
        </div>
        <Badge variant="outline" className="bg-white text-blue-600 border-blue-200">Read Only</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Date of Incident</Label>
          <Controller
            control={control}
            name="incidentDate"
            rules={{ required: true }}
            render={({ field }) => (
<Popover>
  <PopoverTrigger asChild>
<Button
  type="button"   // 👈 THIS IS REQUIRED
  variant="outline"
  className={`w-full justify-start text-left font-normal ${
    !field.value && "text-muted-foreground"
  }`}
>

      <CalendarIcon className="mr-2 h-4 w-4" />
      {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
    </Button>
  </PopoverTrigger>

  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={field.value}
      onSelect={field.onChange}
      initialFocus
    />
  </PopoverContent>
</Popover>

            )}
          />
          {errors.incidentDate && <p className="text-red-500 text-sm">Date is required</p>}
        </div>
        <div className="space-y-2">
          <Label>Time of Incident</Label>
          <Input type="time" {...register('incidentTime', { required: true })} />
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label>Where did it occur? (Platform/Website/App)</Label>
          <Input placeholder="e.g. Facebook, Whatsapp, SBI Bank Website" {...register('incidentPlatform', { required: true })} />
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label>Incident Description</Label>
          <textarea 
            className="w-full min-h-[150px] rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Please describe the incident in detail..."
            {...register('incidentDescription', { required: true, minLength: 20 })}
          ></textarea>
          {errors.incidentDescription && <p className="text-red-500 text-sm">Description is required (min 20 chars)</p>}
        </div>

        {/* Integrated Evidence Upload */}
        <div className="col-span-1 md:col-span-2">
           <Label className="mb-2 block">Upload Evidence (Optional)</Label>
           <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 mb-2">Upload screenshots, PDFs (Max 5MB)</p>
            <div className="flex justify-center">
              <label className="cursor-pointer">
                <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors text-xs font-medium border border-slate-300">Choose Files</span>
                <input type="file" className="hidden" multiple {...register('evidenceFiles')} />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev} className="gap-2"><ChevronLeft className="h-4 w-4" /> Back</Button>
        <Button type="submit" className="gap-2">Next Step <ChevronRight className="h-4 w-4" /></Button>
      </div>
    </form>
  );
}

function StepEvidence({ onNext, onPrev, defaultValues }: any) {
  const { register, handleSubmit } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors">
        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900">Upload Evidence</h3>
        <p className="text-sm text-slate-500 mb-4">Upload screenshots, PDFs, or recordings (Max 5MB each)</p>
        <div className="flex justify-center">
          <label className="cursor-pointer">
            <span className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium">Choose Files</span>
            <input type="file" className="hidden" multiple {...register('evidenceFiles')} />
          </label>
        </div>
      </div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Evidence is crucial for investigation. Please ensure images are clear and readable.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev} className="gap-2"><ChevronLeft className="h-4 w-4" /> Back</Button>
        <Button type="submit" className="gap-2">Next Step <ChevronRight className="h-4 w-4" /></Button>
      </div>
    </form>
  );
}

function StepSuspect({ onNext, onPrev, defaultValues }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800">
        If you don't know the suspect details, you can skip or leave fields empty.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Suspect Name (if known)</Label>
          <Input 
            {...register('suspectName', { 
              minLength: { value: 2, message: "Name must be at least 2 characters" },
              pattern: { value: /^[A-Za-z\s]+$/, message: "Name should only contain letters" }
            })} 
          />
          {errors.suspectName && <p className="text-red-500 text-sm mt-1">{errors.suspectName.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label>Suspect Mobile/Email</Label>
          <Input 
            placeholder="e.g. 9876543210 or suspect@example.com"
            {...register('suspectContact', {
              validate: (value) => {
                if (!value) return true;
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                const isPhone = /^\d{10}$/.test(value);
                return isEmail || isPhone || "Enter a valid Email or 10-digit Mobile Number";
              }
            })} 
          />
          {errors.suspectContact && <p className="text-red-500 text-sm mt-1">{errors.suspectContact.message as string}</p>}
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label>Suspect Identification Details</Label>
          <Input 
            placeholder="e.g. Bank Account Number, UPI ID, Profile URL" 
            {...register('suspectIdDetails', {
              minLength: { value: 3, message: "Details should be at least 3 characters" }
            })} 
          />
          {errors.suspectIdDetails && <p className="text-red-500 text-sm mt-1">{errors.suspectIdDetails.message as string}</p>}
        </div>
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label>Additional Info</Label>
          <textarea 
             className="w-full min-h-[100px] rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
             {...register('suspectAdditionalInfo')}
          ></textarea>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev} className="gap-2"><ChevronLeft className="h-4 w-4" /> Back</Button>
<Button type="button" onClick={handleSubmit(onNext)} className="gap-2">
  Review Details <ChevronRight className="h-4 w-4" />
</Button>
      </div>
    </form>
  );
}

function StepReview({ formData, onPrev, onSubmit, isSubmitting }: any) {
  // Get victim details from profile
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const victimName = user.name || formData.victimName || "John Doe (You)";
  
  return (
    <div className="space-y-8">
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
        <h3 className="font-semibold text-lg border-b border-slate-200 pb-2">Incident Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-500 block">Category</span> <span className="font-medium">{formData.category}</span></div>
          <div><span className="text-slate-500 block">Date & Time</span> <span className="font-medium">
  {formData.incidentDate
    ? format(new Date(formData.incidentDate), "dd MMM yyyy")
    : "N/A"}{" "}
  at {formData.incidentTime || "N/A"}
</span>
</div>
          <div><span className="text-slate-500 block">Platform</span> <span className="font-medium">{formData.incidentPlatform}</span></div>
          <div><span className="text-slate-500 block">Victim</span> <span className="font-medium">{victimName}</span></div>
        </div>
        <div>
          <span className="text-slate-500 block text-sm">Description</span>
          <p className="text-sm mt-1">{formData.incidentDescription}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input type="checkbox" id="declaration" className="mt-1 h-4 w-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500" />
        <label htmlFor="declaration" className="text-sm text-slate-600">
          I hereby declare that the information provided above is true to the best of my knowledge. I understand that filing a false complaint is a punishable offense.
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isSubmitting} className="gap-2"><ChevronLeft className="h-4 w-4" /> Back</Button>
        <Button 
          onClick={onSubmit} 
          variant="default" 
          size="lg" 
          disabled={isSubmitting}
          className="gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>Submit Complaint <CheckCircle className="h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}

function SuccessMessage({ ackNumber, isOffline }: { ackNumber?: string | null, isOffline?: boolean }) {
  const displayAck = ackNumber || `CYB-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="text-center py-12">
      <div className={`w-20 h-20 ${isOffline ? 'bg-yellow-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
        {isOffline ? (
            <WifiOff className="h-10 w-10 text-yellow-600" />
        ) : (
            <CheckCircle className="h-10 w-10 text-green-600" />
        )}
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        {isOffline ? "Complaint Saved (Offline Mode)" : "Complaint Submitted Successfully"}
      </h2>
      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        {isOffline 
            ? "We couldn't reach the server, so your complaint has been saved securely on your device. We will attempt to sync it when the connection is restored." 
            : "Your complaint has been registered. You will receive an SMS and Email with the acknowledgment number shortly."}
      </p>
      
      <div className="bg-slate-100 p-6 rounded-lg max-w-sm mx-auto mb-8">
        <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-1">Acknowledgement Number</p>
        <p className="text-3xl font-mono font-bold text-slate-900">{displayAck}</p>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => window.location.href = '/'}>Return Home</Button>
        <Button variant="default" onClick={() => window.location.href = '/dashboard/citizen'}>Track Status</Button>
      </div>
    </div>
  );
}
