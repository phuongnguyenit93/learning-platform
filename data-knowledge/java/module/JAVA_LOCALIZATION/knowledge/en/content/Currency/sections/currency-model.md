`java.util.Currency` represents currency metadata known to the JDK, commonly identified by an ISO 4217 code:

```java
Currency usd = Currency.getInstance("USD");
Currency vnd = Currency.getInstance("VND");
```

### Why use Currency instead of just `"USD"` or `"$"`?

A string is only text. `Currency` gives Java a meaningful object representing the **identity and metadata of a monetary unit**.

Important pieces of that metadata include:

```text
currency code      → USD
numeric code       → corresponding ISO numeric code
symbol             → $, US$, ... depending on display locale
display name       → localized currency name
default fraction digits
                    → default fractional-digit metadata for the currency
```

A symbol is especially unsuitable as identity because the same symbol, such as `$`, can be associated with multiple currencies. Domain data should keep an explicit currency code/object rather than relying on a display symbol.

It exposes metadata such as:

```java
usd.getCurrencyCode();
usd.getNumericCode();
usd.getDefaultFractionDigits();
usd.getSymbol(Locale.US);
usd.getDisplayName(Locale.US);
```

`getDefaultFractionDigits()` is currency metadata, not a complete accounting rule for every business case. Monetary calculations still require explicit scale and rounding policies.

`Currency` does **not** contain an amount:

```text
Currency    → USD
BigDecimal  → 125.50
money value → must preserve both amount and unit
```

Java Core does not provide a built-in `Money` domain value type in `java.base` that solves all monetary modeling concerns.
