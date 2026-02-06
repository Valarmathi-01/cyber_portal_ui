import apiService from './apiService';

export interface SuspectDetails {
    id: number;
    identifierType: string;
    identifierValue: string;
    incidentState: string;
    description: string;
    evidencePath: string | null;
    reportCount: number;
    firstReportedAt: string;
    lastReportedAt: string;
}

export interface SuspectReportResponse {
    suspect: SuspectDetails;
    message: string;
}

export interface SuspectSearchResponse {
    suspect: SuspectDetails;
    found: boolean;
}

const suspectService = {
  /**
   * Report a suspect
   * Endpoint: POST /api/suspects/report?identifierType={...}&...
   */
  reportSuspect: async (
    identifierType: string, 
    identifierValue: string, 
    incidentState: string, 
    description: string
  ): Promise<SuspectReportResponse> => {
    try {
      const queryParams = new URLSearchParams({
          identifierType,
          identifierValue,
          incidentState,
          description
      }).toString();
      
      const response = await apiService.post<SuspectReportResponse>(`/api/suspects/report?${queryParams}`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search for a suspect
   * Endpoint: GET /api/suspects/search?identifierType={...}&identifierValue={...}
   */
  searchSuspect: async (
    identifierType: string,
    identifierValue: string
  ): Promise<SuspectSearchResponse> => {
    try {
      const queryParams = new URLSearchParams({
          identifierType,
          identifierValue
      }).toString();

      const response = await apiService.get<SuspectSearchResponse>(`/api/suspects/search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default suspectService;
