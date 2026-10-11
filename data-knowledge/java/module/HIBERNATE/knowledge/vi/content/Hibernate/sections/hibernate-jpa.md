Hibernate và JPA không đồng nghĩa:

```text
JPA
= specification

Hibernate
= implementation/provider + native features
```

Code chỉ dùng Jakarta Persistence contract có portability tốt hơn; code dùng Hibernate extension chấp nhận coupling để lấy capability riêng.
