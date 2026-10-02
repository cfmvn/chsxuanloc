export interface AlumniContact {
  id: string;
  fullName: string;
  gradYear: number;
  batch: string; // e.g. "Khóa 2005 - 2008"
  className: string; // e.g. "12A1"
  homeroomTeacher?: string;
  currentLocation: string; // Tỉnh thành / Quốc gia
  currentJob: string;
  company?: string;
  bio?: string;
  facebook?: string;
  email?: string;
  phone?: string;
  verified: boolean;
}

// Danh sách cựu học sinh đăng ký thực tế (ban đầu để trống để tiếp nhận dữ liệu thật từ form/Firebase)
export const ALUMNI_DIRECTORY: AlumniContact[] = [];
