// Nguồn: /docs/tao_chan_dung_KH.md — cấu hình các tiêu chí để người dùng tự
// "tạo khách hàng theo tiêu chí" ở màn Practice (nút "Tạo ngay"). Chỉ 10
// dòng theo đúng ui-draft/man-practice-taoKH.png (doc có thêm mục #12 "Độ
// khó mong muốn" nhưng KHÔNG có trên UI draft — bỏ qua, để AI tự suy độ
// khó từ toàn bộ hồ sơ khi sinh chân dung, xem agent/main.py). Doc #10
// "Động lực" + #11 "Rào cản" gộp làm 1 dòng trên UI (2 field riêng trong
// cùng 1 picker).

export type PersonaFieldSelectionType = 'single' | 'multi';

export interface PersonaOptionGroup {
  heading?: string;
  options: string[];
}

export interface PersonaBuilderField {
  /** Key gửi lên backend, xem lib/ai.ts PersonaCriteriaInput. */
  key: string;
  /** Nhãn hiển thị trong picker khi 1 dòng có nhiều field (Động lực / Rào cản). */
  fieldLabel?: string;
  selectionType: PersonaFieldSelectionType;
  groups: PersonaOptionGroup[];
  allowCustom: boolean;
}

export interface PersonaBuilderCriterion {
  id: string;
  order: number;
  icon: string;
  label: string;
  placeholder: string;
  fields: PersonaBuilderField[];
}

export const personaBuilderCriteria: PersonaBuilderCriterion[] = [
  {
    id: 'age',
    order: 1,
    icon: 'person-outline',
    label: 'Tuổi',
    placeholder: 'Chọn khoảng tuổi',
    fields: [
      {
        key: 'age',
        selectionType: 'single',
        allowCustom: true,
        groups: [
          {
            options: [
              'Dưới 22 tuổi',
              '22–25 tuổi',
              '26–30 tuổi',
              '31–35 tuổi',
              '36–45 tuổi',
              '46–55 tuổi',
              'Trên 55 tuổi',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'gender',
    order: 2,
    icon: 'male-female-outline',
    label: 'Giới tính',
    placeholder: 'Chọn giới tính',
    fields: [
      {
        key: 'gender',
        selectionType: 'single',
        allowCustom: false,
        groups: [{ options: ['Nam', 'Nữ', 'Không muốn xác định', 'Khác'] }],
      },
    ],
  },
  {
    id: 'occupation',
    order: 3,
    icon: 'briefcase-outline',
    label: 'Nghề nghiệp',
    placeholder: 'Chọn nghề nghiệp',
    fields: [
      {
        key: 'occupation',
        selectionType: 'single',
        allowCustom: true,
        groups: [
          {
            heading: 'Sinh viên / Nhân viên',
            options: [
              'Sinh viên',
              'Nhân viên văn phòng',
              'Chuyên viên',
              'Nhân viên kinh doanh / Sales',
              'Nhân viên ngành đặc thù',
            ],
          },
          {
            heading: 'Quản lý / Chuyên môn cao',
            options: [
              'Quản lý cấp trung',
              'Quản lý cấp cao',
              'Chuyên gia',
              'Bác sĩ / Nhân viên y tế',
              'Giáo viên / Giảng viên',
              'Luật sư',
              'Kỹ sư / CNTT',
            ],
          },
          {
            heading: 'Kinh doanh',
            options: ['Chủ hộ kinh doanh', 'Chủ doanh nghiệp nhỏ', 'Kinh doanh online', 'Freelancer'],
          },
          { heading: 'Khác', options: ['Nghỉ hưu', 'Nội trợ'] },
        ],
      },
    ],
  },
  {
    id: 'income',
    order: 4,
    icon: 'wallet-outline',
    label: 'Thu nhập',
    placeholder: 'Chọn mức thu nhập',
    fields: [
      {
        key: 'income',
        selectionType: 'single',
        allowCustom: true,
        groups: [
          {
            options: [
              'Chưa có / Không ổn định',
              'Dưới 10 triệu VNĐ',
              '10–20 triệu VNĐ',
              '20–30 triệu VNĐ',
              '30–50 triệu VNĐ',
              '50–100 triệu VNĐ',
              '100–200 triệu VNĐ',
              'Trên 200 triệu VNĐ',
              'Thu nhập biến động theo mùa / doanh thu',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'region',
    order: 5,
    icon: 'location-outline',
    label: 'Khu vực',
    placeholder: 'Chọn khu vực',
    fields: [
      {
        key: 'region',
        selectionType: 'single',
        allowCustom: true,
        groups: [
          {
            options: [
              'Hà Nội',
              'TP. Hồ Chí Minh',
              'Thành phố lớn khác',
              'Tỉnh / thành phát triển',
              'Khu vực khu công nghiệp',
              'Khu vực nông thôn',
              'Miền Bắc',
              'Miền Trung',
              'Miền Nam',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'needs',
    order: 6,
    icon: 'locate-outline',
    label: 'Nhu cầu / Mục tiêu',
    placeholder: 'Chọn nhu cầu hoặc mục tiêu',
    fields: [
      {
        key: 'needs',
        selectionType: 'multi',
        allowCustom: true,
        groups: [
          {
            heading: 'Giao dịch hằng ngày',
            options: ['Mở tài khoản', 'Nhận lương', 'Chuyển tiền / Thanh toán', 'Mở thẻ tín dụng', 'Chi tiêu qua thẻ'],
          },
          {
            heading: 'Tiết kiệm / Tích lũy',
            options: ['Gửi tiết kiệm', 'Tích lũy định kỳ', 'Xây dựng quỹ dự phòng', 'Tích lũy cho mục tiêu cụ thể'],
          },
          {
            heading: 'Vay vốn',
            options: ['Vay mua nhà', 'Vay mua xe', 'Vay tiêu dùng', 'Vay phục vụ kinh doanh', 'Cần thêm vốn trong ngắn hạn'],
          },
          {
            heading: 'Đầu tư / Tài sản',
            options: ['Đầu tư tiền nhàn rỗi', 'Tăng trưởng tài sản', 'Bảo toàn tài sản', 'Lập kế hoạch tài chính dài hạn'],
          },
          {
            heading: 'Mục tiêu cuộc sống',
            options: ['Mua nhà', 'Mua xe', 'Du lịch', 'Kết hôn', 'Sinh con / Chăm lo gia đình', 'Giáo dục cho con', 'Chuẩn bị nghỉ hưu'],
          },
          { heading: 'Khác', options: ['Chưa xác định rõ nhu cầu'] },
        ],
      },
    ],
  },
  {
    id: 'behavior',
    order: 7,
    icon: 'cart-outline',
    label: 'Hành vi hiện tại',
    placeholder: 'Chọn hành vi',
    fields: [
      {
        key: 'behavior',
        selectionType: 'multi',
        allowCustom: true,
        groups: [
          {
            heading: 'Hành vi sử dụng ngân hàng',
            options: [
              'Đã sử dụng dịch vụ ngân hàng khác',
              'Chỉ sử dụng một ngân hàng chính',
              'Sử dụng nhiều ngân hàng',
              'Thường xuyên so sánh các ngân hàng',
              'Đã có quan hệ với RM / Sales khác',
            ],
          },
          {
            heading: 'Hành vi giao dịch',
            options: [
              'Ưu tiên giao dịch trên ứng dụng',
              'Thích tự tìm hiểu trước khi quyết định',
              'Ít sử dụng ngân hàng số',
              'Thích được tư vấn trực tiếp',
              'Ít có thời gian',
            ],
          },
          {
            heading: 'Hành vi tài chính',
            options: [
              'Chi tiêu theo kế hoạch',
              'Chi tiêu khá cảm tính',
              'Thường xuyên có tiền nhàn rỗi',
              'Đã có khoản tiết kiệm',
              'Đã có khoản vay',
              'Đã có danh mục đầu tư',
            ],
          },
          {
            heading: 'Hành vi ra quyết định',
            options: [
              'Quyết định nhanh',
              'Cần thời gian suy nghĩ',
              'Thích so sánh kỹ',
              'Thường hỏi nhiều câu hỏi',
              'Cần tham khảo gia đình / người thân',
              'Tự nghiên cứu rất kỹ trước khi gặp Sales',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'painPoints',
    order: 8,
    icon: 'warning-outline',
    label: 'Pain points',
    placeholder: 'Chọn pain points',
    fields: [
      {
        key: 'painPoints',
        selectionType: 'multi',
        allowCustom: true,
        groups: [
          {
            heading: 'Về sản phẩm',
            options: [
              'Lo lãi suất cao',
              'Lo các loại phí',
              'Không hiểu rõ sản phẩm',
              'Sợ sản phẩm không phù hợp',
              'Điều kiện sản phẩm quá phức tạp',
            ],
          },
          {
            heading: 'Về quy trình',
            options: [
              'Ngại thủ tục phức tạp',
              'Không có thời gian làm hồ sơ',
              'Ngại cung cấp nhiều giấy tờ',
              'Từng có trải nghiệm không tốt',
              'Lo phải chờ đợi lâu',
            ],
          },
          {
            heading: 'Về niềm tin',
            options: [
              'Sợ rủi ro',
              'Lo bị lừa đảo',
              'Không tin quảng cáo',
              'Không tin nhân viên tư vấn',
              'Sợ bị ép mua',
              'Lo thông tin không minh bạch',
            ],
          },
          {
            heading: 'Về tài chính',
            options: ['Thu nhập không ổn định', 'Lo áp lực trả nợ', 'Chưa đủ khả năng tài chính', 'Khó cân đối dòng tiền'],
          },
          {
            heading: 'Tình huống nâng cao',
            options: [
              'Không thấy sự khác biệt giữa các ngân hàng',
              'Đã có giải pháp ở ngân hàng khác',
              'Chưa thấy nhu cầu cấp thiết',
              'Từng bị từ chối vay / sử dụng sản phẩm',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'expectations',
    order: 9,
    icon: 'star-outline',
    label: 'Kỳ vọng',
    placeholder: 'Chọn kỳ vọng',
    fields: [
      {
        key: 'expectations',
        selectionType: 'multi',
        allowCustom: true,
        groups: [
          {
            heading: 'Về tư vấn',
            options: ['Tư vấn dễ hiểu', 'Tư vấn đúng nhu cầu', 'Thông tin minh bạch', 'Có phân tích / so sánh rõ ràng', 'Không chèo kéo'],
          },
          {
            heading: 'Về trải nghiệm',
            options: ['Nhanh chóng', 'Thủ tục đơn giản', 'Có thể thực hiện online', 'Được hỗ trợ tận tình', 'Được phục vụ chủ động'],
          },
          {
            heading: 'Về giải pháp',
            options: [
              'Lãi suất tốt',
              'Phí thấp',
              'Nhiều ưu đãi',
              'Giải pháp linh hoạt',
              'Cá nhân hóa theo nhu cầu',
              'Được tư vấn tài chính tổng thể',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'motivationBarrier',
    order: 10,
    icon: 'lock-closed-outline',
    label: 'Động lực / Rào cản',
    placeholder: 'Chọn động lực hoặc rào cản',
    fields: [
      {
        key: 'motivation',
        fieldLabel: 'Động lực',
        selectionType: 'multi',
        allowCustom: true,
        groups: [
          {
            options: [
              'Muốn tiết kiệm chi phí',
              'Muốn nhận ưu đãi',
              'Có nhu cầu cấp thiết',
              'Muốn đạt mục tiêu tài chính',
              'Muốn tiết kiệm thời gian',
              'Muốn tăng trưởng tài sản',
              'Muốn bảo vệ tài chính gia đình',
              'Được người quen giới thiệu',
              'Tin tưởng thương hiệu ngân hàng',
              'Đã có trải nghiệm tốt trước đây',
            ],
          },
        ],
      },
      {
        key: 'barrier',
        fieldLabel: 'Rào cản',
        selectionType: 'multi',
        allowCustom: true,
        groups: [
          {
            options: [
              'Chưa đủ tin tưởng',
              'Sợ rủi ro',
              'Đang sử dụng ngân hàng khác',
              'Chưa thấy nhu cầu cấp thiết',
              'Thiếu thời gian',
              'Sợ thủ tục phức tạp',
              'Lo chi phí',
              'Cần tham khảo người thân',
              'Muốn so sánh thêm',
              'Đã từng có trải nghiệm không tốt',
            ],
          },
        ],
      },
    ],
  },
];
