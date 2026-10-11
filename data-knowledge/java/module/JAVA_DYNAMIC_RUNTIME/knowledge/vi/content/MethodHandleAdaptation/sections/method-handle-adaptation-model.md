Sau khi có một MethodHandle đúng member, phần mạnh của `java.lang.invoke` là tạo **handle mới** bằng adaptation/composition thay vì viết wrapper method thủ công.

Running example:

```text
(Greeter,String)String
        ↓ bind receiver
(String)String
        ↓ filter argument
(Object)String
        ↓ filter return
(Object)Object
```

Mỗi bước tạo một handle mới với `MethodType` mới nhưng vẫn đại diện cho một chuỗi thực thi có thể gọi trực tiếp.

Hai khái niệm:

- **adaptation**: thay đổi cách phía gọi nhìn/đưa argument vào target;
- **composition**: ghép nhiều handle thành một thao tác lớn hơn.

Không phải mọi adapter đều “không có chi phí”. Một số conversion, boxing/cast hay chuỗi handle phức tạp có chi phí; trước hết hãy dùng chúng vì tính đúng đắn và thiết kế, rồi benchmark nếu hiệu năng thực sự quan trọng.
