A lambda does not carry enough information by itself to define its complete Java type. The surrounding context supplies a **target type**, and that target must be a compatible functional interface.

```java
Predicate<String> nonEmpty = text -> !text.isEmpty();
Function<String, Integer> length = text -> text.length();
```

Both lambdas have one parameter, but they represent different contracts:

- `Predicate<String>` accepts a `String` and produces a `boolean`;
- `Function<String, Integer>` accepts a `String` and produces an `Integer`.

The functional interface is therefore the typed bridge between ordinary Java APIs and concise behavior syntax. It tells the compiler the parameter types, result expectations, and relevant checked-exception contract that the lambda or method reference must satisfy.

Chapter 2 develops this contract in detail before Chapter 3 applies it to lambda target typing.
