Để xem đầy đủ danh sách các thuộc tính cấu hình của Eureka hay bất kỳ dự án Spring Cloud nào, bạn có 3 "nguồn tài nguyên" từ mức độ tóm tắt đến chi tiết tận chân tơ kẽ tóc:

## 1. Tài liệu chính thức (Official Documentation) - Nguồn chuẩn nhất
Spring Cloud có một trang chuyên biệt liệt kê tất cả các thuộc tính cấu hình. Đối với Eureka, bạn có thể tra cứu tại:
* https://docs.spring.io/spring-cloud-netflix/reference/configprops.html
* **Mẹo:** Nhấn `Ctrl + F` và tìm kiếm tiền tố `eureka.server`, `eureka.client`, hoặc `eureka.instance`. Tài liệu sẽ giải thích rõ: *Default value* là gì và mục đích sử dụng.

## 2. Sử dụng IDE (IntelliJ IDEA) - Nguồn nhanh nhất
Vì bạn đang phát triển trên IntelliJ, bạn có một trợ thủ đắc lực ngay trong trình soạn thảo:

* **Gợi ý tự động (Autocomplete):** Trong file `application.yml`, bạn chỉ cần gõ `eureka.` rồi nhấn `Ctrl + Space`. IDE sẽ liệt kê tất cả các thuộc tính khả dụng kèm mô tả ngắn.
* **Truy cập Source Code:** Giữ phím `Ctrl` và click chuột trái vào một từ khóa cấu hình (ví dụ: `enable-self-preservation`). IntelliJ sẽ đưa bạn thẳng đến class Java định nghĩa thuộc tính đó (thường là `EurekaServerConfigBean.java` hoặc `EurekaClientConfigBean.java`).

## 3. Xem trực tiếp trên App đang chạy (Spring Boot Actuator)
Đây là cách "thực tế" nhất để xem cấu hình đang có hiệu lực (Real-time):

1. Thêm dependency `spring-boot-starter-actuator` vào module.
2. Cấu hình mở endpoint trong `application.yml`:
   ```yaml
   management:
     endpoints:
       web:
         exposure:
           include: "configprops,env"
   ```
3. Truy cập: `http://localhost:8761/actuator/configprops`.
4. Kết quả trả về là một file JSON chứa tất cả giá trị cấu hình thực tế, bao gồm cả những giá trị mặc định mà bạn không khai báo.

---

## 📊 Tóm tắt các nhóm cấu hình Eureka quan trọng

| Nhóm Config | Ý nghĩa | Ví dụ tiêu biểu |
| :--- | :--- | :--- |
| **eureka.server.\*** | Cấu hình cho "đầu não" Eureka Server. | `enable-self-preservation`, `eviction-interval-timer-in-ms` |
| **eureka.client.\*** | Cách service tương tác với Server. | `service-url`, `register-with-eureka`, `fetch-registry` |
| **eureka.instance.\*** | Định danh của chính service đó. | `instance-id`, `prefer-ip-address`, `lease-renewal-interval-in-seconds` |

---

### 💡 Lưu ý cho dự án java-learning:
Khi bạn chạy Eureka trong môi trường **Docker**, hãy đặc biệt chú ý đến nhóm `eureka.instance.*`. Bạn thường phải cấu hình `prefer-ip-address: true` để các service có thể tìm thấy nhau qua địa chỉ IP nội bộ của Docker thay vì dùng hostname của container.

```yaml
	eureka:
	  instance:
	    prefer-ip-address: true
	    instance-id: ${spring.application.name}:${random.value}
```
