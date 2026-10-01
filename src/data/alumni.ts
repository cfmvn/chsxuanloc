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

export const ALUMNI_DIRECTORY: AlumniContact[] = [
  {
    id: 'alm-01',
    fullName: 'Nguyễn Văn Hùng',
    gradYear: 2008,
    batch: 'Khóa 2005 - 2008',
    className: '12A1',
    homeroomTeacher: 'Thầy Đặng Thành Luân (Toán)',
    currentLocation: 'TP. Hồ Chí Minh',
    currentJob: 'Kỹ sư Cầu đường Senior',
    company: 'Tổng Cty Tư vấn Thiết kế Giao thông',
    bio: 'Luôn nhớ những buổi chiều đá bóng ở sân trường THPT Xuân Lộc và tiết Toán vui vẻ của thầy Luân.',
    facebook: 'https://facebook.com',
    email: 'hung.nguyen@example.com',
    verified: true
  },
  {
    id: 'alm-02',
    fullName: 'Lê Thị Thu Thảo',
    gradYear: 2008,
    batch: 'Khóa 2005 - 2008',
    className: '12A1',
    homeroomTeacher: 'Thầy Đặng Thành Luân (Toán)',
    currentLocation: 'Đồng Nai (Xuân Lộc)',
    currentJob: 'Dược sĩ / Chủ nhà thuốc tư nhân',
    bio: 'Sẵn sàng hỗ trợ tư vấn sức khỏe và kết nối cựu học sinh các khóa tại địa phương.',
    phone: '0988 111 222',
    verified: true
  },
  {
    id: 'alm-03',
    fullName: 'Trần Minh Quang',
    gradYear: 2006,
    batch: 'Khóa 2003 - 2006',
    className: '12A4',
    homeroomTeacher: 'Cô Huỳnh Thu Thủy (Lý)',
    currentLocation: 'Bình Dương',
    currentJob: 'Giám đốc Vận hành Nhà máy',
    company: 'Tập đoàn Sản xuất Gỗ Tân Uyên',
    bio: 'Khóa 2003-2006 điểm danh nhé! Rất mong được gặp lại thầy cô và bạn bè xưa.',
    facebook: 'https://facebook.com',
    email: 'quang.tran@example.com',
    verified: true
  },
  {
    id: 'alm-04',
    fullName: 'Hoàng Ngọc Ánh',
    gradYear: 2011,
    batch: 'Khóa 2008 - 2011',
    className: '12B2',
    homeroomTeacher: 'Thầy Nguyễn Văn Hiếu',
    currentLocation: 'Đà Nẵng',
    currentJob: 'Chuyên gia Marketing & Du lịch',
    bio: 'Dù ở xa quê nhưng trái tim luôn hướng về chân núi Chứa Chan và mái trường Xuân Lộc mến yêu.',
    facebook: 'https://facebook.com',
    verified: true
  },
  {
    id: 'alm-05',
    fullName: 'Phạm Đức Anh',
    gradYear: 1993,
    batch: 'Khóa 1990 - 1993',
    className: '12A',
    homeroomTeacher: 'Thầy Nguyễn Văn Hiếu',
    currentLocation: 'Hà Nội',
    currentJob: 'Tiến sĩ - Giảng viên Đại học',
    company: 'Đại học Quốc Gia Hà Nội',
    bio: 'Là một trong những khóa học sinh đầu tiên khi trường mới thành lập năm 1990. Rất tự hào về sự phát triển của trường hôm nay.',
    email: 'anh.pham@vnu.edu.vn',
    verified: true
  },
  {
    id: 'alm-06',
    fullName: 'Đỗ Thùy Trang',
    gradYear: 2024,
    batch: 'Khóa 2021 - 2024',
    className: '12A3',
    homeroomTeacher: 'Thầy Kiều Mạnh Hà',
    currentLocation: 'TP. Hồ Chí Minh',
    currentJob: 'Sinh viên Năm 2 ngành Khoa học Máy tính',
    company: 'Đại học Bách Khoa TP.HCM',
    bio: 'Cựu học sinh khóa 2021-2024. Rất vui được kết nối cùng các anh chị cựu học sinh đi trước!',
    facebook: 'https://facebook.com',
    verified: true
  }
];
