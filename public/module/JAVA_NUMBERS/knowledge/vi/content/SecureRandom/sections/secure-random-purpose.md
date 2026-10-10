Các trường hợp sử dụng điển hình:

- token bảo mật;
- nonce khi giao thức yêu cầu nonce ngẫu nhiên;
- salt;
- dữ liệu bí mật;
- đầu vào cho quá trình sinh khóa khi API/giao thức yêu cầu nguồn ngẫu nhiên.

Ví dụ tạo các byte ngẫu nhiên:

```java
SecureRandom secureRandom = new SecureRandom();

byte[] bytes = new byte[32];
secureRandom.nextBytes(bytes);
```

### VÌ SAO không dùng SecureRandom cho mọi thứ?

Đảm bảo bảo mật có chi phí, cách khởi tạo và ngữ nghĩa của nhà cung cấp bảo mật (provider) khác với bộ sinh số giả ngẫu nhiên thông thường.

Với mô phỏng hoặc kiểm thử cần tính xác định:

```text
khả năng tái lập kết quả
→ thường quan trọng

tính khó dự đoán về mặt mật mã
→ không phải yêu cầu
```

Khi đó bộ sinh số giả ngẫu nhiên thông thường có thể phù hợp hơn.
