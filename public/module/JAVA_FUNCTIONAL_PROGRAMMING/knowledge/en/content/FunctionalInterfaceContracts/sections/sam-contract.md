SAM stands for **Single Abstract Method**. The beginner mental model is simple: a lambda needs one abstract operation to implement.

```java
@FunctionalInterface
interface Transformer<T, R> {
    R apply(T value);
}
```

`Transformer<T, R>` has one abstract operation, `apply`, so a compatible lambda can provide that behavior:

```java
Transformer<String, Integer> length = text -> text.length();
```

However, Java does not determine functional-interface status by naively counting every `abstract` declaration. Inheritance and methods matching public instance methods of `Object` affect the calculation. The next sections cover those rules.

For day-to-day code, remember the intent: after Java applies the functional-interface rules, there must be one coherent abstract contract for the lambda or method reference to implement.
