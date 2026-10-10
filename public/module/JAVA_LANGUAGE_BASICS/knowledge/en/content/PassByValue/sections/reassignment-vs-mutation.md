```java
void replace(User user) {
    user = new User("new");
}
```

Reassigning the parameter only changes the local parameter variable. The caller's reference still points to the original object.

This distinction is foundational for aliasing, defensive copying, and API design.

The classic `swap` example demonstrates the rule:

```java
void swap(User a, User b) {
    User temp = a;
    a = b;
    b = temp;
}
```

Only the local parameters are swapped. The caller's variables keep their original references.

For mutable inputs, an API should state whether it only reads the object, mutates it, returns a new object, or retains the reference. Defensive copying is an API-boundary decision, not something Java pass-by-value performs automatically.

The next chapter moves from data and call semantics to how Java organizes type names with packages and imports.
