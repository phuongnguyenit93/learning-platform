Tên `@Inherited` dễ khiến người học suy luận quá rộng. Nó không có nghĩa “siêu dữ liệu được kế thừa giống method”.

Ví dụ:

```java
class BaseService {
    @Audit(action = "BASE")
    public void process() {
    }
}

class PaymentService extends BaseService {
    @Override
    public void process() {
    }
}
```

Method `PaymentService.process()` không tự mang `@Audit(action = "BASE")` chỉ vì nó override method của superclass. Tra cứu Annotation trên method không dùng `@Inherited`.

Tương tự:

- field annotation không tự truyền xuống subclass field;
- constructor hoặc parameter annotation không tự truyền;
- interface annotation không đi sang implementing class qua `@Inherited`;
- tra cứu kế thừa ở cấp class chỉ hoạt động nếu kiểu Annotation có `@Inherited` và siêu dữ liệu còn tồn tại ở thời gian chạy.

### Lặp lại + kế thừa không có nghĩa là gộp toàn bộ

Giả sử superclass có:

```java
@Tag("base-a")
@Tag("base-b")
class Base {
}
```

và subclass có:

```java
@Tag("child")
class Child extends Base {
}
```

Nếu `@Tag` vừa lặp lại vừa có `@Inherited`, tra cứu “theo type” trên `Child` dùng tập Annotation associated tại class hiện tại; nó không mặc định trả `child + base-a + base-b` như một phép gộp toàn bộ hierarchy.

Đây là khác biệt giữa:

```text
kế thừa theo cơ chế tìm ngược
và
cộng dồn toàn bộ chuỗi kế thừa
```

Kế thừa Annotation của Java là cơ chế tra cứu tìm ngược theo quy tắc xác định, không phải cơ chế framework tự gộp cấu hình.

### Ranh giới với module Reflection

Module Annotation cần hiểu các API tra cứu trên để giải thích ngữ nghĩa của `@Repeatable` và `@Inherited`. Các chủ đề sâu hơn như `Class`, `Method`, kiểm soát truy cập và gọi method bằng Reflection thuộc module `reflection`.

Chương tiếp theo chuyển sang một thành phần đọc hoàn toàn khác: **bộ xử lý Annotation chạy khi biên dịch**, trước khi ứng dụng được khởi động.
