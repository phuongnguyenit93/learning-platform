The Stream API needs callers to supply behavior such as "keep this element", "transform this value", or "do this with each value". Functional interfaces give those behaviors concrete Java types.

For example, callers can supply contracts you already know from `java.util.function`:

```java
Predicate<String> keep = name -> !name.isBlank();
Function<String, String> normalize = String::trim;
Consumer<String> print = System.out::println;

names.stream().filter(keep);
names.stream().map(normalize);
names.stream().forEach(print);
```

The important connection in this module is the type relationship: lambdas and method references become values of those functional-interface types, and Stream methods receive them as arguments.

How a Stream schedules, delays, combines, or executes its operations is separate Stream API knowledge.
