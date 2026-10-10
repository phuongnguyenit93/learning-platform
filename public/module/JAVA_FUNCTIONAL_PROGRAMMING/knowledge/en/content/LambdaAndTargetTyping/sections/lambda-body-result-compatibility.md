The lambda body must match the result expected by the target function type.

For a value-producing contract, an expression body must produce a compatible value. A block body is structurally **value-compatible** when it cannot complete normally and every `return` statement in the block has the form `return expression;`. For a particular target result type, each such result expression must then be compatible with that target type:

```java
Function<String, Integer> length = text -> text.length();

Function<String, Integer> parsedLength = text -> {
    String trimmed = text.trim();
    return trimmed.length();
};

Supplier<String> alwaysFails = () -> {
    throw new IllegalStateException("failed");
};
```

The `alwaysFails` block is valid for a value-returning target even though it never reaches a `return`, because the block cannot complete normally.

For a `void`-producing contract, a block body does not return a value. An expression body may also be a Java **statement expression** whose produced value is simply discarded:

```java
Consumer<String> printer = text -> System.out.println(text);
Consumer<String> trimAndDiscard = text -> text.trim();

Consumer<String> normalizedPrinter = text -> {
    String normalized = text.trim();
    System.out.println(normalized);
};
```

Here `text.trim()` returns a `String`, but that result is discarded because the target function type returns `void`. This does not make every value expression `void`-compatible; Java applies its specific statement-expression compatibility rules.

Block lambdas must satisfy Java's normal reachability and return rules for the target result. A block targeting a value-returning function cannot complete normally by falling through to the closing brace.

Checked exceptions are also constrained by the target function type; that practical limitation is developed in the final chapter of this module.
