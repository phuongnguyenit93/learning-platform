Cho phép nhiều luồng nhìn thấy cùng native memory không đồng nghĩa dữ liệu đã thread-safe. Shared Arena chỉ cho phép truy cập từ nhiều luồng; nó không tạo lock hay atomic protocol cho native structure.

Các nguồn race phổ biến:

- Java và native thread cùng ghi một buffer;
- callback đến đồng thời trong khi Java đang close tài nguyên;
- native library giữ trạng thái toàn cục nhưng tài liệu của library yêu cầu serialize call;
- JNI global reference trỏ tới object có trạng thái có thể thay đổi nhưng không thread-safe.

Trước khi chia sẻ, cần xác định rõ ai được đọc/ghi, điều kiện nào cho phép close và library có đảm bảo thread safety hay không.

Nếu dữ liệu chỉ dùng trong một tác vụ một luồng, confined ownership thường dễ lập luận và an toàn hơn trạng thái dùng chung.
