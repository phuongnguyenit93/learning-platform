Đây là phân biệt quan trọng nhất khi tự viết loader:

```text
loadClass(...)
→ điều phối: đã load chưa? delegate parent? fallback?

findClass(...)
→ điểm mở rộng: loader hiện tại tự tìm/định nghĩa class thế nào?
```

`ClassLoader` mặc định đã cài hành vi parent-first trong `loadClass`. Vì vậy custom loader thông thường chỉ override `findClass`:

```java
public final class PluginClassLoader extends ClassLoader {
    public PluginClassLoader(ClassLoader parent) {
        super(parent);
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] bytes = findPluginBytes(name);
        return defineClass(name, bytes, 0, bytes.length);
    }

    private byte[] findPluginBytes(String name) throws ClassNotFoundException {
        throw new ClassNotFoundException(name);
    }
}
```

Khi bên gọi dùng:

```java
Class<?> type = loader.loadClass("com.example.plugins.PaymentPlugin");
```

Luồng mặc định gần như:

```text
findLoadedClass
    ↓
delegate parent
    ↓ parent không tìm thấy
findClass của PluginClassLoader
    ↓
defineClass
```

### Khi nào mới nên ghi đè (override) loadClass?

Chỉ khi loader thật sự cần chính sách lookup khác, ví dụ child-first có tách biệt chọn lọc. Lúc đó implementation phải tự giữ các invariant như:

- không định nghĩa cùng class hai lần trong cùng loader;
- locking đúng khi nhiều thread load cùng binary name;
- parent/shared API boundary rõ ràng;
- optional resolution đúng semantics.

Nếu bài toán chỉ là “class bytes nằm ở nguồn khác”, override `findClass` thường là lựa chọn đúng.
