### KHÁI NIỆM

Theo IEEE 754, floating-point có thể hình dung bằng ba phần:

```text
sign
 + số mũ (exponent)
 + phần định trị (significand)
```

`float` dùng binary32; `double` dùng binary64. Trong mã ứng dụng Java, `double` thường là lựa chọn mặc định khi cần số dấu phẩy động vì có độ chính xác/phạm vi tốt hơn `float`.

### VÌ SAO 0.1 không “vừa” trong hệ nhị phân?

Một số phân số hữu hạn trong hệ 10 lại lặp vô hạn trong hệ 2.

```text
0.5 thập phân
→ 0.1 nhị phân
→ biểu diễn hữu hạn

0.1 thập phân
→ phân số nhị phân lặp
→ chỉ lưu được giá trị gần nhất
```

Vì vậy:

```java
double x = 0.1 + 0.2;
System.out.println(x); // 0.30000000000000004
```

Đây không phải lỗi riêng của Java mà là hệ quả của cách biểu diễn dấu phẩy động nhị phân với số bit hữu hạn.
