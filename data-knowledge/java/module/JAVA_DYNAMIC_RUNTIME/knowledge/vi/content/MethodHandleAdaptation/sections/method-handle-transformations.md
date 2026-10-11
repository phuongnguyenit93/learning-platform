`filterArguments` biến đổi input trước khi target chạy:

```java
MethodHandle trim =
        lookup.findVirtual(
                String.class,
                "trim",
                MethodType.methodType(String.class)
        );

MethodHandle normalized =
        MethodHandles.filterArguments(
                boundGreet, // (String)String
                0,
                trim        // (String)String
        );
```

Flow:

```text
"  Phuong "
→ trim
→ "Phuong"
→ greet
→ "Hello Phuong"
```

`filterReturnValue` làm điều tương tự với output.

Ngoài filter, `foldArguments`/combiner APIs cho phép tính thêm giá trị từ arguments rồi đưa vào target. Khi chuỗi handle bắt đầu khó đọc hơn một method bình thường, đó là tín hiệu nên cân nhắc wrapper Java rõ ràng hơn.
