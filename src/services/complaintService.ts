import apiService from './apiService';

// Define the structure for the Complaint Request Payload
// Updated to match the backend requirement: Flattened structure with citizenId
export interface ComplaintRequest {
  category: string; // Enum-like string e.g., "BANKING_FRAUD"
  incidentDate: string; // ISO format
  reasonForDelay?: string;
  incidentDescription?: string;
  incidentLocation?: string;
  state: string;
  district: string;
  policeStation: string;
  citizenId: number;
  
  // Optional fields that might still be useful or returned
  acknowledgementNo?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; 
}

// Define the structure for the Complaint Response
export interface ComplaintResponse {
  statusCode: number;
  message: string;
  data: ComplaintRequest; // The created complaint object
}

/**
 * Service to handle Complaint related API calls
 */
const complaintService = {
  /**
   * Submit a new complaint
   * Endpoint: POST /api/complaints/submit
   * 
   * @param payload - The full complaint data object
   * @returns The response data from the server
   */
  submitComplaint: async (payload: ComplaintRequest): Promise<ComplaintResponse> => {
    try {
      // call the centralized apiService's post method
      const response = await apiService.post<ComplaintResponse>('/api/complaints/submit', payload);
      
      // Return the actual data payload from the backend response
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default complaintService;
