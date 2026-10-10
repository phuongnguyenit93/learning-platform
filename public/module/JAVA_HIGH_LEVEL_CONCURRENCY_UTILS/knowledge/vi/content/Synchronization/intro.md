# Synchronization trong Java

Phần trước đã học các vấn đề cần giải quyết: atomicity, visibility, ordering và progress.

Phần này tập trung vào các công cụ dùng để bảo vệ shared mutable state.

Mental model:

```text
shared mutable state
        ↓
chọn synchronization strategy phù hợp
        ↓
synchronized / Lock / Atomic / Concurrent Collection
```

Không có một công cụ luôn tốt nhất cho mọi tình huống.
