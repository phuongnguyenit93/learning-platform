Keep the direction explicit:

```text
BigDecimal / numeric domain value
        ↓
calculation, validation, persistence
        ↓
human presentation boundary
        ↓
NumberFormat(locale)
        ↓
String for the user
```

Do not persist the formatted representation as the primary numeric value:

```java
String formatted = format.format(total);
// not the canonical amount to store and calculate with
```

Formatted text may contain locale-specific separators, lose displayed precision, or fail under another parser. Machine-to-machine serialization needs its own stable, locale-neutral contract.

The next chapter adds another frequently confused concept: currency. A locale can influence currency display and can suggest a regional default, but the currency of a transaction is separate domain information.
