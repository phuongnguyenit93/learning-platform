`@Order` hữu ích khi nhiều cross-cutting concern cần precedence rõ ràng, nhưng dependency phức tạp kiểu:

```text
Aspect A phải chạy trước B,
B phải thay dữ liệu cho C,
C phải chạy trước D
```

là dấu hiệu design đang khó hiểu.

Business rule nên nằm trong abstraction/service rõ ràng thay vì biến advice ordering thành workflow engine ngầm.

Chapter Pointcut cố ý có hai advice `this(...)` và `target(...)` cùng match mà không dùng thứ tự của chúng làm learning contract. Đây chính là ví dụ cho nguyên tắc này.
