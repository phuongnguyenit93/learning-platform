Phép toán số nguyên và phép toán dấu phẩy động có **kiểu sai khác nhau**.

```text
số nguyên
→ chính xác trong phạm vi biểu diễn được
→ tràn số/quay vòng khi vượt phạm vi

số dấu phẩy động
→ phạm vi động rộng
→ nhiều giá trị chỉ là xấp xỉ
→ có NaN / vô cực / số 0 có dấu
```

Ví dụ:

```java
int count = Integer.MAX_VALUE;
count++;
System.out.println(count); // Integer.MIN_VALUE

double total = 0.1 + 0.2;
System.out.println(total); // 0.30000000000000004
```

Hai kết quả “lạ” này không cùng nguyên nhân:

- số nguyên sai vì **phạm vi hữu hạn**;
- số dấu phẩy động lệch vì **cách biểu diễn hữu hạn trong hệ nhị phân**.

Điều quan trọng không phải “kiểu nào chính xác hơn” một cách chung chung, mà là **kiểu nào phù hợp với yêu cầu hơn**.
