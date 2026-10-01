export interface TributeMessage {
  id: string;
  senderName: string;
  batch: string; // e.g. "Khóa 2005 - 2008"
  className: string; // e.g. "12A1"
  teacherName: string; // "Tất cả quý Thầy Cô" hoặc tên thầy cô cụ thể
  message: string;
  flowerCount: number;
  heartCount: number;
  dateStr: string;
}

export const INITIAL_TRIBUTES: TributeMessage[] = [
  {
    id: 'trib-01',
    senderName: 'Cựu học sinh ẩn danh',
    batch: 'Khóa 2002 - 2005',
    className: '12A2',
    teacherName: 'Thầy Kiều Mạnh Hà',
    message: 'Kính chúc Thầy thật nhiều sức khỏe để tiếp tục dẫn dắt các thế hệ học sinh Xuân Lộc. Em vẫn luôn khắc ghi bài học làm người mà Thầy đã chỉ dạy.',
    flowerCount: 48,
    heartCount: 92,
    dateStr: '15/09/2026'
  },
  {
    id: 'trib-02',
    senderName: 'Cựu học sinh (Ẩn danh)',
    batch: 'Khóa 2008 - 2011',
    className: '12B1',
    teacherName: 'Cô Huỳnh Thu Thủy',
    message: 'Nhớ mãi những tiết Vật lý sôi nổi và nụ cười ấm áp của Cô Thủy. Cảm ơn Cô đã luôn kiên nhẫn đồng hành cùng lớp 12B1 tinh nghịch năm ấy!',
    flowerCount: 36,
    heartCount: 75,
    dateStr: '18/09/2026'
  },
  {
    id: 'trib-03',
    senderName: 'Tập thể Cựu học sinh Lớp 12A',
    batch: 'Khóa 1990 - 1993',
    className: '12A',
    teacherName: 'Thầy Nguyễn Văn Hiếu',
    message: 'Hơn 30 năm trôi qua kể từ ngày ra trường, chúng em luôn tự hào là lứa học trò đầu tiên của Thầy tại mái trường Xuân Lộc thân yêu.',
    flowerCount: 120,
    heartCount: 215,
    dateStr: '20/09/2026'
  },
  {
    id: 'trib-04',
    senderName: 'Cựu học sinh K2018',
    batch: 'Khóa 2018 - 2021',
    className: '12A4',
    teacherName: 'Thầy Đặng Thành Luân',
    message: 'Cảm ơn Thầy Luân không chỉ dạy Toán hay mà còn truyền cho chúng em ngọn lửa nhiệt huyết của tuổi trẻ và phong trào Đoàn sôi nổi.',
    flowerCount: 52,
    heartCount: 88,
    dateStr: '22/09/2026'
  },
  {
    id: 'trib-05',
    senderName: 'Cựu học sinh Niên khóa 2021-2024',
    batch: 'Khóa 2021 - 2024',
    className: '12A3',
    teacherName: 'Tất cả quý Thầy Cô',
    message: 'Kính chúc toàn thể quý Thầy Cô trường THPT Xuân Lộc luôn dồi dào sức khỏe, tràn đầy niềm vui và giữ mãi ngọn lửa yêu nghề với các thế hệ học trò.',
    flowerCount: 89,
    heartCount: 164,
    dateStr: '25/09/2026'
  }
];
