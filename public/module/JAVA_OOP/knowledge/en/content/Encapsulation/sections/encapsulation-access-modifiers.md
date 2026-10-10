### RELATION — how do access modifiers support encapsulation?

Encapsulation is a **design concept**: an object should control which state and implementation details are exposed outside its boundary.

Access modifiers are one of the **Java mechanisms** used to enforce part of that boundary in source code.

Java has four main member-access levels:

```text
private
→ directly accessible only inside the declaring class

package-private
→ accessible to classes in the same package

protected
→ additionally supports subclass access under Java's inheritance rules

public
→ becomes part of the surface that outside code can access and depend on
```

The relationship is:

```text
Encapsulation
→ decides which boundary should exist

Access modifiers
→ help Java enforce part of that boundary
```

### WHY — `private` alone does not guarantee good encapsulation

For example:

```java
class Account {
    private int balance;

    public void setBalance(int balance) {
        this.balance = balance;
    }
}
```

The field is `private`, but `public setBalance(...)` still allows callers to put the object into an invalid state.

Compare that with:

```java
class Account {
    private int balance;

    public void withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalArgumentException("invalid withdrawal");
        }
        balance -= amount;
    }
}
```

Here `private` restricts direct access while `withdraw(...)` provides a **controlled state transition**.

So:

```text
private
≠
encapsulation

private + meaningful API boundary + protected rules
→ stronger encapsulation
```

### NOTE — where should you learn access modifiers in detail?

This section focuses only on the **relationship between encapsulation and access modifiers in OOP design**.

For detailed Java rules covering `private`, package-private, `protected`, and `public`—especially cross-package `protected` access and exact visibility rules—continue to **Class Object → Access Modifier**.
