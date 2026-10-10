### CƠ CHẾ — Java chọn phương thức như thế nào?

Với một **phương thức đối tượng bị ghi đè**, Java tách quá trình thành hai bước:

```text
Lúc biên dịch (compile time)
→ kiểm tra kiểu tham chiếu và kiểu tham số
→ xác định chữ ký phương thức hợp lệ

Lúc chạy (runtime)
→ nhìn vào class thực tế của đối tượng nhận lời gọi
→ chọn phần triển khai ghi đè cụ thể
```

Ví dụ:

```java
PaymentMethod payment = new CardPayment();
payment.pay(1000);
```

Trình biên dịch kiểm tra rằng `PaymentMethod` có phương thức `pay(...)` phù hợp. Khi chương trình chạy, nếu `CardPayment` ghi đè phương thức đó thì phần thân của `CardPayment` được thực thi.

Cơ chế này gọi là **phân phối động (dynamic dispatch)**.

### CƠ CHẾ — lời gọi bên trong đối tượng vẫn phân phối theo đối tượng nhận lời gọi thực tế

Phân phối động không chỉ xảy ra khi bên gọi bên ngoài trực tiếp gọi một phương thức ghi đè. Một phương thức của class cha gọi một phương thức đối tượng khác qua `this` cũng vẫn làm việc với **cùng đối tượng thực tế lúc chạy**:

```java
class PaymentMethod {
    void execute(int amount) {
        pay(amount); // vẫn là lời gọi được phân phối động qua this
    }

    void pay(int amount) {
        System.out.println("generic");
    }
}

class CardPayment extends PaymentMethod {
    @Override
    void pay(int amount) {
        System.out.println("card: " + amount);
    }
}

PaymentMethod payment = new CardPayment();
payment.execute(1000);
```

Flow là:

```text
payment.execute(...)
→ chạy PaymentMethod.execute(...)
→ execute gọi this.pay(...)
→ đối tượng nhận lời gọi thực tế vẫn là CardPayment
→ CardPayment.pay(...) chạy
```

Vì vậy không nên suy luận rằng “đang ở phần thân của `PaymentMethod` thì mọi lời gọi phương thức bên trong cũng cố định vào cách triển khai của `PaymentMethod`”. Với phương thức đối tượng có thể bị ghi đè, đối tượng nhận lời gọi thực tế lúc chạy vẫn quyết định phần thân cuối cùng.

### MINH CHỨNG — `PolymorphismController#dispatch()`

Ví dụ thực thi hiện có dùng:

```java
Speaker first = new Dog();
Speaker second = new Cat();
```

Cả hai biến đều có kiểu khai báo là `Speaker`, nhưng:

```text
first.speak()
→ hành vi của Dog

second.speak()
→ hành vi của Cat
```

Điểm cần quan sát là:

> **cùng kiểu khai báo nhưng hành vi lúc chạy có thể khác nhau**.

### GIỚI HẠN — không phải thành viên nào cũng dùng phân phối động

Phương thức đối tượng bị ghi đè có phân phối động.

Nhưng:

- phương thức `static` không hoạt động theo cách này;
- trường dữ liệu cũng không hoạt động theo cách này.

Sự khác biệt này sẽ được làm rõ ở chương `Overloading` và `Overriding`.
