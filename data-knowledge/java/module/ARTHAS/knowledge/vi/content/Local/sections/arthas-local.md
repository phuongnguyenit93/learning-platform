Arthas là công cụ mạnh mẽ của Alibaba giúp bạn soi thấu "nội tạng" của ứng dụng Java ngay khi nó đang chạy.

## 1. Tải Arthas (Chỉ cần 1 file bootstrap)
Arthas cung cấp một file mồi (`arthas-boot.jar`) rất nhẹ. Bạn không cần cài đặt rườm rà.

* **Tải bằng trình duyệt:** Truy cập [arthas-boot.jar](https://arthas.aliyun.com/arthas-boot.jar) và lưu vào máy.
* **Tải bằng dòng lệnh:**
```bash
  curl -O [https://arthas.aliyun.com/arthas-boot.jar](https://arthas.aliyun.com/arthas-boot.jar)
```

## 2. Chuẩn bị Ứng dụng trong IntelliJ
Để Arthas có thể "soi", ứng dụng Spring Boot của bạn phải đang ở trạng thái **Running**.
1. Mở dự án `java-learning` trong IntelliJ.
2. Chạy (Run) các service của bạn (ví dụ: `InventoryApplication`).

## 3. Khởi động Arthas và "Attach" vào App
Mở Terminal và chạy lệnh sau:
```bash
  java -jar arthas-boot.jar
```
**Điều gì sẽ xảy ra?**
* Arthas liệt kê tất cả tiến trình Java đang chạy trên máy bạn.
* Bạn sẽ thấy danh sách dạng:
```plaintext
  [1]: 12345 org.jetbrains.jps.cmdline.Launcher
  [2]: 67890 com.example.inventory.InventoryApplication
```
* **Việc của bạn:** Nhập số thứ tự tương ứng (ví dụ: `2`) rồi nhấn **Enter**.

## 4. Kiểm tra sức khỏe với Dashboard
Sau khi thấy logo Arthas ASCII hiện ra, hãy thử gõ lệnh cơ bản nhất:
```bash
  dashboard
```
Lệnh này hiện ra bảng điều khiển thời gian thực về: **CPU, Memory, Threads, và Runtime**.
* Nhấn `q` hoặc `Ctrl + C` để thoát khỏi Dashboard và quay lại dòng lệnh.

## 5. Lưu ý "Sống còn" cho môi trường Windows
Vì bạn đang làm việc trên Windows, hãy chú ý các điểm sau để tránh lỗi:

* **Quyền Admin:** Đôi khi bạn cần mở Terminal (CMD/PowerShell) bằng quyền **Administrator** để Arthas có đủ quyền can thiệp vào JVM.
* **Xung đột Cổng (Port):** Arthas mặc định dùng port `3658`. Nếu bạn muốn soi 2 service cùng lúc, cái thứ 2 sẽ báo lỗi.
    * **Cách xử lý:** Chỉ định port khác:
```bash
  java -jar arthas-boot.jar --telnet-port 3659 --http-port 8564
```
* **Tắt sạch sẽ:** Khi xong việc, hãy gõ lệnh `stop`. Lệnh này cực kỳ quan trọng vì nó sẽ gỡ bỏ các "móc" (instrumentation) mà Arthas đã gắn vào App, trả lại hiệu năng ban đầu cho máy.

---

### 💡 Mẹo nhỏ cho dự án java-learning:
Nếu bạn thấy một API chạy chậm mà không biết chậm ở đâu, sau khi attach Arthas, hãy thử dùng lệnh `trace`:
```bash
  trace com.example.service.ProductService getProductDetail
```
Arthas sẽ vẽ ra một cái cây thời gian, cho bạn thấy chính xác từng dòng code mất bao nhiêu mili giây.
