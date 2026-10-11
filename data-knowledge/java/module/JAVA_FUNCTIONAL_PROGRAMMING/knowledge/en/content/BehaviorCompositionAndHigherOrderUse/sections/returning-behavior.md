A method can also build behavior and return it for later use. This is useful for factories of validation rules, transformations, callbacks, or policies.

```java
static Predicate<String> hasMinLength(int min) {
    return text -> text != null && text.length() >= min;
}

Predicate<String> atLeastFive = hasMinLength(5);
boolean valid = atLeastFive.test("Java 21");
```

At runtime, the returned value is an instance of the target functional-interface type. The caller should depend on that interface contract rather than on the implementation class or object identity, and does not need to know whether the behavior came from a lambda, method reference, or named class.
