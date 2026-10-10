```java
BankAccount a = new BankAccount("A-01");
BankAccount b = a;
```

No new object is created. Only the reference value is copied, so both variables refer to the same object.

Mutation through one reference is visible through the other.
