`this` là tham chiếu tới đối tượng hiện tại trong ngữ cảnh của một thể hiện.

Nó thường được dùng để:

- phân biệt trường dữ liệu với tham số cùng tên;
- truyền đối tượng hiện tại sang phương thức khác;
- gọi hàm khởi tạo khác bằng `this(...)`;
- khi cần, trả về chính đối tượng hiện tại trong API kiểu nối chuỗi lời gọi.

```java
class BankAccount {
    private final String id;
    private int balance;

    BankAccount(String id) {
        this(id, 0);
    }

    BankAccount(String id, int balance) {
        this.id = id;
        this.balance = balance;
    }
}
```

Ở đây `this(id, 0)` gọi lại hàm khởi tạo **trong cùng lớp**, còn `this.id = id` truy cập trường dữ liệu của đối tượng hiện tại.

Không có `this` trong ngữ cảnh `static` vì thành viên `static` không gắn với một đối tượng cụ thể.
