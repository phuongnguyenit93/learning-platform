Với mã bình thường, trình biên dịch kiểm tra `public`, `protected`, package-private và `private` ngay tại nơi gọi. Một class bên ngoài `PaymentService` không thể viết `service.internalStatus()` vì lời gọi đó vi phạm quy tắc truy cập của Java.

Reflection tách quá trình này thành hai bước. Bước đầu là **khám phá**: lấy đối tượng mô tả đại diện cho thành phần. Bước sau là **sử dụng**: đọc/ghi field, gọi method hoặc gọi constructor. `getDeclaredMethod()` có thể trả về đối tượng mô tả cho method `private`, nhưng `Method.invoke()` vẫn kiểm tra quyền truy cập nếu việc kiểm tra truy cập chưa được tắt.

```java
PaymentService service = new PaymentService("demo");
Method method = PaymentService.class.getDeclaredMethod("internalStatus");

System.out.println(method.getName());        // internalStatus
System.out.println(method.canAccess(service)); // thường là false từ bên gọi bên ngoài

method.invoke(service); // IllegalAccessException nếu bên gọi không có quyền
```

Điều này giải thích vì sao Reflection không làm mất tính đóng gói chỉ bằng việc “thấy” thành phần private. Đối tượng mô tả là siêu dữ liệu; quyền thao tác là một ranh giới khác.

`canAccess(obj)` kiểm tra thành phần hiện có thể được bên gọi sử dụng hay không. Với instance field/method, `obj` phải là instance phù hợp; với thành phần static và constructor, đối số phải là `null`. Đây là cách kiểm tra trạng thái truy cập thực tế rõ ràng hơn API cũ `isAccessible()`, vốn chỉ cho biết cờ bỏ qua kiểm tra truy cập đang bật hay tắt.
