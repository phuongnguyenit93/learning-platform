When the input is already a language tag:

```java
Locale locale = Locale.forLanguageTag("vi-VN");
```

When code owns the components, Java 21 provides `Locale.of(...)` factories:

```java
Locale vi = Locale.of("vi");
Locale viVN = Locale.of("vi", "VN");
```

For scripts, extensions, or stricter component assembly, use `Locale.Builder`:

```java
Locale locale = new Locale.Builder()
        .setLanguage("zh")
        .setScript("Hant")
        .setRegion("TW")
        .build();
```

The builder is useful when malformed subtags should fail with `IllformedLocaleException` instead of being treated as loosely parsed input.

Constants such as `Locale.US`, `Locale.UK`, and `Locale.JAPAN` are convenient, but application support should not be restricted to a hard-coded list merely because constants exist.

### Do not infer unrelated domain facts from Locale

Even a region-bearing locale is not a user profile:

```text
Locale.US
≠ user address
≠ nationality
≠ time zone
≠ mandatory transaction currency
```

Model country, currency, or zone explicitly when the domain requires them.
