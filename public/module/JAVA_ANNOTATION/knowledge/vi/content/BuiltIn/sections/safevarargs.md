> **Ranh giới cho người mới:** mục này chỉ cần hiểu `@SafeVarargs` là một lời cam kết về tính an toàn của generic varargs. Cơ chế sâu của type erasure, reifiable type và heap pollution thuộc module Generics.

Varargs của generic/non-reifiable type có thể tạo **heap pollution** vì varargs được biểu diễn bằng mảng ở thời gian chạy trong khi thông tin generic type có thể bị type erasure.

Ví dụ:

```java
@SafeVarargs
static <T> List<T> combine(List<T>... lists) {
    return Arrays.stream(lists)
        .flatMap(List::stream)
        .toList();
}
```

`@SafeVarargs` là lời **khẳng định của lập trình viên** rằng phần triển khai không thực hiện thao tác không an toàn trên varargs parameter.

Nó không:

- làm mọi thao tác generic varargs tự động an toàn;
- ngăn một phần triển khai xấu gây heap pollution;
- thay thế việc rà soát mã nguồn.

Annotation chỉ hợp lệ trên **variable-arity constructor/method** và, với method, phải là `static`, `final` hoặc `private` instance method để lời khẳng định không bị một phần triển khai override phá vỡ.

Nếu method ghi một đối tượng có type không tương thích vào mảng nền (backing array), hoặc làm mảng đó thoát ra nơi có thể bị sửa sai type, gắn `@SafeVarargs` chỉ đang **che cảnh báo sai cách**.

### Khác gì với `@SuppressWarnings("unchecked")`?

Đây là một khác biệt quan trọng:

```text
@SuppressWarnings("unchecked")
→ việc bỏ qua cảnh báo mang tính cục bộ trong phạm vi khai báo

@SafeVarargs
→ bỏ qua cảnh báo liên quan non-reifiable varargs ở phần khai báo
→ đồng thời bỏ qua cảnh báo tương ứng tại nơi gọi
```

Vì vậy `@SafeVarargs` là một phần của **quy tắc API với bên gọi**, không chỉ là “tắt cảnh báo bên trong method”.
