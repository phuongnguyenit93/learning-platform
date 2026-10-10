Localization owns presentation. It does not answer domain questions such as:

```text
can USD and EUR amounts be added?
which exchange rate and timestamp apply?
how should tax be rounded?
what scale should persistence use?
how should remainder be allocated when money is divided?
```

A minimal domain value might be:

```java
record Money(BigDecimal amount, Currency currency) {}
```

and localization can render it later. The example below **deliberately uses the `Currency` default fraction digits as a display policy**; it is not a business-rounding rule:

```java
String displayUsingCurrencyDefaultDigits(Money money, Locale locale) {
    NumberFormat format = NumberFormat.getCurrencyInstance(locale);
    format.setCurrency(money.currency());

    int fractionDigits = money.currency().getDefaultFractionDigits();
    if (fractionDigits >= 0) {
        format.setMinimumFractionDigits(fractionDigits);
        format.setMaximumFractionDigits(fractionDigits);
    }

    return format.format(money.amount());
}
```

A real application may choose a different display policy. The important boundary is that `setCurrency(...)` does not synchronize fraction digits automatically, and `NumberFormat` must not replace the domain's rounding/scale policy.

This preserves the module's central boundary: **the domain owns meaning; locale controls human presentation**.

The next chapter applies the same idea to text ordering. The order humans expect from an alphabet is not necessarily the raw order produced by `String.compareTo`, so Java provides `Collator`.
