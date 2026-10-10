`Collator` can be thought of as a **`Comparator<String>` specialized for human language**. It applies locale-related collation rules and decides whether two strings compare as equal or which one should sort before the other in that context.

The main pieces are:

```text
Locale / collation rules
→ which linguistic ordering rules apply

strength
→ which differences are significant

decomposition
→ how equivalent/related Unicode representations are handled

compare(...)
→ performs the comparison

CollationKey
→ optimized comparison representation for repeated comparisons
```

Use `Collator` when **human-facing order** matters. For stable technical keys or protocol ordering, a locale-neutral order is usually more appropriate.

`String.compareTo` compares strings lexicographically over their UTF-16 `char` code units. That is useful for many machine-oriented tasks, but it does not model language-specific collation rules.

`Collator` adds locale context:

```java
Collator collator = Collator.getInstance(
        Locale.forLanguageTag("vi-VN")
);

int result = collator.compare("An", "Ân");
```

The mental model is:

```text
two user-facing strings
        ↓
Locale
        ↓
Collator
        ↓
language-sensitive comparison
```

Like a `Comparator`, the contract is based on the sign of the result:

```text
< 0 → first value sorts before the second
= 0 → equal at the current collation strength
> 0 → first value sorts after the second
```

The exact numeric result is not meaningful beyond its sign.
