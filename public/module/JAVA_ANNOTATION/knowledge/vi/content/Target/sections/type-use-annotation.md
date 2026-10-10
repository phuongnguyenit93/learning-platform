`TYPE_USE` mở rộng câu hỏi từ “Annotation gắn lên **khai báo nào?**” sang “Annotation mô tả **type nào ở vị trí sử dụng này?**”.

Ví dụ:

```java
List<@NonNull String> names;

@NonNull String findName() {
    return "Java";
}

Object value = (@NonNull String) input;

List<@Readonly String> copy = new ArrayList<>();
```

Type annotation có thể xuất hiện trong nhiều ngữ cảnh sử dụng type như:

- generic type argument;
- return type, receiver type hoặc một lần xuất hiện của type;
- phép ép kiểu;
- `new` expression;
- thành phần/chiều của mảng;
- type trong `throws` hoặc `implements` tùy phạm vi áp dụng của Annotation.

`TYPE_PARAMETER` khác `TYPE_USE`:

```java
class Box<@TypeParameterRule T> {
    List<@TypeUseRule T> values;
}
```

Annotation đầu mô tả **khai báo của `T`**; Annotation sau mô tả một **lần sử dụng type `T`**.

Theo mô hình ngôn ngữ Java, `TYPE_USE` còn bao phủ một số ngữ cảnh khai báo liên quan tới type như khai báo type/type parameter để thuận tiện cho công cụ kiểm tra kiểu. Vì vậy cần đọc quy tắc cụ thể thay vì suy luận chỉ từ vị trí ký tự `@`.

### Kiểm tra type annotation tại thời gian chạy

> **Chỉ cần nhận diện ở module này:** Reflection có API riêng để quan sát type annotation. Không cần học sâu `AnnotatedType` tại đây; phần Reflection chi tiết thuộc module `reflection`.

Nếu type annotation có chính sách `RUNTIME`, mã chạy ở thời gian chạy thường quan sát nó qua `AnnotatedType` và các subtype như `AnnotatedParameterizedType`, không chỉ qua API Annotation trên khai báo thông thường.

Chi tiết Reflection sâu hơn thuộc module `reflection`; ở đây điểm cần nhớ là **siêu dữ liệu trên khai báo và siêu dữ liệu TYPE_USE có mô hình tra cứu khác nhau**.

### Trường hợp đặc biệt — khai báo cục bộ và type annotation là hai kênh khác nhau

> **Edge case để tránh suy luận sai:** không cần ghi nhớ class-file representation chi tiết; chỉ cần biết cùng xuất hiện gần một biến cục bộ nhưng Annotation trên khai báo và Annotation trên type không phải cùng một kênh siêu dữ liệu.

Annotation trên **khai báo biến cục bộ** và formal parameter của lambda không được lưu trong binary theo cơ chế dành cho Annotation trên khai báo, kể cả khi kiểu Annotation khai báo `CLASS` hoặc `RUNTIME`.

Trong khi đó, type annotation đặt lên **type được sử dụng** ở các ngữ cảnh tương ứng đi qua kênh siêu dữ liệu dành cho type annotation và có quy tắc lưu trữ riêng.

Vì vậy `RUNTIME` không có nghĩa mọi ký hiệu `@...` trong mã nguồn đều trở thành Annotation trên khai báo có thể đọc lúc chạy. Phải luôn đọc **`@Retention` cùng với `@Target` và vị trí sử dụng thực tế**.
