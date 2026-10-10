Chọn cách tạo dựa trên điều ta biết về giá trị đầu vào.

```java
Optional<String> none = Optional.empty();
Optional<String> known = Optional.of("Java");
Optional<String> maybe = Optional.ofNullable(valueFromLegacyApi);
```

`Optional.of(value)` yêu cầu `value` khác `null`; nếu không nó ném `NullPointerException`. `Optional.ofNullable(value)` chuyển `null` thành `Optional.empty()`.

Không nên dùng `ofNullable` theo thói quen cho mọi giá trị. Nếu dữ liệu lẽ ra bắt buộc phải khác `null`, việc chuyển im lặng sang trạng thái rỗng có thể che một lỗi thật sự.

Với API làm việc nhiều với kiểu nguyên thủy, JDK còn có `OptionalInt`, `OptionalLong` và `OptionalDouble`. Các kiểu này biểu diễn kết quả nguyên thủy có thể vắng mặt mà không phải bọc dữ liệu trong `Integer`, `Long` hoặc `Double`. Chúng là các kiểu riêng với tập API nhỏ hơn, không phải lớp con của `Optional<T>`.
