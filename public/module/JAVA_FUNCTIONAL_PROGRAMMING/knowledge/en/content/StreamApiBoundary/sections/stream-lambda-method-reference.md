Stream code commonly makes functional interfaces visible through lambda and method-reference syntax.

```java
names.stream()
        .filter(name -> !name.isBlank())
        .map(String::trim);
```

Here the lambda can satisfy a `Predicate<String>`, while `String::trim` can satisfy the mapping function expected by `map`.

This example is only evidence of the connection: **Stream method -> functional-interface parameter -> lambda/method reference**. The semantics of the Stream chain itself are owned by the Stream API module.
