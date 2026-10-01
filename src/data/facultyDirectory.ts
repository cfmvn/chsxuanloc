export interface FacultyMember {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  startYear: string;
  period: string;
  status: 'Đang công tác' | 'Đã nghỉ hưu' | 'Đã chuyển công tác';
  roleOrNote: string;
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const departmentsData: Department[] = [
  { id: 'toan', name: 'Tổ Toán học', icon: '📐', description: 'Nòng cốt bồi dưỡng tư duy logic, STEM Toán và đội tuyển HSG' },
  { id: 'van', name: 'Tổ Ngữ văn', icon: '📖', description: 'Gìn giữ hồn văn học, dự án trải nghiệm và văn hóa đọc' },
  { id: 'ly-cn', name: 'Tổ Vật lý - Công nghệ', icon: '⚡', description: 'Tiên phong hướng dẫn NCKH, sáng tạo kỹ thuật và thực nghiệm' },
  { id: 'hoa', name: 'Tổ Hóa học', icon: '🧪', description: 'Đổi mới thí nghiệm số, luyện thi chuyên sâu và bồi dưỡng HSG' },
  { id: 'sinh', name: 'Tổ Sinh học', icon: '🌱', description: 'Thực địa sinh thái Chứa Chan, Y sinh và bảo vệ môi trường' },
  { id: 'tin', name: 'Tổ Tin học', icon: '💻', description: 'Huấn luyện HSG Quốc gia môn Tin học, chuyển đổi số & AI' },
  { id: 'su-dia-gdcd', name: 'Tổ Sử - Địa - GDKT&PL', icon: '🏛️', description: 'Giáo dục di sản, chủ quyền biển đảo và pháp lý học đường' },
  { id: 'ngoai-ngu', name: 'Tổ Ngoại ngữ (Tiếng Anh)', icon: '🌐', description: 'Phát triển CLB E-Club, mô hình Debate và chứng chỉ quốc tế' },
  { id: 'the-chat-gdqp', name: 'Tổ Thể dục - GDQP-AN', icon: '🏃', description: 'Đoàn Hội khỏe Phù Đổng, hội thao GDQP và rèn luyện thể chất' },
];

export const facultyMembersData: FacultyMember[] = [
  // 1. Tổ Toán học
  {
    id: 'toan-1',
    name: 'Thầy Trần Đình Vinh',
    departmentId: 'toan',
    departmentName: 'Tổ Toán học',
    startYear: '~1990',
    period: '1990 – ~2015',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Cựu Hiệu trưởng, giáo viên Toán cốt cán cấp tỉnh.'
  },
  {
    id: 'toan-2',
    name: 'Thầy Bùi Văn Dũng',
    departmentId: 'toan',
    departmentName: 'Tổ Toán học',
    startYear: '~1995',
    period: '1995 – 2023',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Cựu Phó Hiệu trưởng, bồi dưỡng nhiều thế hệ HSG Toán tỉnh.'
  },
  {
    id: 'toan-3',
    name: 'Thầy Nguyễn Đình Cường',
    departmentId: 'toan',
    departmentName: 'Tổ Toán học',
    startYear: '1988',
    period: '1988 – 2020',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Cựu Phó Hiệu trưởng, đóng góp lớn thời kỳ đầu dựng trường.'
  },
  {
    id: 'toan-4',
    name: 'Thầy Trần Hữu Quyết',
    departmentId: 'toan',
    departmentName: 'Tổ Toán học',
    startYear: '~2000',
    period: '2000 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tổ trưởng chuyên môn, giáo viên dạy giỏi, luyện thi đại học và HSG.'
  },
  {
    id: 'toan-5',
    name: 'Cô Nguyễn Thị Thanh Trúc',
    departmentId: 'toan',
    departmentName: 'Tổ Toán học',
    startYear: '~2005',
    period: '2005 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Cốt cán bồi dưỡng HSG môn Toán, phụ trách đội tuyển trường.'
  },
  {
    id: 'toan-6',
    name: 'Thầy Lê Minh Tâm',
    departmentId: 'toan',
    departmentName: 'Tổ Toán học',
    startYear: '~1998',
    period: '1998 – 2018',
    status: 'Đã chuyển công tác',
    roleOrNote: 'Chuyển công tác về TP. Biên Hòa.'
  },
  {
    id: 'toan-7',
    name: 'Thầy Võ Văn Hùng',
    departmentId: 'toan',
    departmentName: 'Tổ Toán học',
    startYear: '~2008',
    period: '2008 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Ứng dụng CNTT trong giảng dạy hình học không gian, STEM Toán.'
  },
  {
    id: 'toan-8',
    name: 'Cô Phan Thị Lệ Hà',
    departmentId: 'toan',
    departmentName: 'Tổ Toán học',
    startYear: '~2002',
    period: '2002 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Giáo viên dạy giỏi cấp tỉnh, nhiệt huyết trong công tác chủ nhiệm.'
  },
  {
    id: 'toan-9',
    name: 'Thầy Đặng Văn Tuấn',
    departmentId: 'toan',
    departmentName: 'Tổ Toán học',
    startYear: '~2012',
    period: '2012 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Thế hệ giáo viên trẻ, cựu học sinh trường quay về công tác.'
  },

  // 2. Tổ Ngữ văn
  {
    id: 'van-1',
    name: 'Cô Trần Thị Kim Tân',
    departmentId: 'van',
    departmentName: 'Tổ Ngữ văn',
    startYear: '1986',
    period: '1986 – 2017',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Cựu Hiệu trưởng, Huân chương Lao động hạng Ba cá nhân, lãnh đạo đưa trường lên chuẩn quốc gia.'
  },
  {
    id: 'van-2',
    name: 'Thầy Hồ Văn Sinh',
    departmentId: 'van',
    departmentName: 'Tổ Ngữ văn',
    startYear: '~1992',
    period: '1992 – 2021',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Cựu Hiệu trưởng, Thạc sĩ Ngữ văn, tác giả nhiều sáng kiến kinh nghiệm cấp tỉnh.'
  },
  {
    id: 'van-3',
    name: 'Cô Đinh Thị Thanh Nguyên',
    departmentId: 'van',
    departmentName: 'Tổ Ngữ văn',
    startYear: '~1995',
    period: '1995 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Cựu Phó Hiệu trưởng, giáo viên cốt cán bồi dưỡng HSG Văn của huyện và tỉnh.'
  },
  {
    id: 'van-4',
    name: 'Cô Lê Thị Bích Ngọc',
    departmentId: 'van',
    departmentName: 'Tổ Ngữ văn',
    startYear: '~2001',
    period: '2001 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tổ trưởng chuyên môn, đổi mới phương pháp dạy học dự án văn học.'
  },
  {
    id: 'van-5',
    name: 'Cô Trần Thị Mai Phương',
    departmentId: 'van',
    departmentName: 'Tổ Ngữ văn',
    startYear: '~2006',
    period: '2006 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Đội tuyển HSG Văn cấp tỉnh, thành tích cao tại hội thi GVDG.'
  },
  {
    id: 'van-6',
    name: 'Thầy Hoàng Văn Sơn',
    departmentId: 'van',
    departmentName: 'Tổ Ngữ văn',
    startYear: '1990',
    period: '1990 – 2015',
    status: 'Đã chuyển công tác',
    roleOrNote: 'Chuyển công tác về Sở GD&ĐT Đồng Nai.'
  },
  {
    id: 'van-7',
    name: 'Cô Nguyễn Thị Diễm',
    departmentId: 'van',
    departmentName: 'Tổ Ngữ văn',
    startYear: '~2010',
    period: '2010 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Chủ nhiệm CLB Sách và Hành động, phát triển văn hóa đọc cho học sinh.'
  },

  // 3. Tổ Vật lý - Công nghệ
  {
    id: 'ly-1',
    name: 'Thầy Vũ Ngọc Cường',
    departmentId: 'ly-cn',
    departmentName: 'Tổ Vật lý - Công nghệ',
    startYear: '~1996',
    period: '1996 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Phó Hiệu trưởng, phụ trách công tác bồi dưỡng KHKT và chuyên môn tự nhiên.'
  },
  {
    id: 'ly-2',
    name: 'Thầy Hoàng Văn Trọng',
    departmentId: 'ly-cn',
    departmentName: 'Tổ Vật lý - Công nghệ',
    startYear: '1985',
    period: '1985 – 1992',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Hiệu trưởng đầu tiên của trường, kiêm giảng dạy Vật lý thời kỳ sơ khai.'
  },
  {
    id: 'ly-3',
    name: 'Thầy Nguyễn Văn Đạt',
    departmentId: 'ly-cn',
    departmentName: 'Tổ Vật lý - Công nghệ',
    startYear: '~2002',
    period: '2002 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tổ trưởng bộ môn Vật lý, nhiều năm liền có học sinh đạt giải Nhất, Nhì HSG tỉnh.'
  },
  {
    id: 'ly-4',
    name: 'Thầy Trần Thanh Tuấn',
    departmentId: 'ly-cn',
    departmentName: 'Tổ Vật lý - Công nghệ',
    startYear: '~2007',
    period: '2007 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Phụ trách hướng dẫn đề tài NCKH, sáng tạo thanh thiếu niên nhi đồng.'
  },
  {
    id: 'ly-5',
    name: 'Cô Nguyễn Thị Hồng',
    departmentId: 'ly-cn',
    departmentName: 'Tổ Vật lý - Công nghệ',
    startYear: '~1998',
    period: '1998 – 2020',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Giáo viên giàu kinh nghiệm, nhiều giải pháp tự làm đồ dùng dạy học cấp tỉnh.'
  },
  {
    id: 'ly-6',
    name: 'Thầy Nguyễn Quốc Khánh',
    departmentId: 'ly-cn',
    departmentName: 'Tổ Vật lý - Công nghệ',
    startYear: '~2015',
    period: '2015 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Cựu học sinh trường tốt nghiệp ĐH Sư phạm TP.HCM loại Giỏi quay về giảng dạy.'
  },

  // 4. Tổ Hóa học
  {
    id: 'hoa-1',
    name: 'Thầy Phan Bá Kiên',
    departmentId: 'hoa',
    departmentName: 'Tổ Hóa học',
    startYear: '~2000',
    period: '2000 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Phó Hiệu trưởng, Thạc sĩ Hóa học, cốt cán bộ môn của Sở GD&ĐT Đồng Nai.'
  },
  {
    id: 'hoa-2',
    name: 'Thầy Nguyễn Ngọc Hiệp',
    departmentId: 'hoa',
    departmentName: 'Tổ Hóa học',
    startYear: '1986',
    period: '1986 – Đầu 2000',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Cựu Hiệu trưởng, giáo viên Hóa học đầu tiên xây dựng phòng thực hành hóa học của trường.'
  },
  {
    id: 'hoa-3',
    name: 'Cô Phạm Thị Loan',
    departmentId: 'hoa',
    departmentName: 'Tổ Hóa học',
    startYear: '~2003',
    period: '2003 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tổ trưởng bộ môn, dẫn dắt đội tuyển HSG Hóa đạt nhiều giải cao.'
  },
  {
    id: 'hoa-4',
    name: 'Thầy Lê Đình Hùng',
    departmentId: 'hoa',
    departmentName: 'Tổ Hóa học',
    startYear: '~1995',
    period: '1995 – 2018',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Nhiều năm giữ cương vị Chủ tịch Công đoàn nhà trường.'
  },
  {
    id: 'hoa-5',
    name: 'Cô Vũ Thị Hảo',
    departmentId: 'hoa',
    departmentName: 'Tổ Hóa học',
    startYear: '~2008',
    period: '2008 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Giáo viên dạy giỏi cấp tỉnh, đổi mới bài giảng thí nghiệm số.'
  },

  // 5. Tổ Sinh học
  {
    id: 'sinh-1',
    name: 'Cô Nguyễn Thị Minh Tâm',
    departmentId: 'sinh',
    departmentName: 'Tổ Sinh học',
    startYear: '~1994',
    period: '1994 – 2022',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Nhiều năm làm Tổ trưởng, bồi dưỡng nhiều thế hệ học sinh đỗ Y Dược TP.HCM.'
  },
  {
    id: 'sinh-2',
    name: 'Cô Đặng Thị Thúy',
    departmentId: 'sinh',
    departmentName: 'Tổ Sinh học',
    startYear: '~2004',
    period: '2004 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tổ trưởng chuyên môn, hướng dẫn các dự án KHKT lĩnh vực Y sinh - Môi trường.'
  },
  {
    id: 'sinh-3',
    name: 'Thầy Trần Văn Bình',
    departmentId: 'sinh',
    departmentName: 'Tổ Sinh học',
    startYear: '~2006',
    period: '2006 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Cốt cán bộ môn Sinh học, phụ trách bồi dưỡng mũi nhọn.'
  },
  {
    id: 'sinh-4',
    name: 'Cô Hoàng Thị Nga',
    departmentId: 'sinh',
    departmentName: 'Tổ Sinh học',
    startYear: '~2011',
    period: '2011 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Giáo viên tích cực trong hoạt động trải nghiệm thực địa sinh thái rừng Chứa Chan.'
  },

  // 6. Tổ Tin học
  {
    id: 'tin-1',
    name: 'Thầy Hồ Đức Nghỉ',
    departmentId: 'tin',
    departmentName: 'Tổ Tin học',
    startYear: '~2003',
    period: '2003 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Phó Hiệu trưởng, phụ trách chuyển đổi số, thiết bị CNTT trường học.'
  },
  {
    id: 'tin-2',
    name: 'Thầy Nguyễn Văn Long',
    departmentId: 'tin',
    departmentName: 'Tổ Tin học',
    startYear: '~2002',
    period: '2002 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tổ trưởng chuyên môn, huấn luyện đội tuyển HSG Tin học cấp tỉnh và vòng quốc gia.'
  },
  {
    id: 'tin-3',
    name: 'Thầy Phạm Minh Trí',
    departmentId: 'tin',
    departmentName: 'Tổ Tin học',
    startYear: '~2009',
    period: '2009 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Phụ trách phòng máy, đội thi Tin học trẻ, hướng dẫn học sinh lập trình Pascal/C++/Python.'
  },
  {
    id: 'tin-4',
    name: 'Cô Đỗ Thị Tuyết',
    departmentId: 'tin',
    departmentName: 'Tổ Tin học',
    startYear: '~2014',
    period: '2014 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tham gia xây dựng hệ sinh thái thư viện điện tử và trường học số.'
  },

  // 7. Tổ Lịch sử - Địa lý - GDKT&PL
  {
    id: 'su-dia-1',
    name: 'Thầy Kiều Mạnh Hà',
    departmentId: 'su-dia-gdcd',
    departmentName: 'Tổ Lịch sử - Địa lý - GDKT&PL',
    startYear: '2021',
    period: '2021 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Hiệu trưởng (từ cuối 2021), Thạc sĩ QLGD, đẩy mạnh Chương trình GDPT 2018 và trường học hạnh phúc.'
  },
  {
    id: 'su-dia-2',
    name: 'Thầy Mai Văn Dũng',
    departmentId: 'su-dia-gdcd',
    departmentName: 'Tổ Lịch sử - Địa lý - GDKT&PL',
    startYear: '~1991',
    period: '1991 – 2021',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Giáo viên Lịch sử kỳ cựu, nguyên Bí thư Đoàn trường nhiều nhiệm kỳ.'
  },
  {
    id: 'su-dia-3',
    name: 'Cô Nguyễn Thị Hồng Vân',
    departmentId: 'su-dia-gdcd',
    departmentName: 'Tổ Lịch sử - Địa lý - GDKT&PL',
    startYear: '~2001',
    period: '2001 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tổ trưởng bộ môn Lịch sử, bồi dưỡng HSG đạt nhiều giải cao cấp tỉnh.'
  },
  {
    id: 'su-dia-4',
    name: 'Thầy Bùi Quang Hải',
    departmentId: 'su-dia-gdcd',
    departmentName: 'Tổ Lịch sử - Địa lý - GDKT&PL',
    startYear: '~2005',
    period: '2005 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Bộ môn Địa lý, phụ trách các hoạt động giáo dục di sản và chủ quyền biển đảo.'
  },
  {
    id: 'su-dia-5',
    name: 'Cô Trần Thị Thu Hiền',
    departmentId: 'su-dia-gdcd',
    departmentName: 'Tổ Lịch sử - Địa lý - GDKT&PL',
    startYear: '~2007',
    period: '2007 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Bộ môn GDCD / GDKT&PL, cố vấn pháp lý học đường và tâm lý học sinh.'
  },

  // 8. Tổ Ngoại ngữ (Tiếng Anh)
  {
    id: 'anh-1',
    name: 'Cô Nguyễn Thị Lan Anh',
    departmentId: 'ngoai-ngu',
    departmentName: 'Tổ Ngoại ngữ (Tiếng Anh)',
    startYear: '~1997',
    period: '1997 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Nguyên Tổ trưởng chuyên môn, giáo viên dạy giỏi cấp tỉnh, chứng chỉ IELTS 8.0.'
  },
  {
    id: 'anh-2',
    name: 'Thầy Lê Thanh Phong',
    departmentId: 'ngoai-ngu',
    departmentName: 'Tổ Ngoại ngữ (Tiếng Anh)',
    startYear: '~2004',
    period: '2004 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tổ trưởng bộ môn Tiếng Anh, chủ nhiệm CLB Tiếng Anh giao tiếp (E-Club).'
  },
  {
    id: 'anh-3',
    name: 'Cô Đoàn Thị Thảo',
    departmentId: 'ngoai-ngu',
    departmentName: 'Tổ Ngoại ngữ (Tiếng Anh)',
    startYear: '~2008',
    period: '2008 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Bồi dưỡng đội tuyển HSG Tiếng Anh, dẫn dắt học sinh thi chứng chỉ quốc tế.'
  },
  {
    id: 'anh-4',
    name: 'Cô Phạm Quỳnh Như',
    departmentId: 'ngoai-ngu',
    departmentName: 'Tổ Ngoại ngữ (Tiếng Anh)',
    startYear: '~2016',
    period: '2016 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Giáo viên trẻ, đưa mô hình Debate (Tranh biện tiếng Anh) vào trường học.'
  },

  // 9. Tổ Thể dục - GDQP-AN
  {
    id: 'td-1',
    name: 'Thầy Trần Văn Sang',
    departmentId: 'the-chat-gdqp',
    departmentName: 'Tổ Thể dục - GDQP-AN',
    startYear: '~1992',
    period: '1992 – 2022',
    status: 'Đã nghỉ hưu',
    roleOrNote: 'Trưởng đoàn Hội khỏe Phù Đổng trường qua nhiều kỳ đại hội cấp tỉnh.'
  },
  {
    id: 'td-2',
    name: 'Thầy Đinh Văn Thắng',
    departmentId: 'the-chat-gdqp',
    departmentName: 'Tổ Thể dục - GDQP-AN',
    startYear: '~2002',
    period: '2002 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Tổ trưởng bộ môn, huấn luyện đội tuyển Điền kinh và Bóng chuyền đạt huy chương vàng tỉnh.'
  },
  {
    id: 'td-3',
    name: 'Thầy Nguyễn Văn Nam',
    departmentId: 'the-chat-gdqp',
    departmentName: 'Tổ Thể dục - GDQP-AN',
    startYear: '~2006',
    period: '2006 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Giảng dạy GDQP-AN, đạt nhiều giải tại Hội thao GDQP-AN cấp tỉnh.'
  },
  {
    id: 'td-4',
    name: 'Thầy Hoàng Đình Vũ',
    departmentId: 'the-chat-gdqp',
    departmentName: 'Tổ Thể dục - GDQP-AN',
    startYear: '~2012',
    period: '2012 – Nay',
    status: 'Đang công tác',
    roleOrNote: 'Phụ trách phong trào thể dục thể thao và bóng rổ học sinh.'
  }
];

export const facultyDevPhases = [
  {
    phase: 'Thời kỳ mở đầu (1985 - 1995)',
    title: 'Khai Phá & Xung Phong Vượt Khó',
    desc: 'Chỉ với vài chục thầy cô giáo xung phong từ các trường sư phạm phía Bắc, Huế, TP.HCM và các vùng lân cận về địa bàn huyện mới thành lập. Cơ sở vật chất thiếu thốn, giáo viên kiêm nhiệm nhiều bộ môn.'
  },
  {
    phase: 'Thời kỳ chuẩn hóa (1995 - 2010)',
    title: 'Chuẩn Hóa Sư Phạm & Nâng Cao Kỷ Cương',
    desc: 'Đội ngũ đạt 100% chuẩn đại học sư phạm; xuất hiện lứa giáo viên cốt cán cấp tỉnh, đạt giải cao trong các hội thi giáo viên dạy giỏi.'
  },
  {
    phase: 'Thời kỳ nâng chuẩn & kế thừa (2010 - Nay)',
    title: 'Thạc Sĩ Hóa, Chuyển Đổi Số & Thế Hệ CHS Quay Về',
    desc: 'Tỷ lệ giáo viên có trình độ Thạc sĩ đạt trên 20%, nhiều giáo viên là cựu học sinh của trường sau khi tốt nghiệp quay về cống hiến; lực lượng nòng cốt bồi dưỡng HSG tỉnh, HSG quốc gia và KHKT.'
  }
];

export const facultyPillars = [
  {
    title: 'Truyền Thống "Kế Thừa Sư Phạm" Đặc Thù',
    desc: 'Hơn 30% giáo viên hiện nay chính là cựu học sinh các khóa của trường tốt nghiệp ĐH Sư phạm TP.HCM, ĐH Sài Gòn, ĐH Đồng Nai trở về quê hương, thấu hiểu tâm lý học sinh và gìn giữ trọn vẹn bản sắc Xuân Lộc.',
    icon: '🤝'
  },
  {
    title: 'Sự Ổn Định & Gắn Bó Trọn Đời',
    desc: 'Tỷ lệ thuyên chuyển rất thấp; đa số thầy cô sau khi về trường đều cống hiến trọn sự nghiệp (từ 20 đến trên 30 năm), tạo nề nếp gia phong học đường liên tục, vững vàng.',
    icon: '🏛️'
  },
  {
    title: 'Năng Lực Bứt Phá Mũi Nhọn & Sáng Tạo',
    desc: 'Đóng góp hàng chục sáng kiến kinh nghiệm loại A, B cấp tỉnh mỗi năm; kiên trì đưa trường vào danh sách cái nôi HSG cấp tỉnh và vòng HSG Quốc gia.',
    icon: '🚀'
  }
];
