Annotations can describe **declarations** such as classes, methods, fields, parameters, and modules. Java also supports annotations on **uses of a type**.

Declaration-oriented example:

```java
@Audit(action = "PAYMENT")
void pay(@RequestId String requestId) {
}
```

Type-use example:

```java
List<@NonNull String> names;

@NonNull String findName() {
    return "Ada";
}
```

The same visual `@Name` syntax can therefore participate in different semantic locations. The annotation type's `@Target` declaration decides which locations are legal.

This distinction matters for tools. A framework interested in method declarations asks a different question from a static analyzer interested in nullness of a nested generic type argument.

When one source occurrence is legal in both a declaration context and a type context, Java can treat it according to both applicable locations. Runtime APIs reflect the same distinction: declaration annotations are exposed through `AnnotatedElement`-style APIs, while runtime-retained type annotations are inspected through the `AnnotatedType` family.
