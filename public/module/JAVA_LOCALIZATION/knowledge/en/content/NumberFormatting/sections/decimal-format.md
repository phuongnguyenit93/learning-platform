When presentation needs more control, a `DecimalFormat` can combine a pattern with locale-specific symbols:

```java
DecimalFormatSymbols symbols = DecimalFormatSymbols.getInstance(Locale.US);
DecimalFormat format = new DecimalFormat("#,##0.00", symbols);

String text = format.format(new BigDecimal("1234.5"));
```

Pattern vocabulary includes:

```text
#  → optional digit
0  → required digit
.  → decimal separator position in pattern syntax
,  → grouping separator position in pattern syntax
```

`DecimalFormatSymbols` determines the actual locale characters used for decimal/grouping separators, percent signs, and related symbols.

Do not format and then replace `.` with `,` manually. Configure the formatter correctly.

### Rounding is a domain policy when business meaning depends on it

Formatting can round the displayed representation:

```java
format.setMaximumFractionDigits(2);
format.setRoundingMode(RoundingMode.HALF_UP);
```

But tax, payment, or accounting rounding rules belong to the business domain. Choosing another locale must never silently change the amount owed.
