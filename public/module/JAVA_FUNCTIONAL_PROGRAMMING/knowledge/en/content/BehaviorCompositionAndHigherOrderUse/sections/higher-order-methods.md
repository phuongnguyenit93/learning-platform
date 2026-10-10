Java does not have a separate built-in function type. Instead, a method can receive or return behavior through a functional-interface type such as `Function`, `Predicate`, `Consumer`, or a domain-specific functional interface.

That gives Java a practical form of higher-order programming: behavior can be passed around as a value while the functional interface keeps the parameter and result contract explicit.

```java
static <T, R> R apply(T value, Function<T, R> operation) {
    return operation.apply(value);
}

String result = apply(" java ", String::trim);
```

The method owns *when* the behavior runs. The caller chooses *which* behavior to provide.
