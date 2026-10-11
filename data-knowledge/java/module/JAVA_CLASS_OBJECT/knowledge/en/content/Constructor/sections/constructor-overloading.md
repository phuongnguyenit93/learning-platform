A class may declare multiple constructors with different parameter lists.

```java
BankAccount(String id) {
    this(id, 0);
}
```

`this(...)` delegates to another constructor in the same class so validation/initialization logic can stay in one place.

For a class that has a superclass, if a constructor does not explicitly begin with `this(...)` or `super(...)`, Java inserts an implicit no-argument `super()` call. That call must resolve to an accessible superclass constructor; otherwise compilation fails. `java.lang.Object` is the root exception because it has no superclass.
