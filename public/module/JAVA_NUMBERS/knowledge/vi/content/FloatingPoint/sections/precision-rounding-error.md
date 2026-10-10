### CƠ CHẾ — sai số xuất hiện như thế nào?

Với kết quả hữu hạn thông thường nằm trong phạm vi biểu diễn được, phép toán thường phải đưa kết quả toán học về giá trị dấu phẩy động gần nhất theo quy tắc làm tròn của IEEE 754/Java.

```text
kết quả toán học chính xác
        ↓
giá trị nhị phân biểu diễn được gần nhất
        ↓
phép toán tiếp theo
        ↓
làm tròn lần nữa
```

Nhưng không phải mọi kết quả đều chỉ trở thành một giá trị xấp xỉ hữu hạn:

```text
mức độ lớn quá cao
→ tràn số
→ có thể thành +Infinity / -Infinity

độ lớn quá nhỏ
→ tràn dưới (underflow)
→ có thể thành giá trị dưới chuẩn (subnormal) hoặc số 0 có dấu
```

Sai số nhỏ có thể tích lũy:

```java
double total = 0.0;
for (int i = 0; i < 10; i++) {
    total += 0.1;
}
System.out.println(total);
```

Phép toán dấu phẩy động cũng không phải lúc nào có tính kết hợp theo trực giác toán học:

```java
double a = 1e16;
double b = -1e16;
double c = 1.0;

System.out.println((a + b) + c); // có thể khác
System.out.println(a + (b + c)); // với cách nhóm khác
```

### Khi nào phù hợp?

`double` thường phù hợp cho:

- cảm biến/đo lường;
- thống kê;
- đồ họa;
- tính toán khoa học/kỹ thuật;
- mô phỏng;
- các bài toán có mức sai số chấp nhận rõ ràng.

Nó thường không phù hợp nếu yêu cầu đòi hỏi **ngữ nghĩa thập phân chính xác**, ví dụ nhiều quy trình tính tiền/thuế/tỷ lệ.
