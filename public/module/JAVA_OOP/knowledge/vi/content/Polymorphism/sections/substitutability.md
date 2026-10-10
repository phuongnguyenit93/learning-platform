### KHÁI NIỆM — gán được về mặt kiểu chưa đủ

Java có thể cho phép:

```java
Parent value = new Child();
```

nhưng điều đó chỉ chứng minh **khả năng tương thích kiểu (type compatibility)**.

Về mặt thiết kế, `Child` chỉ thực sự là một kiểu con tốt nếu nó vẫn đáp ứng những kỳ vọng quan trọng mà bên gọi có đối với `Parent`.

Ví dụ một kiểu con nên giữ các kỳ vọng như:

- không bất ngờ thu hẹp đầu vào hợp lệ một cách vô lý;
- kết quả sau khi gọi phương thức vẫn giữ các cam kết quan trọng;
- invariant vẫn đúng;
- side effect và cách báo lỗi không phá giả định của hợp đồng chung.

Đây là tư duy gần với **Liskov Substitution Principle**, nhưng ở mức Java Core ta có thể dùng một câu hỏi đơn giản hơn:

> Nếu thay cách triển khai mà bên gọi không biết, hành vi có vẫn hợp lý theo hợp đồng chung không?

### TRƯỜNG HỢP VI PHẠM — tương thích kiểu nhưng không tương thích hành vi

Giả sử hợp đồng `Account` khiến bên gọi có lý do hợp lý để tin rằng mọi tài khoản đều hỗ trợ `withdraw(...)`:

```java
class Account {
    void withdraw(int amount) {
        // hợp đồng rút tiền thông thường
    }
}

class FixedAccount extends Account {
    @Override
    void withdraw(int amount) {
        throw new UnsupportedOperationException();
    }
}
```

Java vẫn cho phép:

```java
Account account = new FixedAccount();
```

Nhưng nếu mọi bên gọi của `Account` đều phải thêm ngoại lệ riêng cho `FixedAccount`, quan hệ kiểu con đã không còn bảo toàn kỳ vọng hành vi chung.

```text
gán được theo hệ thống kiểu
≠
thay thế tốt theo hợp đồng hành vi
```

### MINH CHỨNG — `SubstitutabilityController#substituteImplementations()`

Ví dụ thực thi truyền nhiều cách triển khai vào cùng một phương thức nhận `Formatter`:

```text
run(new Upper())
run(new Lower())
```

Method `run(...)` chỉ biết hợp đồng của `Formatter`. Nó không cần phân nhánh để xử lý riêng từng cách triển khai.

### THỰC HÀNH — dấu hiệu khả năng thay thế đang yếu

Nếu mã thường xuyên phải viết:

```java
if (payment instanceof SpecialPayment) {
    // xử lý riêng vì kiểu con này không làm theo hợp đồng chung
}
```

hãy kiểm tra lại trừu tượng hóa hoặc quan hệ kiểu con.

### MỐI LIÊN HỆ — câu hỏi tiếp theo

Ta vừa thấy phương thức bị ghi đè được chọn lúc chạy. Nhưng Java còn có:

- `overloading` được chọn chủ yếu lúc biên dịch;
- che khuất phương thức `static`;
- che khuất trường dữ liệu.

Nếu không tách rõ các cơ chế này, rất dễ hiểu sai đa hình. Chương tiếp theo tập trung vào chính sự khác biệt đó.
