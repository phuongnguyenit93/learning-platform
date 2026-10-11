Hãy bắt đầu từ ý nghĩa của giá trị, không bắt đầu từ tên kiểu Java.

```text
Giá trị luôn là số nguyên?
        │
        ├─ có → phạm vi hợp lệ có nằm trong int/long?
        │          ├─ có    → số nguyên độ rộng cố định
        │          └─ không → BigInteger
        │
        └─ không → bài toán có yêu cầu ngữ nghĩa thập phân chính xác?
                     ├─ có    → BigDecimal
                     └─ không → float/double, thường ưu tiên double
```

Sau lựa chọn đầu tiên, cần hỏi tiếp ngay:

```text
số nguyên độ rộng cố định
→ điều gì xảy ra nếu vượt phạm vi?
→ có chấp nhận giá trị quay vòng hay phải phát hiện tràn số?

số dấu phẩy động
→ mức sai số xấp xỉ nào được chấp nhận?
→ quy tắc so sánh theo sai số được xác định thế nào?

BigInteger
→ chi phí bộ nhớ và tính toán tăng thêm có phù hợp không?
→ điều gì xảy ra khi chuyển ngược về kiểu nguyên thủy?

BigDecimal
→ scale và precision có ý nghĩa gì trong nghiệp vụ này?
→ được phép làm tròn ở đâu?
→ định danh dựa trên cách biểu diễn hay giá trị số học?
```

Thói quen quan trọng là luôn ghép mỗi cách biểu diễn với **kiểu sai lệch hoặc giới hạn đặc trưng của nó**.
