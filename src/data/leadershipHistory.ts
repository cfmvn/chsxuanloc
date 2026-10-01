export interface PrincipalHistory {
  id: string;
  name: string;
  role: string;
  period: string;
  leadershipStyle: string;
  context: string;
  keyFocus: string;
  achievements: string[];
  badge: string;
}

export interface LeadershipLesson {
  title: string;
  desc: string;
  icon: string;
}

export const principalsHistoryData: PrincipalHistory[] = [
  {
    id: "hoang-van-trong",
    name: "Thầy Hoàng Văn Trọng",
    role: "Hiệu trưởng Tiên khởi",
    period: "1985 – 1992",
    leadershipStyle: "Tiên phong, kiên cường & Truyền lửa",
    context: "Trường Phổ thông Trung học Xuân Lộc II thành lập ngày 23/12/1985 trong muôn vàn khó khăn: 2 dãy phòng cấp 4, sân đất đỏ Gia Ray, thiết bị nghèo nàn, giáo viên điều động từ nhiều nơi.",
    keyFocus: "Khai sơn phá thạch, tổ chức bộ máy ban đầu, chăm lo đời sống để giáo viên an tâm bám trường, bám lớp thời kỳ bao cấp và mở đầu Đổi mới.",
    achievements: [
      "Thiết lập trọn vẹn bộ máy tổ chức: Chi bộ Đảng, Ban Giám hiệu, Công đoàn, Đoàn Thanh niên và các tổ bộ môn đầu tiên.",
      "Tạo kỳ tích khóa tốt nghiệp đầu tiên (tháng 5/1986) đạt tỷ lệ 92%, gây tiếng vang lớn trong ngành giáo dục Đồng Nai."
    ],
    badge: "Lãnh Đạo Tiên Phong"
  },
  {
    id: "nguyen-ngoc-hiep-tran-dinh-vinh",
    name: "Thầy Nguyễn Ngọc Hiệp & Thầy Trần Đình Vinh",
    role: "Hiệu trưởng qua các thời kỳ",
    period: "1992 – Thập niên 2000",
    leadershipStyle: "Quy chuẩn, nề nếp, kỷ cương & Tầm nhìn kiến thiết",
    context: "Nền kinh tế mở cửa, dân số tăng nhanh, nhu cầu học tập của nhân dân Xuân Lộc đòi hỏi chuyển đổi thành trường trung tâm chất lượng cao cấp huyện.",
    keyFocus: "Mở rộng quy mô, kiên cố hóa trường lớp, quy chuẩn hóa chuyên môn, chuẩn hóa hồ sơ sổ sách và bước đầu ứng dụng CNTT.",
    achievements: [
      "Tham mưu quy hoạch và hoàn thành xây mới khuôn viên khang trang gần 20.000 m² (1998) tại thị trấn Gia Ray.",
      "Đón nhận Bằng khen của Thủ tướng Chính phủ (1997) và Huân chương Lao động hạng Ba (1998).",
      "Nâng tỷ lệ tốt nghiệp THPT bình quân lên 95% – 98%, khẳng định uy tín vững chắc của trường."
    ],
    badge: "Quy Phạm & Mở Rộng"
  },
  {
    id: "tran-thi-kim-tan",
    name: "Cô Trần Thị Kim Tân",
    role: "Nguyên Hiệu trưởng",
    period: "2008 – 2017",
    leadershipStyle: "Tâm huyết, truyền cảm hứng & Giàu lòng nhân ái",
    context: "Giai đoạn hội nhập sâu rộng, thực hiện phong trào 'Nói không với tiêu cực trong thi cử', kiểm định chất lượng và xây dựng trường chuẩn quốc gia.",
    keyFocus: "Khích lệ đội ngũ tự học nâng chuẩn Thạc sĩ; chủ trương đón nhận thế hệ cựu học sinh giỏi sau khi tốt nghiệp ĐH Sư phạm trở về cống hiến.",
    achievements: [
      "Trường chính thức đạt Chuẩn Quốc gia Mức độ 1 ngày 06/11/2009.",
      "Đón nhận Huân chương Lao động hạng Nhì của Chủ tịch nước (2011).",
      "Nhận Cờ thi đua xuất sắc của Chính phủ (2011, 2013).",
      "Bứt phá chất lượng thi ĐH, đưa THPT Xuân Lộc vào nhóm dẫn đầu các trường không chuyên toàn tỉnh."
    ],
    badge: "Truyền Cảm Hứng & Chuẩn Hóa"
  },
  {
    id: "ho-van-sinh",
    name: "Thầy Hồ Văn Sinh",
    role: "Nguyên Hiệu trưởng",
    period: "2017 – 2021",
    leadershipStyle: "Học thuật, thực chứng & Quyết liệt mục tiêu",
    context: "Đổi mới thi THPT Quốc gia trắc nghiệm liên môn, gia tăng cạnh tranh chỉ số chất lượng giáo dục.",
    keyFocus: "Quản trị dựa trên dữ liệu; đẩy mạnh nghiên cứu khoa học sư phạm ứng dụng; phân hóa năng lực học sinh và bồi dưỡng chuyên sâu mũi nhọn.",
    achievements: [
      "Được công nhận Trường Chuẩn Quốc gia Mức độ 2 (chuẩn cao nhất theo quy định Bộ GD&ĐT).",
      "Chính thức lọt vào danh sách Top 149 trường THPT trọng điểm được ĐHQG TP.HCM ưu tiên xét tuyển thẳng.",
      "Thắng lớn tại Cuộc thi Sáng tạo KHKT cấp tỉnh với nhiều giải Nhất, Nhì; tỷ lệ đỗ đại học công lập đạt trên 80%."
    ],
    badge: "Học Thuật & Đột Phá Vị Thế"
  },
  {
    id: "kieu-manh-ha",
    name: "Thầy Kiều Mạnh Hà",
    role: "Hiệu trưởng Đương nhiệm",
    period: "Cuối 2021 – Nay",
    leadershipStyle: "Năng động, hiện đại & Kiến tạo 'Trường học hạnh phúc'",
    context: "Triển khai Chương trình GDPT 2018, chuyển đổi số toàn diện giáo dục, ứng dụng CNTT và AI.",
    keyFocus: "Lấy học sinh làm trung tâm; chuyển đổi số mọi khâu quản lý - dạy học; phát triển kỹ năng mềm, CLB học sinh và đào tạo nhân tài mũi nhọn Quốc gia.",
    achievements: [
      "Xây dựng thành công cơ cấu tổ hợp môn học linh hoạt theo Chương trình GDPT 2018 cho cả 3 khối lớp.",
      "Đột phá mũi nhọn: Đưa học sinh vào Đội tuyển HSG Quốc gia môn Tin học năm 2026 và liên tục đoạt giải cao Sáng tạo KHKT.",
      "Hoàn thiện nâng cấp cảnh quan, thư viện mở, hệ thống phòng lab và lớp học số thông minh."
    ],
    badge: "Chuyển Đổi Số & Hội Nhập"
  }
];

export const vicePrincipalsNotable = [
  {
    era: "Giai đoạn Tiền đề & Củng cố (1985 – 2005)",
    leaders: "Thầy Nguyễn Đình Cường, Thầy Bùi Văn Dũng, Thầy Vũ Ngọc Cường...",
    role: "Đặt nền móng nề nếp chuyên môn, phụ trách cơ sở vật chất thời kỳ vượt khó."
  },
  {
    era: "Giai đoạn Chuẩn hóa & Đổi mới (2005 – Nay)",
    leaders: "Cô Đinh Thị Thanh Nguyên, Thầy Phan Bá Kiên, Thầy Hồ Đức Nghỉ...",
    role: "Phụ trách chuyên môn mũi nhọn, khảo thí kiểm định, quản lý cơ sở vật chất đạt chuẩn Mức độ 2."
  },
  {
    era: "Đội ngũ Cấp ủy & Tổ trưởng Chuyên môn",
    leaders: "Tổ trưởng các bộ môn Toán, Lý, Hóa, Sinh, Văn, Sử, Địa, Ngoại ngữ, Thể chất - GDQP...",
    role: "Lực lượng nòng cốt biến định hướng chiến lược của Ban Giám hiệu thành chất lượng giảng dạy thực tế."
  }
];

export const leadershipLessons: LeadershipLesson[] = [
  {
    title: "Sự Kế Thừa Liên Tục & Không Đứt Gãy",
    desc: "Các thế hệ lãnh đạo nối tiếp nhau duy trì mục tiêu phát triển chung, tôn trọng di sản của người đi trước giúp trường giữ vững tính ổn định nội bộ suốt 40 năm.",
    icon: "🔄"
  },
  {
    title: "Biết Dựa Vào Sức Mạnh Cộng Đồng",
    desc: "Duy trì mối quan hệ khăng khít với Ban Đại diện Cha mẹ học sinh, Huyện ủy - UBND huyện Xuân Lộc và mạng lưới Cựu học sinh để huy động sức mạnh xã hội hóa giáo dục.",
    icon: "🤝"
  },
  {
    title: "Thước Đo Bằng Sự Trưởng Thành Của Học Sinh",
    desc: "Mọi quyết sách quản trị đều phục vụ lợi ích tối thượng của người học: rèn luyện đạo đức, nâng cao tri thức và định hình nhân cách để tự tin bước ra xã hội.",
    icon: "🌟"
  }
];
