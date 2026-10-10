`List.of`, `Set.of` và `Map.of`/`Map.ofEntries` tạo ra collection **không cho phép sửa** có nội dung được xác định ngay lúc tạo. Không có collection nguồn có thể thay đổi bên ngoài để sau đó thay đổi cấu trúc phía sau như `Collections.unmodifiableList(source)`.

```java
List<String> users = List.of("U01", "U02", "U03");
Set<String> roles = Set.of("USER", "ADMIN");
Map<String, Integer> limits = Map.of(
        "STANDARD", 10,
        "PREMIUM", 100
);
```

Các quy ước quan trọng:

- Các phương thức tạo này không chấp nhận `null` phần tử/khóa/giá trị.
- `List.of` cho phép phần tử trùng nhau.
- `Set.of` từ chối đối số trùng nhau.
- `Map.of`/`Map.ofEntries` từ chối khóa trùng.
- Không nên dựa vào thứ tự duyệt của `Set.of` hoặc `Map.of` như một quy ước nghiệp vụ.

Cụm “phương thức tạo collection bất biến” đôi khi được dùng trong trao đổi, nhưng về mặt API Java mô tả kết quả là **không cho phép sửa**. Nếu phần tử bên trong có thể thay đổi, trạng thái của phần tử vẫn có thể đổi:

```java
List<StringBuilder> values = List.of(new StringBuilder("A"));
values.getFirst().append("B");

System.out.println(values); // [AB]
```

Collection không thêm/xóa/thay thế phần tử được, còn bản thân `StringBuilder` vẫn có thể thay đổi.
