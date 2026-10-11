Regions using daylight saving time can have special local-clock transitions.

### Gap — a range of local times does not exist

When the clock jumps forward, for example from 02:00 to 03:00, the skipped local times do not exist in that region on that date.

Convenience APIs such as `LocalDateTime.atZone(zone)` resolve a gap according to `ZonedDateTime` rules by moving the local time forward by the gap length.

For important user scheduling input, the application may prefer to detect the gap rather than silently accept the default adjustment:

```java
LocalDateTime local = ...;
ZoneId zone = ZoneId.of("Europe/Paris");

List<ZoneOffset> validOffsets = zone.getRules().getValidOffsets(local);

if (validOffsets.isEmpty()) {
    // local time falls in a gap
}
```

### Overlap — one local time occurs twice

When the clock moves backward, one local clock reading can be valid under two offsets.

```java
List<ZoneOffset> validOffsets = zone.getRules().getValidOffsets(local);

if (validOffsets.size() == 2) {
    // ambiguous local time
}
```

Normal local-to-zone construction follows concrete resolution rules:

```text
normal
→ 1 valid offset → use it

gap
→ 0 valid offsets
→ move the local date-time forward by the length of the gap

overlap
→ 2 valid offsets
→ use the before-transition offset by default
  (typically the summer offset; the API calls this the earlier offset)
```

If the application needs the other occurrence during an overlap, `withLaterOffsetAtOverlap()` selects the after-transition offset; `withEarlierOffsetAtOverlap()` selects the before-transition offset explicitly.

When code needs to inspect the transition itself rather than only count valid offsets, `ZoneRules.getTransition(localDateTime)` returns the corresponding `ZoneOffsetTransition`; `nextTransition(instant)` and `previousTransition(instant)` find transitions around a timeline point.

The key lesson is not memorizing one DST date; it is understanding this relationship:

```text
LocalDateTime + ZoneId
does not always map 1:1 to Instant
```
