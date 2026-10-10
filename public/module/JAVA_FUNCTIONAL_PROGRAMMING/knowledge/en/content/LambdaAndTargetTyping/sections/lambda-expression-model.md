A lambda expression is Java syntax for supplying behavior to a compatible functional-interface target type.

```java
Predicate<String> nonEmpty = text -> !text.isEmpty();
```

The lambda `text -> !text.isEmpty()` does not declare a named method and does not introduce a new function type of its own. The surrounding `Predicate<String>` target tells the compiler that the lambda receives a `String` and must produce a `boolean`.

Evaluating a lambda expression yields a value referring to an instance of the target functional-interface type. Java does not guarantee that each evaluation allocates a fresh object, so code should depend on the interface contract rather than assumptions about the runtime implementation class or object identity.

The useful mental model is: **a lambda is an expression whose meaning is completed by its target functional interface**.
