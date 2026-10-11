Reflection cho phép đi từ một kiểu sang quan hệ kế thừa trực tiếp của nó:

~~~java
Class<?> type = PaymentService.class;

Class<?> parent = type.getSuperclass();
Class<?>[] interfaces = type.getInterfaces();
~~~

Với PaymentService ở ví dụ trên:

~~~text
getSuperclass() → java.lang.Object
getInterfaces() → [PaymentProcessor]
~~~

`getInterfaces()` trả các interface **trực tiếp** mà class `implements`, hoặc các superinterface trực tiếp mà một interface `extends`. Nó không tự trải phẳng toàn bộ cây interface. Nếu framework cần tập đầy đủ của cả hệ phân cấp, chính framework phải duyệt tiếp và tránh lặp.

getSuperclass() có các ranh giới đáng nhớ:

| Type | getSuperclass() |
| --- | --- |
| class bình thường | superclass trực tiếp |
| Object | null |
| interface | null |
| primitive | null |
| void | null |
| array | Object |

Mảng còn báo cáo `Cloneable` và `Serializable` qua `getInterfaces()`, dù ta không viết một khai báo class thông thường cho mảng.

Ví dụ duyệt chuỗi superclass:

~~~java
static List<Class<?>> classHierarchy(Class<?> type) {
    List<Class<?>> result = new ArrayList<>();
    for (Class<?> current = type;
         current != null;
         current = current.getSuperclass()) {
        result.add(current);
    }
    return result;
}
~~~

Nếu cần giữ chữ ký generic của superclass/interface, `Class` còn có `getGenericSuperclass()` và `getGenericInterfaces()`. Mô hình `Type` đầy đủ được học ở chương **Siêu dữ liệu Generics còn lại sau xóa kiểu**; đừng nhầm siêu dữ liệu của `Class<?>` với toàn bộ mô hình kiểu generic.
