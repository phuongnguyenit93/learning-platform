Parsing is more than splitting characters. After fields are read, Java must **resolve** them into a valid temporal value.

The main resolver styles are:

```text
STRICT
→ require fields to satisfy the rules precisely

SMART
→ allow selected sensible adjustments according to formatter semantics

LENIENT
→ allow broader overflow and normalization
```

A formatter created by `DateTimeFormatter.ofPattern(...)` uses **`SMART` by default**. Predefined formatters can carry their own resolver configuration, so do not generalize that every `DateTimeFormatter` defaults to `SMART`. If an input contract must reject invalid calendar data strictly, inspect or configure the `ResolverStyle` intentionally.

Example:

```java
DateTimeFormatter strict = DateTimeFormatter
        .ofPattern("dd/MM/uuuu")
        .withResolverStyle(ResolverStyle.STRICT);

LocalDate.parse("31/02/2026", strict); // DateTimeParseException
```

For user/API input with a strict contract, `STRICT` often gives easier reasoning because invalid calendar data is rejected instead of silently adjusted.

### SMART is not business validation

Even a successfully parsed value can violate application rules:

```text
valid calendar date
≠
valid booking date
```

A booking might need to be within the next 90 days or avoid company holidays. `DateTimeFormatter` validates/resolves temporal text; it does not replace business validation.
