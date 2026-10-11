Calls such as:

```java
text.toLowerCase()
text.toUpperCase()
```

use the default locale. That can be wrong when the string is a technical identifier rather than user-facing language.

A classic example is Turkish `I/i`, whose uppercase/lowercase relationships differ from English expectations.

Use this distinction:

```text
human-language text
→ case conversion may need the user's Locale

identifier / protocol token / technical key
→ usually needs Locale.ROOT or an explicit protocol rule
```

For a locale-neutral technical normalization:

```java
String normalizedKey = input.toLowerCase(Locale.ROOT);
```

`Locale.ROOT` represents a language/country-neutral locale suitable for operations that must not inherit a particular user's locale.

Lowercasing is also not a universal replacement for case-insensitive comparison. Unicode case mapping and a domain's identity rules can be more complex than ASCII-style assumptions.
