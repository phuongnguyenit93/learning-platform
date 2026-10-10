Java Platform Module System thêm một ranh giới cao hơn quyền truy cập package. Với named module, cần phân biệt hai khái niệm:

- `exports` cho mô-đun khác dùng **public API** của package;
- `opens` cho mô-đun khác thực hiện **truy cập phản chiếu sâu** vào thành phần không public của package.

Ví dụ:

```java
module payment.core {
    exports com.example.payment.api;
    opens com.example.payment.internal to payment.framework;
}
```

Mô-đun `payment.framework` có thể truy cập phản chiếu sâu vào package `com.example.payment.internal`, nhưng mô-đun khác không tự động có quyền đó. Nếu package chỉ `exports` mà không `opens`, thành phần public có thể được dùng theo quy tắc `exports`, còn private/package/protected instance members không thể đơn giản bị mở bằng `setAccessible(true)` từ mô-đun ngoài.

Đây là tính đóng gói mạnh: ranh giới mô-đun có thể nói rõ package nào là API công khai và package nào cho phép truy cập phản chiếu sâu. Reflection vẫn mạnh, nhưng không phải quyền vượt qua mọi ranh giới mô-đun.

Khi chạy ứng dụng, tùy chọn JVM dạng sau có thể mở tạm một package cho một module sử dụng:

```text
--add-opens payment.core/com.example.payment.internal=payment.framework
```

Đó là quyết định khi triển khai/lúc chạy, không phải lý do để thư viện mặc định dựa vào phần nội bộ `private`. Nếu framework cần Reflection hợp lệ lâu dài, mô tả mô-đun hoặc hợp đồng tích hợp nên biểu diễn ranh giới đó rõ ràng.
