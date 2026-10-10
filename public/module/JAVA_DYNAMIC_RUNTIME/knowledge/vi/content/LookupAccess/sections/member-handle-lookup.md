`Lookup` cung cấp nhiều factory cho executable handles:

```java
MethodHandle virtual =
        lookup.findVirtual(
                Greeter.class,
                "greet",
                MethodType.methodType(
                        String.class,
                        String.class
                )
        );

MethodHandle constructor =
        lookup.findConstructor(
                Greeter.class,
                MethodType.methodType(void.class)
        );
```

Với `findConstructor`, `MethodType` đầu vào dùng return type `void` để mô tả descriptor của constructor, nhưng handle được trả về có return type là chính class được khởi tạo. Ví dụ trên tạo handle kiểu `()Greeter`.

Field cũng có thể được biểu diễn bằng **MethodHandle accessor**:

```java
MethodHandle getter =
        lookup.findGetter(
                User.class,
                "name",
                String.class
        );
```

Nhưng khi mục tiêu là **variable access semantics** như volatile/acquire/release/CAS, abstraction phù hợp là `VarHandle`, không phải getter/setter MethodHandle.

```text
field as callable getter/setter
→ MethodHandle accessor

field as variable with memory/access modes
→ VarHandle
```
