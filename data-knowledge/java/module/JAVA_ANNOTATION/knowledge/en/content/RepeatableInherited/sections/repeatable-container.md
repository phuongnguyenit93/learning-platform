Making an annotation repeatable requires two annotation types: the repeated annotation and its container.

Without `@Repeatable`, writing the same annotation type more than once at the same context is a compile-time error. Repeatability is therefore an explicit part of the annotation contract, not just a formatting convenience.

```java
@Repeatable(Audits.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audit {
    String action();
    int level() default 1;
}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Audits {
    Audit[] value();
}
```

Source code can now repeat `@Audit`:

```java
@Audit(action = "AUTHORIZE")
@Audit(action = "CAPTURE")
void pay() {
}
```

Conceptually, the repeated form corresponds to a container holding multiple values:

```java
@Audits({
        @Audit(action = "AUTHORIZE"),
        @Audit(action = "CAPTURE")
})
void pay() {
}
```

The compiler validates the container contract. Its `value()` must return `Audit[]`, and the two annotation types must remain compatible. In particular:

- the container's retention must be at least as long-lived as the repeated annotation's retention;
- the repeated annotation must be applicable to at least the same declaration/type-use kinds as its container; the container may intentionally be narrower, which also narrows where repetition is legal;
- every container element other than `value()` must declare a default;
- if the repeated annotation is `@Documented`, the container must also be `@Documented`;
- if the repeated annotation is `@Inherited`, the container must also be `@Inherited`.

These rules prevent repeated source syntax from silently changing the metadata contract when the compiler represents multiple annotations through the container.

### PITFALL — the container is observable metadata

The container is not purely hidden syntax sugar. Low-level reflection or tools that ask for the container type can observe it. Libraries that support repeatable annotations should normally use the `...ByType(...)` APIs designed to flatten repeated values instead of assuming one physical annotation representation.
