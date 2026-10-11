Đây là thử nghiệm quan trọng nhất của chương.

```java
final class PluginWithSideEffect {
    static {
        System.out.println("STATIC INITIALIZER RAN");
    }
}

public class LoadWithoutInitializeDemo {
    public static void main(String[] args) throws Exception {
        ClassLoader loader = LoadWithoutInitializeDemo.class.getClassLoader();

        Class<?> loaded = Class.forName(
                "com.example.PluginWithSideEffect",
                false,
                loader
        );

        System.out.println("loaded = " + loaded.getName());
        System.out.println("before initialization");

        Class.forName(
                "com.example.PluginWithSideEffect",
                true,
                loader
        );
    }
}
```

Với binary name đúng và class nằm trên classpath, kết quả quan sát mong đợi có dạng:

```text
loaded = com.example.PluginWithSideEffect
before initialization
STATIC INITIALIZER RAN
```

`Class.forName(name, false, loader)` yêu cầu load/link khi cần nhưng không chủ động initialize class. Lần gọi với `true` yêu cầu initialization.

`ClassLoader.loadClass(name)` cũng thường được dùng để lấy `Class<?>` mà chưa kích hoạt initialization. Tác dụng phụ chỉ xuất hiện khi có initialization trigger phù hợp.

Cách hình dung khi kết thúc chương:

```text
bytes có tồn tại
    ↓ chưa đủ
loading tạo runtime Class identity
    ↓
linking verify + prepare + resolve
    ↓
active use
    ↓
initialization chạy static initialization
```

Chương tiếp theo sẽ trả lời câu hỏi tự nhiên: **loader nào đang làm các việc này trong một JVM Java 21 thông thường?**
