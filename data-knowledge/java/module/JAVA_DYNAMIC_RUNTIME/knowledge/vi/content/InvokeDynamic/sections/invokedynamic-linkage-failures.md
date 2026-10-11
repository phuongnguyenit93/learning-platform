CallSite do bootstrap trả về phải có type tương thích chính xác với descriptor của invokedynamic instruction.

Failure semantics cần tách rõ:

- nếu bootstrap ném một `Error` hoặc subclass của `Error`, chính error đó được dùng làm resolution failure;
- nếu bootstrap ném một `Throwable` không phải `Error`, JVM bọc nó trong `BootstrapMethodError` và giữ throwable gốc làm cause;
- nếu bootstrap trả `null`, trả object không phải `CallSite`, hoặc trả `CallSite` có type không khớp descriptor của instruction, resolution thất bại bằng `BootstrapMethodError`.

Với cùng một `invokedynamic` instruction, sau khi resolution đã thất bại thì các lần thực thi sau tiếp tục nhận cùng resolution error; bootstrap không được chạy lại cho instruction đó.

Luồng debug:

```text
lỗi invokedynamic
→ call-site MethodType là gì?
→ bootstrap nhận name/type nào?
→ target.type() trước asType là gì?
→ returned CallSite.type() là gì?
→ nếu là BootstrapMethodError, original cause là gì?
→ nếu là Error khác, bootstrap/resolution đã ném trực tiếp error nào?
```

Không nên bắt `BootstrapMethodError` như một business exception. Đây thường là lỗi linkage, lập trình hoặc cấu hình.
