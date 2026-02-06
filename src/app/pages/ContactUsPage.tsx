import React, { useState } from 'react';
import { Search, Phone, Mail, MapPin, Building2, User } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface NodalOfficer {
  id: string;
  state: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
}

const MOCK_OFFICERS: NodalOfficer[] = [
  {
    id: '1',
    state: 'Andaman & Nicobar Islands',
    name: 'Shri. Kishore Kumar',
    designation: 'Superintendent of Police',
    email: 'sp-cyber.and@nic.in',
    phone: '03192-233077'
  },
  {
    id: '2',
    state: 'Andhra Pradesh',
    name: 'Shri. P.H.D. Ramakrishna',
    designation: 'SP Cyber Crimes',
    email: 'sp_cyber@ap.gov.in',
    phone: '0863-2340000'
  },
  {
    id: '3',
    state: 'Arunachal Pradesh',
    name: 'Shri. Rohit Rajbir Singh',
    designation: 'SP (SIT)',
    email: 'sp-sit@arunpol.nic.in',
    phone: '0360-2212345'
  },
  {
    id: '4',
    state: 'Assam',
    name: 'Shri. Rosie Kalita',
    designation: 'Superintendent of Police (CID)',
    email: 'cyber.cid@assampolice.gov.in',
    phone: '0361-2345678'
  },
  {
    id: '5',
    state: 'Bihar',
    name: 'Shri. Sushant Kumar Saroj',
    designation: 'SP (Cyber)',
    email: 'sp-cyber-bih@nic.in',
    phone: '0612-2233445'
  },
  {
    id: '6',
    state: 'Chandigarh',
    name: 'Shri. Ketan Bansal',
    designation: 'SP (Cyber Crime)',
    email: 'sp-cyber-chd@nic.in',
    phone: '0172-2740000'
  },
  {
    id: '7',
    state: 'Delhi',
    name: 'Shri. Hemant Tiwari',
    designation: 'DCP (IFSO)',
    email: 'dcp-cybercell-dl@nic.in',
    phone: '011-23456789'
  },
  {
    id: '8',
    state: 'Karnataka',
    name: 'Shri. Vamsi Krishna',
    designation: 'SP (Cyber Crime Division)',
    email: 'sp-cyber-ka@nic.in',
    phone: '080-22334455'
  },
  {
    id: '9',
    state: 'Maharashtra',
    name: 'Shri. Yashasvi Yadav',
    designation: 'IGP (Cyber)',
    email: 'ig.cyber-mah@gov.in',
    phone: '022-22160000'
  },
  {
    id: '10',
    state: 'Tamil Nadu',
    name: 'Shri. M.R. Sibi Chakravarthy',
    designation: 'SP (Cyber Crime Wing)',
    email: 'sp.ccw-tn@gov.in',
    phone: '044-28447788'
  }
];

export function ContactUsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOfficers = MOCK_OFFICERS.filter(officer =>
    officer.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
            <h1 className="text-2xl font-bold text-slate-900">Contact Us</h1>
          </div>
          <p className="mt-2 ml-4 text-slate-600 max-w-3xl">
            Get in touch with the National Cyber Crime Reporting Portal helpdesk or find the Nodal Officer for your State/UT.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        
        {/* Helpdesk Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-blue-900 px-6 py-4 border-b border-blue-800">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Phone className="w-5 h-5 mr-2 text-orange-400" />
              Central Helpdesk
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Helpline Number</h3>
                <p className="text-slate-600 mt-1">For immediate assistance with reporting cyber crime.</p>
                <div className="mt-2 text-2xl font-bold text-blue-700">1930</div>
                <p className="text-xs text-slate-500 mt-1">(24x7 Toll Free)</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Email Support</h3>
                <p className="text-slate-600 mt-1">For general queries and grievance redressal.</p>
                <a href="mailto:cybercrime-gov@nic.in" className="mt-2 inline-block text-lg font-medium text-blue-700 hover:underline">
                  cybercrime-gov@nic.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Nodal Officers Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-700" />
              State/UT Nodal Officers
            </h2>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search State or Officer..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    State / UT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Officer Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact Phone
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredOfficers.length > 0 ? (
                  filteredOfficers.map((officer, index) => (
                    <tr key={officer.id} className={index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        {officer.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-slate-400" />
                          {officer.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {officer.designation}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        <a href={`mailto:${officer.email}`} className="text-blue-600 hover:underline flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {officer.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-slate-400" />
                          {officer.phone}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-8 h-8 text-slate-300 mb-2" />
                        <p>No officers found matching "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 text-center">
              Note: The above list is subject to change. For any discrepancies, please contact the central helpdesk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
