Suppose a framework must invoke `greet(String)` across many implementations. When application code knows the target type normally, a direct call is still the best option:

```java
String result = greeter.greet("Phuong");
```

The interesting problems start when infrastructure code wants to **store behavior as data**, pre-bind a receiver, normalize several signatures to one internal contract, or link a call site once and later dispatch through its current target. Reflection handles runtime inspection and invocation well, but `java.lang.invoke` adds a different model: typed executable references plus composable transformations.

```text
"The call contract is (String)String"
        ↓
MethodType describes the contract
        ↓
Lookup checks access and creates a MethodHandle
        ↓
MethodHandle can be bound/adapted/composed
        ↓
CallSite can hold a target
        ↓
invokedynamic lets the JVM link through bootstrap logic
```

VarHandle solves a separate problem: representing **a variable or family of variables** together with access semantics such as plain, volatile, acquire/release, or compare-and-set.
