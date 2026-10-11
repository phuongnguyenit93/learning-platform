GC không thể chỉ hỏi “object được tạo bao lâu rồi?”. Câu hỏi quan trọng hơn là **object còn reachable từ runtime roots theo collector model hay không**.

Conceptually:

```text
GC roots
  ↓
reachable object graph
  ↓
objects còn cần giữ

unreachable objects
  ↓
có thể reclaim
```

Một memory leak trong Java thường không phải “GC quên free”, mà là ứng dụng vô tình giữ strong reference khiến object **vẫn reachable dù về mặt nghiệp vụ không còn cần**.

Reachability vì thế nối thiết kế chương trình với hành vi GC: reference graph của ứng dụng quyết định live set mà collector phải giữ.
