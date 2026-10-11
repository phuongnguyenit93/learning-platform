`ZoneOffset` describes a specific displacement from UTC:

```text
Z       → +00:00
+07:00  → seven hours ahead of UTC
-05:00  → five hours behind UTC
```

```java
ZoneOffset utc = ZoneOffset.UTC;
ZoneOffset plusSeven = ZoneOffset.of("+07:00");
ZoneOffset minusFive = ZoneOffset.ofHours(-5);
```

An offset is **a concrete numeric relationship**. `+07:00` does not carry regional history, daylight-saving legislation, or a country identity.

For example:

```java
OffsetDateTime value = OffsetDateTime.parse("2026-10-05T09:00:00+07:00");
Instant instant = value.toInstant();
```

Local fields plus an offset are enough to determine an instant. They are not enough to prove that the region was `Asia/Ho_Chi_Minh`; many places or fixed-offset systems can share the same offset at a given time.
