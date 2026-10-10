Plugin isolation tồn tại để một extension không vô tình chia sẻ toàn bộ không gian class/dependency/tài nguyên với host và plugin khác.

Không isolation, hai plugin có thể:

- yêu cầu version khác nhau của cùng library;
- nhìn thấy chi tiết triển khai không nên thấy;
- giữ thread/tài nguyên khiến host không cleanup được;
- làm crash/failure lan rộng qua shared global state.

Isolation không nhất thiết luôn cần custom class loader. Mức isolation phụ thuộc requirement:

```text
logical isolation
→ contract + lifecycle + không dùng shared mutable state

class-loader isolation
→ dependency/type namespace boundary

module-layer isolation
→ named-module graph + loader mapping

process isolation
→ ranh giới failure/security/tài nguyên mạnh hơn
```

Module này tập trung isolation trong cùng JVM; process/container isolation thuộc architecture khác.
