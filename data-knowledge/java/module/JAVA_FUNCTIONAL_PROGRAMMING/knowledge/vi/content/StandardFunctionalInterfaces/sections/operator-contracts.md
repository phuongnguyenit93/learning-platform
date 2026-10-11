Các giao diện toán tử giữ quan hệ cùng kiểu: `UnaryOperator<T>` là biến thể chuyên biệt của `Function<T, T>`, còn `BinaryOperator<T>` là biến thể chuyên biệt của `BiFunction<T, T, T>`.

`UnaryOperator<T>` nhận một giá trị `T` và tạo ra một giá trị `T`:

```java
UnaryOperator<String> normalize = text -> text.trim().toLowerCase();
```

`BinaryOperator<T>` nhận hai giá trị `T` và tạo ra một giá trị `T`:

```java
BinaryOperator<Integer> max = (left, right) -> Math.max(left, right);
```

Dùng các giao diện này khi quan hệ "cùng kiểu" mang ý nghĩa. `UnaryOperator<String>` nói rõ "String vào, String ra" hơn `Function<String, String>`, còn `BinaryOperator<Integer>` thể hiện việc gộp hai giá trị cùng miền kiểu thành một giá trị cùng kiểu.
