The JDK knows calendar mechanics; it does not know your organization's business-day policy.

“Three business days from now” may require answers to:

```text
Does Saturday count?
Sunday?
Which country's public holidays?
Company-specific holidays?
What happens after a 17:00 cut-off?
```

This is not correctly modeled as:

```java
deadline = start.plusDays(3);
```

`plusDays(3)` means three calendar days, not three business days.

A clearer design can make the policy explicit:

```java
interface BusinessCalendar {
    LocalDate addBusinessDays(LocalDate start, int days);
    boolean isBusinessDay(LocalDate date);
}
```

An implementation can use `LocalDate`, `DayOfWeek`, and a separate holiday source. The date-time API provides **mechanics**; the application supplies **business policy**.

The next chapter addresses another frequently hidden dependency: asking the operating environment what time it is “now.”
