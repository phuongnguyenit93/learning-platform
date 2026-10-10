Các bytecode invoke truyền thống như `invokevirtual` hay `invokestatic` mô tả khá trực tiếp kiểu symbolic reference mà JVM cần resolve. `invokedynamic` mở một extension point khác: **logic linkage do bootstrap method quyết định**.

Thay vì bytecode chỉ rõ target method cuối cùng:

```text
invokedynamic
→ JVM gọi bootstrap method khi cần link call site
→ bootstrap trả về CallSite
→ instruction từ đó dispatch qua CallSite đó
```

Điều này cho phép language runtime hoặc JDK runtime library triển khai custom invocation semantics mà không cần thêm bytecode instruction riêng cho từng language feature.

Java source bình thường hiếm khi tạo `invokedynamic` trực tiếp. Compiler/JDK runtime có thể dùng nó cho feature như lambda hoặc string concatenation. Module này học cơ chế để hiểu luồng runtime, không dạy viết classfile generator.
