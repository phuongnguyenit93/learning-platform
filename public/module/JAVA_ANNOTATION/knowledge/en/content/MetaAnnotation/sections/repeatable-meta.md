`@Repeatable` configures an annotation type so multiple instances can appear at one legal location. The declaration names the **container annotation type** that represents those repeated values.

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

Client code can then write:

```java
@Audit(action = "AUTHORIZE")
@Audit(action = "CAPTURE")
void pay() {
}
```

At this point the key model is the declaration relationship: **repeatable annotation ↔ container annotation**. The next chapter owns the container compatibility rules, representation, and retrieval semantics, including why `getAnnotationsByType(...)` differs from asking for one annotation directly.
