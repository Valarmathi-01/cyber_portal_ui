import React from 'react';
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Link } from 'react-router-dom';

export function VolunteerInstruction() {
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white py-6 shadow-md">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
           <div className="bg-white p-2 rounded-lg">
             <Shield className="h-10 w-10 text-orange-500" />
           </div>
           <div>
             <h1 className="text-2xl font-bold uppercase tracking-wider">National Cyber Crime Reporting Portal</h1>
             <p className="text-blue-200 text-sm">Cyber Volunteer Registration</p>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Section Title */}
          <div className="bg-blue-700 text-white px-6 py-3 border-b border-blue-800">
            <h2 className="text-lg font-bold uppercase tracking-wide flex items-center">
              Process of Registration
            </h2>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-slate-700 text-sm mb-6">
              For any society to feel safe and secure, citizen support enhances the efficacy of police efforts. 
              The Cyber Crime Volunteer Program aims to bring together citizens having passion to serve the society 
              in making the cyber space clean and safe. Any Indian citizen can associate by registering in any of the three categories of 'Cyber Volunteer', as mentioned below.
            </div>

            <div className="space-y-4 text-slate-700">
              <div className="flex gap-3">
                <span className="font-bold text-blue-800">1)</span>
                <p>Any citizen of India may register as a Cyber Volunteer.</p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-blue-800">2)</span>
                <p>To contribute as a Cyber Volunteer, register on National Cybercrime Reporting Portal (www.cybercrime.gov.in).</p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-blue-800">3)</span>
                <p>To register on Portal, create a Login ID. Mention name of State/UT of your residence and mobile number which are mandatory. Enter OTP received on your mobile on Login page and Submit.</p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-blue-800">4)</span>
                <div className="space-y-2">
                  <p>Provide the required information in "Registration Step 1" on page "USER VOLUNTEER PROFILE DETAILS". Further:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                    <li>Upload resume, ID Proof, Address Proof and Passport size photograph.</li>
                    <li>Select Type of Volunteership:
                      <ul className="list-circle pl-5 mt-1 space-y-1 text-slate-500 italic">
                        <li>Cyber Volunteer Unlawful Content Flagger</li>
                        <li>Cyber Awareness Promoter</li>
                        <li>Cyber Expert</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-blue-800">5)</span>
                <p>In "Registration Step 2", mention the reason to be a Cyber Volunteer, including other details, and submit.</p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-blue-800">6)</span>
                <p>Save and continue to come to "Preview and Final Submit".</p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-blue-800">7)</span>
                <p>In "Preview and Final Submit", recheck the details again before clicking "Final Submit".</p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-blue-800">8)</span>
                <p>For registration as 'Cyber Volunteer Unlawful Content Flagger', no prior verification (KYC) is required. After clicking 'Final Submit', direct reporting of unlawful content notices on Internet or any social media platform/group, website, email, etc. may be done at imminent bar of illegal acts.</p>
              </div>

              <div className="flex gap-3">
                <span className="font-bold text-blue-800">9)</span>
                <p>For registration as 'Cyber Awareness Promoter' or 'Cyber Expert', prior verification (KYC) will be carried out.</p>
              </div>
            </div>

            <div className="pt-8 flex justify-center">
              <Link to="/volunteer-registration">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Click here to Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
