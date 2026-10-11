`@SuppressWarnings` tells the compiler to suppress selected warning categories within the annotated scope.

```java
@SuppressWarnings("unchecked")
static List<String> cast(Object value) {
    return (List<String>) value;
}
```

The annotation is not proof that the code is safe. It only changes warning reporting. The programmer still owns the reasoning that justifies the suppression.

Prefer the narrowest useful scope:

```text
one local declaration or method
→ warning suppression stays near the reviewed code

whole class or package-scale suppression
→ unrelated future warnings may be hidden
```

The Java Language Specification requires compilers to recognize at least four standard suppression keys: `unchecked`, `deprecation`, `removal`, and `preview`. Compilers may recognize additional implementation-specific keys; for example, `javac` has lint categories such as `rawtypes`. Do not assume every warning string is a portable Java-language key.

### PRACTICE — suppress the cause you understand

Before adding `@SuppressWarnings`, ask whether the warning can be eliminated by improving the type-safe code. Suppression is appropriate when the unsafe-looking operation is required and its invariant is understood; it should not become a default way to silence review feedback.
