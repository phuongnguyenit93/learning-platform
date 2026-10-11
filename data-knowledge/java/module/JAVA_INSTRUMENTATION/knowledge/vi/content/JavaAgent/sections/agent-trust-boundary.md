Agent có quyền chạy code trong cùng JVM và có thể biến đổi bytecode của class ứng dụng. Vì vậy đặc tả package Java đặt trách nhiệm xác minh độ tin cậy lên người triển khai agent hoặc công cụ.

Các rủi ro điển hình:

- agent JAR bị thay thế hoặc tải từ nguồn không đáng tin;
- transformer sửa nhầm class JDK/framework;
- helper class bị nạp bởi loader không mong muốn;
- agent đọc dữ liệu nhạy cảm trong tiến trình;
- bytecode không hợp lệ làm ứng dụng lỗi;
- dynamic attach tạo một kênh thay đổi runtime ngoài kế hoạch triển khai.

Mô hình bảo mật nên là: **agent có quyền rất cao trong tiến trình**. Do đó nguồn gốc artifact, cố định phiên bản, kiểm soát quyền attach, ghi log và kế hoạch rollback quan trọng không kém code của transformer.
