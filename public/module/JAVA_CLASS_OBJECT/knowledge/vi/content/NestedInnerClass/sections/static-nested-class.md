Lớp lồng `static` được khai báo với `static` và **không tự giữ tham chiếu tới đối tượng của lớp bên ngoài**.

```java
class BankAccount {
    static class Builder {
        BankAccount build() {
            return new BankAccount("A-01");
        }
    }
}
```

Nó gần giống một lớp bình thường về ngữ nghĩa đối tượng, chỉ được đặt trong phạm vi tên của lớp bên ngoài. Cách này phù hợp cho kiểu phụ có quan hệ logic mạnh với `BankAccount` nhưng không cần trạng thái của một tài khoản cụ thể.

Ta có thể tạo nó mà không cần một đối tượng `BankAccount`:

```java
BankAccount.Builder builder = new BankAccount.Builder();
```
