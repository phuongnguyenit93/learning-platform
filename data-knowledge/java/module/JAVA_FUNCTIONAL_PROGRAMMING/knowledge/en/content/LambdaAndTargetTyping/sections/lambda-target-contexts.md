Common target-typing contexts include assignment, method invocation, return statements, and explicit casts.

```java
// Assignment context
Predicate<String> valid = text -> !text.isBlank();

// Method-invocation context
runWhenReady(() -> startService());

// Return context
Predicate<String> buildRule() {
    return text -> text.length() >= 3;
}

// Cast context
Object rule = (Predicate<String>) text -> !text.isEmpty();
```

In each case, the surrounding Java construct supplies the expected functional-interface type. That expected type determines parameter types and the result contract before the lambda can be type-checked.

If the context does not identify one compatible target clearly, compilation may fail rather than guessing which behavior type the programmer intended.
