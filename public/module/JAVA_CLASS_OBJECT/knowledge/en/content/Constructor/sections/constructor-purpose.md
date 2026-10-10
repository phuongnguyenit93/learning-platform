A constructor should establish invariants required for the object to be usable.

```java
class BankAccount {
    private final String id;
    private int balance;

    BankAccount(String id, int openingBalance) {
        if (openingBalance < 0) throw new IllegalArgumentException();
        this.id = id;
        this.balance = openingBalance;
    }
}
```

Callers should not normally receive a half-valid object that requires a mandatory sequence of setter calls before use.
