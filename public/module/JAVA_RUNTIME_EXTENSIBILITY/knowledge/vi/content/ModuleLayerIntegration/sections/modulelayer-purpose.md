`ModuleLayer` hữu ích khi plugin là **explicit named modules** và host cần tạo thêm module graph trong JVM sau boot layer.

Đừng dùng `ModuleLayer` chỉ vì provider nằm trong JAR. Nếu tập plugin cố định khi process khởi động, discovery bằng `ServiceLoader` trên class path/module path thường đơn giản hơn.

`ModuleLayer` phù hợp hơn khi cần:

- resolve module set từ directory/plugin repository riêng;
- giữ module graph tách khỏi boot layer;
- chọn one-loader/many-loader mapping;
- khám phá provider trong layer mới;
- replace plugin set bằng layer mới thay vì mutate boot graph.

Mental model:

```text
module artifacts
→ ModuleFinder
→ Configuration
→ ModuleLayer
→ ServiceLoader.load(layer, service)
```

Layer là runtime representation của một resolved module graph, không phải mutable list plugin.
