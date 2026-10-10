Xóa kiểu (type erasure) nghĩa là nhiều khác biệt generic không tồn tại như định danh kiểu riêng khi chương trình thực thi. Ví dụ:

```java
Repository<Integer> integers = new Repository<>();
Repository<Long> longs = new Repository<>();

System.out.println(integers.getClass() == longs.getClass()); // true
```

Cả hai đối tượng có cùng `Class` lúc chạy: `Repository.class`. Reflection không thể hỏi một đối tượng `Repository` bất kỳ rồi luôn nhận lại “đối tượng này là `Repository<Integer>`”. Thông tin đó thường đã bị xóa.

Thông tin generic vẫn có thể tồn tại ở **vị trí khai báo**. Ví dụ field `List<PaymentRequest> requests`, method trả `List<String>`, superclass `BaseRepository<PaymentRequest>` hoặc khai báo `Repository<T extends Number>` có thể mang siêu dữ liệu chữ ký. API như `getGenericType()`, `getGenericReturnType()`, `getGenericParameterTypes()` và `getGenericSuperclass()` đọc phần siêu dữ liệu này.

Vì vậy cần phân biệt:

```text
kiểu dùng khi thực thi
→ chủ yếu dùng Class/JVM descriptor sau xóa kiểu

siêu dữ liệu chữ ký generic
→ mô tả khai báo generic để trình biên dịch/công cụ/framework có thể đọc
```

Một khai báo class ẩn danh hoặc class con đôi khi giữ đối số kiểu cụ thể trong chữ ký generic của superclass, nên các thư viện có thể dùng mẫu “type token”. Nhưng đó là vì **khai báo của class con giữ siêu dữ liệu**, không phải vì JVM âm thầm nhớ đối số kiểu cho mọi đối tượng generic.

Reflection cũng không nên dùng chữ ký generic như một cơ chế bảo đảm an toàn kiểu generic lúc chạy. Nó giúp serializer, dependency injection container, schema generator và framework hiểu khai báo tốt hơn; việc kiểm tra và hành vi lúc chạy vẫn phải được thiết kế riêng.

Sau chương này ta đã biết Reflection có thể mang theo cấu trúc kiểu khá phong phú. Bước tiếp theo trong ROADMAP là **Proxy động và chặn lời gọi**: một trường hợp tích hợp nơi siêu dữ liệu `Method` được chuyển qua `InvocationHandler` để tạo hành vi trung gian lúc chạy.
