`DateTimeFormatter` can request a localized style instead of hard-coding one date pattern for every user:

```java
DateTimeFormatter formatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.MEDIUM)
        .withLocale(Locale.forLanguageTag("vi-VN"));

String text = formatter.format(LocalDate.of(2026, 9, 27));
```

The standard styles are:

```text
FULL
LONG
MEDIUM
SHORT
```

Related factories include:

```java
DateTimeFormatter.ofLocalizedTime(style);
DateTimeFormatter.ofLocalizedDateTime(dateStyle, timeStyle);
```

The application specifies the **level of detail**, while locale data selects an appropriate pattern:

```text
application asks for MEDIUM date
        ↓
vi-VN → Vietnamese presentation convention
en-US → US-English presentation convention
```

The exact rendered string can depend on the locale data available in the runtime. If the business contract only requires localized presentation, tests should avoid unnecessarily freezing one implementation-specific literal pattern.
