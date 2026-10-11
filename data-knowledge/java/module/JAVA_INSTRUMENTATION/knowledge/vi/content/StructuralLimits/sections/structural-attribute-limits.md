Ngoài field/method/hierarchy, một số attribute của class file mang ý nghĩa cấu trúc cũng không thể tùy ý thay đổi khi class đã được nạp. Trong quy tắc redefine/retransform của JVM TI trên JDK hiện đại, các nhóm quan trọng gồm:

- NestHost / NestMembers;
- Record;
- PermittedSubclasses.

Chúng không chỉ là metadata trang trí. Chúng ảnh hưởng quyền truy cập nestmate, identity/component của record và hệ phân cấp sealed class.

Vì vậy công cụ không nên nghĩ:

~~~text
"attribute chỉ là metadata"
→ "có thể viết lại thoải mái"
~~~

Thư viện bytecode có thể cho phép tạo bytes chứa attribute khác, nhưng JVM vẫn là nơi quyết định định nghĩa có hợp lệ cho redefine/retransform hay không.
