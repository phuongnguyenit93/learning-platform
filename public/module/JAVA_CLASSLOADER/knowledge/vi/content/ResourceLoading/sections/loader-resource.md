`ClassLoader#getResource(String)` dùng resource name theo root semantics. Convention là **không có leading slash**:

```java
ClassLoader loader = PaymentPlugin.class.getClassLoader();

URL url = loader.getResource("config/plugins.yml");
```

So sánh:

| API | Input | Resource được tìm |
| --- | --- | --- |
| `PaymentPlugin.class.getResource("plugin.properties")` | relative | `com/example/plugins/plugin.properties` |
| `PaymentPlugin.class.getResource("/config/plugins.yml")` | absolute | `config/plugins.yml` |
| `loader.getResource("config/plugins.yml")` | root-relative | `config/plugins.yml` |

Một lỗi phổ biến:

```java
loader.getResource("/config/plugins.yml");
```

Với `ClassLoader` API, leading slash không mang semantics “absolute” như `Class.getResource`; dùng resource name không có slash đầu là cách portable đúng contract.

> **Nâng cao — JPMS boundary:** trong môi trường named module, các quy tắc encapsulation của module vẫn áp dụng. `ClassLoader.getResource` không phải một “lối tắt” để bỏ qua ranh giới JPMS; khi chuyển từ classpath phẳng sang module path, cần kiểm tra cả loader visibility lẫn module resource access.

### Kết quả tìm tài nguyên vẫn phụ thuộc ClassLoader

Hai plugin loaders có thể cùng tìm:

```text
plugin.properties
```

nhưng nhận hai resource khác nhau vì source/namespace của hai loader khác nhau.

Do đó khi debug resource:

```text
resource name
  +
loader dùng để lookup
→ kết quả
```

chứ không chỉ nhìn mỗi string path.
