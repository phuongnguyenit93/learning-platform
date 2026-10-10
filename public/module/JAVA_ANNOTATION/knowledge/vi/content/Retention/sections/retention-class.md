`CLASS` giữ Annotation trong class file nhưng JVM **không bắt buộc** phải giữ nó để Reflection chuẩn ở thời gian chạy truy cập.

```java
@Retention(RetentionPolicy.CLASS)
public @interface BytecodeMetadata {
}
```

Đây cũng là chính sách mặc định nếu không viết `@Retention`.

Trường hợp sử dụng điển hình:

- công cụ xử lý bytecode;
- phân tích/chèn mã sau khi biên dịch;
- siêu dữ liệu cần đi cùng class file nhưng không cần Reflection ở thời gian chạy.

Mô hình tư duy:

```text
.java
  annotation
      ↓
.class
  annotation vẫn được ghi
      ↓
Reflection ở thời gian chạy
  không quan sát được như Annotation RUNTIME
```

Sai sót phổ biến là quên `@Retention(RUNTIME)` rồi thắc mắc vì sao Reflection không thấy Annotation tùy chỉnh.
