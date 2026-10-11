Private interface methods let methods inside the interface reuse implementation details without exposing those helpers as part of the public contract:

```java
interface Formatter {
    default String upper(String value) {
        return normalize(value).toUpperCase();
    }

    private String normalize(String value) {
        return value.trim();
    }

    static String normalizeKey(String value) {
        return normalizeStatic(value).toLowerCase();
    }

    private static String normalizeStatic(String value) {
        return value.trim();
    }
}
```

`private String normalize(...)` is a private instance method and can be used from instance/default context. `private static String normalizeStatic(...)` is a private static method and can be used from static context without an instance.

Implementing classes cannot call or override these private helpers; they are internal implementation details of the interface.
