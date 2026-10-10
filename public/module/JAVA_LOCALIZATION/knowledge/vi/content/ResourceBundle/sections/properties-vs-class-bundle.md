Java hỗ trợ hai kiểu gói tài nguyên chính.

### `.properties`

```text
Messages_en.properties
Messages_vi.properties
```

Ưu điểm:

- tách văn bản khỏi mã nguồn Java;
- dễ cho người dịch và công cụ dịch xử lý;
- phù hợp với dữ liệu khóa/giá trị dạng văn bản;
- không cần biên dịch lại lớp Java khi sửa bản dịch nếu quy trình triển khai cho phép thay tài nguyên.

### Gói tài nguyên dạng lớp

Có thể tạo lớp kế thừa `ListResourceBundle`:

```java
public class Messages_en extends ListResourceBundle {
    @Override
    protected Object[][] getContents() {
        return new Object[][] {
                {"order.created", "Order created"}
        };
    }
}
```

Gói tài nguyên dạng lớp có thể trả đối tượng chứ không chỉ String, nhưng đổi lại tài nguyên bị gắn với mã Java/vòng đời biên dịch.

Với bản dịch thông điệp thông thường, `.properties` thường đơn giản và dễ vận hành hơn.

Trong Java hiện đại, `PropertyResourceBundle` đọc gói `.properties` bằng UTF-8 theo hành vi chuẩn hiện hành, đồng thời có cơ chế tương thích với mã hóa cũ. Dù vậy, kho mã và quy trình xây dựng vẫn nên thống nhất UTF-8 rõ ràng để tránh khác biệt giữa các công cụ.
