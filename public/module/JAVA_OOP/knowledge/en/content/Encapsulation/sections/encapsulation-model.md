### WHAT — what is encapsulation?

Encapsulation means **controlling access to state and implementation details** so callers interact through stable behavior rather than controlling every internal detail directly.

`private` is a Java mechanism that supports encapsulation, but it is not the definition of encapsulation.

The following class uses a private field but still has a weak boundary:

```java
class Account {
    private int balance;

    int getBalance() { return balance; }
    void setBalance(int balance) { this.balance = balance; }
}
```

A caller can still set `balance = -100`. The field is syntactically hidden, but the rule is not protected.

A behavior-oriented API is stronger:

```java
class Account {
    private int balance = 100;

    void withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalArgumentException("invalid withdrawal");
        }
        balance -= amount;
    }
}
```

### WHY — what are we actually hiding?

Not every field must be “secret”. The important point is that callers should not depend on **decisions and representations outside their responsibility**.

If `balance` later changes from `int` to `Money`, callers using `withdraw(...)` may remain unchanged. Callers using `setBalance(...)` or reimplementing the rule outside the object are tightly coupled to the old representation.

### RELATION — encapsulation and abstraction are different

The concepts often work together but answer different questions:

```text
Encapsulation
→ who may see or mutate state and implementation?

Abstraction
→ what contract or behavior does the caller need to see?
```

We will return to abstraction at the end of the module. For now, remember: access modifiers are tools; a **meaningful boundary is the goal**.

### PITFALL — a `private` field can still leak mutable state

Encapsulation can be broken even without a setter. An object may expose its **internal representation** by returning a mutable reference directly:

```java
class Order {
    private final List<String> items = new ArrayList<>();

    public List<String> getItems() {
        return items;
    }
}
```

A caller can now do:

```java
order.getItems().clear();
```

The field is still `private`, yet the caller holds the exact reference used internally and can mutate state without going through any `Order` rule.

Keep the distinction clear:

```text
private field
≠
internal state automatically protected

mutable reference escapes
→ caller can mutate internal representation
→ invariants can still be broken
```

Depending on the contract, an object may return a copy, an immutable view, or expose intent-oriented operations instead of a mutable collection. Detailed collection APIs belong in the `collection` module; the OOP lesson here is **representation exposure**.
