Với `MutableCallSite`, `setTarget` không đảm bảo thread khác nhìn thấy target mới ngay theo cách volatile write làm.

```java
site.setTarget(newTarget);
```

Nếu cần buộc một tập mutable call sites được đồng bộ hóa tới các thread khác, API cung cấp:

```java
MutableCallSite.syncAll(
        new MutableCallSite[]{site}
);
```

Khi có nhiều writer, `setTarget` và `syncAll` thường cần được phối hợp bằng mutual exclusion để tránh race giữa các lần publish target. Reader có thể thấy target mới ngay sau `setTarget` trước cả `syncAll`, hoặc vẫn thấy target cũ cho tới khi `syncAll` hoàn tất. `syncAll` có thể tốn chi phí, nên phù hợp hơn với batch update không quá thường xuyên.

`VolatileCallSite` có semantics mạnh hơn:

```java
volatileSite.setTarget(newTarget);
```

Ở module này chỉ cần nắm hành vi cấp API. Việc chứng minh happens-before, memory ordering hay xây lock-free algorithm thuộc Java Concurrency.

Pitfall phổ biến là thấy “Mutable” rồi giả định update target giống volatile/reference atomic publication. Không nên suy luận như vậy.
