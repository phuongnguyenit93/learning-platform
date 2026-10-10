# Date-Time Localization

Date-time presentation is a common place to confuse `Locale` with `ZoneId`. They solve different problems: locale controls **presentation conventions**, while a time zone controls **the relationship between an instant and local clock time**.

**Date-time localization** means rendering a date/time value in a form familiar to readers of a locale, including conventions such as date-field order, localized month/day names, and the requested level of detail.

A complete date-time presentation pipeline may contain:

```text
temporal value
→ LocalDate / LocalDateTime / Instant / ZonedDateTime...

ZoneId (when an instant must become local time)
→ determines which local date/time is meant

Locale
→ determines language/regional presentation conventions

DateTimeFormatter + style/pattern
→ produces the final String
```

Date-time localization therefore **does not change the meaning of time**; it changes how an already-defined date/time is presented to a person.
