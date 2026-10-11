```java
BankAccount account = new BankAccount("A-01", new ArrayList<>());
BankAccount alias = account;

alias.tags().add("VIP");
System.out.println(account.tags()); // [VIP]
```

Assignment did not copy the `BankAccount`; it copied the reference.

This connects directly to Java pass-by-value: a method receives a copy of the reference value and can therefore mutate the same object.
