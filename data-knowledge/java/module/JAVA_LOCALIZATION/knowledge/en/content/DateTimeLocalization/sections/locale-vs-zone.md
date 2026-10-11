Keep this model explicit:

```text
Instant
→ one point on the timeline

ZoneId
→ maps that instant to a local date/time using time-zone rules

Locale
→ chooses how that local date/time is presented to a reader
```

Start from one instant:

```java
Instant instant = Instant.parse("2026-09-27T08:30:00Z");

ZoneId hcm = ZoneId.of("Asia/Ho_Chi_Minh");
ZoneId newYork = ZoneId.of("America/New_York");

ZonedDateTime vietnamTime = instant.atZone(hcm);
ZonedDateTime newYorkTime = instant.atZone(newYork);
```

Then choose how one of those local views should be shown:

```java
DateTimeFormatter viFormatter = DateTimeFormatter
        .ofLocalizedDateTime(FormatStyle.MEDIUM)
        .withLocale(Locale.forLanguageTag("vi-VN"));

String display = viFormatter.format(vietnamTime);
```

It is also valid to format `newYorkTime` using `vi-VN`. That simply means “show New York local time using Vietnamese presentation conventions.”

Therefore:

```text
Locale.forLanguageTag("vi-VN")
does not imply
ZoneId.of("Asia/Ho_Chi_Minh")
```

User language preference and user time zone should be modeled independently.
