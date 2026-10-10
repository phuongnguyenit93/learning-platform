`this` is the reference to the current object in instance context.

Common uses include:

- distinguishing fields from same-named parameters;
- passing the current object elsewhere;
- invoking another constructor through `this(...)`;
- returning the current instance in fluent APIs when appropriate.

```java
class BankAccount {
    private final String id;
    private int balance;

    BankAccount(String id) {
        this(id, 0);
    }

    BankAccount(String id, int balance) {
        this.id = id;
        this.balance = balance;
    }
}
```

Here `this(id, 0)` reuses another constructor in the **same** class, while `this.id = id` refers to the current object's field.

Static context has no `this` because there is no implicit current instance.
