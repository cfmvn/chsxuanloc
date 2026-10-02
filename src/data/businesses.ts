export interface BusinessItem {
  id: string;
  name: string;
  tagline: string;
  category: 'CongNghe' | 'YTe' | 'GiaoDuc' | 'XayDung' | 'SanXuat' | 'DichVu' | 'TaiChinh';
  categoryLabel: string;
  founderName: string;
  batch: string; // e.g. "Khóa 2005 - 2008"
  role: string;
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  address: string;
  city: string;
  logo?: string;
  description: string;
  hiring: boolean;
  hiringRoles?: string[];
  exclusiveOffer?: string; // Ưu đãi riêng cho cựu học sinh
  verified: boolean;
}

export const BUSINESS_CATEGORIES = [
  { id: 'ALL', label: 'Tất cả lĩnh vực' },
  { id: 'CongNghe', label: 'Công nghệ & Chuyển đổi số' },
  { id: 'YTe', label: 'Y tế & Chăm sóc sức khỏe' },
  { id: 'GiaoDuc', label: 'Giáo dục & Đào tạo' },
  { id: 'XayDung', label: 'Xây dựng & Bất động sản' },
  { id: 'SanXuat', label: 'Sản xuất & Nông nghiệp' },
  { id: 'DichVu', label: 'Thương mại & Dịch vụ' },
  { id: 'TaiChinh', label: 'Tài chính & Pháp lý' },
];

// Danh sách doanh nghiệp cựu học sinh (được tiếp nhận và phê duyệt từ form đăng ký)
export const INITIAL_BUSINESSES: BusinessItem[] = [];
