Một trường hợp sử dụng quan trọng của Reflection là **đọc annotation có chính sách lưu giữ `RUNTIME`**. Reflection không quyết định annotation tồn tại bao lâu; retention, target, repeatable và quy tắc kế thừa thuộc mô-đun Annotation. Ở đây ta nhìn annotation từ phía **bên đọc lúc chạy**.

`Class`, `Field`, `Method`, `Constructor`, `Parameter`, `RecordComponent` và nhiều phần tử phản chiếu khác tham gia hợp đồng `AnnotatedElement`, nên chúng có nhóm API tra cứu tương đối thống nhất. Trong ví dụ dưới, giả sử `@Audit` là annotation tùy chỉnh đã được khai báo với retention `RUNTIME` trong mô-đun Annotation:

~~~java
Deprecated deprecated = PaymentService.class
        .getAnnotation(Deprecated.class);

Annotation[] declared = PaymentService.class
        .getDeclaredAnnotations();

Audit[] audits = PaymentService.class
        .getAnnotationsByType(Audit.class);
~~~

Các API này trả lời các câu hỏi khác nhau:

- `getAnnotation(...)` dùng ngữ nghĩa **present** theo định nghĩa của `AnnotatedElement`;
- `getDeclaredAnnotation(...)` / `getDeclaredAnnotations()` chỉ nhìn khai báo hiện tại;
- `getAnnotationsByType(...)` phù hợp khi annotation có thể lặp lại và cần xử lý ngữ nghĩa của annotation chứa (container).

Reflection chỉ thấy annotation còn tồn tại lúc chạy. Annotation có retention `SOURCE` hoặc `CLASS` không tự xuất hiện qua các API lúc chạy này chỉ vì mã nguồn/class file từng có annotation đó.

~~~text
Mô-đun Annotation
→ định nghĩa hợp đồng siêu dữ liệu và retention

Mô-đun Reflection
→ đọc siêu dữ liệu RUNTIME và quyết định hành vi lúc chạy
~~~
