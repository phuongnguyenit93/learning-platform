Most application code can use the localized formatter factories directly. Sometimes a framework, report engine, or integration needs to inspect the concrete localized pattern. `DateTimeFormatterBuilder.getLocalizedDateTimePattern(...)` exposes it:

```java
String pattern = DateTimeFormatterBuilder.getLocalizedDateTimePattern(
        FormatStyle.MEDIUM,
        null,
        IsoChronology.INSTANCE,
        locale
);
```

This is useful when another component specifically requires a pattern string.

Do not immediately copy that result into application constants. If the intent is “use the locale's medium date style,” preserving the higher-level `ofLocalizedDate(...)` request lets locale data continue to own the pattern.

If the application contract truly requires an explicit pattern, use one deliberately:

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
        "d MMMM uuuu",
        locale
);
```

At that point the application owns the pattern while the locale still controls textual elements such as localized month names.
