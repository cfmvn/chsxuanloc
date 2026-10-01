export interface BusinessItem {
  id: string;
  name: string;
  tagline: string;
  category: 'CongNghe' | 'YTe' | 'GiaoDuc' | 'XayDung' | 'AmThuc' | 'DichVu' | 'SanXuat' | 'TaiChinh';
  categoryLabel: string;
  founderName: string;
  batch: string; // e.g., "Khóa 2002 - 2005"
  role: string;
  phone?: string;
  email?: string;
  website?: string;
  address: string;
  city: string;
  logoUrl?: string;
  description: string;
  hiring: boolean;
  hiringRoles?: string[];
  exclusiveOffer?: string; // Ưu đãi đặc quyền cho cựu học sinh THPT Xuân Lộc
  verified: boolean;
}

export const BUSINESS_CATEGORIES = [
  { id: 'ALL', label: 'Tất cả lĩnh vực' },
  { id: 'CongNghe', label: 'Công nghệ & Chuyển đổi số' },
  { id: 'YTe', label: 'Y tế & Chăm sóc sức khỏe' },
  { id: 'GiaoDuc', label: 'Giáo dục & Đào tạo' },
  { id: 'XayDung', label: 'Xây dựng & Bất động sản' },
  { id: 'AmThuc', label: 'Ẩm thực & F&B' },
  { id: 'SanXuat', label: 'Sản xuất & Nông nghiệp' },
  { id: 'DichVu', label: 'Thương mại & Dịch vụ' },
  { id: 'TaiChinh', label: 'Tài chính & Pháp lý' },
];

export const INITIAL_BUSINESSES: BusinessItem[] = [
  {
    id: 'biz-01',
    name: 'Công Ty Cổ Phần Công Nghệ Titan Tech',
    tagline: 'Giải pháp phần mềm quản lý doanh nghiệp và ứng dụng di động chất lượng cao',
    category: 'CongNghe',
    categoryLabel: 'Công nghệ & Chuyển đổi số',
    founderName: 'Nguyễn Hoàng Long',
    batch: 'Khóa 2002 - 2005',
    role: 'Sáng lập & CEO',
    phone: '0908 123 456',
    email: 'long.nh@titantech.vn',
    website: 'https://titantech.vn',
    address: 'Tòa nhà Landmark, TP. Hồ Chí Minh & Chi nhánh Xuân Lộc',
    city: 'Hồ Chí Minh',
    description: 'Titan Tech đồng hành cùng hơn 200 doanh nghiệp vừa và nhỏ trong quá trình số hóa vận hành, tư vấn giải pháp AI và xây dựng hệ thống website/app hiện đại.',
    hiring: true,
    hiringRoles: ['Frontend Developer (React/Vue)', 'UI/UX Designer', 'Account Executive'],
    exclusiveOffer: 'Giảm 20% chi phí thiết kế website/hệ thống quản lý cho doanh nghiệp của Cựu học sinh Xuân Lộc.',
    verified: true
  },
  {
    id: 'biz-02',
    name: 'Phòng Khám Đa Khoa An Phúc Xuân Lộc',
    tagline: 'Chăm sóc sức khỏe gia đình tận tâm với đội ngũ bác sĩ chuyên khoa đầu ngành',
    category: 'YTe',
    categoryLabel: 'Y tế & Chăm sóc sức khỏe',
    founderName: 'Bác sĩ CKII Lê Minh Trí',
    batch: 'Khóa 1995 - 1998',
    role: 'Giám đốc chuyên môn',
    phone: '0251 387 1234',
    email: 'contact@anphucxuanloc.com',
    website: 'https://anphucxuanloc.com',
    address: 'QL1A, Thị Trấn Gia Ray, Huyện Xuân Lộc, Đồng Nai',
    city: 'Đồng Nai',
    description: 'Trang thiết bị chuẩn đoán hình ảnh và xét nghiệm hiện đại, phục vụ khám chữa bệnh cho bà con huyện nhà với tinh thần y đức cao nhất.',
    hiring: false,
    exclusiveOffer: 'Khám tổng quát và tư vấn miễn phí cho quý thầy cô cựu giáo viên THPT Xuân Lộc.',
    verified: true
  },
  {
    id: 'biz-03',
    name: 'Trung Tâm Anh Ngữ Sunrise Academy',
    tagline: 'Đào tạo IELTS, giao tiếp quốc tế và tiếng Anh phản xạ cho thế hệ trẻ',
    category: 'GiaoDuc',
    categoryLabel: 'Giáo dục & Đào tạo',
    founderName: 'Trần Thị Mai Phương (Thạc sĩ Ngôn ngữ Anh)',
    batch: 'Khóa 2008 - 2011',
    role: 'Giám đốc Đào tạo',
    phone: '0937 654 321',
    email: 'admissions@sunriseacademy.edu.vn',
    address: 'Khu phố 3, Thị trấn Gia Ray, Xuân Lộc, Đồng Nai',
    city: 'Đồng Nai',
    description: 'Cam kết chuẩn đầu ra IELTS 6.5+, môi trường luyện nói năng động, học bổng 50% cho học sinh nghèo hiếu học tại các trường THPT trong huyện.',
    hiring: true,
    hiringRoles: ['Giáo viên IELTS 7.5+', 'Trợ giảng tiếng Anh'],
    exclusiveOffer: 'Giảm 15% học phí trọn khóa cho con em và người thân của cựu học sinh.',
    verified: true
  },
  {
    id: 'biz-04',
    name: 'Công Ty Cổ Phần Thiết Kế & Xây Dựng Nam Phát',
    tagline: 'Kiến tạo không gian sống tiện nghi, bền vững và trường tồn',
    category: 'XayDung',
    categoryLabel: 'Xây dựng & Bất động sản',
    founderName: 'KTS. Phạm Quốc Bảo',
    batch: 'Khóa 1998 - 2001',
    role: 'Tổng Giám Đốc',
    phone: '0912 888 999',
    email: 'namphat.const@gmail.com',
    address: 'Đường Hùng Vương, Biên Hòa, Đồng Nai',
    city: 'Đồng Nai',
    description: 'Chuyên tư vấn thiết kế kiến trúc, thi công biệt thự, nhà phố, cảnh quan sân vườn và công trình thương mại tại Đồng Nai, Bình Dương và TP.HCM.',
    hiring: true,
    hiringRoles: ['Kỹ sư giám sát hiện trường', 'Họa viên 3D Sketchup/Revit'],
    exclusiveOffer: 'Tặng 100% hồ sơ thiết kế phối cảnh khi ký hợp đồng thi công trọn gói.',
    verified: true
  },
  {
    id: 'biz-05',
    name: 'Chuỗi Cà Phê Mộc Chứa Chan & Nông Sản Sạch',
    tagline: 'Hương vị cà phê nguyên chất từ vùng đất đỏ bazan Xuân Lộc',
    category: 'AmThuc',
    categoryLabel: 'Ẩm thực & F&B',
    founderName: 'Đặng Thanh Tùng',
    batch: 'Khóa 2012 - 2015',
    role: 'Đồng sáng lập',
    phone: '0978 222 333',
    email: 'tung.mocchuachan@gmail.com',
    address: 'Chân núi Chứa Chan, Xuân Lộc, Đồng Nai',
    city: 'Đồng Nai',
    description: 'Mô hình kết hợp cafe trải nghiệm, camping ngắm núi Chứa Chan và cung cấp hạt cafe rang mộc hữu cơ xuất khẩu.',
    hiring: false,
    exclusiveOffer: 'Giảm 10% toàn menu đồ uống cho các buổi họp mặt lớp/hội khóa cựu học sinh.',
    verified: true
  },
  {
    id: 'biz-06',
    name: 'Hãng Luật Vạn Tín & Cộng Sự',
    tagline: 'Bảo vệ quyền lợi hợp pháp, tư vấn pháp lý doanh nghiệp và đầu tư',
    category: 'TaiChinh',
    categoryLabel: 'Tài chính & Pháp lý',
    founderName: 'Luật sư Vũ Anh Tuấn',
    batch: 'Khóa 1993 - 1996',
    role: 'Luật sư điều hành',
    phone: '0903 999 111',
    email: 'tuan.vu@vantinlaw.com',
    website: 'https://vantinlaw.com',
    address: 'Quận 1, TP. Hồ Chí Minh',
    city: 'Hồ Chí Minh',
    description: 'Hơn 15 năm kinh nghiệm tư vấn M&A, tranh tụng kinh doanh thương mại và pháp lý bất động sản.',
    hiring: false,
    exclusiveOffer: 'Tư vấn pháp lý sơ bộ miễn phí cho các startup do cựu học sinh sáng lập.',
    verified: true
  }
];
