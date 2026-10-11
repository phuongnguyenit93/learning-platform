`InheritableThreadLocal` cho phép child Thread nhận initial value từ parent tại thời điểm child Thread được tạo.

Tham khảo:

```text
ThreadLocalController#inheritance()
GET /context/inheritance
```

Demo cố tình:

```text
parent = A
new Thread(...)
parent = B
child.start()
```

Child vẫn quan sát initial inherited value A.

**Kết luận:** inheritance gắn với **Thread creation**, không phải "mỗi khi submit task thì copy context mới".
