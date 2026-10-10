Bên trong lambda, `this` mang cùng ý nghĩa với `this` ở ngữ cảnh bao quanh. Lambda không tạo một `this` riêng của nó.

```java
class Greeter {
    private final String prefix = "Hello";

    Runnable greeting(String name) {
        return () -> System.out.println(this.prefix + " " + name);
    }
}
```

Trong ví dụ này, `this` vẫn trỏ tới thực thể `Greeter`.

Việc truy cập thành viên không kèm phần định danh (qualifier), cũng như việc dùng `super`, vẫn giữ ngữ nghĩa của phạm vi bao quanh khi hợp lệ tại vị trí đó. Vì vậy lambda giống hành vi được viết ngay trong phương thức hiện tại hơn là một đối tượng lồng có danh tính riêng.
