A dangerous architecture is:

```text
domain number/date
        ↓
format for a human
        ↓
store/send that text as the canonical value
        ↓
parse it again in another service
```

Localized formatting is optimized for **human readability**, not machine round trips.

For example, `1,234` can mean different things under different conventions, and a date such as `03/04/2026` is ambiguous without a known contract. Formatters can also round values or omit fields that the UI does not need.

Prefer a clear split:

```text
machine boundary
→ explicit numeric representation
→ ISO date/time where appropriate
→ explicit currency code

human boundary
→ localized NumberFormat / DateTimeFormatter / messages
```

Even formatting and parsing with the same formatter does not guarantee preservation of the original object if the presentation intentionally drops precision or information.

### Localization review checklist

```text
[ ] Are formatted strings being stored as canonical domain values?
[ ] Is Locale passed explicitly at user-facing boundaries?
[ ] Is Locale being confused with ZoneId, Currency, country, or user location?
[ ] Do technical identifiers call toLowerCase()/toUpperCase() with an implicit default locale?
[ ] Does machine serialization accidentally use localized NumberFormat/date formatting?
[ ] Are translatable sentences assembled from fragments?
[ ] Are MessageFormat apostrophes and placeholders tested?
[ ] Are ResourceBundle missing keys and fallback behavior validated?
[ ] Does user-visible sorting need a Collator?
[ ] Is Java collation incorrectly assumed to match database collation?
```
