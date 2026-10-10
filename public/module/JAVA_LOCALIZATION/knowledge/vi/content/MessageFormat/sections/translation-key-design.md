Khóa bản dịch nên **ổn định theo ý nghĩa**, không dựa trực tiếp vào câu tiếng Anh hiện tại.

Tốt:

```properties
order.created=Order {0} was created.
order.cancelled=Order {0} was cancelled.
```

Kém ổn định:

```properties
Order_was_created=Order was created
```

Nếu câu tiếng Anh thay cách diễn đạt, khóa ngữ nghĩa `order.created` vẫn giữ nguyên định danh.

### Không chia một câu thành các mảnh khó dịch

Tránh:

```text
"Order " + id + " was " + statusText
```

vì người dịch không kiểm soát được toàn bộ cấu trúc câu.

Ưu tiên:

```properties
order.status=Order {0} is {1}.
```

Nếu ngữ pháp của từng trạng thái khác nhau đáng kể giữa các ngôn ngữ, dùng khóa/thông điệp hoàn chỉnh cho từng ý nghĩa thường tốt hơn việc ép mọi ngôn ngữ vào một mẫu câu tiếng Anh.
