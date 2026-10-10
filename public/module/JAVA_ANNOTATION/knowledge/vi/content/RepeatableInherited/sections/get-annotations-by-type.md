> **Ranh giới cho người mới:** bạn cần hiểu vì sao API `...ByType(...)` tồn tại và cách `@Inherited` ảnh hưởng kết quả. Không cần học toàn bộ Reflection API; module `reflection` sẽ sở hữu phần đó.

Trước khi nhìn API, cần phân biệt bốn khái niệm tra cứu mà Java dùng:

```text
directly present (xuất hiện trực tiếp)
→ Annotation T được gắn trực tiếp lên phần tử

indirectly present (xuất hiện gián tiếp)
→ Annotation T nằm bên trong Annotation chứa của một Annotation lặp lại

present (được xem là hiện diện)
→ directly present
→ hoặc, với class + @Inherited, được tìm thấy qua superclass theo quy tắc của Java

associated (được liên kết với phần tử khi tra cứu theo type)
→ directly present hoặc indirectly present
→ hoặc, với class + @Inherited, tìm ngược lên superclass khi phần tử hiện tại không có associated annotation của T
```

Từ đó các API quen thuộc có thể đọc như sau:

| API | Annotation chứa của dạng lặp | Tra cứu superclass với `@Inherited` |
| --- | --- | --- |
| `getDeclaredAnnotation(T)` | không mở Annotation chứa | không |
| `getAnnotation(T)` | không mở Annotation chứa | có với class khi `T` là `@Inherited` |
| `getDeclaredAnnotationsByType(T)` | có | không |
| `getAnnotationsByType(T)` | có | có với class khi `T` là `@Inherited` |
| `isAnnotationPresent(T)` | cùng ngữ nghĩa tra cứu một Annotation như `getAnnotation(T) != null` | tương ứng |

Đây là lý do không nên dùng `getAnnotation(T)` rồi mong nó “tự hiểu” mọi giá trị lặp.

Khi làm việc với Annotation lặp lại, API phù hợp thường là:

```java
Method method = PaymentService.class.getDeclaredMethod("transfer");

Audit[] audits = method.getAnnotationsByType(Audit.class);
```

`getAnnotationsByType(Audit.class)` hiểu ngữ nghĩa Annotation lặp lại/Annotation chứa và trả về các `Audit` riêng lẻ.

Ngược lại:

```java
Audit audit = method.getAnnotation(Audit.class);
```

không phải API tốt để đọc một Annotation lặp lại. Khi chỉ có một `@Audit` trực tiếp, lời gọi có thể trả về Annotation đó. Sau khi thêm Annotation thứ hai, siêu dữ liệu có thể được chứa qua Annotation chứa và `getAnnotation(Audit.class)` không còn cho kết quả như mã nguồn cũ mong đợi.

Đây là một rủi ro tương thích quan trọng:

> Nếu kiểu Annotation có thể lặp lại, thành phần đọc nên dùng API `*AnnotationsByType` thay vì giả định chỉ có một instance.

### Tra cứu khai báo trực tiếp và tra cứu kế thừa

`getDeclaredAnnotationsByType(T)`:

- chỉ xem siêu dữ liệu khai báo tại phần tử hiện tại;
- mở Annotation chứa;
- không đi lên superclass.

`getAnnotationsByType(T)` trên `Class`:

- mở Annotation chứa;
- có thể áp dụng ngữ nghĩa `@Inherited`;
- chỉ tìm ngược lên superclass khi class hiện tại không có associated annotation của type đó.

Điều này có nghĩa Annotation vừa lặp lại vừa kế thừa **không được cộng dồn từ mọi superclass**.
