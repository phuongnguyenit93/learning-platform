These calls look harmless:

```java
NumberFormat format = NumberFormat.getNumberInstance();
String lower = input.toLowerCase();
DateTimeFormatter formatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.SHORT);
```

but they do **not all consult the same default**. `String.toLowerCase()` uses the JVM's general default Locale, while formatting APIs such as `NumberFormat` and localized `DateTimeFormatter` use the `FORMAT` default category. The common risk is the same: behavior is being driven by implicit JVM-wide state instead of an explicit application/user Locale.

That creates failures such as:

```text
developer machine → tests pass
CI machine        → different output
production node A → default locale X
production node B → default locale Y
```

A multi-user backend is clearer when user-facing operations receive the locale explicitly:

```java
String render(Order order, Locale userLocale) { ... }
```

The default locale should be an **intentional fallback policy**, not an invisible dependency.

Tests can deliberately vary the default locale to expose accidental dependencies:

```java
Locale previousGeneral = Locale.getDefault();
Locale previousDisplay = Locale.getDefault(Locale.Category.DISPLAY);
Locale previousFormat = Locale.getDefault(Locale.Category.FORMAT);
try {
    Locale.setDefault(Locale.forLanguageTag("tr-TR"));
    // run a focused test
} finally {
    Locale.setDefault(previousGeneral);
    Locale.setDefault(Locale.Category.DISPLAY, previousDisplay);
    Locale.setDefault(Locale.Category.FORMAT, previousFormat);
}
```

`Locale.setDefault(Locale)` updates the JVM-wide general default and both category defaults, so a test that changes it must restore all three values if they may have differed beforehand. Because this is global mutable state, parallel tests can still interfere with each other; isolate such tests or prefer code whose locale dependency is explicit.
