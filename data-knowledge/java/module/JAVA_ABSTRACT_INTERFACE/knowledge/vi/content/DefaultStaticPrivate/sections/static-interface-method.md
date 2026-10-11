Phương thức `static` thuộc về chính kiểu interface. Nó hữu ích khi thao tác gắn chặt với hợp đồng nhưng không cần trạng thái của một đối tượng cụ thể:

```java
interface PaymentMethod {
    void pay(int amount);

    static void validate(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("amount must be positive");
        }
    }
}

PaymentMethod.validate(100);
```

Nó **không được kế thừa** bởi lớp triển khai hoặc interface con. Cách gọi đúng đi qua chính tên interface khai báo phương thức, ví dụ `PaymentMethod.validate(...)`; không gọi như phương thức của đối tượng và cũng không dựa vào tên interface con như thể phương thức đã được kế thừa.

Phương thức `static` trong interface phù hợp cho thao tác tạo đối tượng, kiểm tra hợp lệ hoặc hỗ trợ gắn chặt với hợp đồng nhưng độc lập với trạng thái của từng đối tượng. Tuy vậy, việc đặt phương thức ở interface vẫn cần có ngữ nghĩa rõ ràng; không nên biến interface thành nơi chứa các tiện ích không liên quan.
