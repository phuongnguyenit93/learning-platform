Các phương thức Stream khác nhau yêu cầu các hợp đồng hành vi khác nhau. Chỉ cần đọc kiểu giao diện hàm trong chữ ký phương thức, ta thường đã hiểu được vai trò của hành vi cần truyền vào.

- `Predicate<T>` trả lời câu hỏi đúng/sai về một giá trị.
- `Function<T, R>` biến đổi một giá trị sang dạng khác.
- `Consumer<T>` thực hiện hành động mà không trả kết quả qua hợp đồng hàm.
- `Supplier<T>` có thể cung cấp giá trị khi API cần một hành vi tạo dữ liệu.

Các giao diện này không thuộc riêng Stream. Chúng là hợp đồng Java dùng chung và còn xuất hiện trong tiện ích tập hợp, API bất đồng bộ, mã ứng dụng và nhiều thư viện khác.

Ở chương này, mục tiêu là nhận ra đúng hợp đồng. Phân loại thao tác và quy tắc thực thi chi tiết của Stream thuộc mô-đun Stream API.
