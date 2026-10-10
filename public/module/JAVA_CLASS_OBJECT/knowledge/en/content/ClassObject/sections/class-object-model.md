A `class` defines a type and its shared implementation: fields, methods, constructors, nested types, and initialization logic.

An `object` is a runtime instance with:

- its own identity;
- its own instance state;
- behavior determined by the class/runtime type.

```java
BankAccount first = new BankAccount("A-01");
BankAccount second = new BankAccount("A-02");
```

Both objects use the same `BankAccount` class definition but remain distinct instances with different identities and potentially different state.

### Why group state and behavior?

Suppose an account balance could be changed by arbitrary code through an exposed integer. Every caller would need to remember all rules such as "do not withdraw below zero". A class can instead keep the state and the operations that protect its invariants together:

```java
class BankAccount {
    private int balance;

    void withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalArgumentException();
        }
        balance -= amount;
    }
}
```

The important idea is not merely that Java has `class` syntax. The object becomes the owner of state and the rules that keep that state meaningful. Later modules go deeper into encapsulation and object-oriented design; this module first establishes the object model and lifecycle needed to understand them.
