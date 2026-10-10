Optimizer được phép thay đổi **cách** chương trình được thực thi, nhưng không được thay đổi hành vi mà Java/JVM contract yêu cầu phải observable.

Do đó:

- object có thể không tồn tại vật lý như source gợi ý;
- method có thể được inline;
- instruction order machine-level có thể khác mental model source trong giới hạn semantics;
- compiled code có thể bị discard/recompile.

Nhưng ứng dụng không nên phụ thuộc vào một chi tiết triển khai tình cờ như “method này chắc chắn inline” hoặc “object này chắc chắn ở stack”.

Rule thực tế:

> viết code theo language/JMM semantics; dùng profiler/benchmark khi cần biết optimization thật của runtime.
