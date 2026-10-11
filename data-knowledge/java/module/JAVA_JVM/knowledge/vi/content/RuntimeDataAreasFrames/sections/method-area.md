Method area là runtime data area dùng chung, lưu các cấu trúc liên quan tới class/interface như runtime constant pool, field/method data và biểu diễn code cần cho runtime.

Specification mô tả **logical responsibility**, không bắt implementation phải có một physical region tên “method area”.

Trong HotSpot hiện đại, người học thường gặp **Metaspace** khi nói về class metadata. Không nên viết:

```text
method area = metaspace
```

như một identity tuyệt đối. Chính xác hơn:

```text
method area
→ specification-level abstraction

Metaspace
→ một phần HotSpot implementation strategy cho class metadata
```
