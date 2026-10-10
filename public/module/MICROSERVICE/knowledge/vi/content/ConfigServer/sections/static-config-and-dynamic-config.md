Đây là một vấn đề chạm đúng vào sự khác biệt giữa cấu hình lúc đóng gói (**Build-time**) và cấu hình lúc vận hành (**Run-time**). Trong môi trường Microservices, Spring Cloud Config tỏ ra hữu hiệu hơn rất nhiều.

## 1. Bảng so sánh chi tiết

| Đặc điểm | Dùng Gradle Task (Build-time) | Dùng Spring Cloud Config (Run-time) |
| :--- | :--- | :--- |
| **Thời điểm áp dụng** | Khi bạn đang Build dự án (tạo file `.jar`). | Khi ứng dụng đang chạy (Startup hoặc Refresh). |
| **Tính linh hoạt** | **Thấp.** Muốn đổi mật khẩu DB, bạn phải chạy lại Task, Build lại code và Deploy lại. | **Cao.** Chỉ cần sửa file trên Git/Folder, Service nhận cấu hình mới mà không cần build lại code. |
| **Quản lý tập trung** | **Kém.** Cấu hình nằm rải rác trong từng Service hoặc script của Gradle. | **Tuyệt vời.** Tất cả cấu hình của 10-20 services nằm gọn trong một Repo duy nhất. |
| **Bảo mật** | **Rủi ro.** Mật khẩu thường bị "hard-code" trong script hoặc lưu trong file jar. | **An toàn.** Hỗ trợ mã hóa (Encryption) và phân quyền truy cập vào Config Server. |
| **Môi trường (Env)** | Phải tạo nhiều file `.yml` khác nhau (`dev`, `prod`) từ trước. | Tự động khớp cấu hình theo profile (`dev`/`test`/`prod`) thông minh. |

## 2. Tại sao Spring Cloud Config lại thắng thế?

Trong dự án `java-learning` của bạn, nếu dùng Gradle Task, mỗi lần thay đổi địa chỉ RabbitMQ hoặc Eureka, bạn sẽ phải trải qua quy trình:
`Chỉnh sửa script Gradle` $\rightarrow$ `Chạy gradle build` $\rightarrow$ `Build lại Docker Image` $\rightarrow$ `Chạy lại Docker Compose`.
**=> Quá mất thời gian.**

Với **Spring Cloud Config**:
1. Bạn sửa file `application.yml` trong thư mục cấu hình (Config Repo).
2. Restart Service (hoặc dùng `@RefreshScope` để cập nhật ngay lập tức).
   **=> Xong.**

## 3. Khi nào thì nên dùng Gradle Task?

Gradle Task chỉ hữu hiệu cho các tác vụ mang tính chất **Scaffolding** (như Task vẽ sơ đồ cấu trúc dự án bạn đã làm) hoặc tạo ra các file cấu hình mặc định ban đầu. Nó không phù hợp để quản lý các thông số biến động theo môi trường.

---

### 💡 Lời khuyên cho lộ trình Microservices:

Hãy tập thói quen tách biệt hoàn toàn giữa **Code** và **Cấu hình** theo nguyên lý *12-Factor App*:

* **Code:** Chỉ build 1 lần duy nhất thành file `.jar` hoặc Docker Image (**Build once, run everywhere**).
* **Cấu hình:** Được "bơm" vào ứng dụng từ bên ngoài (**Spring Cloud Config**) tùy theo môi trường nó đang chạy.

```yaml
  # Ví dụ cấu hình bootstrap.yml để trỏ tới Config Server
  spring:
    application:
      name: order-service
    cloud:
      config:
        uri: http://config-server:8888
        fail-fast: true
        retry:
          max-attempts: 5
```
