`BigInteger` không nạp chồng toán tử số học kiểu `+`, `-`, `*`. Thay vào đó, phép toán được thực hiện bằng phương thức và trả về đối tượng mới:

```java
BigInteger a = BigInteger.TEN;

a.add(BigInteger.ONE); // kết quả bị bỏ qua
System.out.println(a); // 10

a = a.add(BigInteger.ONE);
System.out.println(a); // 11
```

Cách ghi nhớ:

```text
đối tượng BigInteger
→ giá trị không đổi

biến tham chiếu
→ có thể trỏ sang đối tượng mới
```

Tính bất biến giúp việc chia sẻ giá trị dễ suy luận hơn, nhưng cũng có nghĩa một chuỗi phép toán có thể tạo nhiều đối tượng trung gian.
