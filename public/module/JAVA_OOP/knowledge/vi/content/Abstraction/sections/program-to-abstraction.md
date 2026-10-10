### KHÁI NIỆM

“Program to abstraction” có nghĩa là thành phần sử dụng nên phụ thuộc vào **vai trò hoặc hợp đồng ổn định**, thay vì phụ thuộc vào một cách triển khai cụ thể nếu điều đó không cần thiết.

```java
final class Checkout {
    private final Pricing pricing;

    Checkout(Pricing pricing) {
        this.pricing = pricing;
    }
}
```

`Checkout` biết `Pricing`.

Nó không cần biết chính xác đối tượng được truyền vào là:

```text
Regular
Discount
SeasonalPricing
```

### VÌ SAO — giảm lượng kiến thức mà bên sử dụng phải biết

Nếu cách triển khai thay đổi nhưng hợp đồng vẫn giữ nguyên, `Checkout` có thể không cần sửa.

Đây là nền tảng để:

- đa hình mang lại khả năng thay thế;
- kết hợp đối tượng cho phép thay đối tượng cộng tác;
- khi kiểm thử, dễ thay phần triển khai thật bằng phần triển khai giả khi cần.

### ĐÁNH ĐỔI — không tạo `interface` cho mọi class một cách máy móc

Một tầng trừu tượng chỉ đáng tồn tại khi nó biểu diễn một vai trò hoặc ranh giới có ý nghĩa.

Ví dụ nó có thể hữu ích khi:

- có nhiều cách triển khai;
- cần một điểm thay thế rõ ràng;
- cần ranh giới kiến trúc;
- cần tách bên sử dụng khỏi chi tiết hạ tầng.

Nếu chỉ tạo:

```text
FooInterface
FooImpl
```

cho mọi class mà không có lý do cụ thể, ta chỉ thêm một lớp trung gian mà chưa chắc giảm phụ thuộc thực sự.

### THỰC HÀNH — kiểm tra hướng phụ thuộc

Hãy hỏi thành phần sử dụng:

> Nó thực sự cần khả năng nào, hay nó đang phụ thuộc vào class cụ thể chỉ vì tiện?

Nếu bên sử dụng chỉ cần một tập nhỏ hành vi ổn định, đó có thể là dấu hiệu nên phụ thuộc vào một trừu tượng nhỏ hơn.
