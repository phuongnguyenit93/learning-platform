Lớp lồng không `static` là lớp nội bộ và gắn với một đối tượng cụ thể của lớp bên ngoài:

```java
class BankAccount {
    private int balance;

    class BalanceView {
        int currentBalance() {
            return BankAccount.this.balance;
        }
    }
}
```

Mỗi `BalanceView` thuộc về một `BankAccount` cụ thể và có thể truy cập thành viên của đối tượng bên ngoài.

Cú pháp tạo đối tượng làm mối quan hệ này nhìn thấy rất rõ:

```java
BankAccount account = new BankAccount("A-01");
BankAccount.BalanceView view = account.new BalanceView();
```

Điều này tiện nhưng cũng tạo quan hệ phụ thuộc về thời gian tồn tại: giữ đối tượng lớp nội bộ có thể đồng thời khiến đối tượng bên ngoài tiếp tục còn được truy cập tới.
