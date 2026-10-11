Lambda gồm danh sách tham số, dấu `->`, rồi tới thân biểu thức hoặc thân khối.

```java
// Không có tham số
Supplier<Long> now = () -> System.currentTimeMillis();

// Một tham số; có thể bỏ dấu ngoặc tròn
Predicate<String> nonEmpty = text -> !text.isEmpty();

// Nhiều tham số
Comparator<String> byLength =
        (left, right) -> Integer.compare(left.length(), right.length());

// Thân khối
Function<String, Integer> parse = text -> {
    String trimmed = text.trim();
    return Integer.parseInt(trimmed);
};
```

Thân biểu thức phù hợp khi một biểu thức đã diễn đạt rõ hành vi. Thân khối phù hợp khi cần nhiều câu lệnh, biến cục bộ hoặc `return` tường minh.

Không nên cố ép nhiều bước nghiệp vụ vào một biểu thức chỉ để lambda ngắn hơn. Mục tiêu là giảm phần cú pháp thừa nhưng vẫn giữ luồng xử lý dễ đọc.
