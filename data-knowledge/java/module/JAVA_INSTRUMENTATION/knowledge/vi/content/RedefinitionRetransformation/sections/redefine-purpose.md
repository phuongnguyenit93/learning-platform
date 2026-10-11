Redefinition thay định nghĩa class bằng **một bộ class-file bytes do bên gọi cung cấp**:

~~~java
byte[] replacement = loadCompiledReplacement();
ClassDefinition definition =
        new ClassDefinition(OrderService.class, replacement);

inst.redefineClasses(definition);
~~~

Mô hình tư duy:

~~~text
bên gọi đã có class bytes thay thế
        ↓
redefineClasses(...)
        ↓
các transformer đã đăng ký tham gia theo quy tắc của chuỗi
        ↓
JVM verify + cài định nghĩa mới
~~~

Trường hợp sử dụng điển hình là fix-and-continue/gỡ lỗi hoặc công cụ đã có sẵn bytes thay thế. Java API còn gợi ý rằng nếu mục tiêu là “lấy class hiện tại rồi áp dụng bytecode instrumentation”, retransformClasses thường phù hợp hơn.

Redefinition cần Can-Redefine-Classes trong manifest và JVM phải hỗ trợ khả năng.
