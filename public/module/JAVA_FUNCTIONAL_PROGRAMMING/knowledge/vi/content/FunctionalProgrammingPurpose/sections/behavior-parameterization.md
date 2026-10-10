Khi hành vi có một kiểu rõ ràng, phương thức có thể nhận hành vi đó như tham số:

```java
List<String> select(
        List<String> names,
        Predicate<String> rule) {

    List<String> result = new ArrayList<>();
    for (String name : names) {
        if (rule.test(name)) {
            result.add(name);
        }
    }
    return result;
}
```

Bên gọi quyết định biến thể xử lý mà không cần sửa `select`:

```java
select(names, name -> name.length() >= 5);
select(names, name -> name.startsWith("A"));
```

Cách tổ chức này thường được gọi là **tham số hóa hành vi (behavior parameterization)**: thuật toán ổn định nằm ở một chỗ, còn quy tắc hoặc hành động có thể thay đổi được truyền từ bên ngoài vào.

Ý tưởng này xuất hiện ở hàm gọi lại, `Comparator`, quy tắc kiểm tra dữ liệu, công việc trì hoãn và nhiều API khác trong Java. Các chương sau sẽ giải thích hệ kiểu giúp những hành vi này an toàn như thế nào.
