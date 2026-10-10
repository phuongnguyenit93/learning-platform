Java can obtain a currency from a `Locale`, but the rule is not simply “use the region's currency.” If the Locale contains `cu` and/or `rg` Unicode extensions, Java reflects those values; when both are present, `cu` takes precedence over the currency implied by `rg`. Without those extensions, Java derives from the Locale's **country**; the language and variant components are ignored:

```java
Currency currency = Currency.getInstance(Locale.US);

Currency euroPreference = Currency.getInstance(
        Locale.forLanguageTag("en-US-u-cu-eur")
); // EUR
```

If the Locale's country is not a supported ISO 3166 country code, `Currency.getInstance(locale)` can throw `IllegalArgumentException`; for a territory that has no currency, it can return `null`. A language-only Locale such as `Locale.ENGLISH` is therefore not enough information to infer a transaction currency.

That does not mean every user with `en-US` preferences transacts in USD.

A Vietnamese UI can display a USD transaction:

```java
Locale displayLocale = Locale.forLanguageTag("vi-VN");
Currency transactionCurrency = Currency.getInstance("USD");
```

The two values answer different questions:

```text
displayLocale
→ which human presentation conventions should be used?

transactionCurrency
→ which monetary unit does this amount represent?
```

When currency matters to the business, store/model it explicitly instead of reconstructing it from locale at display time.
