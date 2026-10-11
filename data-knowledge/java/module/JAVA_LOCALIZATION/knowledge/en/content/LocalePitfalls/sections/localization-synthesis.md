After learning the individual APIs, decision-making should return to one end-to-end flow instead of starting from class names:

```text
1. Identify the canonical domain meaning
   → number, currency, instant, status, identifier, ...
        ↓
2. Decide whether the boundary is human-facing or machine-stable
        ↓
3. For human-facing output/input, choose Locale explicitly
   → user preference / request negotiation / product policy
        ↓
4. Choose the mechanism that owns the presentation problem
   → ResourceBundle / MessageFormat
   → NumberFormat / Currency
   → DateTimeFormatter + ZoneId
   → Collator / BreakIterator / Bidi when text behavior requires them
        ↓
5. Make fallback and default-Locale policy observable and intentional
        ↓
6. Keep machine-facing representations stable and locale-neutral
   → do not persist localized strings as domain values, identifiers, or protocol formats
```

When one step is unclear, the underlying problem is usually an **ownership/boundary decision**, not a missing formatter.

If one principle should remain after this module, it is this:

```text
Business meaning should stay stable.
Locale should change how people see that meaning, not what the meaning is.
```
