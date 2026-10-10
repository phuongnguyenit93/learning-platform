Human-entered text may need the same locale context used for display, especially when it contains localized month/day names or a locale-specific structure:

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
        "d MMMM uuuu",
        Locale.forLanguageTag("vi-VN")
);

LocalDate date = LocalDate.parse(input, formatter);
```

Machine-to-machine contracts should normally use a stable explicit format instead:

```java
Instant.parse("2026-09-27T08:30:00Z");
LocalDate.parse("2026-09-27");
```

Use this boundary:

```text
human display/input
→ locale-aware formatter when appropriate

machine contract / persistence
→ explicit stable representation, commonly ISO-based
```

Parsing localized input also requires an intentional validation/resolver policy and handling of `DateTimeParseException`. A human-friendly display string should not automatically become the canonical stored representation.

The next milestone turns to **natural-language text behavior**: first `BreakIterator` text boundaries, then `Bidi` analysis for mixed LTR/RTL text. `ResourceBundle` fallback and default-Locale risks are synthesized afterward in the final milestone.
