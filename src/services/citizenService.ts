import apiService from './apiService';

// Updated ComplaintRecord based on flattened response structure
export interface ComplaintRecord {
  id: number;
  apiId:number;
  acknowledgementNo: string;
  category: string;
  incidentDate: string;
  // reasonForDelay: string;
  incidentDescription: string;
  incidentLocation: string;
  state: string;
  district: string;
  policeStation: string;
  status: string;

  officerName: string;
  officerState: string;
  suspectName: string;
  suspectContact: string;
  suspectIdentificationDetails: string;
  suspectAdditionalInfo: string;
  
  // Flattened citizen details
  citizenId: number;
  citizenName: string;
  citizenMobile: string;
  
  // Flattened FIR details
  firId: number | null;
  firNumber: string | null;
  
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: number;
  status: string;
  remarks: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

export interface DashboardStats {
  totalReported: number;
  pending: number;
  underInvestigation: number;
  resolved: number;
  rejected: number;
}

// Service for citizen related operations
const citizenService = {
  /**
   * Get list of all complaints filed by a citizen
   * Endpoint: GET /api/complaints?citizenId={citizenId}
   */
  getMyComplaints: async (citizenId: number): Promise<ComplaintRecord[]> => {
    try {
      const response = await apiService.get<ApiResponse<ComplaintRecord[]>>(`/api/complaints?citizenId=${citizenId}`);
      // Return the data array from the response body
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get details of a specific complaint by Acknowledgement Number
   * Endpoint: GET /api/complaints/track/{ackNo}
   */
  getComplaintDetails: async (ackNo: string): Promise<ComplaintRecord> => {
    try {
      const response = await apiService.get<ApiResponse<ComplaintRecord>>(`/api/complaints/track/${ackNo}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get timeline of a specific complaint
   * Endpoint: GET /api/complaints/{complaintId}/timeline
   */
  getComplaintTimeline: async (complaintId: number): Promise<TimelineEvent[]> => {
    try {
      const response = await apiService.get<ApiResponse<TimelineEvent[]>>(`/api/complaints/${complaintId}/timeline`);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get AI prediction for status updates
   * Endpoint: POST /api/ai/status/tracking/updates?status={status}
   */
  aiPredict: async (status: string): Promise<string> => {
    try {
      const response = await apiService.post<ApiResponse<string>>(`/api/ai/status/tracking/updates?status=${status}`, {});
      return response.data.data;
    } catch (error) {
      console.error("AI Predict failed", error);
      return ""; // Return empty string on failure to avoid breaking UI
    }
  },

  /**
   * Withdraw a complaint (if allowed)
   * Endpoint: POST /api/citizen/complaints/:id/withdraw
   */
  withdrawComplaint: async (id: string, reason: string): Promise<any> => {
    try {
      const response = await apiService.post(`/api/citizen/complaints/${id}/withdraw`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Download FIR document
   * Endpoint: GET /api/documents/fir/{firId}
   */
  downloadFir: async (id: number): Promise<Blob> => {
    try {
      const response = await apiService.getBlob(`/api/police/complaints/${id}/download-fir`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default citizenService;
