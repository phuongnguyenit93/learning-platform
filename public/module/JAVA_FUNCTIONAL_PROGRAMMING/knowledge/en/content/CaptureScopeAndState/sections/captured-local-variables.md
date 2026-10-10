When a lambda uses a local variable declared outside its body, that local variable is **captured**.

```java
Predicate<String> minimumLength(int min) {
    return text -> text.length() >= min;
}
```

The parameter `min` belongs to the invocation of `minimumLength`, but the returned lambda may be invoked after `minimumLength` has already returned. Java therefore lets the lambda retain the value it needs independently of the original stack frame.

Local variables that are declared inside the lambda are ordinary lambda-local variables and are not captures:

```java
Function<String, Integer> length = text -> {
    String trimmed = text.trim();
    return trimmed.length();
};
```

Here `trimmed` belongs only to the lambda invocation.
