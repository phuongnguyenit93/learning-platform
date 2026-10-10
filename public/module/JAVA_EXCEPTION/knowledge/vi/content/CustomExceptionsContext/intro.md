# Ngoại lệ tùy chỉnh (Custom Exception)

Không phải lỗi nào cũng cần một lớp exception mới. Ngoại lệ tùy chỉnh chỉ có giá trị khi kiểu mới **bổ sung ý nghĩa**, tạo ranh giới trừu tượng rõ hơn hoặc cho bên gọi một nhóm lỗi có cách xử lý riêng.

Câu hỏi không phải:

```text
"Có thể tạo exception riêng không?"
```

mà là:

```text
"Bên gọi được lợi gì khi lỗi này có một kiểu riêng?"
```
