import React, { useState, useEffect } from 'react';
import { CheckCircle, FileText, Search, User, ShieldCheck, Lock, ClipboardList, AlertTriangle, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import citizenService, { TimelineEvent } from '../../../services/citizenService';

interface TimelineStep {
  id: string;
  title: string;
  date: string;
  desc: string;
  status: 'completed' | 'current' | 'pending';
  icon: any;
  updatedBy?: string; // Added for real data
}

const STEP_DEFINITIONS: Record<string, { title: string, icon: any, desc: string }> = {
  'SUBMITTED': { 
    title: 'Complaint Submitted', 
    icon: CheckCircle, 
    desc: 'Complaint has been successfully submitted to the portal.' 
  },
  'RECEIVED': { 
    title: 'Complaint Received', 
    icon: ClipboardList, 
    desc: 'Complaint acknowledged by the Cyber Crime Department.' 
  },
  'UNDER_VERIFICATION': { 
    title: 'Under Verification', 
    icon: Search, 
    desc: 'Initial verification of complaint details and evidence.' 
  },
  'FIR_GENERATED': { 
    title: 'FIR Generated', 
    icon: FileText, 
    desc: 'First Information Report (FIR) has been officially registered.' 
  },
  'INVESTIGATING': { 
    title: 'Investigation', 
    icon: User, 
    desc: 'Investigating Officer assigned and investigation is in progress.' 
  },
  'RESOLVED': { 
    title: 'Resolved', 
    icon: ShieldCheck, 
    desc: 'Investigation completed and case resolved.' 
  },
  'CLOSED': { 
    title: 'Closed', 
    icon: Lock, 
    desc: 'Case file has been officially closed.' 
  },
  'REJECTED': {
    title: 'Rejected',
    icon: AlertTriangle,
    desc: 'Complaint has been rejected.'
  }
};

// Helper to format mock dates based on status state
const getStepDate = (stepStatus: 'completed' | 'current' | 'pending', offsetDays: number = 0): string => {
  if (stepStatus === 'pending') return 'Pending';
  
  const date = new Date();
  date.setDate(date.getDate() - offsetDays);
  
  // Format: 12 Oct 2023, 10:30 AM
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }) + ', ' + '10:30 AM'; // Using static time for consistency in mock
};

export function ComplaintTimeline({ currentStatus, complaintId, onDownloadFir }: { currentStatus?: string, complaintId?: number, onDownloadFir?: () => void }) {
  
  // State for real data
  const [realEvents, setRealEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(''); // Unused for now

  // AI Prediction State
  const [prediction, setPrediction] = useState('');

  // Fetch real data if complaintId is provided
  useEffect(() => {
    if (complaintId) {
      const fetchTimeline = async () => {
        try {
          setIsLoading(true);
          const data = await citizenService.getComplaintTimeline(complaintId);
          // Sort oldest first (SUBMITTED -> ...)
          const sorted = [...data].sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
          setRealEvents(sorted);
        } catch (err) {
          console.error("Failed to fetch timeline", err);
          // setError("Failed to load timeline");
        } finally {
          setIsLoading(false);
        }
      };
      fetchTimeline();
    }
  }, [complaintId]);

  // Determine current effective status for prediction
  // For Real Data: Use the status of the last event (which is the current/latest status)
  // For Legacy: Use the currentStatus prop
  const latestEventStatus = (complaintId && realEvents.length > 0) 
    ? realEvents[realEvents.length - 1].status 
    : currentStatus;

  // Fetch AI Prediction
  useEffect(() => {
    if (latestEventStatus) {
      const fetchPrediction = async () => {
        try {
          const pred = await citizenService.aiPredict(latestEventStatus);
          setPrediction(pred);
        } catch (e) {
          console.error("Failed to fetch AI prediction", e);
        }
      };
      fetchPrediction();
    }
  }, [latestEventStatus]);

  // Logic for Legacy (Mock/Static) Mode
  const getLegacySteps = () => {
    const normalizeStatus = (status: string): string => {
        if (!status) return 'SUBMITTED';
        const s = status.toUpperCase().replace(/ /g, '_');
        if (s === 'UNDER_INVESTIGATION') return 'INVESTIGATING';
        if (s === 'FIR_REGISTERED') return 'FIR_GENERATED';
        return s;
    };

    const normalizedStatus = normalizeStatus(currentStatus || 'SUBMITTED');
    let visibleStepIds: string[] = [];

    switch (normalizedStatus) {
        case 'SUBMITTED':
        case 'RECEIVED':
        case 'UNDER_VERIFICATION':
        visibleStepIds = ['SUBMITTED', 'RECEIVED', 'UNDER_VERIFICATION'];
        break;
        case 'FIR_GENERATED':
        visibleStepIds = ['SUBMITTED', 'RECEIVED', 'UNDER_VERIFICATION', 'FIR_GENERATED', 'INVESTIGATING', 'RESOLVED'];
        break;
        case 'INVESTIGATING':
        visibleStepIds = ['SUBMITTED', 'RECEIVED', 'UNDER_VERIFICATION', 'FIR_GENERATED', 'INVESTIGATING', 'RESOLVED', 'CLOSED'];
        break;
        case 'RESOLVED':
        visibleStepIds = ['SUBMITTED', 'RECEIVED', 'UNDER_VERIFICATION', 'FIR_GENERATED', 'INVESTIGATING', 'RESOLVED', 'CLOSED'];
        break;
        case 'CLOSED':
        visibleStepIds = ['SUBMITTED', 'RECEIVED', 'UNDER_VERIFICATION', 'CLOSED'];
        break;
        default:
        visibleStepIds = ['SUBMITTED', 'RECEIVED', 'UNDER_VERIFICATION'];
    }

    let currentIndex = visibleStepIds.indexOf(normalizedStatus);
    if (currentIndex === -1) currentIndex = visibleStepIds.length - 1;

    return visibleStepIds.map((stepId, index) => {
        const config = STEP_DEFINITIONS[stepId];
        let stepStatus: 'completed' | 'current' | 'pending' = 'pending';

        if (index < currentIndex) {
        stepStatus = 'completed';
        } else if (index === currentIndex) {
        stepStatus = 'current';
        }

        return {
        id: stepId,
        title: config.title,
        icon: config.icon,
        desc: config.desc,
        status: stepStatus,
        date: getStepDate(stepStatus, (currentIndex - index) * 2)
        };
    });
  };

  // Logic for Real Data Mode
  const getRealSteps = (): TimelineStep[] => {
      return realEvents.map((event, index) => {
          const normalizedStatus = event.status ? event.status.toUpperCase().replace(/ /g, '_') : 'SUBMITTED';
          const config = STEP_DEFINITIONS[normalizedStatus] || { 
              title: event.status, 
              icon: ClipboardList, 
              desc: event.remarks 
          };
          
          const isLatest = index === realEvents.length - 1;
          
          return {
              id: normalizedStatus,
              title: config.title, 
              icon: config.icon,
              desc: event.remarks,
              status: isLatest ? 'current' : 'completed', 
              date: new Date(event.updatedAt).toLocaleDateString('en-GB', { 
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              }),
              updatedBy: event.updatedBy
          };
      });
  };

  // Decide which steps to render
  const steps = (complaintId && realEvents.length > 0) ? getRealSteps() : getLegacySteps();

  if (complaintId && isLoading && realEvents.length === 0) {
      return <div className="text-sm text-slate-500 py-4">Loading timeline...</div>;
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {steps.map((step, index) => (
        <div key={index} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${step.status === 'current' ? 'is-active' : ''}`}>
          
          {/* Icon Marker */}
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 relative z-10 ${
            step.status === 'completed' ? 'bg-green-500 text-white' : 
            step.status === 'current' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            <step.icon className="w-5 h-5" />
          </div>

          {/* Content Card */}
          <div className="flex-1 md:flex-none md:w-[calc(50%-2.25rem)] bg-white p-6 rounded-lg border border-slate-200 shadow-sm ml-4 md:ml-0 md:group-odd:ml-4 md:group-even:mr-4 text-left">
            <div className="flex flex-col items-start gap-1 mb-1">
              <div className="font-bold text-slate-900 text-sm">{step.title}</div>
              <time className={`font-medium text-xs ${step.status === 'current' ? 'text-orange-600' : 'text-slate-400'}`}>
                {step.date}
              </time>
            </div>
            <div className="text-slate-600 text-xs mb-3">{step.desc}</div>
            
            {step.updatedBy && (
                 <div className="text-[10px] text-slate-400">Updated by: {step.updatedBy}</div>
            )}

            {/* AI Prediction for Current Status */}
            {step.status === 'current' && prediction && (
               <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start gap-3 mt-3">
                 <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-sm font-semibold text-blue-800 mb-1">AI Prediction</p>
                   <p className="text-xs text-slate-600 leading-relaxed">{prediction}</p>
                 </div>
               </div>
            )}
            
            {/* Download FIR Button - Show if FIR is generated (Current or Completed step) */}
            {step.id === 'FIR_GENERATED' && (step.status === 'completed' || step.status === 'current') && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs h-auto py-1 mt-2"
                onClick={onDownloadFir}
                disabled={!onDownloadFir}
              >
                <Download className="h-3 w-3 mr-2" /> Download FIR Copy
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}