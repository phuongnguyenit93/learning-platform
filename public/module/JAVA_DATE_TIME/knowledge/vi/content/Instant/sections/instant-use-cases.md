`Instant` thường phù hợp cho dữ liệu kiểu:

```text
createdAt / updatedAt của sự kiện đã xảy ra
requestReceivedAt
messageProducedAt
tokenIssuedAt / expiresAt khi ý nghĩa là hạn chót trên dòng thời gian
dấu thời gian của nhật ký kiểm toán (audit)
```

Ví dụ:

```java
record AuditEvent(String action, Instant occurredAt) {}

AuditEvent event = new AuditEvent("PAYMENT_CONFIRMED", Instant.now());
```

### Khi Instant không đủ

Một cuộc họp tương lai “09:00 ngày 05/10 tại Europe/Paris” chứa ý định theo **thời gian dân sự cục bộ + quy tắc của vùng**. Nếu chỉ giữ `Instant` sau lần phân giải đầu tiên, ứng dụng có thể mất ngữ cảnh múi giờ mà nghiệp vụ cần để hiển thị, chỉnh lịch hoặc phản ứng với thay đổi quy tắc trong tương lai.

Vì vậy cần hỏi:

```text
Sự kiện đã xảy ra và chỉ cần vị trí trên dòng thời gian?
→ Instant thường đủ

Lịch tương lai gắn với nơi cụ thể?
→ giữ ngày-giờ cục bộ + ZoneId/ZonedDateTime theo yêu cầu nghiệp vụ
```

### So sánh Instant

```java
Instant a = Instant.parse("2026-10-05T02:00:00Z");
Instant b = Instant.parse("2026-10-05T03:00:00Z");

a.isBefore(b); // true
a.isAfter(b);  // false
```

Vì cả hai đã ở cùng dòng thời gian toàn cục, so sánh không cần đoán múi giờ.

Chương tiếp theo giải thích cầu nối quan trọng: **một độ lệch UTC cụ thể khác gì một múi giờ theo vùng có quy tắc thay đổi theo ngày?**
