One important reason default methods exist is **interface evolution**: a library may add behavior with a default implementation without forcing every old implementation to add source code immediately.

Default methods do not make every change compatible:

- adding an abstract method can still break existing implementations at compile time;
- adding a default method can create a conflict with another interface;
- changing the behavioral contract can still break client assumptions.

A child interface can also **turn an inherited default method back into an abstract requirement** by redeclaring it without a body:

```java
interface Base {
    default Number value() { return 0; }
}

interface Specific extends Base {
    @Override
    Integer value();
}
```

This is first a property of `default` behavior, and it also shows that a child interface may refine its contract instead of retaining the parent default.

The next milestone uses default methods to examine how Java resolves conflicts when one class implements several interfaces.
