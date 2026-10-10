`ModuleLayer` được tạo từ một `Configuration` đã resolve. Nó không phải mutable registry để add/remove module tùy ý sau đó.

Khi tập plugin thay đổi, mô hình dễ suy luận hơn là:

```text
old artifacts
→ old Configuration
→ old Layer

new artifacts
→ new Configuration
→ new Layer
```

Host có thể:

1. discover/validate new layer;
2. activate provider mới;
3. chuyển registry/context sang thế hệ mới theo cách nguyên tử;
4. drain/cleanup old plugin generation;
5. release reference tới old layer/loaders nếu muốn GC.

`ModuleLayer.Controller` có một số khả năng điều chỉnh reads/exports/opens, nhưng nó không biến layer thành general module add/remove container.

Nếu reference, thread hoặc tài nguyên cũ vẫn giữ class loader, class của layer/plugin cũ vẫn chưa thể unload dù ứng dụng đã chuyển sang layer mới.
