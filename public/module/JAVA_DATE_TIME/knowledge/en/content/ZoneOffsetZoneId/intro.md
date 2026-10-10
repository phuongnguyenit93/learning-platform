# ZoneOffset, ZoneId, and Zone Rules

To map local date-time fields onto the global timeline, Java needs to know how a local clock relates to UTC. Two closely related but different concepts appear here: `ZoneOffset` and `ZoneId`.

### What is a time zone, really?

In software, a **time zone** should not be reduced to “UTC+7” or “UTC-5.” For a named region, a time zone is **a rule set that maps between the global timeline and that region's local civil time**.

It can answer questions such as:

```text
What local time does this Instant have in Paris?
Which offset applies to this LocalDateTime in New York?
Is there a DST transition on this date?
Does this local clock reading occur once, twice, or not at all?
```

The important relationship is:

```text
ZoneId
→ identifies a zone's rule set

ZoneRules
→ the rules that vary over time

ZoneOffset
→ one concrete offset selected for a particular context
```

So **a time zone is not the same thing as an offset**. An offset is one part/result of the zone rules at a particular time.

### What is DST? — know the term before gaps and overlaps appear

**DST (Daylight Saving Time)** is a policy used by **some** countries or regions to change the UTC offset/local clock during part of the year. Not every region uses DST, and governments can change the rules.

When a zone transition moves the clock, two terms matter:

```text
gap
→ the clock jumps forward
→ a range of local clock readings does not exist

overlap
→ the clock moves backward
→ a range of local clock readings occurs twice under different offsets
```

This is why `LocalDateTime + ZoneId` does not always map trivially 1:1 to an `Instant`. The learner does not need the resolution rules yet; later chapters build them step by step, with Arithmetic / Comparison covering DST gaps and overlaps explicitly.
