Kết quả phổ biến của Linker.downcallHandle là MethodHandle. Trong FFM, MethodHandle là **cầu invocation**: Java có thể gọi handle như một typed callable object và FFM chuyển invocation đó qua native boundary.

~~~java
MethodHandle add = linker.downcallHandle(
        addAddress,
        addDescriptor);
~~~

Module này chỉ cần hiểu ba điều:

1. type của MethodHandle được suy ra từ FunctionDescriptor và carrier mapping;
2. invoke với type/argument sai sẽ không trở thành native call hợp lệ;
3. MethodHandle ở đây là phương tiện được FFM tái sử dụng, không phải nội dung chính của native interoperability.

Lookup rules, adaptation/combinator và mechanics sâu của MethodHandle thuộc **Dynamic Runtime**. Không nên học lại toàn bộ java.lang.invoke chỉ để hiểu downcall.
