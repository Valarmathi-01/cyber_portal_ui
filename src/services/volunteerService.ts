import apiService from './apiService';



export interface VolunteerRegistrationDto {
  title: string;
  volunteerName: string;
  fatherOrMotherName: string;
  mobileNo: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  qualification: string;
  certifications: string;
  volunteerType: string;
  homePhone: string;
  nationalIdType: string;
  nationalIdNumber: string;
  houseNo: string;
  streetName: string;
  country: string;
  state: string;
  district: string;
  cityOrVillage: string;
  pincode: string;
}

export interface VolunteerDto {
  id: number;
  title: string | null;
  volunteerName: string;
  fatherOrMotherName: string | null;
  mobileNo: string;
  status: string | null;
  type: string | null;
  email: string;
  gender: string;
  dateOfBirth: string;
  occupation: string | null;
  qualification: string | null;
  certifications: string | null;
  volunteerType: string | null;
  resumePath: string | null;
  homePhone: string | null;
  nationalIdType: string | null;
  nationalIdNumber: string | null;
  passportPhotoPath: string | null;
  houseNo: string | null;
  streetName: string | null;
  country: string | null;
  state: string | null;
  district: string | null;
  cityOrVillage: string | null;
  pincode: string | null;
  approved: boolean;
  createdAt:string;
  updatedAt:string;

}

export interface GetVolunteerListResponse {
  statusCode: number;
  message: string;
  data: VolunteerDto[];
}
export const register = async (
  data: VolunteerRegistrationDto,
  resume: File,
  photo: File
) => {
  const formData = new FormData();

  // ✅ Send JSON correctly as application/json
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  formData.append("resume", resume);
  formData.append("photo", photo);

  // ✅ DO NOT manually set Content-Type
  return apiService.post("/api/volunteers/register", formData);
};


// export const register = async (data: VolunteerRegistrationDto, resume: File, photo: File) => {
//     const formData = new FormData();

//     // important: backend expects key name "data"
//     formData.append("data", JSON.stringify(data)); // ✅ string is enough

//     formData.append("resume", resume);
//     formData.append("photo", photo);

//     return apiService.post("/api/volunteers/register", formData, {
//       headers: {
//         // ✅ must be multipart
//         "Content-Type": "multipart/form-data",
//       },
//     });
// };

export const getVolunteerList = async (status?: string): Promise<GetVolunteerListResponse> => {
    const url = status ? `/api/volunteers/${status}` : '/api/volunteers/list';
    const response = await apiService.get<GetVolunteerListResponse>(url);
    return response.data;
};

export const volunteerApprovedList = async (): Promise<GetVolunteerListResponse> => {
    const response = await apiService.get<GetVolunteerListResponse>('/api/volunteers/APPROVED');
    return response.data;
};

export const updateVolunteerStatus = async (id: number, status: string) => {
    // sending status as query param to be safe, or could be body
    return apiService.put(`/api/volunteers/${id}/status?status=${status}`, {});
};

export const exportList = async () => {
    return apiService.getBlob('/api/volunteers/approved/excel');
};
