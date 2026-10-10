```java
BankAccount account = new BankAccount("A-01", new ArrayList<>());
BankAccount alias = account;

alias.tags().add("VIP");
System.out.println(account.tags()); // [VIP]
```

Phép gán không sao chép `BankAccount`; nó chỉ sao chép giá trị tham chiếu.

Mô hình tư duy này nối trực tiếp với quy tắc **Java luôn truyền tham trị (pass-by-value)**: phương thức nhận một bản sao của giá trị tham chiếu, vì vậy bản sao đó vẫn có thể trỏ tới và thay đổi cùng một đối tượng.
