`java.lang.invoke.MethodHandle` là cơ chế gọi động lân cận Reflection, nhưng nó giải quyết bài toán ở mức khác.

Với người học mô-đun Reflection, chỉ cần xem `MethodHandle` là một **API lân cận ở mức thấp hơn để giữ và gọi một đích động đã được phân giải**. Bạn không cần học `MethodType`, `Lookup` hay cơ chế thích nghi (adaptation) sâu để hiểu Reflection; phần dưới chỉ giúp nhận biết ranh giới giữa hai cơ chế.

Core Reflection tập trung vào **khám phá và thao tác siêu dữ liệu**: tìm `Method`, đọc annotation, tham số, modifier, chữ ký generic rồi có thể gọi. `MethodHandle` đại diện cho một đích có thể gọi với `MethodType`; nó hỗ trợ tra cứu và thích nghi cho các trường hợp liên kết/gọi động cấp thấp hơn.

Một cách hình dung hữu ích:

```text
Reflection
→ “thành phần nào tồn tại và siêu dữ liệu của nó là gì?”
→ Method.invoke(...) khi cần gọi qua đối tượng mô tả

MethodHandle
→ “tôi đã có một đích động có thể gọi với hình dạng kiểu nào?”
→ invokeExact/invoke + thích nghi khi cần
```

`invokeExact()` yêu cầu kiểu tại điểm gọi khớp chính xác với `MethodType`; `invoke()` linh hoạt hơn và có thể áp dụng một số thích nghi. Quyền truy cập khi tạo handle vẫn đi qua `MethodHandles.Lookup`, nên MethodHandle không phải lối tắt bỏ qua tính đóng gói.

Không nên đổi mọi `Method.invoke()` thành MethodHandle chỉ vì nghe “nhanh hơn”. Nếu nhiệm vụ chính là kiểm tra annotation, generic hoặc siêu dữ liệu thành phần, Reflection vẫn là abstraction tự nhiên. Nếu một hệ thống lúc chạy phân giải một đích có thể gọi một lần rồi gọi lặp lại với hợp đồng kiểu được kiểm soát, MethodHandle có thể là cơ chế phù hợp hơn. Chương này chỉ xác định ranh giới; `java.lang.invoke` có mô hình riêng sâu hơn Reflection.
