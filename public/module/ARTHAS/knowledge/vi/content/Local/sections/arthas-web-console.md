Sau khi bạn đã chọn xong Process ID (PID), Arthas mặc định sẽ mở một "cổng trời" để bạn truy cập thông qua trình duyệt web. Đây là cách cấu hình và thao tác chi tiết.

## 1. Kiểm tra trạng thái mặc định
Khi Arthas khởi động thành công, nó sẽ mở hai cổng giao tiếp chính:
* **Cổng Web (HTTP):** `8563` (Giao diện người dùng).
* **Cổng Telnet:** `3658` (Kết nối điều khiển).

**Địa chỉ truy cập nhanh:** `http://127.0.0.1:8563`

## 2. Cách cấu hình để truy cập từ xa (Remote Access)
Nếu bạn chạy Arthas trên Server/Docker và muốn ngồi máy cá nhân để soi, bạn không thể dùng `127.0.0.1` (vốn chỉ cho phép kết nối nội bộ). Bạn cần yêu cầu Arthas lắng nghe trên tất cả các card mạng.

Chạy lệnh khởi động kèm tham số `--target-ip`:
```bash
  java -jar arthas-boot.jar --target-ip 0.0.0.0
```
* **Lưu ý:** Hãy đảm bảo Firewall của Server đã mở cổng `8563` và `3658`.

## 3. Thao tác trên giao diện Web Console
Khi truy cập vào `http://<IP-SERVER>:8563`, bạn sẽ thấy giao diện Terminal trực quan. Hãy nhập thông số:
* **IP:** Nhập IP của server (mặc định là `127.0.0.1`).
* **Port:** Nhập `3658` (Cổng điều khiển).
* **Connect:** Nhấn nút Connect để bắt đầu phiên làm việc.

Bây giờ, toàn bộ các lệnh như `dashboard`, `thread`, hay `watch` sẽ hiển thị mượt mà ngay trên trình duyệt của bạn.

## 4. Một số mẹo nhỏ cho bạn

* **Đổi cổng Web:** Nếu cổng `8563` bị chiếm bởi ứng dụng khác, hãy đổi bằng tham số:
```bash
  java -jar arthas-boot.jar --http-port 9999
```
* **Tắt Arthas sạch sẽ:** Khi dùng xong, đừng quên gõ lệnh `stop`. Nếu bạn chỉ đóng trình duyệt, Arthas vẫn chạy ngầm và chiếm tài nguyên JVM.
* **Cảnh báo bảo mật:** Web Console mặc định không có mật khẩu. Đừng bao giờ mở cổng này ra Internet công cộng nếu không có lớp bảo mật hoặc SSH Tunnel che chắn.

---

### 💡 Mẹo cho dự án java-learning:
Khi dùng Web Console, bạn có thể mở nhiều tab trình duyệt để theo dõi các thông số khác nhau cùng lúc. Ví dụ:
* **Tab 1:** Để lệnh `dashboard` chạy liên tục để xem CPU.
* **Tab 2:** Dùng lệnh `trace` để soi một API đang nghi vấn.
* **Tab 3:** Dùng `watch` để bắt dữ liệu đầu vào.
