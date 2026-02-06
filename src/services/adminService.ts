import apiService from './apiService';

export interface AdminComplaint {
    id: number;
    acknowledgementNo: string;
    category: string;
    incidentDate: string | null;
    reasonForDelay: string | null;
    additionalInfo: string | null;
    incidentLocation: string | null;
    state: string | null;
    district: string | null;
    policeStation: string | null;
    status: string;
    citizenId: number | null;
    citizenName: string | null;
    citizenMobile: string | null;
    firId: number | null;
    firNumber: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GetAllComplaintsResponse {
    statusCode: number;
    message: string;
    data: AdminComplaint[];
}

export interface ViewComplaintResponse {
    statusCode: number;
    message: string;
    data: AdminComplaint;
}

export interface UpdateStatusRequest {
    status: string;
    remarks: string;
    officerName?: string;
}

export interface UpdateStatusResponse {
    statusCode: number;
    message: string;
    data: AdminComplaint;
}

export interface DashboardStats {
    byCategory: Record<string, number>;
    resolvedComplaints: number;
    byRegion: Record<string, number>;
    pendingComplaints: number;
    byStatus: Record<string, number>;
    totalComplaints: number;
}

export interface DashboardStatsResponse {
    statusCode: number;
    message: string;
    data: DashboardStats;
}

export interface SuspectReport {
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

export interface GetSuspectReportsResponse {
    statusCode: number;
    message: string;
    data: SuspectReport[];
}

export interface Volunteer {
    id: number;
    name: string;
    mobile: string;
    email: string;
    state: string;
    type: string;
    date: string;
    status: string;
    type: string;
}

export interface GetVolunteersResponse {
    statusCode: number;
    message: string;
    data: Volunteer[];
}

export interface PoliceOfficer {
    id: number;
    officerCode: string;
    name: string;
    rank: string;
    state: string;
}

export interface GetPoliceOfficersResponse {
    statusCode: number;
    message: string;
    data: PoliceOfficer[];
}

export const getAllComplaints = async (): Promise<GetAllComplaintsResponse> => {
    try {
        const response = await apiService.get<GetAllComplaintsResponse>('/api/complaints');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const viewComplaintByAckNo = async (acknowledgementNo: string): Promise<ViewComplaintResponse> => {
    try {
        const response = await apiService.get<ViewComplaintResponse>(`/api/complaints/track/${acknowledgementNo}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateStatus = async (complaintId: number, data: UpdateStatusRequest): Promise<UpdateStatusResponse> => {
    try {
        const response = await apiService.post<UpdateStatusResponse>(`/api/police/complaints/${complaintId}/status`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
    try {
        const response = await apiService.get<DashboardStatsResponse>('/api/dashboard/stats');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const downloadComplaintsExcel = async (): Promise<Blob> => {
    try {
        const response = await apiService.getBlob('/api/documents/citizen/complaints/excel');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSuspectReportList = async (): Promise<GetSuspectReportsResponse> => {
    try {
        const response = await apiService.get<GetSuspectReportsResponse>('/api/suspects');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getVolunteersList = async (): Promise<GetVolunteersResponse> => {
    try {
        const response = await apiService.get<GetVolunteersResponse>('/api/volunteers');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllPoliceOfficers = async (): Promise<GetPoliceOfficersResponse> => {
    try {
        const response = await apiService.get<GetPoliceOfficersResponse>('/api/citizens/officers');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const generateFir = async (complaintId: number, officerId: number): Promise<any> => {
    try {
        const response = await apiService.post<any>(`/api/police/complaints/${complaintId}/upload-fir?officerId=${officerId}`, {});
        return response.data;
    } catch (error) {
        throw error;
    }
};