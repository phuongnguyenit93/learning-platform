A tag combines subtags, usually from general to more specific:

```text
language[-Script][-REGION][-variant...][-extensions...]
```

Examples:

```text
vi-VN
en-US
en-GB
zh-Hans-CN
zh-Hant-TW
```

In short, **a language tag is the standardized text form that describes locale information**, while `Locale` is Java's object representation of that information.

```text
"vi-VN"
→ interoperable language tag

Locale.forLanguageTag("vi-VN")
→ Java object used with APIs
```

Language tags exist because a Java object cannot be placed directly into an HTTP header, URL, or configuration file. A common textual standard lets browsers, servers, and services exchange the same locale context.

This is not an arbitrary hyphen-separated string. Each subtag has a standardized role so different systems can exchange locale context consistently.

```text
browser / HTTP / config / database
        ↓ language tag
Java application
        ↓ Locale
formatter / bundle / collator
```
