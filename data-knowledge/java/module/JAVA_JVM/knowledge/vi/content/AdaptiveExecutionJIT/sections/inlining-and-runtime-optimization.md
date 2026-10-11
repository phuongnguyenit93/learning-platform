Inlining thay một call boundary bằng body của callee trong biểu diễn đã compile khi optimizer đánh giá có lợi và an toàn.

```text
before
caller → call smallMethod()

after conceptual inlining
caller → [body of smallMethod]
```

Inlining quan trọng không chỉ vì loại call overhead. Nó mở ra optimization mới xuyên qua boundary: constant propagation, dead-code elimination, escape analysis và nhiều transform khác.

Nhưng inlining không phải Java semantics. Source vẫn có method boundary về mặt language/debug meaning; runtime có thể chọn inline hoặc không tùy profile, size và policy.

Vì vậy benchmark “method nhỏ chắc chắn inline” mà không đo bằng chứng runtime là suy đoán về implementation.
