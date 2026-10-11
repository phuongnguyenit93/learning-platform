Because `LocalDate` is immutable, arithmetic returns new values:

```java
LocalDate date = LocalDate.of(2026, 9, 27);

LocalDate tomorrow = date.plusDays(1);
LocalDate nextWeek = date.plusWeeks(1);
LocalDate nextMonth = date.plusMonths(1);
LocalDate lastYear = date.minusYears(1);
```

Beyond convenience methods such as `plusDays`, Java also has shared abstractions for temporal amounts and units. The next snippet is only a **preview**: `Period` is explained fully in the `Duration / Period` chapter, and `ChronoUnit` in `Arithmetic / Comparison`:

```java
LocalDate afterTenDays = date.plus(Period.ofDays(10));
long days = ChronoUnit.DAYS.between(date, afterTenDays);
```

The key point is that this is **calendar arithmetic**. `plusDays(1)` moves to the next calendar date; it does not promise that exactly 24 elapsed timeline hours have passed. That distinction becomes important once a zone with daylight-saving transitions enters the model.

### Field-based adjustment

```java
LocalDate firstDay = date.withDayOfMonth(1);
LocalDate december = date.withMonth(12);
```

For reusable calendar adjustments, Java provides `TemporalAdjusters`:

```java
LocalDate lastDayOfMonth = date.with(TemporalAdjusters.lastDayOfMonth());
LocalDate nextMonday = date.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
```

Do not mistake general calendar adjusters for a business calendar. “Next business day” can depend on weekends, holidays, country, exchange, or company policy and belongs in application policy.
