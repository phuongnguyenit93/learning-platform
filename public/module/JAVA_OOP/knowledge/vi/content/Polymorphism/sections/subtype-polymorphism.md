### KHÁI NIỆM — một hợp đồng, nhiều cách thực hiện

Đa hình thông qua kiểu con (**subtype polymorphism**) cho phép đoạn mã phụ thuộc vào một kiểu chung nhưng làm việc với nhiều cách triển khai khác nhau.

```java
PaymentMethod payment = new CardPayment();
payment.pay(1000);
```

`CheckoutService` chỉ cần biết hợp đồng của `PaymentMethod`. Nó không nhất thiết phải biết đối tượng thực tế lúc chạy là thanh toán bằng thẻ, ví điện tử hay chuyển khoản.

### MÔ HÌNH TRONG JAVA — đa hình không yêu cầu kế thừa lớp

`PaymentMethod` có thể là một `interface`:

```java
interface PaymentMethod {
    void pay(int amount);
}

class CardPayment implements PaymentMethod {
    @Override
    public void pay(int amount) {
        System.out.println("card: " + amount);
    }
}

PaymentMethod payment = new CardPayment();
payment.pay(1000);
```

Ở đây không có `CardPayment extends PaymentMethod`, nhưng vẫn có đầy đủ chuỗi:

```text
CardPayment implements PaymentMethod
→ CardPayment là kiểu con của PaymentMethod
→ biến PaymentMethod có thể giữ CardPayment
→ lời gọi phương thức đối tượng vẫn được phân phối động theo đối tượng nhận lời gọi thực tế
```

Điều này rất quan trọng: **đa hình kiểu con rộng hơn kế thừa class**. Kế thừa class là một cách tạo kiểu con; triển khai `interface` là một cách khác. Các quy tắc chi tiết của `interface` thuộc mô-đun `abstract-interface`.

### MÔ HÌNH TƯ DUY — kiểu khai báo và kiểu thực tế lúc chạy

Với:

```java
PaymentMethod payment = new CardPayment();
```

cần giữ hai lớp thông tin tách biệt:

```text
PaymentMethod payment
↑ kiểu tĩnh / kiểu khai báo

new CardPayment()
↑ kiểu thực tế lúc chạy / đối tượng thực tế
```

Kiểu khai báo cho trình biên dịch biết **những thành viên nào hợp lệ để gọi qua biểu thức `payment`**. Kiểu thực tế lúc chạy trở nên quan trọng khi một phương thức đối tượng đã hợp lệ lại có nhiều cách triển khai ghi đè khác nhau.

Ví dụ:

```java
Animal animal = new Dog();

animal.sound(); // hợp lệ nếu Animal khai báo sound()
animal.bark();  // lỗi biên dịch nếu Animal không khai báo bark()
```

Dù đối tượng thực tế là `Dog`, trình biên dịch vẫn không cho gọi `bark()` qua biến `Animal` chỉ vì đối tượng thực tế có phương thức đó.

### VÌ SAO — giảm nhánh xử lý theo từng kiểu cụ thể

Không có đa hình, bên gọi thường phải tự phân loại đối tượng:

```text
nếu là CardPayment
→ xử lý kiểu thẻ

nếu là WalletPayment
→ xử lý kiểu ví

nếu là BankTransfer
→ xử lý kiểu chuyển khoản
```

Với đa hình:

```java
payment.pay(amount);
```

Bên gọi chỉ yêu cầu hành vi `pay`. Object cụ thể tự quyết định cách thực hiện.

Điều này không có nghĩa mọi `if` đều xấu. Lợi ích xuất hiện khi nhánh điều kiện chỉ tồn tại vì bên gọi đang tự chọn hành vi dựa trên kiểu đối tượng.

### MỐI LIÊN HỆ — đa hình cần một hợp đồng có ý nghĩa

Phân phối động chỉ thực sự hữu ích khi các cách triển khai tuân theo cùng một hợp đồng hành vi.

Nếu mỗi kiểu con có quy tắc hoàn toàn khác nhau đến mức bên gọi vẫn phải xử lý riêng từng loại, thiết kế đa hình chỉ còn mang tính hình thức.
