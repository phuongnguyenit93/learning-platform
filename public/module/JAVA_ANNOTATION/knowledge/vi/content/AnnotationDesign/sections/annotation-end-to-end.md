Toàn bộ module có thể được nhìn như một luồng siêu dữ liệu:

```text
định nghĩa cấu trúc siêu dữ liệu
→ các phần tử + giá trị mặc định
→ @Retention: siêu dữ liệu sống bao lâu
→ @Target: siêu dữ liệu được đặt ở đâu
→ meta-annotations: cấu hình quy tắc của Annotation
→ @Repeatable/@Inherited: ngữ nghĩa lặp lại và kế thừa khi tra cứu
→ bộ xử lý lúc biên dịch hoặc thành phần đọc lúc chạy đọc siêu dữ liệu
```

Với ví dụ xuyên suốt `@Audit`, luồng thiết kế đầy đủ là:

```text
Bài toán
→ cần mô tả method nào phải được audit
        ↓
Kiểu Annotation và các phần tử
→ action, level
        ↓
@Target
→ chỉ METHOD nếu quy tắc chỉ có nghĩa trên method
        ↓
@Retention
→ RUNTIME nếu thành phần ở thời gian chạy cần đọc
→ SOURCE nếu bộ xử lý lúc biên dịch là thành phần đọc duy nhất
        ↓
Thành phần đọc
→ processor / Reflection / framework
        ↓
Hành vi
→ kiểm tra / sinh mã / đăng ký / audit
```

Điểm phải giữ xuyên suốt:

> **Annotation chỉ mô tả siêu dữ liệu. Hành vi đến từ thành phần đọc và xử lý siêu dữ liệu đó.**

Đây cũng là lý do cùng một cú pháp `@Something` có thể dẫn tới các hành vi hoàn toàn khác nhau tùy thành phần đọc.
