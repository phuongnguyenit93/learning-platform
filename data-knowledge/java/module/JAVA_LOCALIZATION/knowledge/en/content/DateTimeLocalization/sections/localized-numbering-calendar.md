`Locale` can carry more than language and region through **Unicode locale extensions**. Some date-time APIs can use those extensions to select calendar systems, numbering systems, region overrides, or time-zone overrides for presentation.

This does **not** change the foundational model:

```text
Locale is still not ZoneId.
vi-VN does not automatically mean Asia/Ho_Chi_Minh.
Business/user time-zone preference should still be modeled separately.
```

It simply explains why some localization APIs can read additional preferences when code deliberately provides a locale containing such extensions.

For date-time formatting, `DecimalStyle` describes the numeric symbols used by a formatter:

```java
DecimalStyle style = DecimalStyle.of(locale);

char zeroDigit = style.getZeroDigit();
char positiveSign = style.getPositiveSign();
char negativeSign = style.getNegativeSign();
char decimalSeparator = style.getDecimalSeparator();
```

`DateTimeFormatter` also has two methods worth distinguishing:

```java
formatter.withLocale(locale);
formatter.localizedBy(locale);
```

Beginner mental model:

```text
withLocale(locale)
→ changes the locale used for localized text/pattern behavior

localizedBy(locale)
→ applies the locale more broadly, including relevant locale extensions
```

For example, a locale can request a presentation calendar:

```java
Locale thaiBuddhist = Locale.forLanguageTag("th-TH-u-ca-buddhist");

DateTimeFormatter formatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.LONG)
        .localizedBy(thaiBuddhist);

String display = formatter.format(LocalDate.of(2026, 9, 27));
```

The `LocalDate` still represents the same domain date. The `ca-buddhist` preference affects the **chronology/calendar used for presentation** when the formatter honors it; it does not create a different underlying business date.

Applications should not put Unicode extensions into every request without a real use case. The learning goal is simply to understand that **Locale can carry extended preferences and some formatters know how to interpret them**, without turning Locale into a container for all business context.
