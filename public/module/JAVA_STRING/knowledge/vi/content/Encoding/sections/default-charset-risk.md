Từ **JDK 18**, JEP 400 quy định UTF-8 là **Charset mặc định của Java**. Vì vậy, với hành vi JDK chuẩn trên Java 21, `Charset.defaultCharset()` là UTF-8 và các API được định nghĩa là dùng Charset mặc định sẽ đi theo lựa chọn đó; cấu hình tương thích đặc biệt của môi trường chạy có thể chủ động thay đổi mặc định này. Không nên suy rộng thành “mọi luồng I/O chuẩn đều dùng `Charset.defaultCharset()`”: console và một số luồng chuẩn có cơ chế Charset riêng.

Vì vậy mô hình cũ “Charset mặc định luôn phụ thuộc hệ điều hành và locale” không còn đúng mặc định cho Java 21. Tuy nhiên, hợp đồng dữ liệu bền vững vẫn nên nêu Charset rõ ràng thay vì dựa vào mặc định của môi trường chạy.

Ví dụ mã kiểu:

```java
text.getBytes();
new String(bytes);
```

để Charset ngầm định. Nếu dữ liệu đi qua ranh giới lưu trữ hoặc mạng, tốt hơn là chỉ rõ Charset để hợp đồng không phụ thuộc môi trường chạy.

### Vì sao vẫn nên chỉ rõ Charset?

Không phải vì Java 21 thường chọn Charset khác nhau giữa Windows/Linux, mà vì **mã hóa là một phần của hợp đồng dữ liệu**:

```text
phía tạo dữ liệu
→ byte UTF-8
→ phía đọc dữ liệu

hợp đồng phải nói UTF-8
```

Chỉ rõ `StandardCharsets.UTF_8` làm mục đích đọc được ngay trong mã nguồn, tránh phụ thuộc cấu hình tương thích/triển khai và giúp việc rà soát giao thức hoặc định dạng tệp rõ ràng hơn.

Charset mặc định vẫn hợp lý khi hợp đồng API thật sự định nghĩa “dùng Charset mặc định của môi trường chạy”; giao thức lưu trữ hoặc mạng thường nên chỉ rõ Charset.
