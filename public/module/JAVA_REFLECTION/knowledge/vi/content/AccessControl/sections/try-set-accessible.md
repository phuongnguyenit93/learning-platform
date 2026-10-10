`Field`, `Method` và `Constructor` đều kế thừa từ `AccessibleObject`. Chúng có một cờ cho phép bỏ qua các kiểm tra truy cập của ngôn ngữ Java khi môi trường lúc chạy cho phép.

```java
Method method = PaymentService.class.getDeclaredMethod("internalStatus");

if (method.trySetAccessible()) {
    Object value = method.invoke(new PaymentService("demo"));
    System.out.println(value);
}
```

`trySetAccessible()` cố bật cờ cho phép bỏ qua kiểm tra truy cập và trả `true` nếu thành công. Nếu ranh giới hiện tại không cho phép truy cập phản chiếu sâu, nó trả `false`. `setAccessible(true)` yêu cầu cùng mục tiêu nhưng thất bại bằng `InaccessibleObjectException` khi cờ này không thể được bật.

Hai API này không nên được hiểu là “biến private thành public”. Modifier của thành phần không thay đổi. Chúng chỉ ảnh hưởng việc đối tượng phản chiếu có được bỏ qua kiểm tra truy cập khi sử dụng hay không.

Trước khi đi sâu vào JPMS, hãy giữ một mô hình tư duy hai tầng:

~~~text
Quy tắc truy cập Java
public / protected / package-private / private
        ↓
ranh giới mô-đun (khi dùng named module)
exports → cho mô-đun khác dùng public API của package
opens   → cho phép truy cập phản chiếu sâu vào package
~~~

`exports` và `opens` giải hai bài toán khác nhau. Một package có thể xuất public API nhưng vẫn không mở phần nội bộ private cho framework truy cập phản chiếu sâu.

Trong cùng mô-đun, Reflection thường có thể bật quyền truy cập tới thành phần của class cùng mô-đun. **Mô-đun không tên (unnamed module)** là mô-đun ngầm của mã chạy trên classpath và không có `module-info.java`; **mô-đun mở (open module)** là mô-đun có tên (named module) khai báo `open module ...`, nghĩa là các package của nó mặc định được mở cho truy cập phản chiếu sâu. Với hai trường hợp đó, package được coi là mở theo quy tắc JPMS. Khi mã nằm ở một named module khác, `exports` và `opens` trở thành phần quyết định.

Một cách làm thực tế là **thử trước, xử lý lỗi rõ ràng**:

```java
Method method = PaymentService.class.getDeclaredMethod("internalStatus");

if (!method.trySetAccessible()) {
    throw new IllegalStateException("PaymentService is not open for reflective access");
}

String status = (String) method.invoke(service);
```

Cách làm này tốt hơn việc giả định `setAccessible(true)` luôn thành công rồi để lỗi xuất hiện ở môi trường mô-đun khác.
