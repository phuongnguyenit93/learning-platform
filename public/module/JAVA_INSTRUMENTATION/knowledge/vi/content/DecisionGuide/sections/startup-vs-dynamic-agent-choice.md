Chọn startup agent khi nhu cầu đã biết trước triển khai:

- agent observability luôn bật;
- coverage agent trong kiểm thử;
- chính sách bảo mật/runtime bắt buộc;
- muốn thấy class được nạp từ sớm;
- muốn người triển khai opt-in rõ ràng.

Chọn dynamic attach khi:

- điều tra theo nhu cầu;
- công cụ cần attach vào tiến trình đã chạy;
- không thể khởi động lại ngay;
- instrumentation chỉ bật tạm thời.

So sánh:

| | Startup | Dynamic |
| --- | --- | --- |
| chính sách | khai báo rõ lúc JVM khởi động | thay đổi runtime sau khi khởi động |
| class được nạp sớm | thấy từ đầu | có thể phải retransform |
| lỗi | có thể làm quá trình khởi động bị hủy | JVM mục tiêu thường tiếp tục |
| xu hướng JDK | mô hình triển khai ổn định | chính sách ngày càng yêu cầu rõ ràng |

Nếu agent là dependency thường trực trong production, nạp lúc khởi động thường dễ suy luận và kiểm toán hơn.
