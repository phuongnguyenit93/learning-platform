Mỗi lần vượt qua native boundary, ứng dụng nhận thêm một tập rủi ro mà code Java thuần thường tránh được.

- **Khả năng chạy đa nền tảng**: binary native thường gắn với OS, CPU architecture và ABI cụ thể.
- **Triển khai**: phải đóng gói đúng DLL/shared library và dependency native liên quan.
- **Lifetime/ownership**: native memory, callback stub, library handle hoặc JNI global reference phải được giải phóng đúng thời điểm.
- **An toàn**: sai pointer, layout hoặc function descriptor có thể gây JVM crash hoặc silent memory corruption.
- **Gỡ lỗi**: stack trace Java không đủ để chẩn đoán lỗi native; có thể cần debugger và symbol native.
- **Error boundary**: Java exception và native error code không tự động chuyển đổi cho nhau.

Một nguyên tắc thực tế là **thu hẹp bề mặt native**: giữ phần đặc thù native sau một Java API nhỏ, kiểm thử contract ở boundary và tránh để chi tiết pointer/lifetime lan vào mã nghiệp vụ. Khi boundary càng rõ, khả năng thay đổi library, nâng JDK hoặc hỗ trợ thêm nền tảng càng tốt.

Các chương sau sẽ lần lượt giải quyết các nguồn rủi ro này: library/ABI trước, rồi JNI/FFM, memory lifetime, function linkage và cuối cùng là lỗi/tổng hợp.
