Việc **TimeLimiter** yêu cầu (hoặc khuyến khích mạnh mẽ) sử dụng với `CompletableFuture`, `Mono`, hoặc `Flux` xuất phát từ cách quản lý luồng (**Thread**) trong môi trường Servlet truyền thống.

### 1. Cơ chế "Ngắt" (Interruption) của Java
Trong Java, bạn không thể ép một Thread đang chạy phải dừng lại ngay lập tức một cách an toàn (phương thức `thread.stop()` đã bị khai tử). Bạn chỉ có thể gửi một tín hiệu **Interrupt**.

* **Nếu chạy đồng bộ (Synchronous):** Thread hiện tại sẽ bị "khóa" (block) cho đến khi hàm trả về. Nếu hàm đó đang đợi một I/O (gọi API khác) không hỗ trợ interrupt, TimeLimiter không có cách nào giành lại quyền kiểm soát để báo lỗi timeout.
* **Nếu chạy bất đồng bộ (Asynchronous):** Công việc được đẩy sang một Thread khác. TimeLimiter đứng ở Thread chính để theo dõi thời gian. Khi hết giờ, nó báo lỗi ngay cho người dùng và gửi tín hiệu hủy (`cancel`) tới Thread đang chạy ngầm.

### 2. Tránh hiện tượng "Thread Starvation" (Cạn kiệt luồng)
Hãy tưởng tượng hệ thống có 200 Threads trong Thread Pool:

* **Với đồng bộ:** Nếu timeout là 10s và service bên kia chậm, cả 200 Threads sẽ bị treo cứng để đợi. Người dùng thứ 201 sẽ bị từ chối dù hệ thống không bận xử lý logic nặng.
* **Với Async:** TimeLimiter cho phép phản hồi lỗi về phía Client ngay khi hết timeout, giúp giải phóng tài nguyên và tránh "nghẽn cổ chai" tại các luồng xử lý chính.

---

### 3. So sánh TimeLimiter và Circuit Breaker

| Thành phần | Cơ chế | Đối tượng quản lý |
| :--- | :--- | :--- |
| **Circuit Breaker** | Theo dõi tỷ lệ lỗi/timeout để ngắt mạch. | Bọc quanh lệnh gọi đồng bộ hoặc bất đồng bộ. |
| **TimeLimiter** | Đảm bảo một công việc không chạy quá $X$ giây. | Cần cơ chế để tách việc theo dõi và thực thi (Async). |

---

### 4. Cách hoạt động thực tế trong Resilience4j
Khi bạn dùng `@TimeLimiter`, Resilience4j sẽ tạo ra một "bộ hẹn giờ":
1.  Nếu công việc (`Future`/`Mono`) hoàn thành trước: Mọi thứ bình thường.
2.  Nếu bộ hẹn giờ kêu trước: Resilience4j ném ra `TimeoutException`.

> **Mấu chốt:** Nếu không có Async, Thread hiện tại đang bận xử lý logic, nó không thể tự "phân thân" để vừa chạy vừa tự đếm giờ cho chính mình.

---

### Ví dụ về sự khác biệt

* **SAI (Đồng bộ - Không hiệu quả):**
```java
  @TimeLimiter(name = "backend")
  public String doSync() {
      // Luồng này bị block, TimeLimiter không thể can thiệp hiệu quả
      return restTemplate.getForObject(...); 
  }
```

* **ĐÚNG (Bất đồng bộ):**
```java
  @TimeLimiter(name = "backend")
  public CompletableFuture<String> doAsync() {
      // Tách biệt luồng theo dõi và luồng thực thi
      return CompletableFuture.supplyAsync(() -> remoteCall());
  }
```
