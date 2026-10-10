More precisely, `NumberFormat` is an **abstraction for converting between numeric values and human-readable number text** according to a locale.

```text
format
number → localized String

parse
localized String → Number
```

It exists because decimal separators, grouping, percent signs, currency presentation, and some digit conventions vary across locales.

The main pieces in this API family are:

```text
NumberFormat
→ common abstraction/factories

DecimalFormat
→ implementation with detailed pattern control

DecimalFormatSymbols
→ locale-sensitive symbols

Locale
→ context used to choose conventions
```

`NumberFormat` creates formatters for a locale:

```java
BigDecimal value = new BigDecimal("1234567.89");

NumberFormat vi = NumberFormat.getNumberInstance(
        Locale.forLanguageTag("vi-VN")
);
NumberFormat us = NumberFormat.getNumberInstance(Locale.US);

System.out.println(vi.format(value));
System.out.println(us.format(value));
```

The exact output comes from locale data, but grouping and decimal separators commonly differ.

Specialized factories include:

```java
NumberFormat.getIntegerInstance(locale);
NumberFormat.getPercentInstance(locale);
NumberFormat.getCurrencyInstance(locale);
```

For simpler `printf`/`String.format` style formatting, Java also provides overloads that accept a `Locale`:

```java
String text = String.format(Locale.US, "%,.2f", 1234.5);
```

When the locale argument is omitted, formatting APIs of this kind can rely on the default locale. Passing the locale explicitly makes user-facing formatting easier to reason about and test.

Choose the factory by presentation meaning rather than by whichever output happens to look convenient.

For example:

```java
NumberFormat percent = NumberFormat.getPercentInstance(Locale.US);
System.out.println(percent.format(0.25));
```

The domain value remains `0.25`; the percent sign and scaling belong to presentation.
