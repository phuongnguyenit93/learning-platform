### Date ↔ Instant

`Date` and `Instant` can both represent a timeline point, so conversion is direct:

```java
Date legacy = new Date();
Instant instant = legacy.toInstant();

Date back = Date.from(instant);
```

A useful boundary strategy is to convert into modern types early, keep business logic in `java.time`, and convert back only when a legacy API requires it.

### Calendar → ZonedDateTime

```java
Calendar calendar = Calendar.getInstance();

ZonedDateTime modern = calendar.toInstant()
        .atZone(calendar.getTimeZone().toZoneId());
```

Both the timeline point and the calendar's zone are used so the modern zoned view preserves the relevant context.

### `java.sql.Date`, `Time`, and `Timestamp`

**JDBC (Java Database Connectivity)** is Java's API for working with relational databases. Older JDBC code often exposes three `java.sql.*` wrappers that are easy to confuse with `java.time` types:

```text
java.sql.Date
→ SQL DATE-style value
→ natural modern counterpart: LocalDate

java.sql.Time
→ SQL TIME-style value
→ natural modern counterpart: LocalTime

java.sql.Timestamp
→ SQL TIMESTAMP-style wrapper with fractional seconds
→ provides conversion APIs for LocalDateTime and Instant
```

Java provides direct conversions:

In the snippet below, `sqlDate`, `sqlTime`, and `timestamp` are assumed to be **legacy JDBC values already supplied by an older API/database layer**; the code intentionally focuses only on conversion into and out of `java.time`.

```java
LocalDate date = sqlDate.toLocalDate();
java.sql.Date sqlDateAgain = java.sql.Date.valueOf(date);

LocalTime time = sqlTime.toLocalTime();
java.sql.Time sqlTimeAgain = java.sql.Time.valueOf(time);

LocalDateTime localDateTime = timestamp.toLocalDateTime();
java.sql.Timestamp timestampFromLocal = java.sql.Timestamp.valueOf(localDateTime);

Instant instant = timestamp.toInstant();
java.sql.Timestamp timestampFromInstant = java.sql.Timestamp.from(instant);
```

These legacy conversions are **not perfectly symmetric**, and several traps matter:

```text
java.sql.Date.toInstant()
→ unsupported; throws UnsupportedOperationException

java.sql.Time.toInstant()
→ unsupported; throws UnsupportedOperationException

java.sql.Time.valueOf(LocalTime)
→ keeps only hour/minute/second
→ the LocalTime nanosecond fraction is lost

Timestamp.from(Instant) / timestamp.toInstant()
→ timeline-oriented conversion

Timestamp.valueOf(LocalDateTime) / timestamp.toLocalDateTime()
→ legacy local-date-time interpretation
→ mapping between the legacy millisecond value and local fields can depend on the default time zone
```

If the domain owns an `Instant`, prefer an intentional `Timestamp ↔ Instant` boundary. If the schema truly owns local date-time semantics, use `Timestamp ↔ LocalDateTime` deliberately and control default-zone assumptions in the JDBC/database stack.

Do not infer that every database `TIMESTAMP` column has the same semantics merely because `Timestamp` and `Instant` can both participate in timeline conversions. SQL type semantics, time-zone handling, and precision depend on the database/schema/driver contract and must be designed explicitly.

### Modern JDBC can work directly with java.time

Since JDBC 4.2, several `java.time` types have standard direct mappings through `setObject` / `getObject`, so new code **does not have to detour through `java.sql.Date/Time/Timestamp`** merely to access a database.

For a driver/database supporting the corresponding mappings:

In this snippet, `preparedStatement` is an application-created `PreparedStatement` used to send parameters to the database, while `resultSet` is the `ResultSet` returned by a query. They are JDBC boundary objects, not date-time types.

```java
LocalDate invoiceDate = LocalDate.of(2026, 9, 27);
preparedStatement.setObject(1, invoiceDate);

LocalDate loadedDate = resultSet.getObject("invoice_date", LocalDate.class);

OffsetDateTime occurredAt = OffsetDateTime.parse("2026-09-27T17:30:00+07:00");
preparedStatement.setObject(2, occurredAt);

OffsetDateTime loadedOccurredAt = resultSet.getObject(
        "occurred_at",
        OffsetDateTime.class
);
```

`LocalDate`, `LocalTime`, `LocalDateTime`, `OffsetTime`, and `OffsetDateTime` have standard JDBC 4.2 mappings. The actual database type, driver capability, and time-zone semantics still depend on the schema/provider. In particular, do not assume every driver offers the same direct `Instant` mapping just because the application domain uses `Instant`.

### Do not convert through text when a direct API exists

Avoid unnecessary paths such as:

```text
Date → format String → parse LocalDateTime
```

That injects formatting, locale, and possibly default-zone assumptions into a conversion that can be expressed directly.
