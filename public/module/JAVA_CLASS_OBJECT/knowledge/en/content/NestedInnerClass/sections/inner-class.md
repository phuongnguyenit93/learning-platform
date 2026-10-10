A non-static nested class is an inner class and is associated with an outer instance.

```java
class BankAccount {
    private int balance;

    class BalanceView {
        int currentBalance() {
            return BankAccount.this.balance;
        }
    }
}
```

Each `BalanceView` belongs to a particular `BankAccount` instance and may access outer-instance members.

Creation syntax makes that relationship visible:

```java
BankAccount account = new BankAccount("A-01");
BankAccount.BalanceView view = account.new BalanceView();
```

That convenience also creates a lifetime/coupling relationship: keeping the inner object may keep the outer object reachable.
