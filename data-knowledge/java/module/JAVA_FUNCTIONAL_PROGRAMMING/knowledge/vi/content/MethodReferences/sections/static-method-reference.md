Tham chiếu tới phương thức `static` có dạng `TypeName::staticMethod`. Các tham số của giao diện hàm đích được truyền vào phương thức `static` theo đúng thứ tự.

```java
Function<String, Integer> parse = Integer::parseInt;
BinaryOperator<Integer> max = Math::max;
```

Với `parse`, đối số của `Function.apply(String)` được đưa vào `Integer.parseInt(String)`. Với `max`, hai đối số của `BinaryOperator` trở thành hai đối số của `Math.max`.

Kiểu đích vẫn rất quan trọng khi phương thức `static` bị nạp chồng. Chỉ riêng phần chữ trước và sau `::` chưa đủ để Java luôn chọn được đúng phiên bản nạp chồng.
