Trường và phương thức của đối tượng gắn với từng đối tượng cụ thể:

```java
bankAccount.balance
bankAccount.withdraw(...)
```

Trường và phương thức `static` gắn với lớp thay vì một đối tượng cụ thể:

```java
BankAccount.MAX_LIMIT
BankAccount.createDefault()
```

Phương thức `static` không có `this` vì không có đối tượng hiện tại mặc định.
