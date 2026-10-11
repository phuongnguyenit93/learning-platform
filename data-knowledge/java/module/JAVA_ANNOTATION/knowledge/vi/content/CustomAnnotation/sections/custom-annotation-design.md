Một Annotation tùy chỉnh tốt nên trả lời bốn câu hỏi:

1. **Thành phần đọc là ai?** annotation processor, framework lúc chạy hay công cụ khác?
2. **Siêu dữ liệu mô tả điều gì?** chính sách, ánh xạ, khả năng hay quy tắc?
3. **Nó hợp lệ ở đâu?** class, method, field, parameter, type use?
4. **Nó cần tồn tại bao lâu?** mã nguồn, class file hay thời gian chạy?

Với ví dụ xuyên suốt, giả sử một thành phần audit ở thời gian chạy sẽ đọc các method được đánh dấu:

```java
@Audit(action = "TRANSFER", level = 2)
void transfer() {
}
```

Từ yêu cầu đó, ta có thể nhìn thấy các câu hỏi thiết kế tiếp theo mà chưa cần học cú pháp của chúng ngay:

```text
thành phần đọc → thành phần lúc chạy
→ siêu dữ liệu phải tồn tại đến thời gian chạy

quy tắc audit chỉ áp dụng cho method
→ Annotation nên bị giới hạn vào method

action + level
→ cấu trúc siêu dữ liệu của @Audit
```

Hai câu hỏi “tồn tại đến bao giờ?” và “được đặt ở đâu?” sẽ lần lượt được biểu diễn bằng `@Retention` và `@Target` ở các chương tiếp theo.

### Java kiểm tra cấu trúc, không kiểm tra toàn bộ ý nghĩa nghiệp vụ

Trình biên dịch có thể biết `level()` là `int` hay một phần tử khác có type cụ thể, nhưng không tự biết:

```text
timeout phải > 0
action phải thuộc quy ước đặt tên nội bộ
hai phần tử này không được xuất hiện cùng nhau
```

Những ràng buộc nghiệp vụ như vậy phải được thành phần đọc/bộ xử lý kiểm tra và nên được tài liệu hóa rõ.

### Chuyển sang @Retention

Ta đã có cấu trúc siêu dữ liệu. Câu hỏi tiếp theo là: **thành phần đọc cần siêu dữ liệu tồn tại đến giai đoạn nào?** Đây chính là trách nhiệm của chính sách lưu giữ với `@Retention`.
