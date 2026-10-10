### KHÁI NIỆM

`class` là định nghĩa kiểu và phần triển khai chung: trường dữ liệu, phương thức, hàm khởi tạo, kiểu lồng nhau và logic khởi tạo.

`object` là một thể hiện của lớp khi chương trình chạy, có:

- danh tính riêng;
- trạng thái riêng của từng đối tượng;
- hành vi được định nghĩa bởi lớp và kiểu thực tế khi chạy.

```java
BankAccount first = new BankAccount("A-01");
BankAccount second = new BankAccount("A-02");
```

`first` và `second` dùng cùng định nghĩa `BankAccount` nhưng là hai đối tượng có danh tính riêng và có thể mang trạng thái khác nhau.

### VÌ SAO GOM TRẠNG THÁI VÀ HÀNH VI VÀO ĐỐI TƯỢNG?

Giả sử số dư tài khoản chỉ là một biến số nguyên bị nhiều đoạn mã sửa trực tiếp. Mỗi nơi sử dụng đều phải tự nhớ các quy tắc như “không được rút quá số dư”, và chỉ cần một nơi quên là trạng thái có thể mất hợp lệ. Lớp cho phép đặt trạng thái cùng các hành vi bảo vệ điều kiện hợp lệ vào một ranh giới rõ ràng:

```java
class BankAccount {
    private int balance;

    void withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalArgumentException();
        }
        balance -= amount;
    }
}
```

Điểm quan trọng không chỉ là Java có cú pháp `class`. Đối tượng trở thành nơi sở hữu trạng thái và những quy tắc giữ cho trạng thái đó có ý nghĩa. Mô-đun OOP sẽ đi sâu hơn về đóng gói và thiết kế hướng đối tượng; mô-đun này trước hết xây nền về mô hình lớp/đối tượng và quá trình một đối tượng được tạo, sử dụng và chia sẻ.
