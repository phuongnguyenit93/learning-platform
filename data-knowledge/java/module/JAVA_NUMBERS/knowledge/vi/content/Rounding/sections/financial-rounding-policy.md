Với tiền/thuế/tỷ lệ, chính sách thường phải xác định:

- scale của tiền tệ;
- làm tròn từng dòng hay tổng cuối;
- chế độ làm tròn;
- độ chính xác trung gian;
- cách xử lý khi kết quả chính xác không thể biểu diễn ở scale đích.

Ví dụ hai chính sách:

```text
Chính sách A
→ làm tròn từng dòng
→ cộng các giá trị đã làm tròn

Chính sách B
→ cộng các giá trị chính xác/trung gian
→ làm tròn tổng cuối
```

Hai cách triển khai đều có thể dùng BigDecimal đúng API nhưng vẫn cho kết quả khác nếu chính sách khác nhau.

### `UNNECESSARY` như một phép khẳng định điều kiện

```java
BigDecimal exact =
        new BigDecimal("10.00")
                .setScale(2, RoundingMode.UNNECESSARY);
```

`UNNECESSARY` hữu ích khi yêu cầu nói rằng việc làm tròn **không được phép xảy ra**. Nếu phép toán cần bỏ chữ số, Java ném `ArithmeticException`.

Chương tiếp theo giải quyết một điểm khác biệt khác của BigDecimal: **cùng giá trị số chưa chắc `equals` nhau vì scale có thể khác**.
