Khi vận hành một hệ thống gồm nhiều Service, việc sử dụng **Arthas Tunnel** giúp bạn điều khiển và chẩn đoán mọi container từ một giao diện Web duy nhất mà không cần can thiệp trực tiếp vào Terminal của từng máy.

## Bước 1: Dựng "Trạm điều khiển" (Arthas Tunnel Server)
Bạn cần một container trung tâm để tiếp nhận các kết nối từ các Service khác đổ về.

Chạy lệnh Docker sau:
```bash
   docker run -d \
     --name arthas-tunnel-server \
     -p 8080:8080 \
     -p 7777:7777 \
     hengyunabc/arthas-tunnel-server
```
* **Port 8080:** Cổng truy cập giao diện Web Console.
* **Port 7777:** Cổng tiếp nhận kết nối WebSocket từ các Agent (Service).

## Bước 2: "Cấy" Arthas vào Service (Docker Agent)
Giả sử bạn có `inventory-service` đang chạy. Bạn cần đưa Arthas vào bên trong Image của Service đó.

**1. Cập nhật Dockerfile của Service:**
Sử dụng kỹ thuật Multi-stage build để lấy Arthas từ Image chính thức:
```dockerfile
   FROM openjdk:17-jdk-slim
   # ... các lệnh build app của bạn ...

       # Cấy Arthas vào image từ source chính thức
       COPY --from=hengyunabc/arthas:latest /opt/arthas /opt/arthas

       ENTRYPOINT ["java", "-jar", "app.jar"]
       ```

   **2. Kích hoạt Agent kết nối về Tunnel:**
   Sau khi Service khởi chạy, dùng `docker exec` để ra lệnh cho Agent "gọi điện" về trạm trung tâm:
   ```bash
   docker exec -it <inventory_container_id> \
     java -jar /opt/arthas/arthas-boot.jar \
     --attach-only \
     --tunnel-server 'ws://host.docker.internal:7777/ws' \
     --agent-id inventory-service
```
* **Lưu ý:** Trên Windows/Mac, dùng `host.docker.internal` để Container tìm thấy Tunnel Server đang chạy ở máy host.

## Bước 3: Điều khiển từ xa qua Web Console
Đây là lúc bạn gặt hái thành quả. Bạn không cần mở Terminal nữa:

1. Mở trình duyệt, truy cập: `http://localhost:8080`
2. **Thông số nhập:**
    * **IP:** `localhost`
    * **Port:** `8080`
    * **Agent ID:** `inventory-service` (đúng tên bạn đặt ở Bước 2).
3. Nhấn **Connect**.

---

## 📊 Tại sao nên dùng Tunnel thay vì `docker exec` thông thường?

| Lợi ích | Giải thích |
| :--- | :--- |
| **Quản lý tập trung** | Chỉ cần 1 tab trình duyệt để quản lý 10-20 service cùng lúc thay vì mở hàng chục Terminal. |
| **Vượt rào cản mạng** | Tunnel cho phép bạn đứng từ máy cá nhân soi code trên Server (Staging) qua WebSocket an toàn. |
| **Giao diện trực quan** | Web Console hỗ trợ copy-paste log, xem Dashboard và biểu đồ mượt mà hơn Terminal. |

---

### 💡 Mẹo nhỏ cho hệ thống Microservices:
Để chuyên nghiệp hơn, thay vì chạy lệnh `docker exec` thủ công ở Bước 2, bạn có thể cấu hình **Arthas Spring Boot Starter** trong file `pom.xml`. Khi đó, mỗi khi Service khởi động, nó sẽ tự động đăng ký với Tunnel Server mà bạn không cần gõ thêm bất kỳ lệnh Docker nào.

```xml
	<dependency>
	    <groupId>com.taobao.arthas</groupId>
	    <artifactId>arthas-spring-boot-starter</artifactId>
	    <version>3.7.1</version>
	</dependency>
```
