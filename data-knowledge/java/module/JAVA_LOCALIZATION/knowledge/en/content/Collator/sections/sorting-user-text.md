When sorting objects by a localized display name, a `Collator` can be used as the comparison strategy:

```java
record Product(String code, String displayName) {}

Collator collator = Collator.getInstance(locale);

products.sort(
        Comparator.comparing(Product::displayName, collator)
);
```

Three boundaries matter in production systems:

1. **The user's locale** should normally drive user-facing sort order, not the server machine's default locale.
2. If sorting and pagination happen in a database, the database collation is what actually determines row order. A Java `Collator` does not automatically make database ordering identical.
3. Collation output is presentation behavior, not canonical identity. Do not persist or compare business identifiers through user-locale sorting rules.

For repeated comparisons over a large set, `CollationKey` can precompute a comparison representation:

```java
CollationKey key = collator.getCollationKey(text);
```

That is an optimization to consider after the required comparison semantics are already correct.

The next chapter returns to the order example and date-time presentation. There, `Locale` controls **how a date/time is displayed**, while `ZoneId` remains responsible for **which local time corresponds to an instant**.
