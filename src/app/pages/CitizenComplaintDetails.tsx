import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft, FileText, User, MapPin, Calendar, Shield, Phone, Download, Mail, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ComplaintTimeline } from '../components/dashboard/ComplaintTimeline';
import citizenService, { ComplaintRecord } from '../../services/citizenService';

export function CitizenComplaintDetails() {
  const { id } = useParams(); // This is the acknowledgementNo
  const [complaint, setComplaint] = useState<ComplaintRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        // id param here corresponds to acknowledgementNo as per the dashboard link change
        const data = await citizenService.getComplaintDetails(id);
        setComplaint(data);
      } catch (err) {
        console.error("Failed to fetch complaint details", err);
        setError("Unable to load complaint details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaintDetails();
  }, [id]);

  const handleDownloadFir = async () => {
  if (!complaint?.id) {
    toast.error("Complaint ID not found");
    return;
  }

  try {
    const toastId = toast.loading("Downloading FIR...");

    const blob = await citizenService.downloadFir(complaint.id);

    if (!blob || blob.size === 0) {
      throw new Error("Empty file received");
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Let backend filename be used if possible
    link.href = url;
    link.download = `FIR_${complaint.firNumber || complaint.id}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.dismiss(toastId);
    toast.success("FIR downloaded successfully");
  } catch (err: any) {
    toast.dismiss();
    console.error("Download failed:", err);

    if (err?.response?.status === 404) {
      toast.error("FIR not available yet");
    } else {
      toast.error("Failed to download FIR");
    }
  }
};


  const getStatusColor = (status: string) => {
    if (!status) return 'bg-slate-100 text-slate-700';
    const s = status.toUpperCase().replace(/ /g, '_');
    switch (s) {
      case 'RESOLVED': return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'INVESTIGATING':
      case 'UNDER_INVESTIGATION': return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'REJECTED':
      case 'CLOSED': return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
      case 'FIR_GENERATED': return 'bg-red-100 text-red-700 hover:bg-red-100';
      default: return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          Loading complaint details...
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Complaint</h2>
          <p className="text-slate-500 mb-6">{error || "Complaint not found"}</p>
          <Link to="/dashboard/citizen">
            <Button>Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center gap-4">
            <Link to="/dashboard/citizen" aria-label="Back to Recent Complaints" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <h1 className="text-xl font-bold text-slate-900">
                  <span className="hidden sm:inline">Complaint</span> #{complaint.acknowledgementNo}
                </h1>
                <Badge className={`${getStatusColor(complaint.status)} w-fit`}>
                  {complaint.status}
                </Badge>
              </div>
            </div>
            {/* Download FIR Button - Conditional */}

            {complaint.status === 'FIR_GENERATED' && complaint.firId && (

              <Button
                size="sm"
                className="hidden sm:flex bg-orange-600 hover:bg-orange-700 text-white border-transparent"
                onClick={handleDownloadFir}
              >
                <Download className="h-4 w-4 mr-2" /> Download FIR
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Case Details Card */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Case Description
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Subject / Category</h3>
                    <p className="text-slate-900 font-medium">{complaint.category}</p>
                  </div>

                  {complaint.incidentDescription && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Incident Description</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{complaint.incidentDescription}</p>
                    </div>
                  )}

                  {/* {complaint.reasonForDelay && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Reason for Delay</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{complaint.reasonForDelay}</p>
                    </div>
                  )} */}

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50 mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span>Incident Date: {new Date(complaint.incidentDate).toLocaleDateString()}</span>
                    </div>
                    {complaint.state && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" />
                        <span>State: {complaint.state}</span>
                      </div>
                    )}
                    {complaint.district && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4" />
                        <span>District: {complaint.district}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Section */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Investigation Timeline
              </h2>
              <div className="w-full">
                <ComplaintTimeline
                  currentStatus={complaint.status}
                  complaintId={complaint.id}
                  onDownloadFir={
                    complaint.status === 'FIR_GENERATED' && complaint.firId
                      ? handleDownloadFir
                      : undefined
                  }
                />
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Police Station / Officer Card */}
            <Card className="overflow-hidden">
              <div className="bg-blue-600 p-4 text-white">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assigned Authority
                </h3>
              </div>
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      {complaint.officerName ? (
                        <>
                          <p className="font-bold text-slate-900">{complaint.officerName}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-slate-500 font-medium">Investigating Officer</p>
                            {complaint.officerState && (
                              <span className="text-xs text-slate-400">• {complaint.officerState}</span>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="font-bold text-slate-900">Cyber Crime Cell</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                      <span className="text-slate-600">
                        {complaint.district}, {complaint.officerState || complaint.state}
                      </span>
                    </div>
                    {/* Contact info */}
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">1930 (Helpline)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
