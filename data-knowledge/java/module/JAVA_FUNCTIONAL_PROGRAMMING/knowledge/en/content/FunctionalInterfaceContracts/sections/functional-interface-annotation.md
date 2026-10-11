`@FunctionalInterface` asks the compiler to verify that the annotated interface really satisfies the functional-interface rules.

```java
@FunctionalInterface
interface Validator<T> {
    boolean isValid(T value);
}
```

The annotation is useful documentation and a safety check. If a later edit adds an incompatible second abstract contract, compilation fails near the interface definition instead of letting the design silently stop being lambda-compatible.

The annotation is **not required**. An interface that structurally satisfies the rules is still a functional interface even without `@FunctionalInterface`.

Use the annotation for interfaces intentionally designed as functional contracts. Its presence communicates that keeping one functional contract is part of the API design.
