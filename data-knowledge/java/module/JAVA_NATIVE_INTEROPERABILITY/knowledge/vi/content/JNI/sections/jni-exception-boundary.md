Exception Java đi qua JNI dưới dạng **trạng thái pending exception** của luồng hiện tại. Khi một JNI call kích hoạt exception, native code không nên tiếp tục gọi JNI functions một cách tùy ý như thể call trước đã thành công.

Các API thường dùng:

- ExceptionCheck hoặc ExceptionOccurred để kiểm tra;
- ExceptionDescribe để hỗ trợ chẩn đoán; **lưu ý API này mô tả rồi clear pending exception**, nên không dùng nếu mục tiêu là giữ nguyên exception để propagate;
- ExceptionClear khi native code thật sự muốn xử lý và không propagate exception đó;
- Throw hoặc ThrowNew để tạo exception Java từ native side.

Nếu mục tiêu là để bên gọi Java nhận exception, native code thường giải phóng tài nguyên native cần thiết rồi return mà không clear pending exception.

Ngược lại, native error code như errno hoặc status code của một C library **không tự biến thành Java exception**. Boundary layer cần quyết định mapping rõ ràng, ví dụ chuyển status không hợp lệ thành IllegalStateException hoặc domain-specific exception.
