import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Eye, Download, UserCheck, Calendar as CalendarIcon, X } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { VolunteerDto, volunteerApprovedList, exportList } from '../../../services/volunteerService';

export default function AdminVolunteers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const [allVolunteers, setAllVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await volunteerApprovedList();
      
      const mappedVolunteers = response.data.map((v: VolunteerDto) => ({
        id: v.id,
        name: v.volunteerName,
        mobile: v.mobileNo,
        email: v.email,
        state: v.state || 'Unknown',
        type: v.volunteerType ? v.volunteerType.replace(/_/g, ' ') : 'Volunteer',
        // API doesn't provide application date, defaulting to N/A or today if preferred.
        // For now using "Recent" or leaving as N/A to indicate missing data.
        date: v.createdAt.split('T')[0],
 
        status: (v.approved || v.status?.toUpperCase() === 'APPROVED') ? 'Approved' : (v.status || 'Pending'),
        originalData: v
      }));

      setAllVolunteers(mappedVolunteers);
    } catch (e: any) {
      // Silent fail for 500s or handled errors
      if (e?.response?.status !== 500) {
          console.error("Failed to load volunteers", e);
      }
      toast.error("Failed to load volunteer list");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await exportList();
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `approved_volunteers_${format(new Date(), 'yyyyMMdd')}.csv`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Volunteer list exported successfully");
    } catch (e) {
      console.error("Export failed", e);
      toast.error("Failed to export volunteer list");
    } finally {
      setExporting(false);
    }
  };

  // Filter volunteers
  const filteredVolunteers = allVolunteers.filter(v => 
    (v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.mobile.includes(searchTerm)) &&
    (!date || v.date === format(date, 'yyyy-MM-dd')) &&
    v.status === 'Approved'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Approved Cyber Volunteers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage active volunteer network</p>
        </div>
        <Button className="gap-2" onClick={handleExport} disabled={exporting}>
          <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
          {exporting ? 'Exporting...' : 'Export List'}
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by Name, Email or Mobile..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-[240px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Filter by Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDate(undefined)}
                  title="Clear date filter"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
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
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        Loading volunteers...
                      </td>
                    </tr>
                ) : filteredVolunteers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      {date ? "No approved volunteers found for the selected date." : "No approved volunteers found."}
                    </td>
                  </tr>
                ) : (
                  filteredVolunteers.map((volunteer) => (
                    <tr key={volunteer.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{volunteer.name}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs">{volunteer.mobile}</div>
                        <div className="text-xs text-slate-500">{volunteer.email}</div>
                      </td>
                      <td className="px-4 py-3">{volunteer.state}</td>
                      <td className="px-4 py-3">{volunteer.type}</td>
                      <td className="px-4 py-3">{volunteer.date}</td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          volunteer.status === 'Approved' ? 'secondary' : 
                          volunteer.status === 'Rejected' ? 'destructive' : 'outline'
                        } className={
                          volunteer.status === 'Approved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                          volunteer.status === 'Rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }>
                          {volunteer.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedVolunteer(volunteer)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
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

      {/* Volunteer Details Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Volunteer Application</h2>
              <button onClick={() => setSelectedVolunteer(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {selectedVolunteer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedVolunteer.originalData?.title ? `${selectedVolunteer.originalData.title} ` : ''}
                    {selectedVolunteer.name}
                  </h3>
                  <p className="text-slate-500">{selectedVolunteer.type}</p>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-slate-100 text-slate-800">{selectedVolunteer.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <label className="text-slate-500 block mb-1">Email</label>
                  <div className="font-medium">{selectedVolunteer.email}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Mobile</label>
                  <div className="font-medium">{selectedVolunteer.mobile}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">State</label>
                  <div className="font-medium">{selectedVolunteer.state}</div>
                </div>
                 <div>
                  <label className="text-slate-500 block mb-1">District</label>
                  <div className="font-medium">{selectedVolunteer.originalData?.district || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Date of Birth</label>
                  <div className="font-medium">{selectedVolunteer.originalData?.dateOfBirth || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Gender</label>
                  <div className="font-medium">{selectedVolunteer.originalData?.gender || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Father/Mother Name</label>
                  <div className="font-medium">{selectedVolunteer.originalData?.fatherOrMotherName || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Occupation</label>
                  <div className="font-medium">{selectedVolunteer.originalData?.occupation || 'N/A'}</div>
                </div>
                 <div>
                  <label className="text-slate-500 block mb-1">Qualification</label>
                  <div className="font-medium">{selectedVolunteer.originalData?.qualification || 'N/A'}</div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Certifications</label>
                  <div className="font-medium">{selectedVolunteer.originalData?.certifications || 'N/A'}</div>
                </div>
                <div className="col-span-2">
                   <label className="text-slate-500 block mb-1">National ID ({selectedVolunteer.originalData?.nationalIdType || 'ID'})</label>
                   <div className="font-medium">{selectedVolunteer.originalData?.nationalIdNumber || 'N/A'}</div>
                </div>
              </div>

              <div className="border-t pt-6 flex justify-end">
                <Button variant="outline" onClick={() => setSelectedVolunteer(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}