### KHÁI NIỆM — đóng gói là gì?

Đóng gói là việc **kiểm soát quyền truy cập vào trạng thái và chi tiết triển khai**, để bên ngoài tương tác thông qua những hành vi có ý nghĩa thay vì tự điều khiển mọi chi tiết bên trong.

`private` là một cơ chế của Java hỗ trợ đóng gói, nhưng `private` không phải bản thân khái niệm đóng gói.

Ví dụ sau dùng trường `private` nhưng ranh giới vẫn yếu:

```java
class Account {
    private int balance;

    int getBalance() { return balance; }
    void setBalance(int balance) { this.balance = balance; }
}
```

Đoạn mã bên ngoài vẫn có thể gọi:

```java
account.setBalance(-100);
```

Field đã được ẩn về mặt cú pháp, nhưng quy tắc “số dư không được âm” vẫn chưa được bảo vệ.

Một cách thiết kế tốt hơn là công khai hành vi theo đúng ý định:

```java
class Account {
    private int balance = 100;

    void withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            throw new IllegalArgumentException("invalid withdrawal");
        }
        balance -= amount;
    }
}
```

### VÌ SAO — điều cần che giấu thực sự là gì?

Mục tiêu không phải là biến mọi trường thành “bí mật”. Điều quan trọng là bên ngoài không nên phụ thuộc vào **cách lưu dữ liệu và cách ra quyết định nội bộ** nếu đó không phải trách nhiệm của nó.

Nếu sau này `balance` đổi từ `int` sang một kiểu `Money`, đoạn mã chỉ gọi `withdraw(...)` có thể không cần sửa. Ngược lại, đoạn mã tự đọc `balance`, tự tính toán rồi gọi setter sẽ phụ thuộc chặt vào cách biểu diễn dữ liệu cũ.

### MỐI LIÊN HỆ — đóng gói và trừu tượng hóa khác nhau thế nào?

Hai khái niệm thường đi cùng nhau nhưng trả lời hai câu hỏi khác nhau:

```text
Đóng gói (Encapsulation)
→ ai được phép thấy hoặc thay đổi trạng thái và chi tiết triển khai?

Trừu tượng hóa (Abstraction)
→ bên sử dụng thực sự cần nhìn thấy hợp đồng và hành vi nào?
```

Ta sẽ quay lại trừu tượng hóa ở cuối mô-đun. Ở đây chỉ cần nhớ: từ khóa kiểm soát truy cập là công cụ; **ranh giới có ý nghĩa mới là mục tiêu**.

### CẠM BẪY — trường `private` nhưng trạng thái có thể thay đổi vẫn có thể bị lộ

Đóng gói không chỉ bị phá bởi setter. Một đối tượng cũng có thể làm lộ **cách biểu diễn dữ liệu bên trong** thông qua tham chiếu tới dữ liệu có thể thay đổi:

```java
class Order {
    private final List<String> items = new ArrayList<>();

    public List<String> getItems() {
        return items;
    }
}
```

Bên gọi có thể làm:

```java
order.getItems().clear();
```

Trường `items` vẫn là `private`, nhưng bên gọi đã nhận đúng tham chiếu mà `Order` đang dùng nội bộ và có thể sửa trạng thái mà không đi qua bất kỳ quy tắc nào của `Order`.

Vì vậy cần phân biệt:

```text
trường private
≠
trạng thái bên trong tự động được bảo vệ

tham chiếu có thể thay đổi bị lộ ra ngoài
→ bên gọi có thể sửa cách biểu diễn dữ liệu bên trong
→ điều kiện bất biến vẫn có thể bị phá
```

Tùy hợp đồng, đối tượng có thể trả về bản sao, một góc nhìn chỉ đọc hoặc chỉ cung cấp những thao tác có ý nghĩa thay vì công khai trực tiếp collection có thể thay đổi. Chi tiết API của collection thuộc mô-đun `collection`; ở đây điều cần giữ là mô hình tư duy về **việc làm lộ cách biểu diễn dữ liệu bên trong**.
