`SynchronousQueue` không lưu phần tử như buffer thông thường.

```text
producer put(item)
        ↕ rendezvous
consumer take()
```

Mỗi handoff cần một operation phía đối diện tương ứng.

Tham khảo:

```text
CoordinationController#synchronousQueue()
GET /coordination/synchronous-queue
```

**Kết luận:** đây là coordination point trực tiếp, không phải queue dùng để tích trữ backlog.
