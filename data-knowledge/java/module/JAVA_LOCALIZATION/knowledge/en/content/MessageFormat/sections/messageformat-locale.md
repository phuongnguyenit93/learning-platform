`MessageFormat` owns a locale because nested number/date formatting depends on locale data.

```java
MessageFormat vi = new MessageFormat(
        "Tổng: {0,number}",
        Locale.forLanguageTag("vi-VN")
);

MessageFormat us = new MessageFormat(
        "Total: {0,number}",
        Locale.US
);
```

The same numeric argument can therefore render with different separators.

A coherent pipeline is:

```text
request/user Locale
        ↓
ResourceBundle(locale)
        ↓
localized pattern
        ↓
MessageFormat(pattern, same locale)
        ↓
localized message
```

Avoid selecting a Vietnamese pattern and accidentally formatting nested arguments with an unrelated JVM default locale.

`MessageFormat` is mutable, and `java.text` formatter instances should not be assumed safe for unsynchronized shared mutation across threads. Request-local instances or deliberately managed synchronization/caching are clearer choices in server code.

The next chapter focuses on one common argument type in more detail: numeric values.
