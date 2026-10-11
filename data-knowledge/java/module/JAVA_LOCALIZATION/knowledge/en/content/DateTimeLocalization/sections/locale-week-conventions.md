Locale can affect more than the **spelling** of a date. Some human calendar conventions differ between locales, especially the definition of a **week**.

Two questions that look universal are not actually answered the same way everywhere:

```text
Which day starts the week?
How many days must the first week of a year contain?
```

Java represents these conventions with `WeekFields`:

```java
WeekFields weekFields = WeekFields.of(locale);

DayOfWeek firstDay = weekFields.getFirstDayOfWeek();
int minimalDays = weekFields.getMinimalDaysInFirstWeek();
```

Important pieces are:

```text
first day of week
→ the day considered to start a week

minimal days in first week
→ minimum days required for a week to count as the year's first week

week-based fields
→ weekOfMonth / weekOfYear / weekOfWeekBasedYear...
```

`WeekFields` therefore provides **locale-sensitive calendar conventions** for presentation and calendar-style use cases.

Keep one boundary explicit:

```text
locale-sensitive calendar convention
≠ business rule
```

If the domain says “the accounting week always begins Monday,” encode that rule explicitly with `WeekFields.of(DayOfWeek.MONDAY, ...)` or another business policy. A user's locale should not accidentally change business logic.
