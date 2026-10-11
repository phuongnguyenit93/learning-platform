Some extensions, especially the **Unicode locale extension** introduced by `u`, can carry preferences that localization APIs may understand.

For example:

```text
th-TH-u-ca-buddhist
       └───────────→ request a Buddhist display calendar when the service supports it

en-US-u-nu-thai
       └────────→ request Thai digits when the service supports it
```

Keep the boundary clear:

```text
language / script / region
→ primary locale identity/context

extension
→ additional preference interpreted by selected localized services

Locale
≠ transaction Currency
≠ application domain data
≠ the application's complete time-zone policy
```

Not every API interprets every extension. The Date-Time chapter later shows a concrete example where `DateTimeFormatter.localizedBy(locale)` can consume selected locale extensions.

Beginners do not need to memorize the entire BCP 47 grammar. The important point is that a tag **has structure**, so standard APIs should parse/build it instead of application code manually splitting strings.

Script matters when one language is commonly written in multiple scripts:

```java
Locale simplified = Locale.forLanguageTag("zh-Hans-CN");
Locale traditional = Locale.forLanguageTag("zh-Hant-TW");
```

Do not infer script from region when the script is explicitly known.

Similarly, `en-US` and `en-GB` share language `en` but can differ in date, currency, and vocabulary conventions.
