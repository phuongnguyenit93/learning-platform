`RetentionPolicy.RUNTIME` records the annotation in the class file and makes it available for runtime reflective inspection.

For the running auditing example:

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Audit {
    String action();
    int level() default 1;
}
```

A runtime component can then inspect a method:

```java
Method method = PaymentService.class.getDeclaredMethod("pay");
Audit audit = method.getAnnotation(Audit.class);

if (audit != null) {
    System.out.println(audit.action());
}
```

RUNTIME retention only makes retrieval possible. It does not cause the JVM to invoke business behavior automatically.

Detailed reflection APIs, accessibility rules, and generic runtime metadata belong to the reflection module. Here the important boundary is the annotation lifetime contract.
