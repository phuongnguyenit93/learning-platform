Một tham chiếu kiểu `Object` có thể trỏ tới đối tượng của bất kỳ lớp nào:

```java
Object value = new BankAccount("A-01");
```

Nhưng kiểu tĩnh `Object` chỉ cho phép truy cập các thành viên thuộc hợp đồng của `Object`; muốn dùng thành viên riêng của `BankAccount` cần thông tin kiểu và phép ép kiểu phù hợp.

Kiểu nguyên thủy không phải kiểu con của `Object`; các lớp bọc như `Integer` giúp giá trị nguyên thủy tham gia API yêu cầu kiểu tham chiếu.
