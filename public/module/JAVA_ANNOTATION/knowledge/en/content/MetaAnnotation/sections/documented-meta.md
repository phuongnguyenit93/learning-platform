`@Documented` tells documentation tools such as Javadoc that uses of the annotation should be included in the generated API documentation of annotated declarations.

```java
@Documented
@Target(ElementType.METHOD)
public @interface Audit {
    String action();
    int level() default 1;
}
```

This is a documentation contract. `@Documented` does not change runtime reflection, annotation processing, method dispatch, or framework behavior.

Use it when the annotation is part of the API information that consumers of a declaration should see. Purely internal build metadata may not need to appear in public API docs.
