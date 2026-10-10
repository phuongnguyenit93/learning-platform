`@Retention` declares the retention policy of an annotation type:

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Audit {
    String action();
    int level() default 1;
}
```

Its value is one of `SOURCE`, `CLASS`, or `RUNTIME`.

If `@Retention` is absent, the annotation type uses `RetentionPolicy.CLASS` by default. That default is easy to overlook, so public metadata contracts usually benefit from declaring the intended retention explicitly.

```text
consumer runs during source compilation
→ SOURCE may be enough

consumer reads class-file metadata
→ CLASS may be enough

consumer uses runtime reflection
→ RUNTIME required
```

`@Retention` configures availability; it does not define where the annotation may be written or what behavior a framework should perform.
