# Formatting and Parsing

Date-time objects and text are different representations. A value such as `LocalDate` or `Instant` carries temporal semantics; strings such as `27/09/2026`, `2026-09-27`, or `09:30 AM` are **representations** used at UI, file, API, or protocol boundaries.

A common mistake is to let the text shape become the time model. Keep these operations separate instead:

```text
format
→ temporal object → text

parse
→ text → temporal object
```
