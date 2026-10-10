`java.util.function` is the main library of general-purpose function shapes, but it does not own every functional interface in the JDK.

Examples include:

```java
Runnable task = () -> doWork();
Callable<String> loader = () -> loadValue();
Comparator<String> byLength =
        (left, right) -> Integer.compare(left.length(), right.length());
```

`Runnable`, `Callable<V>`, and `Comparator<T>` live in other packages because they belong to other API domains, yet each exposes a compatible single functional contract and can therefore be targeted by a lambda or method reference.

The lesson is to recognize the **functional-interface contract**, not to assume that every lambda target must come from `java.util.function`.
