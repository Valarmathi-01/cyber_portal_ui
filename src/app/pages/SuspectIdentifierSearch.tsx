import React, { useState } from 'react';
import { RefreshCw, Search, AlertCircle, Shield, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';

export function SuspectIdentifierSearch() {
  const [searchType, setSearchType] = useState('mobile');
  const [captchaValue, setCaptchaValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<'found' | 'not-found' | null>(null);
  const [reportCount, setReportCount] = useState<number>(0);
  
  // Dummy captcha generation
  const [captchaCode, setCaptchaCode] = useState('WaC1r2');

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue) {
      return; 
    }
    if (!captchaValue) {
      return;
    }
    if (captchaValue !== captchaCode) {
      alert('Invalid Captcha'); 
      return;
    }

    // Determine result randomly for demo purposes
    // In a real app, this would be an API call
    const isFound = Math.random() > 0.5;
    
    if (isFound) {
      setSearchResult('found');
      // Generate random count between 1 and 50
      setReportCount(Math.floor(Math.random() * 50) + 1);
    } else {
      setSearchResult('not-found');
      setReportCount(0);
    }
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchResult(null);
    refreshCaptcha();
    setCaptchaValue('');
  };

  const radioOptions = [
    { id: 'mobile', label: 'Mobile' },
    { id: 'email', label: 'E-mail' },
    { id: 'bank', label: 'Bank Account Number' },
    { id: 'social', label: 'Social Media' },
    { id: 'upi', label: 'UPI ID' },
    { id: 'website', label: 'Website URL' },
    { id: 'app', label: 'Mobile App' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl relative">
      {/* Header Note */}
      <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-md mb-8 flex items-start text-sm">
        <Shield className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-blue-700" />
        <p>
          This Repository of suspect identifier has been created on the basis of multiple complaints 
          filed by citizens for cybercrimes on this portal.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-md overflow-hidden border border-slate-200">
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <Search className="w-5 h-5 mr-2 text-slate-600" />
            Suspect Identifier Search
          </h1>
        </div>

        <div className="p-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              // This logic is now superseded by the button onClick, 
              // but we keep it or can leave it empty if we want to rely on the button.
              // However, since the button calls preventDefault, this won't run.
            }} 
            className="max-w-3xl mx-auto space-y-8"
          >
            
            {/* Selection Type */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                Select Search Parameter:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {radioOptions.map((option) => (
                  <label 
                    key={option.id} 
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      searchType === option.id 
                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="searchType"
                      value={option.id}
                      checked={searchType === option.id}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-slate-700 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Warning Text for Mobile */}
            {searchType === 'mobile' && (
              <div className="flex items-center text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-100">
                <AlertCircle className="w-4 h-4 mr-2" />
                Do not add +91 with Mobile number
              </div>
            )}

            {/* Input Fields Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4 border-t border-slate-100">
              
              {/* Left Column: Search Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {searchType === 'mobile' ? 'Enter Mobile No' : 
                   searchType === 'email' ? 'Enter E-mail Address' :
                   searchType === 'bank' ? 'Enter Bank Account Number' :
                   searchType === 'social' ? 'Enter Social Media Handle/URL' :
                   searchType === 'upi' ? 'Enter UPI ID' :
                   searchType === 'website' ? 'Enter Website URL' :
                   searchType === 'app' ? 'Enter Mobile App Name' : 'Enter Value'}
                   <span className="text-red-500 ml-1">*</span>
                </label>
                <Input
                  type={
                    searchType === 'mobile' || searchType === 'bank' ? 'tel' : 
                    searchType === 'email' ? 'email' : 
                    searchType === 'website' ? 'url' : 
                    'text'
                  }
                  placeholder={`Enter ${radioOptions.find(o => o.id === searchType)?.label}`}
                  value={searchValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Restrict numeric input for Mobile and Bank
                    if ((searchType === 'mobile' || searchType === 'bank')) {
                      if (!/^\d*$/.test(val)) return;
                      if (searchType === 'mobile' && val.length > 10) return;
                      if (searchType === 'bank' && val.length > 20) return;
                    }
                    setSearchValue(val);
                  }}
                  pattern={
                    searchType === 'mobile' ? '[0-9]{10}' :
                    searchType === 'bank' ? '[0-9]{9,20}' :
                    searchType === 'upi' ? '[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}' :
                    undefined
                  }
                  title={
                    searchType === 'mobile' ? 'Please enter exactly 10 digits' :
                    searchType === 'bank' ? 'Please enter a valid account number (9-20 digits)' :
                    searchType === 'upi' ? 'Please enter a valid UPI ID (e.g. name@bank)' :
                    undefined
                  }
                  className="h-11"
                  required
                />
              </div>

              {/* Right Column: Captcha */}
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Captcha <span className="text-red-500 ml-1">*</span>
                    </label>
                    
                    {/* Captcha Box */}
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
                  </div>
                </div>

                <Input
                  type="text"
                  placeholder="Enter Captcha"
                  value={captchaValue}
                  onChange={(e) => setCaptchaValue(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-center md:justify-start">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 h-11 font-medium text-base shadow-sm"
                onClick={async (e) => {
                  e.preventDefault();
                  
                  // Validation
                  if (!searchValue) return;
                  if (!captchaValue) return;
                  
                  if (captchaValue !== captchaCode) {
                    alert('Invalid Captcha');
                    return;
                  }

                  try {
                    const { default: suspectService } = await import('@/services/suspectService');
                    
                    // Map local searchType to backend identifierType
                    let apiType = 'OTHER';
                    switch(searchType) {
                        case 'mobile': apiType = 'MOBILE'; break;
                        case 'email': apiType = 'EMAIL'; break;
                        case 'bank': apiType = 'BANK_ACCOUNT'; break;
                        case 'social': apiType = 'SOCIAL_MEDIA'; break;
                        case 'upi': apiType = 'UPI_ID'; break;
                        case 'website': apiType = 'WEBSITE_URL'; break;
                        case 'app': apiType = 'MOBILE_APP'; break;
                        default: apiType = searchType.toUpperCase();
                    }

                    const response = await suspectService.searchSuspect(apiType, searchValue);
                    
                    if (response.found && response.suspect) {
                      setSearchResult('found');
                      setReportCount(response.suspect.reportCount);
                    } else {
                      setSearchResult('not-found');
                      setReportCount(0);
                    }
                    setIsModalOpen(true);
                  } catch (err) {
                    console.error("Search failed", err);
                    setSearchResult('not-found');
                    setReportCount(0);
                    setIsModalOpen(true);
                  }
                }}
              >
                Search
              </Button>
            </div>

          </form>
        </div>
      </div>

      {/* Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className={`p-8 text-center ${searchResult === 'found' ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm ${searchResult === 'found' ? 'bg-white text-red-600 ring-4 ring-red-100' : 'bg-white text-green-600 ring-4 ring-green-100'}`}>
                {searchResult === 'found' ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
              </div>
              
              <h3 className={`text-2xl font-bold mb-2 ${searchResult === 'found' ? 'text-red-900' : 'text-green-900'}`}>
                {searchResult === 'found' ? 'Suspect Record Found' : 'No Records Found'}
              </h3>
              
              <div className="mb-8">
                {searchResult === 'found' ? (
                  <div className="space-y-4">
                    <div className="bg-white/80 rounded-xl p-4 border border-red-100 shadow-sm mx-auto max-w-[200px]">
                      <span className="block text-4xl font-extrabold text-red-600 leading-none mb-1">{reportCount}</span>
                      <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Complaints</span>
                    </div>
                    <p className="text-sm font-medium text-red-800">Exercise extreme caution with this identifier.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                     <p className="text-green-800 font-medium">This identifier has no reported history.</p>
                     <p className="text-xs text-green-700 opacity-80">Always remain vigilant during transactions.</p>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={closeModal}
                className={`w-full h-12 text-base shadow-sm ${searchResult === 'found' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Close Search
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
