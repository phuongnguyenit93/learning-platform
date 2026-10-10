Để đảm bảo hiệu năng cho ứng dụng, bạn cần phân biệt rõ giữa việc "ngắt kết nối" và "dừng hoạt động" hoàn toàn của Arthas trong RAM.

[Image showing the difference between exit and stop commands in Arthas]

## 1. Thoát tạm thời: `quit` hoặc `exit`
* **Tác dụng:** Ngắt kết nối giữa Terminal (PowerShell) của bạn và Arthas Server.
* **Trạng thái:** Arthas **vẫn chạy ngầm** (attached) bên trong JVM. Các Agent vẫn bám vào class để sẵn sàng phục vụ. Bạn có thể kết nối lại ngay lập tức mà không cần quá trình Attach lại từ đầu.

## 2. Dừng hoàn toàn: `stop` hoặc `shutdown`
Đây là lệnh **quan trọng nhất** bạn cần dùng khi đã hoàn thành việc chẩn đoán.
* **Hành động:** * Hủy bỏ toàn bộ các thay đổi Bytecode (**Class Enhancement**) mà Arthas đã thực hiện.
  * Giải phóng tài nguyên RAM và đóng cổng Web Console (`8563`).
  * Ngắt kết nối hoàn toàn khỏi JVM.
* **Lưu ý:** Sau khi `stop`, các class được trả về trạng thái nguyên bản, đảm bảo an toàn cho môi trường Production hoặc Staging.

## 3. Cách tắt đối với "Arthas Spring Boot Starter"
Nếu bạn tích hợp Arthas như một Dependency trong dự án, cơ chế sẽ hơi khác:
* **Vô hiệu hóa:** Bạn nên cấu hình trong file `application.yml` (thường là ở profile `prod`) để tránh nó tự kích hoạt:
  ```yaml
  arthas:
    enabled: false
  ```

## 4. Mẹo "dọn dẹp" nếu PowerShell/Terminal bị treo
Nếu bạn lỡ tay tắt cửa sổ Terminal mà chưa gõ `stop`, hoặc tiến trình bị treo, hãy sử dụng lệnh sau trong PowerShell để truy quét:

	```powershell
	# Tìm và tắt các tiến trình liên quan đến Arthas còn sót lại
	Get-Process | Where-Object {$_.ProcessName -like "*arthas*"} | Stop-Process
	```

---

### 💡 Lời khuyên cho Backend Developer:
Luôn ưu tiên dùng lệnh **`stop`** bên trong giao diện Arthas trước khi đóng Terminal. Điều này giúp JVM "sạch sẽ" nhất có thể. Trong môi trường Docker của dự án `java-learning`, việc quên `stop` có thể khiến Container của bạn bị ngốn RAM dần dần theo thời gian (Memory Leak).
