Temporal types often expose:

```java
a.isBefore(b);
a.isAfter(b);
a.compareTo(b);
a.equals(b);
```

The important question is **what kind of ordering or equality is being asked for?**

### LocalDate comparison

```java
LocalDate a = LocalDate.of(2026, 9, 27);
LocalDate b = LocalDate.of(2026, 9, 28);

a.isBefore(b); // true
```

This orders calendar dates.

### Instant comparison

```java
instantA.isBefore(instantB);
```

This orders points on the global timeline.

### Zoned values: representation vs timeline identity

Two `ZonedDateTime` values can have different local fields/zones while representing the same instant. If the business question is “same moment on the timeline?”, comparing their instants states that intent clearly:

```java
boolean sameMoment = a.toInstant().equals(b.toInstant());
boolean sameMomentDirectly = a.isEqual(b);
```

`isEqual(...)` on suitable zone-aware temporals expresses timeline equality directly. Do not use `equals()` as a universal shorthand for every meaning of “same time.” Object equality follows the state/contract of the specific temporal type.

For `ZonedDateTime` and `OffsetDateTime`, read the APIs in two groups:

```text
isEqual / isBefore / isAfter
→ questions about the instant/global timeline

equals
→ object-representation equality according to the type's contract

compareTo
→ the type's natural ordering, with tie-breaks that keep ordering consistent with equality
→ do not assume it is an "instant-only comparator"
```

Here:

```text
natural ordering
→ the default order defined by compareTo(...) for the type

tie-break
→ an extra comparison criterion used only when the previous criterion is equal
```

When business logic cares only about timeline order, `toInstant()` or `isBefore` / `isAfter` / `isEqual` usually expresses that intent more clearly.

**Advanced boundary — exact contracts:** beginners only need the rule above first; the block below matters when sorting/comparator code must follow the exact type contract.

```text
OffsetDateTime.equals(...)
→ same local date-time + same offset

ZonedDateTime.equals(...)
→ same local date-time + same offset + same ZoneId

isEqual / isBefore / isAfter
→ compare the instant on the timeline

OffsetDateTime.compareTo(...)
→ compare instant first
→ when instants tie, local date-time is a tie-break

ZonedDateTime.compareTo(...)
→ compare instant first
→ then local date-time
→ then ZoneId
→ chronology (calendar system) is the final tie-break in the ChronoZonedDateTime contract
```

Therefore two values can represent **the same instant while `compareTo(...) != 0`**. When a comparator must use only timeline order, `OffsetDateTime.timeLineOrder()` and `ChronoZonedDateTime.timeLineOrder()` exist for that purpose.

### Equal local fields do not create global equality

```java
LocalDateTime vietnamNine = LocalDateTime.of(2026, 10, 5, 9, 0);
LocalDateTime parisNine = LocalDateTime.of(2026, 10, 5, 9, 0);
```

Those values are equal as local fields, but that does not prove that real events at 09:00 in Vietnam and Paris occur at the same instant. Zone context must be applied first.
