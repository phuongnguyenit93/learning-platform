`Function<T, R>` mô tả phép biến đổi từ một giá trị đầu vào kiểu `T` thành một kết quả kiểu `R`.

Phương thức hàm của nó có dạng:

```java
R apply(T value);
```

Ví dụ:

```java
Function<String, Integer> length = text -> text.length();

int result = length.apply("Java"); // 4
```

Dùng `Function` khi hợp đồng cốt lõi là **đầu vào → đầu ra**. Đầu ra có thể cùng kiểu với đầu vào, nhưng nếu quan hệ đó luôn đúng thì `UnaryOperator<T>` thường diễn đạt ý định rõ hơn.

`Function` cũng phù hợp với việc kết hợp hành vi vì đầu ra của hàm này có thể trở thành đầu vào của hàm khác. Quy tắc kết hợp sẽ được học ở chương sau.
