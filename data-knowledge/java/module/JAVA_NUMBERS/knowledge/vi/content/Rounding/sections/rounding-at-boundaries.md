Việc làm tròn có thể xảy ra khi:

- giảm scale bằng `setScale`;
- dùng `MathContext` với độ chính xác giới hạn;
- chia một số thập phân không có biểu diễn hữu hạn;
- chuyển kết quả về đơn vị nghiệp vụ có bước giá trị cố định;
- áp dụng quy định pháp lý/quy tắc nghiệp vụ.

Ví dụ:

```java
BigDecimal tax =
        new BigDecimal("10.235")
                .setScale(2, RoundingMode.HALF_UP);

System.out.println(tax); // 10.24
```

### Làm tròn tại ranh giới có chủ ý

Giả sử:

```text
giá × số lượng
        ↓
tạm tính
        ↓
chiết khấu
        ↓
thuế
        ↓
số tiền cuối cùng phải trả
```

Nếu làm tròn sau **mỗi phép toán**, kết quả tích lũy có thể khác với việc giữ độ chính xác trung gian rồi chỉ làm tròn tại ranh giới nghiệp vụ cuối cùng.

Vì vậy chính sách phải trả lời:

```text
làm tròn cái gì?
làm tròn lúc nào?
làm tròn tới scale nào?
làm tròn bằng chế độ nào?
```

### Làm tròn hai lần

Làm tròn nhiều lần có thể khác làm tròn một lần tới đích cuối.

```text
2.445

làm tròn 2 chữ số thập phân với HALF_UP
→ 2.45

sau đó làm tròn 1 chữ số thập phân với HALF_UP
→ 2.5

nhưng làm tròn trực tiếp 1 chữ số thập phân từ 2.445
→ 2.4
```

Đây là lý do việc làm tròn trung gian phải do yêu cầu bài toán quyết định, không phải thêm tùy tiện.
