Truyền hành vi phù hợp khi thuật toán chính ổn định nhưng một quyết định bên trong cần thay đổi. Thay vì gắn cứng mọi biến thể bằng nhiều nhánh `if` hoặc nhiều lớp con, phương thức nhận quy tắc thay đổi đó qua tham số.

```java
static List<String> select(
        List<String> values,
        Predicate<String> rule) {
    List<String> result = new ArrayList<>();
    for (String value : values) {
        if (rule.test(value)) {
            result.add(value);
        }
    }
    return result;
}

List<String> longNames = select(names, name -> name.length() >= 5);
```

Bước thiết kế quan trọng là chọn đúng hợp đồng hàm. `Predicate<T>` truyền đạt rõ ý nghĩa "đưa ra quyết định đúng/sai" hơn một giao diện tự tạo với tên phương thức mơ hồ.
