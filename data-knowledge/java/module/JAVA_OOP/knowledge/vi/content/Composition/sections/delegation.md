**Ủy quyền (delegation)** là việc một đối tượng nhận yêu cầu rồi chuyển một phần công việc cho đối tượng cộng tác phù hợp.

```java
int total(int base) {
    return pricing.price(base);
}
```

`Checkout` không cần biết công thức giảm giá. Nó chỉ cần biết hợp đồng `Pricing`.

### MỐI LIÊN HỆ — ủy quyền dẫn tới trừu tượng hóa

Để kết hợp đối tượng linh hoạt, `Checkout` không nên phụ thuộc vào chi tiết của `Discount` hay `Regular`.

Nó nên phụ thuộc vào một hợp đồng ổn định như `Pricing`.

Đây chính là cầu nối sang **trừu tượng hóa (abstraction)**.

### PHÂN BIỆT — kết hợp đối tượng và ủy quyền

Hai thuật ngữ thường đi cùng nhau nhưng không đồng nghĩa:

```text
Composition
→ A giữ/có đối tượng cộng tác B như một phần của cấu trúc đối tượng

Delegation
→ A nhận yêu cầu rồi giao một trách nhiệm cụ thể cho B thực hiện
```

Trong ví dụ xuyên suốt của mô-đun, `Checkout` có thể giữ một `Pricing` mà không có nghĩa mọi hành vi của `Checkout` đều thuộc về `Pricing`. Khi `Checkout.total(...)` gọi `pricing.price(...)`, **chính trách nhiệm tính giá** được ủy quyền sang đối tượng cộng tác `Pricing`.

```text
Checkout
→ sở hữu trách nhiệm điều phối checkout

Pricing
→ sở hữu trách nhiệm tính giá

Checkout.total(...)
→ ủy quyền phần tính giá cho Pricing.price(...)
```

### ĐÁNH ĐỔI

Nếu mỗi thao tác đơn giản đều được chuyển qua quá nhiều lớp trung gian, mã sẽ trở nên rườm rà.

Ủy quyền có giá trị khi đối tượng được giao việc thực sự có trách nhiệm hoặc điểm biến đổi riêng, chứ không chỉ tồn tại để chuyển tiếp lời gọi.
