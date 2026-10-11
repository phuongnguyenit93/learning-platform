An unbound instance reference has the form `TypeName::instanceMethod`. No receiver object is fixed yet. The target functional interface therefore supplies the receiver as its first argument, followed by the method arguments.

```java
Function<String, String> trim = String::trim;
BiPredicate<String, String> startsWith = String::startsWith;

trim.apply("  Java  ");            // "Java"
startsWith.test("Java", "Ja");   // true
```

For `String::trim`, the `Function` input becomes the `String` receiver. For `String::startsWith`, the first `BiPredicate` argument is the receiver and the second is the prefix argument.

This receiver mapping is the main difference between `someString::method` and `String::method`.
