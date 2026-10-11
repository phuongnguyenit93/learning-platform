Calls such as:

```java
ZoneId.systemDefault();
LocalDate.now();
ZonedDateTime.now();
```

can depend on machine configuration when no explicit clock/zone is supplied.

A common deployment mismatch is:

```text
developer laptop → Asia/Ho_Chi_Minh
CI               → UTC
production       → UTC or another region
```

The same instant near midnight can belong to different `LocalDate` values in different zones.

### Hidden-zone conversion

```java
LocalDateTime local = ...;
Instant instant = local.atZone(ZoneId.systemDefault()).toInstant();
```

If `local` belongs to a known business zone, using the machine default is an undocumented assumption. Supply the correct `ZoneId` from domain/configuration instead.
