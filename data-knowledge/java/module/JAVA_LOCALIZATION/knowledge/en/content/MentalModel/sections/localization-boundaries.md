Localization primarily belongs at boundaries where software communicates with people:

```text
UI / user-facing web response
→ translated messages
→ localized numbers, percentages, currencies and dates

email / report / invoice
→ presentation selected for the recipient

user-visible text sorting
→ locale-sensitive collation
```

Machine-facing data normally needs a stable contract instead:

```text
database numeric values
API machine contracts
cache keys
protocol identifiers
machine-parsed log fields
```

For example, do not normalize a technical key through an implicit user locale:

```java
String key = input.toLowerCase(); // depends on default Locale
```

For locale-neutral text rules, make the intention explicit:

```java
String key = input.toLowerCase(Locale.ROOT);
```

### Module roadmap

The detailed Knowledge chapters expand the nine approved roadmap milestones as follows:

```text
1. Localization Mental Model
→ separate internationalization/localization concerns and keep domain values presentation-neutral
        ↓
2. Locale and Language Tags
→ model locale context, exchange BCP 47 tags, and select a supported locale
        ↓
3. ResourceBundle and Localized Resources
→ organize and locate resources for a Locale
        ↓
4. Parameterized Localized Messages
→ use MessageFormat while keeping translated sentence structure in resources
        ↓
5. Locale-Sensitive Numbers and Currency
→ format/parse numbers while keeping currency identity separate from Locale
        ↓
6. Locale-Sensitive Collation
→ compare and order user-facing text with language-sensitive rules
        ↓
7. Locale-Sensitive Date-Time Localization
→ format/parse date-time conventions without conflating Locale with ZoneId
        ↓
8. Text Segmentation and Bidirectional Text
→ use BreakIterator for text boundaries and Bidi for logical/directional analysis
        ↓
9. Fallback, Default Locale, Common Pitfalls, and Localization Synthesis
→ understand fallback/default behavior and keep machine-stable data independent from presentation localization
```

The goal is not to memorize classes from `java.util` and `java.text`. The goal is to recognize **which values must remain locale-neutral, which boundaries are human-facing, and which Java API belongs at each presentation step**.
