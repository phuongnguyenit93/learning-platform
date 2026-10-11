Not every textual difference must have the same importance. `Collator` exposes **strength** levels that control which distinctions matter during comparison.

Common strengths are:

```text
PRIMARY
→ base-letter distinctions

SECONDARY
→ commonly includes accent/diacritic distinctions

TERTIARY
→ commonly includes case and finer distinctions

IDENTICAL
→ the strictest comparison level
```

```java
Collator collator = Collator.getInstance(Locale.US);
collator.setStrength(Collator.PRIMARY);
```

The exact linguistic meaning of each level is locale-dependent. Do not treat the summary above as a universal alphabet table for every language.

At a lower strength, two strings with different Unicode representations can compare as equivalent for collation purposes. That is useful for search or sorting where some differences should be ignored.

`Collator` also has **decomposition** settings. Unicode text can represent visually similar characters in composed or decomposed forms, for example a precomposed accented character versus a base character followed by a combining mark. Decomposition controls how those representations participate in comparison.

```java
collator.setDecomposition(Collator.NO_DECOMPOSITION);
collator.setDecomposition(Collator.CANONICAL_DECOMPOSITION);
collator.setDecomposition(Collator.FULL_DECOMPOSITION);
```

Do not treat decomposition as another strength level. **Strength** decides which differences matter to comparison; **decomposition** decides how Unicode representations are prepared for that comparison.

The important lesson is that human text comparison can require both linguistic rules and Unicode normalization awareness; comparing raw character values is not always enough.
