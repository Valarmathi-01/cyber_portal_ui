import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Globe, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Share2, 
  AlertTriangle, 
  FileText, 
  RefreshCw,
  Upload,
  Plus,
  CheckCircle,
  X,
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';

export function ReportSuspect() {
  const [reportType, setReportType] = useState('website');
  const [inputValue, setInputValue] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaCode, setCaptchaCode] = useState('WaC1r2');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Clear input when report type changes
  useEffect(() => {
    setInputValue('');
  }, [reportType]);

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  const reportOptions = [
    { id: 'phone', label: 'Mobile', icon: Smartphone },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'bank_account', label: 'Bank Account', icon: FileText },
    { id: 'website', label: 'Website Url', icon: Globe },
    { id: 'whatsapp', label: 'Whatsapp', icon: MessageSquare },
    { id: 'telegram', label: 'Telegram', icon: MessageSquare },
    { id: 'sms', label: 'SMS Header', icon: MessageSquare },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'app', label: 'Mobile App', icon: Smartphone },
    { id: 'other', label: 'other', icon: MoreHorizontal  },

    
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should not be more than 5 MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Validation logic based on reportType
    if (reportType === 'phone' || reportType === 'whatsapp') {
      // Allow only numbers
      if (!/^\d*$/.test(val)) return;
      // Limit to 10 digits
      if (val.length > 10) return;
    }
    
    setInputValue(val);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Report Suspect</h1>
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 text-blue-900 px-6 py-4 rounded-md mb-8 flex items-start text-sm">
        <Shield className="w-6 h-6 mr-3 flex-shrink-0 text-blue-700 mt-0.5" />
        <div>
          <p className="font-medium mb-1">
            This facility allows you to report suspicious unlawful activities and cybercrime attempts such as:
          </p>
          <p className="text-blue-800">
             Phishing URLs, Fraudulent WhatsApp/Telegram numbers, Suspicious Phone numbers, Email-IDs, SMS headers, Social Media content, etc.
             For immediate assistance, please contact our helpline at <span className="font-bold">1930</span>.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200">
        <div className="p-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            
            {/* State Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  State of Incident <span className="text-red-500">*</span>
                </label>
                <select 
                  name="state"
                  className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">--Select--</option>
                  <option value="ANDHRA_PRADESH">Andhra Pradesh</option>
                  <option value="ARUNACHAL_PRADESH">Arunachal Pradesh</option>
                  <option value="ASSAM">Assam</option>
                  <option value="BIHAR">Bihar</option>
                  <option value="CHHATTISGARH">Chhattisgarh</option>
                  <option value="GOA">Goa</option>
                  <option value="GUJARAT">Gujarat</option>
                  <option value="HARYANA">Haryana</option>
                  <option value="HIMACHAL_PRADESH">Himachal Pradesh</option>
                  <option value="JHARKHAND">Jharkhand</option>
                  <option value="KARNATAKA">Karnataka</option>
                  <option value="KERALA">Kerala</option>
                  <option value="MADHYA_PRADESH">Madhya Pradesh</option>
                  <option value="MAHARASHTRA">Maharashtra</option>
                  <option value="MANIPUR">Manipur</option>
                  <option value="MEGHALAYA">Meghalaya</option>
                  <option value="MIZORAM">Mizoram</option>
                  <option value="NAGALAND">Nagaland</option>
                  <option value="ODISHA">Odisha</option>
                  <option value="PUNJAB">Punjab</option>
                  <option value="RAJASTHAN">Rajasthan</option>
                  <option value="SIKKIM">Sikkim</option>
                  <option value="TAMIL_NADU">Tamil Nadu</option>
                  <option value="TELANGANA">Telangana</option>
                  <option value="TRIPURA">Tripura</option>
                  <option value="UTTAR_PRADESH">Uttar Pradesh</option>
                  <option value="UTTARAKHAND">Uttarakhand</option>
                  <option value="WEST_BENGAL">West Bengal</option>
                  <option value="DELHI">Delhi</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* What do you want to report? */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">
                What do you want to report? <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {reportOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = reportType === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setReportType(option.id)}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-lg border text-sm text-center transition-all h-24
                        ${isSelected 
                          ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 shadow-sm' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}
                      `}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span className="leading-tight text-xs font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Input Section */}
            <div className="bg-slate-50 p-6 rounded-md border border-slate-200 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    {reportOptions.find(o => o.id === reportType)?.label} <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type={reportType === 'phone' || reportType === 'whatsapp' || reportType === 'sms' ? 'tel' : reportType === 'email' ? 'email' : reportType === 'website' || reportType === 'social' ? 'url' : 'text'}
                    placeholder={`Enter ${reportOptions.find(o => o.id === reportType)?.label}`}
                    className="h-11 bg-white"
                    value={inputValue}
                    onChange={handleInputChange}
                    pattern={
                        reportType === 'phone' || reportType === 'whatsapp' ? '[0-9]{10}' : undefined
                    }
                    title={
                        reportType === 'phone' || reportType === 'whatsapp' ? 'Please enter exactly 10 digits' : undefined
                    }
                    required 
                  />
                  {reportType === 'phone' && (
                     <p className="text-xs text-red-600 mt-1">Do not add +91 prefix</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Upload Supporting Evidence <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                       <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="evidence-upload"
                        accept="image/*,.pdf"
                      />
                      <label 
                        htmlFor="evidence-upload"
                        className="flex items-center justify-center w-full h-11 px-4 border border-slate-300 rounded-md bg-white text-slate-600 cursor-pointer hover:bg-slate-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {file ? file.name : 'Choose File'}
                      </label>
                    </div>
                    <Button type="button" variant="outline" className="h-11 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
                      <Plus className="w-4 h-4 mr-1" /> Add More
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500">File size should not more than 5 MB</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
               <label className="block text-sm font-bold text-slate-700">
                  Description <span className="text-red-500">*</span>
               </label>
               <textarea
                 className="flex min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                 placeholder="Please describe the incident..."
                 maxLength={500}
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 required
               />
               <div className="flex justify-end">
                 <span className="text-xs text-slate-500">{500 - description.length} characters remaining</span>
               </div>
            </div>

            {/* Captcha */}
            <div className="space-y-2 max-w-sm">
                <label className="block text-sm font-bold text-slate-700">
                  Captcha <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div 
                    className="bg-slate-200 text-slate-600 text-xl font-mono font-bold tracking-widest px-6 py-2 rounded border border-slate-300 select-none w-full text-center h-11 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundImage: 'linear-gradient(45deg, #f1f5f9 25%, #e2e8f0 25%, #e2e8f0 50%, #f1f5f9 50%, #f1f5f9 75%, #e2e8f0 75%, #e2e8f0 100%)', backgroundSize: '20px 20px' }}
                  >
                    <span className="relative z-10" style={{ transform: 'rotate(-2deg)' }}>{captchaCode}</span>
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={refreshCaptcha}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Refresh Captcha"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </button>
                </div>
                <Input
                  type="text"
                  placeholder="Enter Captcha"
                  value={captchaValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCaptchaValue(e.target.value)}
                  className="h-11 mt-2"
                  required
                />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-center">
              <Button 
                type="submit" 
                className="bg-blue-900 hover:bg-blue-800 text-white px-12 h-12 font-medium text-lg shadow-sm"
                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  
                  if (captchaValue !== captchaCode) {
                    toast.error('Invalid Captcha');
                    return;
                  }
                  
                  if ((reportType === 'phone' || reportType === 'whatsapp') && inputValue.length !== 10) {
                    toast.error('Please enter a valid 10-digit number');
                    return;
                  }

                  // Get State from uncontrolled input
                  const form = e.currentTarget.closest('form');
                  const formData = new FormData(form!);
                  const state = formData.get('state') as string;

                  if (!state) {
                    toast.error('Please select a state');
                    return;
                  }

                  try {
                    const { default: suspectService } = await import('../../services/suspectService');

                    // Map reportType to identifierType
                    const getIdentifierType = (type: string) => {
                       switch(type) {
                           case 'website': return 'WEBSITE_URL';
                           case 'whatsapp': return 'WHATSAPP';
                           case 'phone': return 'MOBILE';
                           case 'email': return 'EMAIL';
                           case 'sms': return 'SMS_HEADER';
                           case 'social': return 'SOCIAL_MEDIA';
                           // case 'deepfake': return 'DEEPFAKE';
                           case 'app': return 'MOBILE_APP';
                           case 'bank_account': return 'BANK_ACCOUNT';
                           case 'telegram': return 'TELEGRAM';
                           default: return 'OTHER';
                       }
                    };

                    await suspectService.reportSuspect(
                        getIdentifierType(reportType),
                        inputValue,
                        state,
                        description
                    );

                    toast.success('Suspect reported successfully');
                    
                    // Reset Form
                    setIsSuccessModalOpen(true);
                    setCaptchaValue('');
                    setDescription('');
                    setFile(null);
                    setInputValue('');
                    refreshCaptcha();

                  } catch (error: any) {
                    console.error("Report failed", error);
                    toast.error(error.response?.data?.message || 'Failed to report suspect');
                  }
                }}
              >
                Submit
              </Button>
            </div>

          </form>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Success
              </h3>
              
              <p className="text-slate-600 mb-6">
                Report submitted successfully.
              </p>
              
              <Button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
