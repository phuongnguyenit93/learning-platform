Neither `Collator` nor `String.compareTo` is universally “better.” They serve different contracts.

| Requirement | Usually appropriate |
| --- | --- |
| sort localized names for a UI | `Collator` using the user's locale |
| sort localized product labels | `Collator` |
| stable technical key ordering | locale-neutral ordering |
| protocol token ordering | the protocol's explicit contract |
| database sorting | the database/schema collation |

Example user-facing sort:

```java
List<String> names = new ArrayList<>(
        List.of("An", "Ân", "Anh", "Ánh")
);

Collator collator = Collator.getInstance(
        Locale.forLanguageTag("vi-VN")
);

names.sort(collator);
```

Do not replace collation with a shortcut such as:

```java
left.toLowerCase(locale).compareTo(right.toLowerCase(locale));
```

Case conversion and collation are different problems. A language's ordering rules can involve more than letter case.
