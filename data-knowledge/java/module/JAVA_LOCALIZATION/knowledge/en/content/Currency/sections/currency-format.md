Create a currency formatter from the display locale, then set the transaction currency explicitly when necessary:

```java
NumberFormat format = NumberFormat.getCurrencyInstance(Locale.US);
format.setCurrency(Currency.getInstance("USD"));

String text = format.format(new BigDecimal("1234.50"));
```

The two inputs have separate jobs:

```text
Locale.US
→ separators, symbol placement, localized formatting conventions

Currency.getInstance("EUR")
→ the monetary unit to display
```

Formatting EUR for a US-English user is perfectly valid:

```java
NumberFormat format = NumberFormat.getCurrencyInstance(Locale.US);
format.setCurrency(Currency.getInstance("EUR"));
System.out.println(format.format(new BigDecimal("25.00")));
```

`setCurrency(...)` changes the currency used by the formatter, including the currency identity/symbol, but it does **not** reset the formatter's minimum/maximum fraction digits to the new currency's defaults. A formatter created for USD and then switched to JPY can therefore still retain two fraction digits. Configure display fraction digits deliberately when the transaction currency differs; business rounding and scale policy remain domain-owned.

Avoid manual symbol concatenation such as `"$" + amount`; symbol choice, placement, spacing, and ambiguity can all be locale-sensitive.
