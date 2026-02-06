import React from 'react';
import { Shield, Phone, Mail, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-orange-500" />
              <div>
                <h3 className="text-white font-bold text-lg">CyberCrime</h3>
                <p className="text-xs uppercase tracking-widest text-slate-500">Reporting Portal</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              An initiative by Government of India to facilitate victims/complainants to report cyber crime complaints online.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">File a Complaint</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cyber Safety Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal & Policy</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Citizen Charter</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>Helpline: 1930 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>support@cybercrime.gov.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-orange-500" />
                <span>www.cybercrime.gov.in</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          <p>© {newXZate().getFullYear()} National Cyber Crime Reporting Portal. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function newXZate() { return new Date(); }
