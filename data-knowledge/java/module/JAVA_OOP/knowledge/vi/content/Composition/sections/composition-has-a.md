### KHÁI NIỆM

Với kết hợp đối tượng, một đối tượng giữ tham chiếu tới đối tượng khác và giao một phần công việc cho đối tượng đó.

```java
final class Checkout {
    private final Pricing pricing;

    Checkout(Pricing pricing) {
        this.pricing = pricing;
    }

    int total(int base) {
        return pricing.price(base);
    }
}
```

Ta có thể nói:

```text
Checkout has-a Pricing
```

`Checkout` **có một** `Pricing`, chứ `Checkout` không phải là một loại `Pricing`.

Vì vậy `Checkout extends Pricing` sẽ không thể hiện đúng mối quan hệ của bài toán.

### THUẬT NGỮ — “composition” có hai cách dùng phổ biến

Trong thảo luận OOP, **kết hợp đối tượng (object composition)** thường được dùng theo nghĩa rộng: xây một đối tượng bằng cách ghép các đối tượng cộng tác lại với nhau thay vì kế thừa phần triển khai.

Trong mô hình hóa UML/đối tượng, **composition** còn có nghĩa hẹp hơn: một quan hệ toàn thể–thành phần với quyền sở hữu mạnh và vòng đời của thành phần gắn chặt với toàn thể.

Chapter này dùng cả hai ngữ cảnh, vì vậy cần nhìn câu hỏi đang được trả lời:

```text
composition như kỹ thuật thiết kế
→ ghép đối tượng / ủy quyền hành vi thay vì extends

composition như quan hệ UML
→ quyền sở hữu mạnh + ngữ nghĩa vòng đời
```

Hai cách dùng liên quan nhưng **không đồng nghĩa hoàn toàn**. Một đối tượng giữ một đối tượng cộng tác để ủy quyền chưa đủ để kết luận đó là composition theo UML.

### VÌ SAO — dùng lại hoặc thay đổi hành vi mà không cần kế thừa

Nếu mục tiêu là thay cách tính giá, composition cho phép truyền vào các cách triển khai khác nhau:

```text
Regular
Discount
SeasonalPricing
...
```

mà không cần biến `Checkout` thành một cây kế thừa gồm nhiều class con.

Điểm thay đổi được khoanh vùng ở đối tượng cộng tác (`Pricing`) thay vì ở chính `Checkout`.

### MINH CHỨNG — `CompositionController#strategySwap()`

Ví dụ thực thi tạo:

```text
new Checkout(new Regular())
new Checkout(new Discount())
```

Class `Checkout` không thay đổi. Chỉ đối tượng `Pricing` được thay thế.

Kết quả cho thấy hành vi tính giá thay đổi trong khi kiểu của `Checkout` vẫn giữ nguyên.
