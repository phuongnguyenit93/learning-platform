`StampedLock` hỗ trợ:

- write lock;
- read lock;
- optimistic read.

Optimistic read không giữ read lock trong toàn bộ đoạn đọc. Reader lấy một stamp, đọc snapshot rồi gọi `validate(stamp)`.

```text
tryOptimisticRead()
        ↓
đọc snapshot
        ↓
validate(stamp)
   ├─ true  → snapshot vẫn hợp lệ
   └─ false → fallback sang read lock thật
```

Tham khảo:

```text
SynchronizationController#stampedLock()
GET /synchronization/stamped-lock
```

Writer được cố tình cho xen vào giữa optimistic read.

Kết quả kỳ vọng:

```text
optimisticStampValid = false
fallbackValue = updatedValue
```

**Kết luận:** optimistic read là chiến lược đọc rồi kiểm chứng, không phải "đọc mà luôn an toàn không cần validate".
