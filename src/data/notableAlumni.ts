export interface NotableAlumni {
  id: string;
  name: string;
  category: 'HocThuat' | 'GiaoVien' | 'ChinhTri' | 'DoanhNhan' | 'NgheThuat' | 'MuiNhon';
  categoryLabel: string;
  batch: string;
  role: string;
  organization: string;
  achievements: string;
  icon: string;
}

export const NOTABLE_ALUMNI: NotableAlumni[] = [
  // 1. Nghiên cứu & Học thuật
  {
    id: 'na-01',
    name: 'TS. Vũ Xuân Bạch Dương',
    category: 'HocThuat',
    categoryLabel: 'Nghiên cứu & Học thuật',
    batch: 'Thập niên 1990',
    role: 'Tiến sĩ Khoa học • Giảng viên',
    organization: 'Đại học Quốc gia Chi Nan (NCNU, Đài Loan)',
    achievements: 'Gương mặt học thuật tiêu biểu của ngành giáo dục Đồng Nai với nhiều bài báo khoa học xuất bản trên tạp chí ISI/Scopus quốc tế.',
    icon: '🔬'
  },
  {
    id: 'na-02',
    name: 'Nhóm NCS & ThS Ngành Data Science (UIT)',
    category: 'HocThuat',
    categoryLabel: 'Nghiên cứu & Học thuật',
    batch: 'Khóa 2015 – 2018',
    role: 'Kỹ sư Dữ liệu • Nhà nghiên cứu AI',
    organization: 'Đại học Công nghệ Thông tin (ĐHQG TP.HCM)',
    achievements: 'Công trình nghiên cứu về Khoa học Dữ liệu được công nhận và xuất bản tại Hội nghị Quốc tế ComNetSat uy tín.',
    icon: '💻'
  },
  {
    id: 'na-03',
    name: 'Thế Hệ Bác Sĩ & Dược Sĩ Chuyên Khoa',
    category: 'HocThuat',
    categoryLabel: 'Y Tế & Sức Khỏe',
    batch: 'Thập niên 1990 – 2015',
    role: 'Bác sĩ CK I, II • ThS Y học',
    organization: 'BV Chợ Rẫy, BV ĐH Y Dược TP.HCM, BV Đa khoa Đồng Nai, BV Long Khánh',
    achievements: 'Lực lượng nòng cốt trong ngành y tế công lập, thường xuyên tổ chức khám chữa bệnh thiện nguyện phục vụ bà con huyện nhà.',
    icon: '🩺'
  },

  // 2. Giáo viên cốt cán
  {
    id: 'na-04',
    name: 'Thế Hệ Cựu Học Sinh Trở Về Giảng Dạy (1985 – 1995)',
    category: 'GiaoVien',
    categoryLabel: 'Giáo Viên Cốt Cán',
    batch: 'Khóa 1985 – 1995',
    role: 'Cán bộ quản lý • Tổ trưởng chuyên môn',
    organization: 'Trường THPT Xuân Lộc',
    achievements: 'Trực tiếp bồi dưỡng hàng trăm học sinh giỏi đạt giải cấp tỉnh Toán, Lý, Hóa, Văn; đạt danh hiệu Giáo viên dạy giỏi & Chiến sĩ thi đua cấp tỉnh.',
    icon: '📖'
  },
  {
    id: 'na-05',
    name: 'Cô Lê Thị Hiền & Nhóm GV Hướng Dẫn NCKH',
    category: 'GiaoVien',
    categoryLabel: 'Giáo Viên Cốt Cán',
    batch: 'Thế hệ 2000s',
    role: 'Giáo viên bộ môn • Huấn luyện viên STEM/NCKH',
    organization: 'Trường THPT Xuân Lộc',
    achievements: 'Hướng dẫn học sinh liên tục đạt giải cao tại Cuộc thi Sáng tạo Thanh thiếu niên nhi đồng và Cuộc thi KHKT cấp tỉnh, cấp Quốc gia.',
    icon: '💡'
  },
  {
    id: 'na-06',
    name: 'Thế Hệ Giáo Viên Trẻ Tiên Phong Công Nghệ (Khóa 2010+)',
    category: 'GiaoVien',
    categoryLabel: 'Giáo Viên Cốt Cán',
    batch: 'Khóa 2010 trở đi',
    role: 'Giáo viên Tin học, Ngoại ngữ • Cố vấn CLB',
    organization: 'Trường THPT Xuân Lộc',
    achievements: 'Lực lượng tiên phong chuyển đổi số trong nhà trường, ứng dụng AI trong giảng dạy và cố vấn đài truyền thông học đường XLMedia.',
    icon: '🚀'
  },

  // 3. Quản lý Nhà nước & LLVT
  {
    id: 'na-07',
    name: 'Khối Lãnh Đạo Huyện Ủy, HĐND, UBND Huyện Xuân Lộc',
    category: 'ChinhTri',
    categoryLabel: 'Quản Lý Nhà Nước',
    batch: 'Khóa 1985 – 2000',
    role: 'Bí thư, Chủ tịch, Trưởng các ban ngành',
    organization: 'Huyện ủy & UBND Huyện Xuân Lộc, Tỉnh Đồng Nai',
    achievements: 'Chỉ đạo và thực hiện thắng lợi đề án đưa Xuân Lộc trở thành Huyện Nông thôn mới đầu tiên của cả nước (2014) và NTM nâng cao kiểu mẫu.',
    icon: '🏛️'
  },
  {
    id: 'na-08',
    name: 'Đội Ngũ Sĩ Quan Quân Đội & Công An Nhân Dân',
    category: 'ChinhTri',
    categoryLabel: 'Lực Lượng Vũ Trang',
    batch: 'Nhiều thế hệ',
    role: 'Sĩ quan chỉ huy, Cán bộ',
    organization: 'Công an tỉnh Đồng Nai, Quân đoàn 4, Quân khu 7',
    achievements: 'Bảo đảm an ninh trật tự, quốc phòng an ninh trên địa bàn trọng điểm cửa ngõ miền Đông Nam Bộ.',
    icon: '🛡️'
  },

  // 4. Doanh nhân & Alumni
  {
    id: 'na-09',
    name: 'Anh Dương Quang Châu',
    category: 'DoanhNhan',
    categoryLabel: 'Doanh Nhân & Alumni',
    batch: 'Khóa 1986 – 1989',
    role: 'Doanh nhân • Trưởng Ban Liên Lạc CHS tại TP.HCM',
    organization: 'Ban Liên Lạc Cựu Học Sinh THPT Xuân Lộc',
    achievements: 'Khởi xướng và tài trợ nhiều công trình xã hội hóa của trường: sân khấu ngoài trời, khuôn viên cảnh quan, phòng máy tính kỷ niệm 30 và 40 năm.',
    icon: '🏢'
  },
  {
    id: 'na-10',
    name: 'Anh Đoàn Quang Vinh',
    category: 'DoanhNhan',
    categoryLabel: 'Doanh Nhân & Alumni',
    batch: 'Khóa 2009 – 2012',
    role: 'Doanh nhân trẻ khởi nghiệp',
    organization: 'Đại diện Cựu Học Sinh Thế Hệ Trẻ',
    achievements: 'Tài trợ thường niên Quỹ học bổng "Thắp sáng ước mơ" và hỗ trợ trực tiếp các học sinh có hoàn cảnh đặc biệt khó khăn.',
    icon: '🌱'
  },

  // 5. Văn hóa Nghệ thuật
  {
    id: 'na-11',
    name: 'Ca Sĩ Hồ Trung Dũng',
    category: 'NgheThuat',
    categoryLabel: 'Nghệ Thuật & Văn Hóa',
    batch: 'Cựu học sinh trường',
    role: 'Ca sĩ • Nghệ sĩ biểu diễn chuyên nghiệp',
    organization: 'Showbiz Việt Nam / Âm nhạc Trữ tình & Jazz Pop',
    achievements: 'Nghệ sĩ tên tuổi của nền âm nhạc Việt Nam; từng theo học tại trường trước khi theo học chuyên sâu ngôn ngữ và nghệ thuật tại TP.HCM.',
    icon: '🎵'
  },

  // 6. Học sinh mũi nhọn & Đội tuyển Quốc gia gần đây
  {
    id: 'na-12',
    name: 'Trịnh Ngọc Bảo An',
    category: 'MuiNhon',
    categoryLabel: 'Mũi Nhọn Quốc Gia',
    batch: 'Khóa 2023 – 2026 (Lớp 12A10)',
    role: 'Đội tuyển HSG Quốc Gia',
    organization: 'Đội tuyển HSG Quốc Gia môn Tin học tỉnh Đồng Nai',
    achievements: 'Thành viên Đội tuyển Học sinh giỏi Quốc gia môn Tin học năm 2026, khẳng định năng lực thuật toán đỉnh cao của học sinh vùng đất Gia Ray.',
    icon: '⭐'
  },
  {
    id: 'na-13',
    name: 'Nguyễn Thị Yến Thư, Phan Thanh Bảo & Trương Thị Phương Anh',
    category: 'MuiNhon',
    categoryLabel: 'Sáng Tạo Khoa Học',
    batch: 'Khóa 2023 – 2026',
    role: 'Nhóm tác giả Sáng tạo KHKT',
    organization: 'Cuộc thi Sáng tạo Thanh thiếu niên, nhi đồng cấp tỉnh 2026',
    achievements: 'Đạt Giải Nhì cấp tỉnh năm 2026 với đề tài nghiên cứu ứng dụng thực tiễn dưới sự hướng dẫn của cô Lê Thị Hiền.',
    icon: '🥇'
  }
];
