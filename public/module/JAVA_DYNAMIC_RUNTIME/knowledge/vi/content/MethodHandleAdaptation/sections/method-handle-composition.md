Composition biến nhiều thao tác nhỏ thành một chuỗi lời gọi có thể thực thi:

```text
input
 ↓
normalize
 ↓
validate / select
 ↓
business target
 ↓
format result
```

Ưu điểm trong mã runtime/framework:

- chuỗi handle có thể được xây một lần;
- final handle có một `MethodType` rõ;
- phía gọi chỉ invoke một handle;
- chuỗi handle có cấu trúc kiểu rõ ràng để JVM có cơ hội tối ưu; hiệu quả thực tế vẫn phải được đo trên workload cụ thể.

Nhưng composition quá sâu cũng làm stack trace và việc suy luận khó hơn. Hãy đặt tên biến theo từng giai đoạn có ý nghĩa:

```java
MethodHandle normalizeName = ...;
MethodHandle invokeGreeting = ...;
MethodHandle formatResult = ...;
```

Đừng đặt `mh1`, `mh2`, `mh3` nếu mục tiêu là curriculum hoặc production maintainability.
