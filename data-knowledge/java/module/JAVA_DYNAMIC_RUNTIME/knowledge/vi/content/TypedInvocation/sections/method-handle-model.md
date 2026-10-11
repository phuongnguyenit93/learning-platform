`MethodHandle` là một **tham chiếu thực thi có kiểu** (typed, directly executable reference) tới một thao tác mức thấp như method, constructor, field accessor hoặc thao tác đã được composition. Nó gần với “callable value” hơn là metadata.

Running example:

```java
final class Greeter {
    String greet(String name) {
        return "Hello " + name;
    }
}

MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType type = MethodType.methodType(String.class, String.class);

MethodHandle greet =
        lookup.findVirtual(
                Greeter.class,
                "greet",
                type
        );
```

`greet.type()` ở đây là:

```text
(Greeter, String)String
```

Receiver trở thành **tham số đầu tiên trong `MethodType` của handle** cho virtual method. Điều này giải thích vì sao ta có thể bind receiver sau đó để nhận một handle mới kiểu `(String)String`.

MethodHandle là bất biến. Các thao tác adaptation không thay đổi handle cũ; chúng tạo handle mới đại diện cho pipeline mới.
