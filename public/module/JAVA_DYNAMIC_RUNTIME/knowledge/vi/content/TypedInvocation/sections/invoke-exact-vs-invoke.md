`invokeExact` yêu cầu symbolic type của call site **khớp chính xác** với type của MethodHandle.

```java
MethodHandle h = ...; // (Greeter,String)String

String ok = (String) h.invokeExact(greeter, "A");
```

`invoke` linh hoạt hơn: khi type không khớp chính xác, hành vi tương đương việc adapt handle bằng `asType` nếu conversion được hỗ trợ, rồi thực hiện lời gọi exact.

```java
Object value = h.invoke(greeter, "A");
```

Quy tắc thực dụng:

- dùng `invokeExact` khi pipeline đã có hợp đồng kiểu chính xác;
- dùng `invoke` khi chủ đích chấp nhận các conversion mà `MethodHandle.asType` cho phép;
- đừng dựa vào `invoke` để che một thiết kế có hợp đồng kiểu mơ hồ.

Trong mã framework, việc chuẩn hóa handle về một `MethodType` thống nhất trước rồi gọi `invokeExact` thường giúp suy luận dễ hơn.
