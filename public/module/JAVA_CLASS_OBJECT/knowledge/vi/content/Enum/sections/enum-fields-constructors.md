Enum có thể giữ dữ liệu và hành vi. Ví dụ một loại tài khoản có thể mang mã bên ngoài ổn định:

```java
enum AccountTier {
    STANDARD("STD"),
    PREMIUM("PRM");

    private final String code;

    AccountTier(String code) {
        this.code = code;
    }

    String code() {
        return code;
    }
}
```

Hàm khởi tạo của enum không được gọi trực tiếp từ mã ứng dụng; nó phục vụ việc khởi tạo các hằng đã khai báo.
