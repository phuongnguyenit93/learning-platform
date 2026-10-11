# Meta-Annotations and Annotation-Type Contracts

After defining `@Audit`, Java still needs answers to questions about the annotation type itself:

```text
Where may @Audit appear?
→ method, class, field...?

How long must @Audit survive?
→ source, class file, or runtime?

Should documentation include it?
Does it participate in superclass lookup?
May it repeat?
```

If those rules existed only in comments, the compiler and tools would have no standard contract to enforce. The **annotation type itself therefore needs metadata describing its own behavior**.

A meta-annotation is an annotation applied to an annotation type. It configures how that annotation participates in Java's metadata model.

The running example can now state its complete basic contract:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Documented
public @interface Audit {
    String action();
    int level() default 1;
}
```

Each meta-annotation answers a different question.
