Java provides reusable functional-interface families in `java.util.function` so common behavior shapes do not need a new custom interface every time.

The main question is not "which interface name do I remember?" but **what contract does the behavior have?** Ask:

- Does it transform one value into another? → `Function`.
- Does it answer a yes/no question? → `Predicate`.
- Does it receive a value and perform an action? → `Consumer`.
- Does it produce a value without receiving one? → `Supplier`.
- Do input and output have the same type? → an operator interface may fit.
- Does the behavior need two inputs? → one of the `Bi...` families may fit.

```java
Function<String, Integer> length = String::length;
Predicate<String> nonEmpty = text -> !text.isEmpty();
Consumer<String> printer = System.out::println;
Supplier<UUID> idFactory = UUID::randomUUID;
```

These interfaces are ordinary Java interfaces with one functional contract. Lambdas and method references are concise ways to supply implementations for them.
