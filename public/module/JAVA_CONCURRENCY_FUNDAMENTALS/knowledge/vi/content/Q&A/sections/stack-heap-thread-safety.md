Mỗi Thread có stack riêng.

Local variable nằm trong stack frame, nhưng local variable có thể chứa reference tới object trên heap.

Ví dụ:

```java
List<String> list = sharedList;
```

`list` là local reference, nhưng object mà nó trỏ tới vẫn có thể được nhiều Thread cùng truy cập.

Vì vậy:

```text
local variable
≠ tự động thread-safe
```

Điều cần hỏi là object/state có bị shared mutable access hay không.
