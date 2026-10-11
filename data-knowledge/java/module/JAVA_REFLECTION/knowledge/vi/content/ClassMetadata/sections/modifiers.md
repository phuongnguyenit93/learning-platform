`getModifiers()` trả một bit mask. `java.lang.reflect.Modifier` cung cấp các hàm hỗ trợ để giải nghĩa những bit có liên quan.

~~~java
int modifiers = PaymentService.class.getModifiers();

System.out.println(Modifier.isPublic(modifiers));
System.out.println(Modifier.isAbstract(modifiers));
System.out.println(Modifier.isFinal(modifiers));
System.out.println(Modifier.toString(modifiers));
~~~

Một factory tạo đối tượng thường có thể dùng siêu dữ liệu này để loại abstract class trước khi thử tạo instance:

~~~java
static boolean canConstruct(Class<?> type) {
    int modifiers = type.getModifiers();
    return !type.isInterface()
            && !Modifier.isAbstract(modifiers)
            && !type.isEnum()
            && !type.isPrimitive()
            && !type.isArray();
}
~~~

Đây vẫn chỉ là một bước lọc ban đầu. Việc một kiểu vượt qua các điều kiện trên không bảo đảm framework chắc chắn tạo được đối tượng: constructor phù hợp, quyền truy cập, đối số và lỗi trong constructor vẫn phải được kiểm tra ở bước Constructor Reflection.

Bit mask của modifier phải được diễn giải theo loại phần tử đang được kiểm tra. Cùng một API `Modifier` được dùng cho class, field, method và constructor, nhưng không phải modifier nào cũng có nghĩa trên mọi phần tử.

Package-private không có một bit “package-private” riêng. Nếu public/protected/private đều false thì quyền truy cập trong mã nguồn có thể là package-private, nhưng framework vẫn cần xét ngữ cảnh truy cập thực tế. Chương **Quyền truy cập, đóng gói và giới hạn mô-đun** sẽ xử lý quyền truy cập phản chiếu; ở đây modifier chỉ là siêu dữ liệu.

Ngoài modifier, một số đặc điểm như synthetic, annotation, enum hay record có API riêng vì chúng không đơn giản là một modifier ở cấp mã nguồn.

Trên Java 21 còn có `accessFlags()`, trả về `Set<AccessFlag>` để biểu diễn các cờ truy cập/đặc tính ở mức class file/JVM dưới dạng enum thay vì bit mask:

~~~java
Set<AccessFlag> flags = PaymentService.class.accessFlags();
System.out.println(flags.contains(AccessFlag.PUBLIC));
System.out.println(flags.contains(AccessFlag.FINAL));
~~~

`Modifier` vẫn là API nền tảng và rất phổ biến để đọc modifier Java. `AccessFlag` là mô hình hiện đại hơn cho các cờ mà siêu dữ liệu JVM/class file biểu diễn; hai API liên quan nhưng không nên bị hiểu là hai tên khác nhau cho cùng một khái niệm trừu tượng. `Field`, `Method` và `Constructor`/`Executable` cũng có `accessFlags()` khi framework cần nhìn siêu dữ liệu theo mô hình này.
