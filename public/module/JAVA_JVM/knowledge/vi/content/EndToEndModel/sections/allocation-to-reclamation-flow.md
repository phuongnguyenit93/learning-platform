Một object bắt đầu từ allocation request và trở thành node trong object graph.

```text
new
→ object storage
→ constructor <init> initialization
→ references giữ object reachable
→ ứng dụng thay đổi reference graph
→ object không còn reachable
→ GC có thể reclaim storage
```

“Có thể reclaim” không có nghĩa reclaim ngay lập tức. Timing phụ thuộc collector và runtime state.

Nếu ứng dụng vô tình giữ reference, object vẫn live đối với GC dù nghiệp vụ đã “không cần nữa”. Đây là nguồn gốc phổ biến của managed-memory leak.
