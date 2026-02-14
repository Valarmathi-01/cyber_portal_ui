import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, X, Download, AlertCircle, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import {
  getAllComplaints,
  downloadComplaintsExcel,
  viewComplaintByAckNo,
  updateStatus,
  getAllPoliceOfficers,
  generateFir
} from '../../../services/adminService';
import citizenService from '../../../services/citizenService';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getAllComplaints();

      // Transform API data to UI format
      const formattedComplaints = response.data.map(item => ({
        id: item.acknowledgementNo || `ACK-${item.id}`, // Use Acknowledgement No as ID
        apiId: item.id, // Keep numeric ID if needed
        citizenName: item.citizenName || 'Anonymous',
        category: item.category,
        date: item.incidentDate ? new Date(item.incidentDate).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString(),
        fullDate: item.createdAt,
        status: item.status,
        description: item.incidentDescription || 'No description provided',
        evidence: [], // API doesn't provide evidence list yet
        remarks: [],
        state: item.state,
        label: item.label,
        assignedOfficer: item.officerName || null,
        district: item.district,
        policeStation: item.policeStation
      }));

      setComplaints(formattedComplaints);
    } catch (error: any) {
      // Only log non-500 errors to avoid console spam during server outages
      if (error?.response?.status !== 500) {
        console.error('Failed to fetch complaints:', error);
      }
      toast.error('Failed to load complaints from server');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.info('Exporting data...');
      try {
        const blob = await downloadComplaintsExcel();
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Using .xlsx as endpoint says excel
        a.download = `complaints_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Complaints exported successfully');
      } catch (apiError) {
        console.warn('Backend export failed, falling back to client-side CSV generation');

        // Fallback: Generate CSV from current state data
        if (complaints.length === 0) {
          toast.warning('No data to export');
          return;
        }

        // CSV Header
        const headers = ['Complaint ID', 'Citizen Name', 'Category', 'Incident Date', 'Status', 'State', 'District'];

        // CSV Rows
        const rows = complaints.map(c => [
          c.id,
          `"${c.citizenName}"`, // Quote to handle commas
          c.category,
          c.date,
          c.status,
          c.state || '',
          c.district || ''
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `complaints_export_fallback_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success('Complaints exported successfully (Client-side Fallback)');
      }
    } catch (error) {
      console.error('Export failed completely:', error);
      toast.error('Failed to export complaints');
    }
  };

  const filteredComplaints = complaints.filter((c: any) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'RECEIVED': return 'bg-blue-100 text-blue-800 border-blue-200';
      // case 'ASSIGNED_TO_POLICE': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'UNDER_VERIFICATION': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FIR_GENERATED': return 'bg-red-100 text-red-800 border-red-200';
      case 'INVESTIGATING': return 'bg-amber-100 text-amber-800 border-amber-200';
      // case 'FOLLOW_UP_REQUIRED': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };
  const getLabelColor = (label: string) => {
    switch (label) {
      case 'LIKELY GENUINE':
        return 'bg-green-100 text-green-800 border-green-200';

      case 'POSSIBLY FAKE':
        return 'bg-red-100 text-red-800 border-red-200';

      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };



  const handleStatusChange = (newStatus: string) => {
    setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    toast.success(`Status updated locally to ${newStatus}`);
  };

  const handleOfficerAssign = (officerName: string, firGenerated = false, firFile: File | null = null) => {
    setSelectedComplaint({
      ...selectedComplaint,
      assignedOfficer: officerName,
      firGenerated: firGenerated,
      firDocument: firFile
    });
    toast.success(`Officer ${officerName} assigned`);
  };

  const statusFilters = ['All', 'SUBMITTED', 'RECEIVED', 'UNDER_VERIFICATION', 'FIR_GENERATED', 'INVESTIGATING', 'RESOLVED', 'CLOSED'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Complaints Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => { fetchComplaints(); }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 mr-2"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by ID or Name..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-64 h-10 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              >
                {statusFilters.filter(status => status !== 'FOLLOW_UP_REQUIRED' && status !== 'ASSIGNED_TO_POLICE').map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Statuses' : status.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Complaint ID</th>
                  <th className="px-4 py-3 font-medium">Citizen Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Label</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Loading complaints...
                    </td>
                  </tr>
                ) : currentComplaints.length > 0 ? (
                  currentComplaints.map((complaint: any) => (
                    <tr key={complaint.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-blue-900">{complaint.id}</td>
                      <td className="px-4 py-3">{complaint.citizenName}</td>
                      <td className="px-4 py-3">{complaint.category}</td>
                      <td className="px-4 py-3">{complaint.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getLabelColor(complaint.label)}`}
                        >
                          {complaint.label}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={async () => {
                            try {
                              const response = await viewComplaintByAckNo(complaint.id);
                              const item = response.data;

                              // Format for UI
                              const formatted = {
                                id: item.acknowledgementNo || `ACK-${item.id}`,
                                apiId: item.id,
                                citizenName: item.citizenName || 'Anonymous',
                                category: item.category,
                                date: new Date(item.createdAt).toLocaleDateString(),
                                fullDate: item.createdAt,
                                status: item.status,
                                description: item.incidentDescription || 'No description provided',
                                evidence: [],
                                remarks: [],
                                state: item.state,
                                assignedOfficer: item.officerName || null,
                                district: item.district,
                                policeStation: item.policeStation,
                                firId: item.firId,
                                firNumber: item.firNumber,
                                firGenerated: !!item.firId || !!item.firNumber
                              };

                              setSelectedComplaint(formatted);
                            } catch (err) {
                              console.error(err);
                              toast.error('Failed to fetch complaint details');
                            }
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No complaints found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredComplaints.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900">{startIndex + 1}</span> to <span className="font-medium text-slate-900">{Math.min(startIndex + itemsPerPage, filteredComplaints.length)}</span> of <span className="font-medium text-slate-900">{filteredComplaints.length}</span> entries
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm font-medium text-slate-600 px-2">
                  Page {currentPage} of {totalPages || 1}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Complaint Details</h2>
                <p className="text-sm text-slate-500">ID: {selectedComplaint.id}</p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-2">Incident Description</h3>
                    <p className="text-slate-700 whitespace-pre-wrap">{selectedComplaint.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Download className="w-4 h-4" /> Evidence
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedComplaint.evidence && selectedComplaint.evidence.length > 0 ? (
                        selectedComplaint.evidence.map((file: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-600">
                            <span className="truncate max-w-[150px]">{file}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-600">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 italic">No evidence attached.</p>
                      )}
                    </div>
                  </div>

                  {/* Assigned Investigator Section */}
                  {/* Assigned Investigator Section */}
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Assigned Investigator
                    </h3>

                    {selectedComplaint.status === 'FIR_GENERATED' ? (
                      <>
                        {!selectedComplaint.assignedOfficer ? (
                          <OfficerAssignmentModal
                            complaintId={selectedComplaint.apiId}
                            state={selectedComplaint.state}
                            onAssign={handleOfficerAssign}
                            onCancel={() => handleStatusChange('UNDER_VERIFICATION')}
                            isFirGenerated={selectedComplaint.firGenerated}
                          />
                        ) : (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-in fade-in">
                            <label className="text-xs font-semibold text-blue-800 uppercase">
                              Assigned Investigator
                            </label>

                            <div className="flex items-center gap-2 mt-2">
                              <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">
                                <Shield className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">
                                  {selectedComplaint.assignedOfficer}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Police Department - {selectedComplaint.state || 'Maharashtra'}
                                </p>
                              </div>
                            </div>

                            {/* FIR Document Section */}
                            {(selectedComplaint.firDocument || selectedComplaint.assignedOfficer) && (
                              <div className={`mt-4 border-t ${selectedComplaint.firDocument ? 'border-blue-200' : 'border-slate-200'} pt-3`}>
                                <p className={`text-xs font-semibold ${selectedComplaint.firDocument ? 'text-blue-800' : 'text-slate-500'} uppercase mb-2`}>
                                  Generated FIR Document
                                </p>
                                <div className={`flex items-center justify-between bg-white px-3 py-2 rounded border ${selectedComplaint.firDocument ? 'border-blue-200 shadow-sm' : 'border-slate-200 bg-slate-50'} `}>
                                  <div className="flex items-center gap-2">
                                    <div className={`h-8 w-8 rounded flex items-center justify-center ${selectedComplaint.firDocument ? 'bg-red-50 text-red-600' : 'bg-slate-200 text-slate-400'}`}>
                                      <Download className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className={`text-xs font-medium truncate max-w-[150px] ${selectedComplaint.firDocument ? 'text-slate-700' : 'text-slate-400'}`}>
                                        {selectedComplaint.firDocument ? selectedComplaint.firDocument.name :'fir document' }
                                      </span>
                                      {selectedComplaint.firDocument && (
                                        <span className="text-[10px] text-slate-500">
                                          {(selectedComplaint.firDocument.size / 1024).toFixed(1)} KB
                                        </span>
                                      )}
                                    </div>
                                  </div>
                            
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                      onClick={async () => {
                                        try {
                                          const blob = await citizenService.downloadFir(selectedComplaint.apiId);

                                          const url = window.URL.createObjectURL(blob);
                                          const a = document.createElement("a");
                                          a.href = url;
                                          a.download = `FIR_${selectedComplaint.apiId}.pdf`;
                                          document.body.appendChild(a);
                                          a.click();
                                          document.body.removeChild(a);
                                          window.URL.revokeObjectURL(url);

                                          toast.success("FIR downloaded successfully");
                                        } catch (error) {
                                          console.error(error);
                                          toast.error("Failed to download FIR");
                                        }
                                      }}
                                    >
                                      <Download className="w-4 h-4 mr-1" />
                                      Download
                                    </Button>

                                </div>
                              </div>
                            )}
                          </div>

                        )}

                      </>
                    ) : selectedComplaint.assignedOfficer ? (
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <label className="text-xs font-semibold text-slate-500 uppercase">
                          Investigating Officer
                        </label>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {selectedComplaint.assignedOfficer}
                            </p>
                            <p className="text-xs text-slate-500">
                              Police Department - {selectedComplaint.state || 'Maharashtra'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-lg border-dashed">
                        <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No investigator assigned yet.</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Officer assignment is available when status is FIR GENERATED.
                        </p>
                      </div>
                    )}
                  </div>


                </div>


                {/* Sidebar Info */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Status & Priority</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Current Status</label>
                        <select
                          className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={selectedComplaint.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                        >
                          {statusFilters
                            .filter(status => status !== 'ASSIGNED_TO_POLICE' && status !== 'FOLLOW_UP_REQUIRED' && status !== 'All')
                            .map(status => (
                              <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Date Reported</label>
                        <div className="text-sm text-slate-700">{selectedComplaint.date}</div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Reporter</label>
                        <div className="text-sm text-slate-700 font-medium">{selectedComplaint.citizenName}</div>
                      </div>

                      {selectedComplaint.state && (
                        <div>
                          <label className="text-xs font-medium text-slate-500 block mb-1">State</label>
                          <Badge variant="outline" className="font-normal">{selectedComplaint.state}</Badge>
                        </div>
                      )}

                      {selectedComplaint.district && (
                        <div>
                          <label className="text-xs font-medium text-slate-500 block mb-1">District</label>
                          <div className="text-sm text-slate-700">{selectedComplaint.district}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2 text-yellow-800">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Action Required</h4>
                        <p className="text-xs mt-1">Review evidence and update status within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedComplaint(null)}>Close</Button>
              <Button
                onClick={async () => {
                  if (!selectedComplaint) return;

                  try {
                    // Trigger FIR generation if status is changed to FIR_GENERATED
                    // const originalComplaint = complaints.find(c => c.id === selectedComplaint.id);
                    // const isNewFir = selectedComplaint.status === 'FIR_GENERATED' && originalComplaint?.status !== 'FIR_GENERATED';

                    // if (isNewFir && !selectedComplaint.firGenerated) {
                    //   if (!selectedComplaint.assignedOfficer) {
                    //     toast.error("Please assign an officer first");
                    //     return;
                    //   }

                    //   // We need the officer ID, but we only have the name in selectedComplaint
                    //   try {
                    //     toast.info("Generating FIR...");
                    //     const officersResponse = await getAllPoliceOfficers();
                    //     // Find officer by name from the list
                    //     let officerData: any[] = [];
                    //     if (Array.isArray(officersResponse.data)) {
                    //       officerData = officersResponse.data;
                    //     } else if (officersResponse.data && Array.isArray((officersResponse.data as any).data)) {
                    //       officerData = (officersResponse.data as any).data;
                    //     }

                    //     const officer = officerData.find((o: any) => o.name === selectedComplaint.assignedOfficer);

                    //     if (officer && officer.id) {
                    //       await generateFir(
                    //         selectedComplaint.apiId,
                    //         officer.id,
                    //         selectedComplaint.firDocument
                    //       );

                    //       // await generateFir(selectedComplaint.apiId, officer.id,firDocment.firFile);
                    //       toast.success("FIR Generated");
                    //     } else {
                    //       console.error("Officer not found or invalid ID:", officer);
                    //       toast.error("Could not find valid officer details for FIR generation");
                    //       return;
                    //     }
                    //   } catch (firError) {
                    //     console.error("FIR Generation failed:", firError);
                    //     toast.error("Failed to generate FIR. Please try again.");
                    //     return;
                    //   }
                    // }

                    await updateStatus(selectedComplaint.apiId, {
                      status: selectedComplaint.status,
                      remarks: "Status updated via Admin Portal",
                      officerName: selectedComplaint.assignedOfficer || undefined
                    });

                    toast.success('Status updated successfully');
                    await fetchComplaints();

                    // // Update local state
                    // setComplaints((prev) =>
                    //   prev.map(c => c.id === selectedComplaint.id ? {
                    //     ...selectedComplaint,
                    //     status: selectedComplaint.status,
                    //     assignedOfficer: selectedComplaint.assignedOfficer
                    //   } : c)
                    // );

                    setSelectedComplaint(null);
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to update status');
                  }
                }}
                className="bg-blue-900 text-white hover:bg-blue-800"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for Officer Assignment to handle lazy loading of data
function OfficerAssignmentModal({ complaintId, state, onAssign, onCancel, isFirGenerated }: { complaintId: number, state: string, onAssign: (name: string, firGenerated?: boolean, firFile?: File | null) => void, onCancel: () => void, isFirGenerated?: boolean }) {
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null); // Track selected officer
  const [firFile, setFirFile] = useState<File | null>(null);         // Track uploaded file

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        console.log("Fetching officers...");
        const response = await getAllPoliceOfficers();
        console.log("Officers API Response:", response);

        // Handle potential data nesting issues
        let officerData = [];
        if (Array.isArray(response.data)) {
          officerData = response.data;
        } else if (response.data && Array.isArray((response.data as any).data)) {
          officerData = (response.data as any).data;
        }

        console.log("Parsed Officers:", officerData);
        setOfficers(officerData);
      } catch (error) {
        console.warn("Failed to fetch officers from API", error);
        toast.error("Failed to load officers list");
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, []);

  const handleAssign = async () => {
    // Validate Officer
    if (!selectedOfficer) {
      toast.error("Please select an officer");
      return;
    }

    // Validate FIR File (only if in FIR mode and not yet generated)
    if (complaintId && !isFirGenerated) {
      if (!firFile) {
        toast.error("Please upload the FIR document");
        return;
      }

      if (!selectedOfficer?.id) {
        toast.error("Invalid officer selected (missing ID)");
        return;
      }

      try {
        toast.loading("Generating FIR...");
        // In a real scenario, we might want to upload the firFile here as well
        await generateFir(
          complaintId,
          selectedOfficer.id,
          firFile!
        );

        toast.dismiss();
        toast.success("FIR Generated successfully");
        // Pass true to indicate FIR was generated and include the file
        onAssign(selectedOfficer.name, true, firFile);
      } catch (error) {
        toast.dismiss();
        console.error(error);
        toast.error("Failed to generate FIR");
      }
    } else {
      onAssign(selectedOfficer.name, false, null);
    }
  };

  const filteredOfficers = officers.filter(officer => {
    if (!state) return true;
    // Normalize both states to lowercase and replace underscores with spaces
    const normalizedComplaintState = state.toLowerCase().replace(/_/g, ' ').trim();
    const normalizedOfficerState = (officer.state || '').toLowerCase().replace(/_/g, ' ').trim();

    return normalizedOfficerState === normalizedComplaintState ||
      normalizedOfficerState.includes(normalizedComplaintState) ||
      normalizedComplaintState.includes(normalizedOfficerState);
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Assign Officer
          </h3>
          <Button variant="ghost" size="sm" onClick={() => {
            const fetchOfficers = async () => {
              setLoading(true);
              try {
                const response = await getAllPoliceOfficers();
                if (response && response.data) setOfficers(response.data);
              } catch (e) { toast.error("Refresh failed"); }
              finally { setLoading(false); }
            };
            fetchOfficers();
          }}>Refresh</Button>
        </div>

        <p className="text-sm text-slate-600">
          Please select an investigating officer from <strong>{state || 'Maharashtra'}</strong> to assign to this FIR.
        </p>

        {loading ? (
          <div className="text-center py-8 text-slate-500">Loading officers...</div>
        ) : filteredOfficers.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {filteredOfficers.map((officer: any) => (
              <button
                key={officer.id}
                onClick={() => setSelectedOfficer(officer)}
                className={`w-full flex items-center justify-between p-3 rounded-md border transition-all group text-left ${selectedOfficer?.id === officer.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50'
                  }`}
              >
                <div className="flex flex-col items-start">
                  <span className={`font-medium ${selectedOfficer?.id === officer.id ? 'text-blue-700' : 'text-slate-800'} group-hover:text-blue-700`}>{officer.name}</span>
                  <span className="text-xs text-slate-500">{officer.rank}</span>
                </div>
                {selectedOfficer?.id === officer.id ? (
                  <Shield className="w-4 h-4 text-blue-600" />
                ) : (
                  <Badge variant="secondary" className="group-hover:bg-blue-200">Select</Badge>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-red-500 bg-red-50 rounded-md text-sm">
            No officers found for this region.
          </div>
        )}

        {complaintId && !isFirGenerated && (
          <div className="border-t pt-4 mt-2">
            <h4 className="text-sm font-semibold text-slate-800 mb-2">
              Upload FIR Document <span className="text-red-500">*</span>
            </h4>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFirFile(e.target.files?.[0] || null)}
                className="text-xs cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {!firFile && <p className="text-xs text-slate-400 mt-1">FIR document is required to proceed.</p>}
          </div>
        )}

        <div className="pt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedOfficer || (!!complaintId && !isFirGenerated && !firFile)}
            className="bg-blue-900 text-white hover:bg-blue-800"
          >
            {complaintId && !isFirGenerated ? 'Assign & Generate FIR' : 'Assign Officer'}
          </Button>
        </div>
      </div>
    </div>
  );
}