Một JVM không bắt buộc hỗ trợ mọi khả năng của Instrumentation. Các phép kiểm tra quan trọng:

~~~java
inst.isRedefineClassesSupported();
inst.isRetransformClassesSupported();
inst.isNativeMethodPrefixSupported();
~~~

Khả năng redefine/retransform cần đồng thời:

~~~text
manifest của agent yêu cầu khả năng
        +
cấu hình JVM hỗ trợ
        ↓
API báo true
~~~

Kết quả kiểm tra khả năng ổn định trong suốt một lần chạy JVM, nhưng code vẫn nên hỏi API thay vì mã hóa cứng theo vendor/phiên bản.

Can-Set-Native-Method-Prefix và setNativeMethodPrefix() phục vụ một trường hợp sử dụng chuyên biệt: hỗ trợ bọc native method bằng cách thử phân giải lại với prefix. Đây là khả năng nâng cao; người học chỉ cần nhận diện nó thuộc bề mặt API của Instrumentation, không cần biến module thành curriculum JNI.
