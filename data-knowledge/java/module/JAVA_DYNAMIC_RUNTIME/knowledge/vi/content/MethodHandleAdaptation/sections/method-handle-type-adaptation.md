`asType` tạo adapter sang một `MethodType` khác khi conversions được hỗ trợ.

```java
MethodHandle typed = ...; // (String)String

MethodHandle generic =
        typed.asType(
                MethodType.methodType(
                        Object.class,
                        Object.class
                )
        );
```

Khi invoke `generic`, argument `Object` sẽ được convert/cast về `String`; return `String` được nhìn như `Object`.

`explicitCastArguments` có quy tắc conversion khác và rõ ràng hơn cho một số cast/primitive conversion. Không nên chọn ngẫu nhiên giữa chúng; hãy bắt đầu từ hợp đồng lời gọi mong muốn rồi xem adapter nào thể hiện conversion policy đúng.

Rule:

```text
target type hiện tại
        ↓
hợp đồng lời gọi mong muốn
        ↓
adapter hợp lệ?
        ↓
handle mới với exact type mới
```
