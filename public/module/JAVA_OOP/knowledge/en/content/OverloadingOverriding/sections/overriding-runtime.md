### WHAT

A subclass override supplies a new implementation of an inherited instance-method contract with a compatible signature.

The same overriding model also applies when a class provides an implementation for an inherited interface instance-method contract or overrides a default method. Detailed interface rules belong to `abstract-interface`; the OOP focus here is still **runtime selection of an instance-method implementation**.

```java
class Parent {
    String call() { return "Parent"; }
}

class Child extends Parent {
    @Override
    String call() { return "Child"; }
}
```

### HOW

The compiler first resolves the call to the `call()` signature. When the runtime receiver is `Child`, dynamic dispatch selects the `Child` body.

This is the mechanism that supports subtype polymorphism: a caller may hold a `Parent` reference and still receive subtype behavior.
