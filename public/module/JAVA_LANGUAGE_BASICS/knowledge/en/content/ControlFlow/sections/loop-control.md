Java's common loops are `for`, `while`, and `do-while`.

An unlabeled `break` exits the nearest applicable loop or switch statement; `continue` skips the rest of the current loop iteration and advances to the next iteration.

Labeled `break`/`continue` can express some nested-loop flows, but deeply nested control flow is often a signal that extraction into smaller methods would be clearer.

Choose loops by intent: classic `for` when the counter/update is part of the model, `while` for condition-driven repetition, and `do-while` when the body must execute at least once. Enhanced-for is revisited after arrays are introduced.

### HOW - What order does a loop actually execute?

A classic `for` loop follows this cycle:

```text
initialization       // once
      ↓
condition
 ├─ false → exit
 └─ true
      ↓
body
      ↓
update
      ↓
back to condition
```

Therefore `continue` in a classic `for` transfers control to the **update expression** before the next condition check:

```java
for (int i = 0; i < 3; i++) {
    if (i == 1) {
        continue; // i++ still runs before the next condition check
    }
    System.out.println(i);
}
```

`while` checks its condition before the body and may run zero times. `do-while` executes the body first, so it runs at least once.

This execution model explains `continue`, termination, and side effects better than memorizing syntax alone.

### Definite assignment across branches and loops

With multiple execution paths, the compiler must prove a local variable is assigned on **every path that can reach the read**:

```java
int x;
if (condition) {
    x = 1;
} else {
    x = 2;
}
System.out.println(x); // valid: every branch assigns x
```

A `while` body may execute zero times, so assignment inside it is not necessarily enough after the loop:

```java
int x;
while (condition) {
    x = 1;
}
// System.out.println(x); // x is not guaranteed to be assigned
```

This extends the definite-assignment rule introduced with variables and scope.
