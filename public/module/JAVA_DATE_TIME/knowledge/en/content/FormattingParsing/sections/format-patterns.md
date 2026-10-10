Custom patterns are useful when a UI or legacy file format has a real requirement:

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-uuuu HH:mm");
LocalDateTime value = LocalDateTime.of(2026, 9, 27, 14, 30);

String text = formatter.format(value);
// 27-09-2026 14:30
```

Pattern letters have their own semantics and should not be guessed from appearance.

Important examples:

```text
MM → month-of-year
mm → minute-of-hour

HH → hour-of-day 00-23
hh → clock-hour-of-am-pm 01-12

uuuu → proleptic year
yyyy → year-of-era
YYYY → week-based-year
```

Confusing `MM` and `mm`, or `yyyy` and `YYYY`, is a common real-world bug.

### `uuuu` and `yyyy`

For many modern business dates, `uuuu` is easier to use with strict ISO-style parsing because it represents the **proleptic year**: years are numbered continuously across eras, including year `0` and negative years when moving before the current era.

`yyyy` is the **year-of-era**: the year number inside an era such as CE/BCE, so a complete interpretation also involves the era.

`YYYY` is different again: it is the **week-based-year**, whose year boundary follows week rules rather than the ordinary calendar-year boundary. Around the end or beginning of a calendar year, a date can belong to a different week-based-year. Therefore do not use `YYYY-MM-dd` when the intent is an ordinary calendar date.

```java
DateTimeFormatter strictDate = DateTimeFormatter
        .ofPattern("dd/MM/uuuu")
        .withResolverStyle(ResolverStyle.STRICT);
```

The lesson is not “never use yyyy.” The lesson is that **pattern letters carry semantics**, not merely output shape.

### Locale affects textual fields

Patterns containing month/day names need an intentional locale:

```java
DateTimeFormatter english = DateTimeFormatter.ofPattern("dd MMM uuuu", Locale.ENGLISH);
```

`Locale` here is the language/region **presentation context** used for text such as month or weekday names. It does not replace `ZoneId` and does not determine the instant. Detailed localization belongs to the `localization` module. Here, the important boundary is that formatter behavior can depend on locale, so machine defaults should not silently define a deterministic external contract.
