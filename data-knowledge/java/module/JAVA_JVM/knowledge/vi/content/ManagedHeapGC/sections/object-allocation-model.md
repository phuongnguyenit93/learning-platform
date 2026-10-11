Ở specification level, object/array được cấp storage từ heap. Source:

```java
Order order = new Order();
```

cho ta mental model:

```text
new instruction
→ đảm bảo class sẵn sàng theo lifecycle rule
→ cấp storage cho một object chưa được khởi tạo
→ reference tới object đi vào operand stack
→ invokespecial gọi constructor <init>
→ object hoàn tất initialization theo constructor flow
```

Ở bytecode level, `new` và constructor invocation là **hai bước khác nhau**. `new` tạo một uninitialized object; compiler thường phát sinh `dup` rồi `invokespecial ... <init>` để gọi constructor. Distinction này quan trọng khi đọc bytecode hoặc verifier rules.

HotSpot có thể dùng các kỹ thuật cấp phát nhanh như thread-local allocation buffer hoặc bump-pointer tùy collector/layout, nhưng đó là chi tiết triển khai.

Do đó không nên dạy “Java object luôn được allocate bằng TLAB” như một hợp đồng. Hợp đồng là object có runtime storage và semantics đúng; chiến lược tối ưu có thể thay đổi.
