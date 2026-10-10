Giả sử framework cần gọi method `greet(String)` trên nhiều cách triển khai. Nếu code ứng dụng biết chính xác type tại compile time, lời gọi trực tiếp là lựa chọn tốt nhất:

```java
String result = greeter.greet("Phuong");
```

Khó khăn bắt đầu khi framework muốn **lưu hành vi như dữ liệu**, bind một receiver trước, đổi signature cho khớp một protocol nội bộ, hoặc liên kết một call site một lần rồi dispatch qua target hiện tại. Reflection giải quyết tốt việc khám phá metadata và gọi member khi cần tính động, nhưng `java.lang.invoke` bổ sung một mô hình khác: executable references có kiểu + các phép biến đổi có thể ghép lại.

Một ví dụ mental model:

```text
"Tôi biết hợp đồng lời gọi là (String)String"
        ↓
MethodType mô tả hợp đồng
        ↓
Lookup kiểm tra quyền và tạo MethodHandle
        ↓
MethodHandle có thể bind/adapt/compose
        ↓
CallSite có thể giữ target
        ↓
invokedynamic cho JVM liên kết call site qua bootstrap
```

VarHandle giải quyết một bài toán khác: biểu diễn **một variable hoặc họ variable** cùng access semantics như plain, volatile, acquire/release hay compare-and-set.
