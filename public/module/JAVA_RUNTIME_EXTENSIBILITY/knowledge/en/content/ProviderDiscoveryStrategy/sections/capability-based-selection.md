Providers can sometimes be selected using capabilities without instantiating every provider immediately.

If capability is type-level metadata:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ExportFormat {
    String value();
}
```

the host can inspect `Provider.type()`:

```java
Optional<ReportExporter> pdf =
        ServiceLoader.load(ReportExporter.class)
                .stream()
                .filter(p -> {
                    ExportFormat meta = p.type().getAnnotation(ExportFormat.class);
                    return meta != null && meta.value().equals("pdf");
                })
                .map(ServiceLoader.Provider::get)
                .findFirst();
```

This example is appropriate when the annotation is present on the type returned by `Provider.type()`. If an explicit module uses a static `provider()` method, `Provider.type()` is the method's return type rather than necessarily the factory class named in `provides`. Do not design selection metadata around the assumption that `type()` always returns the declared provider class.

When capability depends on the request or runtime state, a service method is usually clearer:

```java
boolean supports(Report report);
```

Metadata should answer a concrete selection question. Avoid designing a large annotation or descriptor that attempts to describe every provider detail.

If priority matters, model it explicitly and define tie-breaking behavior rather than inheriting ordering accidentally from discovery.
