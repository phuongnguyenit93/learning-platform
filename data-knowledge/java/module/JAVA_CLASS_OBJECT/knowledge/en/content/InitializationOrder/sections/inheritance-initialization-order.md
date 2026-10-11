For `new Child()`:

```text
class initialization if needed
        ↓
Parent instance initialization
        ↓
Parent constructor body
        ↓
Child instance initialization
        ↓
Child constructor body
```

This explains why calling overridable methods too early is dangerous: subclass behavior may run before subclass fields have their intended initialized values.

A small trace makes the order observable:

```java
class Trace {
    static int log(String step) {
        System.out.println(step);
        return 0;
    }
}

class Parent {
    int parentField = Trace.log("parent field");
    { Trace.log("parent block"); }
    Parent() { Trace.log("parent constructor"); }
}

class Child extends Parent {
    int childField = Trace.log("child field");
    { Trace.log("child block"); }
    Child() { Trace.log("child constructor"); }
}
```

Assuming class initialization has already happened, `new Child()` prints the parent field/block/constructor steps before the child field/block/constructor steps. The trace is evidence for the lifecycle rather than a replacement for the rules above.

The next chapter views this as one complete object-creation lifecycle and examines `this` escape.
