A broad target increases the number of places where metadata can be written, but that is not automatically useful.

If `@Audit` describes an executable operation handled by a method interceptor, this is a clear contract:

```java
@Target(ElementType.METHOD)
public @interface Audit {
    String action();
    int level() default 1;
}
```

Allowing fields, parameters, modules, and arbitrary type uses would raise questions the consumer may not know how to answer.

```text
consumer supports methods only
→ METHOD target communicates and enforces that boundary

consumer supports classes and methods with defined semantics for both
→ {TYPE, METHOD} may be appropriate
```

Record components deserve the same precision. An annotation on a record component can propagate to the corresponding component field and to an **implicitly declared** accessor/canonical-constructor parameter when the annotation type is also applicable in those contexts. It is not automatically copied to an explicitly declared accessor, and the formal parameters of an explicitly declared canonical constructor may carry different annotations. Do not assume `RECORD_COMPONENT` means “copy this metadata everywhere”.

### PITFALL — “allow everywhere” weakens the schema

Treat `@Target` as part of annotation design, not as an obstacle to remove when compilation fails. If a new use site is genuinely meaningful, define its semantics first and then widen the target intentionally.

The next chapter asks how an annotation such as `@Audit` declares both its retention and target. The answer is metadata applied to the annotation type itself: **meta-annotations**.
