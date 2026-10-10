# Thay đổi khi đang duyệt và Fail-Fast

Tiếp nối chặng **Khả năng thay đổi, view và Fail-Fast**, chương này tập trung vào điều xảy ra khi cấu trúc collection thay đổi trong lúc Iterator đang duyệt. Iterator giữ trạng thái về vị trí duyệt; nếu cấu trúc thay đổi bên ngoài iterator, vị trí đó có thể trở nên không còn ý nghĩa. Nhiều cách triển khai chuẩn của Java phản ứng bằng cơ chế **fail-fast** để báo lỗi sớm thay vì âm thầm tiếp tục trên một quá trình duyệt đã mất tính nhất quán.

Fail-fast là cơ chế phát hiện lỗi lập trình khi duyệt collection. Nó không phải cơ chế đồng bộ luồng và không nên được dùng làm nền tảng cho tính đúng đắn.
