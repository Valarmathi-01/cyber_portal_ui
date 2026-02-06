import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Eye, Download, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import { VolunteerDto, getVolunteerList, updateVolunteerStatus } from '../../../services/volunteerService';

export default function AdminVolunteerRegistrations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [registrations, setRegistrations] = useState<VolunteerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<VolunteerDto | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await getVolunteerList('PENDING');
      if (response && response.data) {
        setRegistrations(response.data);
      }
    } catch (error) {
      console.error('Error fetching volunteer registrations:', error);
      toast.error('Failed to fetch volunteer registrations');
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(r => 
    r.volunteerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.mobileNo.includes(searchTerm)
  );

  const handleApprove = async (id: number) => {
    try {
      await updateVolunteerStatus(id, 'APPROVED');
      toast.success('Volunteer approved and onboarded successfully');
      setSelectedRegistration(null);
      fetchRegistrations();
    } catch (error) {
      console.error('Error approving volunteer:', error);
      toast.error('Failed to approve volunteer');
    }
  };

  const handleReject = (id: number) => {
    // In a real implementation, this would call an API endpoint
    toast.info('Rejection functionality would connect to backend API here');
    setSelectedRegistration(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Volunteer Registrations</h1>
          <p className="text-slate-500 text-sm mt-1">Review and process new volunteer applications</p>
        </div>
        <Button onClick={fetchRegistrations} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex gap-4">
            <div className="relative w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by Name, Email or Mobile..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">State</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        Loading registrations...
                      </div>
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No registrations found.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{reg.volunteerName}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs">{reg.mobileNo}</div>
                        <div className="text-xs text-slate-500">{reg.email}</div>
                      </td>
                      <td className="px-4 py-3">{reg.state || 'N/A'}</td>
                      <td className="px-4 py-3">{reg.volunteerType || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`
                          ${reg.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'}
                        `}>
                          {reg.status || (reg.approved ? 'Approved' : 'Pending')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedRegistration(reg)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Registration Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Review Application</h2>
              <button onClick={() => setSelectedRegistration(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                  {selectedRegistration.volunteerName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedRegistration.volunteerName}</h3>
                  <p className="text-slate-500">{selectedRegistration.volunteerType}</p>
                </div>
                <div className="ml-auto">
                  <Badge className={`
                    ${selectedRegistration.approved ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'}
                  `}>
                    {selectedRegistration.status || (selectedRegistration.approved ? 'Approved' : 'Pending Review')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <label className="text-slate-500 block mb-1">Email</label>
                  <div className="font-medium">{selectedRegistration.email}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Mobile</label>
                  <div className="font-medium">{selectedRegistration.mobileNo}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">State</label>
                  <div className="font-medium">{selectedRegistration.state || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">District</label>
                  <div className="font-medium">{selectedRegistration.district || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Date of Birth</label>
                  <div className="font-medium">{selectedRegistration.dateOfBirth}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Gender</label>
                  <div className="font-medium">{selectedRegistration.gender}</div>
                </div>
                 <div>
                  <label className="text-slate-500 block mb-1">Father/Mother Name</label>
                  <div className="font-medium">{selectedRegistration.fatherOrMotherName || 'N/A'}</div>
                </div>
                 <div>
                  <label className="text-slate-500 block mb-1">Occupation</label>
                  <div className="font-medium">{selectedRegistration.occupation || 'N/A'}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                 <h4 className="font-medium mb-3">Address Details</h4>
                 <div className="text-sm text-slate-700">
                    <p>{selectedRegistration.houseNo} {selectedRegistration.streetName}</p>
                    <p>{selectedRegistration.cityOrVillage}, {selectedRegistration.district}</p>
                    <p>{selectedRegistration.state}, {selectedRegistration.country}</p>
                    <p>PIN: {selectedRegistration.pincode}</p>
                 </div>
              </div>

              {!selectedRegistration.approved && (
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-md flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                    <span className="font-semibold">Verification Required:</span> Please verify the applicant details before approving.
                    </div>
                </div>
              )}

              <div className="border-t pt-6 flex gap-3 justify-end">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReject(selectedRegistration.id)}>
                  Reject Application
                </Button>
                {!selectedRegistration.approved && (
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(selectedRegistration.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve & Onboard
                    </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}