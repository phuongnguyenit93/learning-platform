The compiler provides a no-argument default constructor only when the class declares **no constructor at all**.

Once you declare:

```java
BankAccount(String id) { ... }
```

the compiler no longer adds `BankAccount()` automatically.

This often matters for frameworks or code expecting a no-arg constructor.
