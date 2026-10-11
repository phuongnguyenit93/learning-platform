Binding giúp cố định một argument trước:

```java
Greeter greeter = new Greeter();

MethodHandle greet = ...; // (Greeter,String)String

MethodHandle bound =
        greet.bindTo(greeter); // (String)String
```

`insertArguments` tổng quát hơn vì có thể bind argument tại vị trí chỉ định:

```java
MethodHandle fixedPrefix =
        MethodHandles.insertArguments(
                target,
                0,
                "INFO"
        );
```

`permuteArguments` đổi thứ tự hoặc reuse argument dựa trên mapping:

```text
before: (A,B)R
after : (B,A)R
```

Những adapter này hữu ích khi framework muốn chuẩn hóa nhiều target khác signature về cùng một hợp đồng nội bộ mà không tạo class wrapper cho từng target.
