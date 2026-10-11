Instance method calls still use dynamic dispatch inside constructors.

If a superclass constructor calls an overridable method, subclass behavior may execute **before subclass state is initialized**.

```java
class Parent {
    Parent() { print(); }
    void print() { }
}

class Child extends Parent {
    private String value = "ready";
    @Override void print() { System.out.println(value); }
}
```

`print()` may observe `value == null` when invoked from `Parent()`.

A strong default is to avoid overridable method calls from constructors.
