Human input may also require the locale that produced it:

```java
NumberFormat format = NumberFormat.getNumberInstance(
        Locale.forLanguageTag("vi-VN")
);

Number parsed = format.parse(input);
```

The same text can be interpreted differently under another locale, so a server should not parse localized user input through an accidental JVM default.

`NumberFormat.parse(String)` can accept a valid prefix and stop before the rest. When validation requires the **entire input** to be consumed, use `ParsePosition`:

```java
ParsePosition pos = new ParsePosition(0);
Number number = format.parse(input, pos);

boolean valid = number != null
        && pos.getIndex() == input.length()
        && pos.getErrorIndex() < 0;
```

When the actual implementation is `DecimalFormat`, decimal domain values can be parsed to `BigDecimal`:

```java
NumberFormat numberFormat = NumberFormat.getNumberInstance(locale);
if (numberFormat instanceof DecimalFormat decimal) {
    decimal.setParseBigDecimal(true);
}
```

`NumberFormat.getNumberInstance(...)` returns the abstract `NumberFormat` type, so code should not assume every provider must return `DecimalFormat`. When it is a `DecimalFormat`, enabling `setParseBigDecimal(true)` avoids introducing binary floating-point approximation merely because the value passed through a UI parser.
