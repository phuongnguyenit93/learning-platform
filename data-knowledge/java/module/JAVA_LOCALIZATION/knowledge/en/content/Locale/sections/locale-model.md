`Locale` is a language/cultural context made from components such as:

```text
language
→ vi, en, ja

script
→ Latn, Cyrl, Hans, Hant

region/country
→ VN, US, GB

variant / extensions
→ additional specialized information
```

### In plain language: what is Locale and what is its role?

`Locale` is a **context/preference value object**. It does not translate text and it does not format data by itself.

Its role is to become an **input to APIs whose behavior depends on language or regional conventions**:

```text
Locale
  ├─→ ResourceBundle      → resource selection
  ├─→ NumberFormat        → number presentation
  ├─→ DateTimeFormatter   → localized names/pattern conventions
  ├─→ Currency display    → localized symbols/names
  └─→ Collator            → human text ordering
```

Think of `Locale` as **“the context that tells Java which conventions to apply”**, not as the conventions or translations themselves.

Examples:

```java
Locale vietnameseVietnam = Locale.forLanguageTag("vi-VN");
Locale englishUS = Locale.forLanguageTag("en-US");
Locale chineseTraditionalTaiwan = Locale.forLanguageTag("zh-Hant-TW");
```

Read `zh-Hant-TW` by role:

```text
zh   → Chinese language
Hant → Traditional Han script
TW   → Taiwan region
```

### Locale is not a physical location

`Locale` does not mean “the device is physically located in this country.” A user in Vietnam can prefer `en-US`; a server in Singapore can render `vi-VN` output.

### Where does an application's Locale come from?

A real application may choose a locale from several sources:

```text
a saved user preference
browser/HTTP language preferences
an application parameter or configuration
a product-defined fallback locale
the JVM default locale — only when that is intentionally part of the policy
```

There is no single source that is always correct. The important point is that the application should have an **explicit locale-selection policy** rather than allowing the machine environment to choose accidentally.

When an application needs to display the locale itself, methods such as `getDisplayLanguage(...)`, `getDisplayCountry(...)`, and `getDisplayName(...)` can produce human-facing names; the locale passed to those methods controls the language used for those names.

### Locale does not contain a time zone

Keep this boundary clear:

```text
Locale
→ language, localized names, formatting conventions

ZoneId
→ time-zone rules and offsets
```

`Locale.forLanguageTag("vi-VN")` does **not** imply `Asia/Ho_Chi_Minh`.

Displaying a point in time often needs both:

```java
Locale locale = Locale.forLanguageTag("vi-VN");
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
```
