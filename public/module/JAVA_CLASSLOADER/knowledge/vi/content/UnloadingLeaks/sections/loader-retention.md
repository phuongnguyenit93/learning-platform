Ta nên chẩn đoán dựa trên **khả năng còn được tham chiếu (reachability)**:

**GC root** là một điểm mà bộ thu gom rác xem như còn sống chắc chắn khi bắt đầu lần theo đồ thị đối tượng, ví dụ luồng đang sống hoặc các cấu trúc JVM sống lâu dẫn tới trạng thái `static`. Một đối tượng còn đường tham chiếu từ GC root thì chưa thể được thu hồi.

```text
GC root / đối tượng sống lâu
→ ...
→ đối tượng plugin / Class của plugin / ClassLoader của plugin
```

Các nguồn giữ lại phổ biến:

- luồng sống lâu có TCCL trỏ vào ClassLoader của plugin;
- bộ nhớ đệm do tầng cha/ứng dụng sở hữu giữ `Class<?>`, `Method`, instance hoặc ClassLoader của plugin;
- registry/bộ lắng nghe/event bus chưa gỡ đăng ký hàm gọi lại (callback) của plugin;
- executor/luồng do plugin tạo chưa dừng;
- registry của JDK/thư viện giữ đối tượng được plugin đăng ký;
- `ThreadLocal` trên luồng trong pool giữ đối tượng thuộc plugin;
- hook dọn dẹp hoặc hàm gọi lại bị giữ ngoài vòng đời plugin.

Ví dụ bộ nhớ đệm nguy hiểm:

```java
// Class này nằm ở Application ClassLoader và sống suốt tiến trình.
final class GlobalCache {
    static final Map<String, Class<?>> TYPES = new HashMap<>();
}

GlobalCache.TYPES.put("payment", pluginClass);
```

Sau khi plugin dừng, mục trên vẫn tạo chuỗi tham chiếu:

```text
GlobalCache static của ứng dụng
→ plugin Class
→ PluginClassLoader ở vai trò ClassLoader định nghĩa
```

### Trường static của plugin tự nó chưa đủ để gọi là rò rỉ

Đây là một điểm tinh tế nhưng quan trọng.

```text
PluginClassLoader
↔ Class của plugin
↔ đồ thị đối tượng static của plugin
```

Nếu toàn bộ đồ thị chỉ tham chiếu lẫn nhau và **không còn đường từ GC root hoặc đối tượng bên ngoài sống lâu đi vào đồ thị**, GC có thể thu hồi chu trình đó.

Rò rỉ xảy ra khi một đối tượng bên ngoài sống lâu vẫn còn đường tham chiếu tới một phần đồ thị của plugin.
