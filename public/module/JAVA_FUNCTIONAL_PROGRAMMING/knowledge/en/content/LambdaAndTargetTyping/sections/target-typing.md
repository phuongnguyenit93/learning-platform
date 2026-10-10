Lambda expressions are **target typed**. The compiler uses the surrounding expected functional-interface type to interpret the lambda.

```java
Predicate<String> rule = text -> text.length() > 3;
```

From `Predicate<String>`, the compiler knows that `text` is a `String` and that the body must be compatible with a `boolean` result.

The same lambda text can target different compatible interfaces:

```java
Callable<String> first = () -> "done";
Supplier<String> second = () -> "done";
```

The body is identical, but the resulting values have different Java types and therefore different API contracts.

Because target typing is essential, a lambda cannot normally stand alone without a context that supplies a target functional interface.
