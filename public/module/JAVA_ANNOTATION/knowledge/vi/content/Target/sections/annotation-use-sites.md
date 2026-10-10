Một khác biệt quan trọng là Annotation có thể mô tả **phần tử được khai báo** hoặc **type đang được sử dụng**.

Annotation trên phần khai báo gắn siêu dữ liệu vào chính phần tử được khai báo:

```java
@ComponentInfo
class PaymentService {

    @Audit(action = "PAYMENT")
    void pay(@RequestId String request) {
    }
}
```

Mỗi kiểu Annotation có thể có phạm vi áp dụng khác nhau: `@ComponentInfo` cho class, `@Audit` cho method, `@RequestId` cho parameter, hoặc nhiều ngữ cảnh nếu quy tắc cho phép.

Type-use annotation gắn siêu dữ liệu vào **một lần sử dụng type**:

```java
List<@NonNull String> names;

@NonNull String loadName() {
    return "Java";
}

String @NonNull [] values;
```

Đây là nền tảng để bộ kiểm tra kiểu hoặc công cụ phân tích tĩnh có thể diễn đạt các thuộc tính như nullness trên chính vị trí sử dụng type thay vì chỉ trên phần khai báo.

Mô hình tư duy:

```text
Annotation trên khai báo
→ mô tả phần tử được khai báo

TYPE_USE Annotation
→ mô tả type ở vị trí nó đang được sử dụng
```

Nếu một Annotation được cấu hình để cùng một vị trí trong mã nguồn hợp lệ ở cả ngữ cảnh khai báo và ngữ cảnh sử dụng type, vị trí đó có thể mang cả hai vai trò theo quy tắc của Java. Vì vậy Reflection tại thời gian chạy tách hai hướng quan sát: Annotation trên khai báo thường đi qua `AnnotatedElement`, còn type annotation đi qua họ `AnnotatedType`.

`@Target` là cơ chế quyết định những vị trí nào trong số đó thực sự hợp lệ cho từng kiểu Annotation.
