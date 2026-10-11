Phương thức `private` cho phép các phương thức bên trong interface dùng lại chi tiết triển khai mà không biến phần hỗ trợ đó thành một phần của hợp đồng công khai:

```java
interface Formatter {
    default String upper(String value) {
        return normalize(value).toUpperCase();
    }

    private String normalize(String value) {
        return value.trim();
    }

    static String normalizeKey(String value) {
        return normalizeStatic(value).toLowerCase();
    }

    private static String normalizeStatic(String value) {
        return value.trim();
    }
}
```

`private String normalize(...)` là phương thức `private` của đối tượng nên dùng được trong ngữ cảnh của phương thức đối tượng/`default` trong interface. `private static String normalizeStatic(...)` là phương thức `private static` nên dùng được từ ngữ cảnh `static` mà không cần đối tượng.

Lớp triển khai interface không thể gọi hoặc override các phương thức hỗ trợ `private` này; chúng là chi tiết triển khai nội bộ của interface.
