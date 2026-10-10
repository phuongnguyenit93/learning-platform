Some interfaces do not want to display the full value `1,200,000`; they want a shorter human-facing form such as “1.2M” or a longer compact phrase appropriate for the locale.

Java 21 supports this through `NumberFormat.getCompactNumberInstance(...)`.

```java
NumberFormat shortFormat = NumberFormat.getCompactNumberInstance(
        Locale.US,
        NumberFormat.Style.SHORT
);

NumberFormat longFormat = NumberFormat.getCompactNumberInstance(
        Locale.US,
        NumberFormat.Style.LONG
);

System.out.println(shortFormat.format(1_200_000));
System.out.println(longFormat.format(1_200_000));
```

Mental model:

```text
numeric value
→ 1_200_000

Locale + compact Style
→ SHORT / LONG

CompactNumberFormat
→ user-facing compact representation
```

`SHORT` and `LONG` do not mean the application should concatenate `K`, `M`, or `B` itself. Compact patterns come from locale data because different languages can abbreviate large numbers differently.

This is still **presentation only**. The domain value remains `1_200_000`; the compact string should not replace the canonical numeric value.

Compact formatting is useful for dashboards, statistic cards, and space-constrained UI. In invoices, accounting, or other precision-sensitive contexts, a full representation is usually more appropriate.
