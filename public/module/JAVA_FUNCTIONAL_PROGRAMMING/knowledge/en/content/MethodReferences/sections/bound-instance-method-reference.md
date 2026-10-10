A bound instance reference has the form `object::instanceMethod`. The receiver object is already fixed, so the target functional interface supplies only the method's remaining arguments.

```java
String prefix = "ID-";
Function<String, String> addPrefix = prefix::concat;

String value = addPrefix.apply("17"); // "ID-17"
```

Here `prefix` is the receiver of `concat`. `Function.apply` contributes the single `String` argument.

Because the receiver is captured when the reference is created, be careful when that receiver is mutable. Reusing the same method reference can observe later changes to the same object.
