Vòng `for-each` là cú pháp giúp mã nguồn sử dụng giao thức duyệt mà không phải tự quản lý iterator.

```java
for (Order order : orders) {
    System.out.println(order.id());
}
```

Với một đối tượng thực hiện `Iterable<Order>`, có thể hình dung trình biên dịch chuyển logic thành dạng gần như:

```java
for (Iterator<Order> it = orders.iterator(); it.hasNext(); ) {
    Order order = it.next();
    System.out.println(order.id());
}
```

Đây là mô hình tư duy, không phải yêu cầu rằng bytecode phải có đúng hình thức trên. Điểm quan trọng là vòng `for-each` phụ thuộc vào quy ước duyệt thay vì vào `ArrayList`, `HashSet` hay một cách triển khai cụ thể.

Mảng cũng dùng được vòng lặp `for-each`:

```java
Order[] array = {orderA, orderB};
for (Order order : array) {
    System.out.println(order.id());
}
```

Mảng là trường hợp riêng của ngôn ngữ; nó không triển khai `Iterable` và không tạo `Iterator` theo quy ước Collection.

Vòng `for-each` phù hợp khi chỉ cần đọc/xử lý từng phần tử. Nó không cung cấp trực tiếp:

- chỉ số hiện tại;
- API `Iterator.remove()`;
- điều khiển hai iterator song song;
- khả năng dừng/chia quá trình duyệt theo `Spliterator`.

Khi thuật toán cần những khả năng đó, dùng trực tiếp API duyệt sẽ rõ hơn.
