`Period` represents an amount in **years, months, and days**.

```java
Period oneMonth = Period.ofMonths(1);
Period oneYearTwoMonths = Period.of(1, 2, 0);
Period oneCalendarDay = Period.ofDays(1);
```

It fits calendar-based rules:

```java
LocalDate start = LocalDate.of(2026, 1, 31);
LocalDate next = start.plus(Period.ofMonths(1));
// 2026-02-28
```

`Period.ofMonths(1)` cannot be defined as one fixed number of seconds because months have different lengths.

### Period does not magically normalize every unit

```java
Period p = Period.of(0, 15, 0);
System.out.println(p);              // P15M
System.out.println(p.normalized()); // P1Y3M
```

Years and months have a useful normalization relationship, but days cannot generally be converted to months because month length is not fixed.
