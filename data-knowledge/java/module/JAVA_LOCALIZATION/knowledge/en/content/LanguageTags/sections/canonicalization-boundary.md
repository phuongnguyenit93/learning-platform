Use locale APIs rather than manually splitting language tags because BCP 47 also supports variants, extensions, and private-use subtags.

`Locale.forLanguageTag(...)` is intended for tag conversion and is relatively tolerant. If a public input contract requires strict rejection of malformed tags, `Locale.Builder` gives a clearer validation boundary:

```java
Locale locale = new Locale.Builder()
        .setLanguageTag(input)
        .build();
```

Ill-formed input can produce `IllformedLocaleException`.

This supports two different policies:

```text
trusted input / best-effort conversion
→ Locale.forLanguageTag(...)

strict public validation
→ Locale.Builder.setLanguageTag(...)
→ convert IllformedLocaleException into the application's validation error
```

### Syntactic validity is not application support

`fr-FR` can be a valid tag even if an application only ships resources for `vi-VN` and `en-US`.

Keep these questions separate:

```text
syntax validity
→ is this a structurally valid language tag?

application support
→ does this product have resources and policy for that locale?
```

The next chapter uses the selected `Locale` to solve a central localization problem: **loading localized messages without hard-coded language branches**.
