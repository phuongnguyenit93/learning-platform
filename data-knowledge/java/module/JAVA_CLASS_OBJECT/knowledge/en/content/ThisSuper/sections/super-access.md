`super` accesses superclass constructors/members according to Java's lookup rules.

```java
class SavingsAccount extends BankAccount {
    private final int interestRate;

    SavingsAccount(String id, int balance, int interestRate) {
        super(id, balance);
        this.interestRate = interestRate;
    }
}
```

`super(id, balance)` initializes the `BankAccount` portion before the `SavingsAccount` constructor body establishes subclass state.

`super` is not a second object nested inside the subclass object. It changes how the source refers to superclass context on the same object.
