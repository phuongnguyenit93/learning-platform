Có thể hiểu một `BigDecimal` bằng:

```text
 giá trị chưa áp dụng scale (BigInteger có độ chính xác tùy ý)
      ×
10^(-scale)

scale
→ int 32-bit
```

Ví dụ:

```text
123.45

giá trị chưa áp dụng scale = 12345
scale          = 2
```

`1.0` và `1.00` có cùng giá trị số nhưng scale khác nhau. Scale là một phần của cách biểu diễn và sẽ quan trọng ở chương so sánh.

Vì vậy “độ chính xác tùy ý” (arbitrary precision) của BigDecimal chủ yếu nói về **số nguyên chưa áp dụng scale / số lượng chữ số**, không có nghĩa scale cũng là một số nguyên không giới hạn.

### VÌ SAO BigDecimal thuộc Numbers?

Với tiền/tỷ lệ/thuế, câu hỏi không chỉ là:

> giá trị gần đúng có đủ tốt không?

mà còn là:

> bài toán muốn giữ bao nhiêu chữ số thập phân, khi nào làm tròn, làm tròn theo chế độ nào, phép so sánh bằng nhau có xét scale không?

BigDecimal buộc các chính sách này phải được thể hiện rõ thay vì giấu chúng trong giá trị xấp xỉ của số dấu phẩy động.
