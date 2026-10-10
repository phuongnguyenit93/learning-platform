`super` cho phép truy cập hàm khởi tạo hoặc thành viên của lớp cha theo quy tắc của Java.

```java
class SavingsAccount extends BankAccount {
    private final int interestRate;

    SavingsAccount(String id, int balance, int interestRate) {
        super(id, balance);
        this.interestRate = interestRate;
    }
}
```

`super(id, balance)` khởi tạo phần `BankAccount` trước khi hàm khởi tạo của `SavingsAccount` thiết lập trạng thái riêng của lớp con.

`super` không phải một đối tượng thứ hai nằm bên trong đối tượng lớp con. Vẫn chỉ có một đối tượng; từ khóa này thay đổi cách mã nguồn chọn thành viên hoặc hàm khởi tạo của lớp cha.
