`BigInteger` biểu diễn số nguyên với độ chính xác tùy ý (arbitrary precision) trong giới hạn bộ nhớ thực tế.

```java
BigInteger value =
        new BigInteger("123456789012345678901234567890");
```

Các cách tạo thường gặp:

```java
BigInteger a = BigInteger.valueOf(123456789L);
BigInteger b = new BigInteger("FF", 16);
BigInteger zero = BigInteger.ZERO;
BigInteger one = BigInteger.ONE;
```

### VÌ SAO

`BigInteger` phù hợp khi:

- các giá trị tổ hợp tăng rất nhanh;
- bộ đếm/định danh của bài toán vượt `long`;
- phép toán số nguyên với độ chính xác tùy ý là một phần của thuật toán;
- một số phép toán mật mã cần số nguyên rất lớn.

Đánh đổi:

```text
kiểu số nguyên thủy
→ kích thước cố định
→ rất nhanh
→ ít cấp phát bộ nhớ

BigInteger
→ độ chính xác tùy ý
→ dựa trên đối tượng
→ chi phí phép toán tăng theo kích thước giá trị
```

Không nên dùng `BigInteger` chỉ vì “an toàn hơn” nếu `long` đã đủ và hiệu năng/khả năng tương tác với API khác là quan trọng.
