`getModifiers()` cho phép framework hiểu field đang đóng vai trò gì:

~~~java
Field field = PaymentService.class.getDeclaredField("available");
int modifiers = field.getModifiers();

boolean isStatic = Modifier.isStatic(modifiers);
boolean isFinal = Modifier.isFinal(modifiers);
boolean isVolatile = Modifier.isVolatile(modifiers);
boolean isTransient = Modifier.isTransient(modifiers);
boolean isPrivate = Modifier.isPrivate(modifiers);
~~~

Các modifier không chỉ để hiển thị. Chúng thường quyết định chính sách:

~~~text
static
→ trạng thái thuộc class; mapper đối tượng thường bỏ qua

final
→ giá trị/tham chiếu của field chỉ được phép gán theo quy tắc của final;
  nếu field trỏ tới một đối tượng có thể thay đổi (mutable) thì trạng thái bên trong đối tượng đó vẫn có thể thay đổi

transient
→ siêu dữ liệu ở cấp mã nguồn thường được serializer cân nhắc bỏ qua,
  nhưng hành vi cuối cùng tùy serializer

volatile
→ field có ngữ nghĩa bảo đảm khả năng nhìn thấy giữa các luồng của Java;
  Reflection chỉ báo cáo siêu dữ liệu, không thay đổi ngữ nghĩa đó
~~~

Đừng hiểu `final` là “Reflection chắc chắn sửa được nếu cố mở quyền truy cập”. Trên Java hiện đại, việc ghi phản chiếu vào field final bị giới hạn mạnh ở một số loại field; ngoài ra `final` còn mang các bảo đảm ngôn ngữ/JVM mà framework không nên tùy tiện phá vỡ. Hãy xem `final` như một ranh giới thiết kế thay vì một cờ cần vượt qua.

Field còn có:

~~~java
field.isEnumConstant();
field.isSynthetic();
~~~

Hai đặc tính này không nên suy ra chỉ từ bit mask của `Modifier`.

Ví dụ một công cụ chụp trạng thái có chính sách rõ:

~~~java
static boolean shouldRead(Field field) {
    int m = field.getModifiers();
    return !Modifier.isStatic(m)
            && !field.isSynthetic();
}
~~~

Chính sách như vậy tốt hơn việc “Reflection thấy gì thì xử lý hết”, vì siêu dữ liệu lúc chạy có thể chứa thành phần phục vụ trình biên dịch/JVM mà không thuộc mô hình miền.
