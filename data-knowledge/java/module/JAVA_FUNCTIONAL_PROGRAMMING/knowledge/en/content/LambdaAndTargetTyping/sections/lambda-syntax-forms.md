Lambda syntax has a parameter list, the `->` token, and either an expression body or a block body.

```java
// No parameters
Supplier<Long> now = () -> System.currentTimeMillis();

// One parameter; parentheses may be omitted
Predicate<String> nonEmpty = text -> !text.isEmpty();

// Multiple parameters
Comparator<String> byLength =
        (left, right) -> Integer.compare(left.length(), right.length());

// Block body
Function<String, Integer> parse = text -> {
    String trimmed = text.trim();
    return Integer.parseInt(trimmed);
};
```

Expression bodies are concise when one expression communicates the behavior. Block bodies are useful when the behavior requires several statements, local variables, or explicit `return` statements.

Choose the shortest form that remains easy to read. Compressing several business steps into one dense expression usually hurts more than it helps.
