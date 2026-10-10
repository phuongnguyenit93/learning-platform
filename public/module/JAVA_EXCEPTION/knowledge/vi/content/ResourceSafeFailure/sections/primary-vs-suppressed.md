Giả sử phần thân ném A:

```java
try (DemoResource resource = new DemoResource()) {
    throw new IllegalArgumentException("body failed");
}
```

và `resource.close()` cũng ném B.

TWR giữ:

```text
A
→ lỗi chính

B
→ suppressed exception được gắn vào A
```

### VÌ SAO A ĐƯỢC ƯU TIÊN?

Thao tác chính đã thất bại trước vì A. Nếu lỗi dọn dẹp B thay thế A, hệ thống sẽ báo:

```text
"close failed"
```

nhưng lại mất lỗi giải thích **vì sao thao tác chính đã thất bại**.

Cơ chế suppression cho phép giữ đầy đủ bức tranh nguyên nhân:

```text
lỗi chính
→ lỗi quyết định kết quả chính

suppressed
→ lỗi phụ xảy ra trong lúc dọn dẹp khi kết quả chính đã được xác định
```

### Ví dụ quan sát được

```java
final class DemoResource implements AutoCloseable {
    @Override
    public void close() {
        throw new IllegalStateException("close failed");
    }
}

try (DemoResource resource = new DemoResource()) {
    throw new IllegalArgumentException("body failed");
}
```

Nếu catch bên ngoài:

```java
catch (Exception ex) {
    System.out.println(ex.getMessage());

    for (Throwable suppressed : ex.getSuppressed()) {
        System.out.println("suppressed: " + suppressed.getMessage());
    }
}
```

kết quả logic là:

```text
primary   = IllegalArgumentException("body failed")
suppressed[0]
          = IllegalStateException("close failed")
```

Đây là bằng chứng trực tiếp cho lý do TWR an toàn hơn việc dọn dẹp thủ công.
