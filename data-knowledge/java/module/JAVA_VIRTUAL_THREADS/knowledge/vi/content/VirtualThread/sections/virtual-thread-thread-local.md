Virtual thread vẫn có `ThreadLocal` semantics theo Thread. Điều khác biệt về scalability là application có thể tạo số lượng Thread lớn hơn rất nhiều, nên việc đặt object lớn vào ThreadLocal cho từng virtual thread có thể trở thành heap pressure đáng kể.

Rule vẫn giống phần Context:

```text
set
→ try
→ work
→ finally remove/restore
```

Không nên dùng ThreadLocal như global cache chỉ vì virtual thread rẻ.

Tham khảo:

```text
VirtualThreadController#threadLocal()
GET /virtual-thread/thread-local
```

Experiment dùng plain `ThreadLocal` trên hai virtual threads:

```text
firstThreadContext = request-A
firstThreadCleaned = true
secondThreadInheritedPlainThreadLocal = null
plainThreadLocalIsPerThread = true
```

**Kết luận:** virtual thread không thay đổi rule isolation/cleanup của ThreadLocal; scale lớn khiến memory discipline càng quan trọng.

### InheritableThreadLocal với Virtual Thread

`InheritableThreadLocal` vẫn có creation-time inheritance semantics. Virtual thread tạo mới có thể nhận inherited value từ Thread tạo nó.

Nhưng Java 2. virtual-thread builder cho phép tắt behavior này:

```java
Thread.ofVirtual()
        .inheritInheritableThreadLocals(false)
        .start(task);
```

Experiment `/thread-local` quan sát thêm:

```text
inheritableThreadLocalDefault = parent-context
inheritableThreadLocalWhenDisabled = null
virtualBuilderCanDisableInheritance = true
```

Điểm quan trọng vẫn là: inheritance không thay thế explicit context propagation. Context có lifecycle/request semantics riêng vẫn nên capture/restore/cleanup có chủ đích thay vì phụ thuộc ngầm vào việc Thread mới được tạo từ Thread nào.
