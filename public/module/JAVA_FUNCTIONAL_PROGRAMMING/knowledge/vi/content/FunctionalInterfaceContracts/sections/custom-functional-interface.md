Nên tạo giao diện hàm riêng khi ý nghĩa nghiệp vụ cần một tên rõ hơn so với giao diện tổng quát, hoặc khi hợp đồng cần đặc điểm mà các giao diện chuẩn không mô tả được, chẳng hạn một ngoại lệ được kiểm tra (checked exception) cụ thể.

```java
@FunctionalInterface
interface DiscountPolicy {
    BigDecimal discountFor(Order order);
}
```

So với `Function<Order, BigDecimal>`, tên `DiscountPolicy` cho biết ngay vai trò của hành vi tại nơi sử dụng:

```java
BigDecimal checkout(Order order, DiscountPolicy policy) {
    return order.total().subtract(policy.discountFor(order));
}
```

Nếu giao diện chuẩn đã diễn đạt đủ rõ hợp đồng thì nên dùng lại giao diện chuẩn. Nếu tên miền nghiệp vụ, tài liệu API hoặc khả năng tiến hóa của hợp đồng quan trọng hơn, giao diện hàm tự định nghĩa thường dễ đọc hơn.
