Hàm khởi tạo nên thiết lập những điều kiện để trạng thái luôn hợp lệ (`invariant`) ngay khi đối tượng trở nên sử dụng được.

```java
class BankAccount {
    private final String id;
    private int balance;

    BankAccount(String id, int openingBalance) {
        if (openingBalance < 0) throw new IllegalArgumentException();
        this.id = id;
        this.balance = openingBalance;
    }
}
```

Sau hàm khởi tạo, bên gọi không nên nhận một đối tượng “nửa hợp lệ” rồi phải gọi thêm nhiều phương thức gán bắt buộc mới dùng được.
