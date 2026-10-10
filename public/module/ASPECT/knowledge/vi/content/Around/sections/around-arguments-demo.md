Controller:

```text
AroundAdviceController#arguments()
```

Endpoint:

```text
GET /aop/around/arguments
```

Controller truyền:

```text
"  Book  "
```

Aspect đọc argument từ `joinPoint.getArgs()`, normalize thành:

```text
book
```

rồi tiếp tục bằng:

```java
joinPoint.proceed(new Object[]{normalized})
```

Event:

```text
around:argument-before="  Book  "
around:argument-after=book
target:normalizeArgument:item=book
```

Target thật sự nhận argument mới chứ không phải argument ban đầu.

Capability này mạnh nhưng cũng dễ làm contract trở nên khó đoán, nên chỉ dùng khi transformation là một phần rõ ràng của cross-cutting contract.

### `proceed(Object[])` trong Spring AOP và AspectJ

Experiment này chạy trên **proxy-based Spring AOP**. Ở runtime này, array truyền vào:

```java
joinPoint.proceed(new Object[]{normalized})
```

đại diện cho argument list mới của underlying method invocation và số phần tử phải phù hợp với method arguments.

Không nên suy luận rằng `proceed(Object[])` có semantics giống hệt khi advice được compile bởi AspectJ compiler. Với AspectJ-compiled around advice, arguments truyền vào `proceed(...)` gắn với các parameter đã bind vào around advice signature, nên rule về số lượng/vị trí argument khác Spring AOP.

Nếu một Aspect cần portable giữa Spring AOP và AspectJ, nên bind argument rõ ràng trong pointcut/advice signature thay vì phụ thuộc vào assumption riêng của một runtime.

---
