So sánh ở mức tư duy:

| Mức | Ưu điểm | Chi phí |
| --- | --- | --- |
| Kiểu ASM mức thấp | kiểm soát bytecode chi tiết, ít mức trừu tượng | cần chuyên môn JVM/class file cao |
| Kiểu Byte Buddy mức cao | matcher/advice dễ diễn đạt, code dễ bảo trì | cần hiểu mức trừu tượng và helper được sinh ra |
| Class-File API chuẩn | API nền tảng chuẩn ở JDK mới | phụ thuộc mốc cơ sở JDK và ranh giới phiên bản |

Không nên chọn chỉ dựa trên số dòng code.

Ví dụ agent đơn giản “đo mọi method có annotation @Timed” có thể dễ với matcher mức cao. Nhưng công cụ kiểu compiler cần viết lại instruction đặc biệt có thể phù hợp với API mức thấp hơn.

Nguyên tắc: chọn **mức trừu tượng cao nhất vẫn cho phép kiểm soát chính xác ràng buộc của trường hợp sử dụng**.
