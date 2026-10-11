Dynamic Runtime trong module này là tập các cơ chế mức thấp của `java.lang.invoke` cho phép Java biểu diễn một lời gọi hoặc một vị trí dữ liệu như một giá trị có kiểu, sau đó liên kết, biến đổi hoặc chọn hành vi ở runtime. Trọng tâm không phải là “viết code động cho mọi thứ”, mà là hiểu những primitive mà JVM, framework và language runtime dùng khi lời gọi Java trực tiếp không còn đủ linh hoạt.

Hai nhánh lớn sẽ xuất hiện xuyên suốt module:

```text
typed invocation
MethodType + MethodHandle + Lookup
        ↓
adaptation / composition
        ↓
CallSite + invokedynamic

typed variable access
VarHandle
```

`MethodHandle` và `VarHandle` được JVM đối xử đặc biệt: các access method của chúng là signature-polymorphic, nên descriptor tại call site có thể mang kiểu thực tế thay vì bị giới hạn bởi signature Java nhìn thấy trong source.

Lộ trình học của module đi theo thứ tự:

```text
MethodType + MethodHandle
→ Lookup
→ adaptation / composition
→ CallSite
→ invokedynamic
→ VarHandle
→ synthesis / decision model
```

Nhánh invocation/linkage được học trước để tạo mental model hoàn chỉnh; sau đó `VarHandle` mở nhánh variable-access song song. Kết thúc module, người học phải phân biệt được **hợp đồng kiểu**, **quyền truy cập**, **đối tượng linkage** và **ngữ nghĩa truy cập biến** thay vì chỉ nhớ tên API.

Điểm cần giữ ngay từ đầu: **dynamic** không đồng nghĩa với “không biết gì cho tới runtime”. Một member có thể đã biết trước nhưng ta vẫn muốn một handle thực thi có kiểu, một quyền lookup có thể truyền đi, một chuỗi handle có thể ghép lại, hoặc một call site có target thay đổi.
