Use a method reference when the lambda would only forward its arguments to one existing method or constructor and the referenced name explains the behavior well.

```java
names.forEach(System.out::println);       // concise and recognizable

Function<String, String> normalized =
        text -> text == null ? "" : text.trim(); // lambda carries real logic
```

A lambda is usually clearer when you need validation, argument rearrangement, constants, multiple calls, control flow, or a name that would otherwise hide important intent.

Do not treat method references as a goal in themselves. They are syntax for reusing existing behavior under a functional-interface contract; readability is the deciding trade-off.
