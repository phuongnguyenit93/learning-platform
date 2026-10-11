Ba khả năng manifest không “bật một API toàn cục” theo nghĩa tuyệt đối. Chúng khai báo agent **cần** khả năng:

~~~text
Can-Redefine-Classes
Can-Retransform-Classes
Can-Set-Native-Method-Prefix
~~~

Sau đó JVM quyết định khả năng thực tế. Vì vậy mẫu an toàn là:

~~~java
if (inst.isRetransformClassesSupported()) {
    inst.addTransformer(transformer, true);
}
~~~

Nếu đăng ký transformer với canRetransform=true khi JVM không hỗ trợ retransformation, addTransformer có thể ném UnsupportedOperationException.

Quy tắc quan trọng:

~~~text
khai báo trong manifest
        +
JVM hỗ trợ
        ↓
khả năng runtime
~~~

Không mã hóa cứng giả định “HotSpot hiện tại hỗ trợ nên mọi JVM đều hỗ trợ”.
