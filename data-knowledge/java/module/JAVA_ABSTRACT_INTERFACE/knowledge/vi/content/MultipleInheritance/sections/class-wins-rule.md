Nếu hệ phân cấp lớp đã cung cấp một **phương thức cụ thể của đối tượng** tương thích, phương thức đó được ưu tiên hơn phương thức `default` của interface:

```java
class Named {
    public String name() {
        return "class";
    }
}

interface NamedContract {
    default String name() {
        return "interface";
    }
}

class CardPayment extends Named implements NamedContract {
}
```

Với `new CardPayment().name()`, phần triển khai từ `Named` được dùng. Phương thức `default` của interface không âm thầm thay thế hành vi cụ thể đã được thừa hưởng từ hệ phân cấp lớp.

Điểm cần phân biệt: nếu lớp cha chỉ khai báo một phương thức abstract cùng chữ ký, lớp cụ thể vẫn phải cung cấp một phần triển khai hợp lệ; quy tắc **lớp được ưu tiên** không nên được hiểu như một phép chọn ở thời điểm chạy giữa hai phần thân luôn có sẵn.

Một phương thức `static` từ phía lớp cũng không thể “nhường chỗ” để phương thức `default` của interface trở thành phương thức của đối tượng. Nếu chữ ký xung đột với hợp đồng interface, Java báo lỗi biên dịch thay vì chọn `default`.
