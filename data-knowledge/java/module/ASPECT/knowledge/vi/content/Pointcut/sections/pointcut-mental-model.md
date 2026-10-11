Một số designator phổ biến:

```text
execution(...)
→ match method execution/signature

within(...)
→ match theo declaring type/package boundary

args(...)
→ match theo runtime argument shape

@annotation(...)
→ match method mang annotation cụ thể

this(...)
→ match theo proxy type

target(...)
→ match theo target type

bean(...)
→ Spring-specific designator, match theo bean name
```

Pointcut cũng có thể đặt tên bằng `@Pointcut` rồi compose bằng:

```text
&&
||
!
```

Việc đặt tên cho pointcut nhỏ giúp expression phức tạp dễ đọc hơn thay vì nhét toàn bộ rule vào một annotation dài.

Mục tiêu không phải dùng expression càng rộng càng tốt. Pointcut nên đủ hẹp để behavior có thể dự đoán được.
