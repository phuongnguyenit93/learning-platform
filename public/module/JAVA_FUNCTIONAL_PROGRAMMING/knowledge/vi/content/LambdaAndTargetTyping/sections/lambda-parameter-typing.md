Trong phần lớn trường hợp, trình biên dịch suy ra kiểu tham số lambda từ kiểu hàm của giao diện đích:

```java
BiFunction<Integer, Integer, Integer> add = (left, right) -> left + right;
```

Cũng có thể viết kiểu tường minh:

```java
BiFunction<Integer, Integer, Integer> add =
        (Integer left, Integer right) -> left + right;
```

Từ Java 11, có thể dùng `var` cho tham số lambda khi cần chú thích (annotation) hoặc muốn thể hiện thống nhất kiểu khai báo:

```java
BiFunction<Integer, Integer, Integer> add =
        (var left, var right) -> left + right;
```

Trong cùng một danh sách tham số lambda, phải dùng nhất quán một kiểu khai báo. Không trộn tham số được suy luận với tham số khai báo kiểu tường minh hoặc `var`.

Suy luận kiểu chỉ giúp bỏ lặp cú pháp; tham số lambda vẫn có kiểu thời điểm biên dịch rõ ràng do giao diện hàm đích quyết định.
