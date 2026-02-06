import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function CyberVolunteerPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header Bar */}


      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Section Title */}
            <div className="bg-blue-700 px-6 py-3 border-b border-blue-800">
                <h2 className="text-lg font-bold text-white flex items-center">
                    <span className="w-1.5 h-6 bg-orange-500 mr-3 rounded-full"></span>
                    About cyber volunteer
                </h2>
            </div>

            <div className="p-8 space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                    <p className="text-sm text-blue-900 font-medium">
                        For any society to feel safe and secure, citizen support enhances the efficacy of police efforts. 
                        Cyber Crime Volunteer Program aims to bring together citizens having passion to serve the society 
                        in making the cyber space clean and safe. Any Indian citizen can associate by registering in any 
                        of the three categories of 'Cyber Volunteer', as mentioned below.
                    </p>
                </div>

                <div className="space-y-4 text-slate-700 text-sm md:text-base leading-relaxed">
                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">1)</span>
                        <p>Any citizen of India may register as Cyber Volunteer.</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">2)</span>
                        <p>To contribute as a Cyber Volunteer, register on National CyberCrime Reporting Portal (www.cybercrime.gov.in).</p>
                    </div>

                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">3)</span>
                        <p>To register on Portal, create Login ID. Mention name of State/UT of your residence and mobile number which are mandatory. Enter OTP received on your mobile on Login Id page and submit.</p>
                    </div>

                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">4)</span>
                        <div>
                            <p className="mb-2">Provide the required information in 'Registration Step 1' on page "USER VOLUNTEER PROFILE DETAILS". Further,</p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-600 ml-1">
                                <li>Upload resume, ID Proof*, Address Proof* and Passport size photograph.</li>
                                <li>Select Type of Volunteership:</li>
                            </ul>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-center font-medium text-slate-800">
                                    Cyber Volunteer Unlawful Content Flagger
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-center font-medium text-slate-800">
                                    Cyber Awareness Promoter
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-center font-medium text-slate-800">
                                    Cyber Expert
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">5)</span>
                        <p>In 'Registration Step 2', mention the reason to be a Cyber Volunteer, including other details, and submit.</p>
                    </div>

                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">6)</span>
                        <p>Save and continue to come to "Preview and Final Submit".</p>
                    </div>

                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">7)</span>
                        <p>In "Preview and Final Submit", recheck the details again before clicking "Final Submit".</p>
                    </div>

                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">8)</span>
                        <p>For registration as "Cyber Volunteer Unlawful Content Flagger", no prior verification (KYC) is required. After clicking Final Submit, start reporting of unlawful content noticed on internet or any social media platform/group, website, email, etc. may be done at imminent bar of the go-in.</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">9)</span>
                        <p>For registration as Cyber Awareness Promoter or Cyber Expert, prior verification (KYC) will be carried out.</p>
                    </div>

                    <div className="flex gap-3">
                        <span className="font-bold text-blue-800 min-w-[20px]">10)</span>
                        <p>Applicable ID and Address proof required to be uploaded:</p>
                    </div>

                    <div className="ml-8 text-xs bg-yellow-50 text-yellow-800 p-3 border border-yellow-200 rounded">
                         <p className="font-semibold mb-1">• ID proof: i.e. Aadhar Card/Indian Passport/Voter ID card/PAN Card/Driving License</p>
                         <p className="font-semibold">• Residence proof: i.e. Indian Passport/Voter ID card/Electricity Bill (Not older than 3 months)/Domicile Certificate with photo of address.</p>
                    </div>
                </div>

                <div className="pt-8 flex justify-center">
                    <Button 
                        onClick={() => navigate('/cyber-volunteer/register')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 text-base shadow-md transition-all transform hover:scale-105"
                    >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Click here to Register
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
