Choose from the question being asked:

```text
“How much real timeline time elapsed?”
→ Duration

“How many calendar days/months/years?”
→ Period
```

### DST: 24 hours can differ from one calendar day

In a region with daylight-saving transitions:

```java
ZonedDateTime start = ZonedDateTime.of(
        LocalDateTime.of(2026, 3, 28, 12, 0),
        ZoneId.of("Europe/Paris")
);

ZonedDateTime plus24Hours = start.plus(Duration.ofHours(24));
ZonedDateTime plusOneDay = start.plus(Period.ofDays(1));
```

`plus24Hours` preserves **24 hours of elapsed timeline duration**. `plusOneDay` expresses **the next calendar day with local-time semantics**. Around a DST transition, the elapsed timeline distance for the latter can be 23 or 25 hours.

That is why `Period.ofDays(1)` and `Duration.ofHours(24)` must not be treated as interchangeable just because they often appear equivalent on ordinary days.

### Month length breaks fixed-second assumptions too

```text
1 month
→ 28, 29, 30, or 31 days depending on position

1 year
→ may include a leap day
```

There is no context-free exact conversion from `Period.ofMonths(1)` to a `Duration`.

### Quick choice table

| Need | Choose |
| --- | --- |
| HTTP timeout of 30 seconds | `Duration` |
| cache TTL of 10 minutes | `Duration` |
| processing time between two `Instant` values | `Duration` |
| add one month to an invoice date | `Period` or `plusMonths` |
| age-like years/months/days | `Period` |
| “same local time tomorrow” scheduling | calendar arithmetic, usually `Period`/`plusDays` on a zone-aware value |

Once the temporal value and amount semantics are correct, a very common boundary comes next: converting between **text and date-time values**.
