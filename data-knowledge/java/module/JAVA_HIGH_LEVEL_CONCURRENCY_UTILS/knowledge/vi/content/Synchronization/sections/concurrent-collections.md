Concurrent collections đóng gói synchronization strategy vào data structure.

Một số nhóm quan trọng:

| Collection | Mục tiêu |
| --- | --- |
| `ConcurrentHashMap` | key/value concurrent access |
| `ConcurrentSkipListMap` | concurrent sorted map |
| `CopyOnWriteArrayList` | read-heavy, write ít, snapshot iteration |
| `ConcurrentLinkedQueue` | non-blocking concurrent queue |
| `BlockingQueue` | queue có semantics chờ; học sâu ở Coordination |

### Atomic compound methods

Với `ConcurrentHashMap`, ưu tiên method thể hiện compound operation nguyên tử ở mức collection:

```java
map.merge(key, 1, Integer::sum);
map.computeIfAbsent(key, k -> newValue());
map.putIfAbsent(key, value);
```

Thay vì tự viết `get()` rồi `put()` và giả định hai operation tách rời trở thành atomic.

### CopyOnWrite snapshot

Iterator của `CopyOnWriteArrayList` quan sát snapshot tại thời điểm iterator được tạo. Ghi mới tạo backing array mới nên phù hợp khi read nhiều hơn write đáng kể.

Điểm đánh đổi là mỗi mutation có thể phải copy backing array. Vì vậy collection này không phù hợp với write-heavy workload hoặc collection rất lớn chỉ vì read path thuận tiện.

### ConcurrentLinkedQueue

`poll()` không block. Khi queue rỗng nó trả `null`.

Do đó consumer không nên viết busy loop vô hạn chỉ gọi `poll()` nếu không có backoff/termination strategy.

`size()` của `ConcurrentLinkedQueue` không nên được coi là cheap constant-time metric cho hot path. Nếu chỉ cần biết queue có phần tử hay không, ưu tiên semantics phù hợp như `isEmpty()` thay vì polling `size()` liên tục.

Iterator của nhiều concurrent collection là **weakly consistent**: nó có thể phản ánh một phần update concurrent mà không fail-fast như collection thường, nhưng không nên suy luận rằng nó là snapshot tuyệt đối. `CopyOnWriteArrayList` là trường hợp khác vì iterator của nó thực sự dùng snapshot backing array.

### Một số API/type đáng nhận ra

Không cần biến chapter này thành API catalog, nhưng nên biết các operation giúp tránh pattern "check rồi update" không atomic trên `ConcurrentHashMap`:

```text
putIfAbsent
compute
computeIfAbsent
computeIfPresent
merge
replace(key, oldValue, newValue)
```

Các type cùng họ cũng đáng nhận ra:

```text
CopyOnWriteArraySet
ConcurrentSkipListSet
```

Chúng không thay đổi mental model chính: chọn collection dựa trên access pattern và semantics cần có, không chỉ vì tên có chữ `Concurrent`.

### ConcurrentSkipListMap

`ConcurrentSkipListMap` phù hợp khi cần đồng thời:

- concurrent access;
- key luôn được quan sát theo sorted order;
- các navigation operation như `firstKey`, `lastKey`, range view.

Nó không phải "ConcurrentHashMap nhưng nhanh hơn"; hai collection phục vụ access pattern khác nhau.

Tham khảo:

```text
SynchronizationController#concurrentSkipList()
GET /synchronization/concurrent-skip-list
```

Demo cho nhiều Thread insert key theo thứ tự cố tình đảo ngược, sau đó quan sát key set cuối vẫn sorted.

Tham khảo:

```text
SynchronizationController#concurrentCollections()
GET /synchronization/concurrent-collections
```

Experiment dùng collection cục bộ và luôn kết thúc, không tạo consumer daemon chạy vô hạn như demo cũ.
