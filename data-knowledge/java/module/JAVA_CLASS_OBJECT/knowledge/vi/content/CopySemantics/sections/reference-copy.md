```java
BankAccount a = new BankAccount("A-01");
BankAccount b = a;
```

Đây không tạo đối tượng mới. Chỉ giá trị tham chiếu được sao chép, nên `a` và `b` cùng trỏ tới một đối tượng.

Thay đổi trạng thái qua một tham chiếu sẽ được quan sát qua tham chiếu còn lại.
