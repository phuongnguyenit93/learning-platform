A functional interface is an interface whose abstract behavior can be represented by one functional contract. That property lets Java use the interface as a target type for a lambda expression or method reference.

```java
@FunctionalInterface
interface TextRule {
    boolean test(String text);
}

TextRule nonEmpty = text -> !text.isEmpty();
```

The important point is the **contract**, not the number of methods written in the source file. A functional interface may also contain `default`, `static`, and `private` methods because those methods do not add another abstract behavior that a lambda must implement.

Java already had interfaces such as `Runnable` and `Comparator<T>` before or alongside lambda-focused APIs. Functional interfaces connect that ordinary interface model to behavior values without creating a separate function-type hierarchy outside Java's type system.
