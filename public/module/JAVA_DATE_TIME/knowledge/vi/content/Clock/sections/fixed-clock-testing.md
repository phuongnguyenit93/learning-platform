Giả sử token hết hạn lúc 10:05 UTC:

```java
Instant expiresAt = Instant.parse("2026-09-27T10:05:00Z");
```

Kiểm thử trước hạn chót:

```java
Clock beforeExpiry = Clock.fixed(
        Instant.parse("2026-09-27T10:04:00Z"),
        ZoneOffset.UTC
);

assertFalse(isExpired(expiresAt, beforeExpiry));
```

Kiểm thử sau hạn chót:

```java
Clock afterExpiry = Clock.fixed(
        Instant.parse("2026-09-27T10:06:00Z"),
        ZoneOffset.UTC
);

assertTrue(isExpired(expiresAt, afterExpiry));
```

Kiểm thử đúng tại hạn chót:

```java
Clock atExpiry = Clock.fixed(
        expiresAt,
        ZoneOffset.UTC
);

assertTrue(isExpired(expiresAt, atExpiry));
```

Ba kiểm thử không cần chờ thời gian thực và không phụ thuộc lúc bộ kiểm thử thực sự chạy.

### Không dùng Thread.sleep để “chờ thời gian” trong kiểm thử đơn vị

Cách viết yếu:

```java
Thread.sleep(1_000);
assertTrue(...);
```

Nó làm kiểm thử chậm và có thể không ổn định vì bộ lập lịch hoặc tải của CI. Nếu logic chỉ cần kiểm tra quy tắc thời gian, điều khiển `Clock` tốt hơn nhiều.
