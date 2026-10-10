Hai `Map` bằng nhau khi chúng biểu diễn cùng tập ánh xạ `khóa → giá trị`. Thứ tự duyệt và lớp triển khai cụ thể không quyết định `Map.equals`.

```java
Map<Long, String> a = new HashMap<>();
a.put(1L, "A");
a.put(2L, "B");

Map<Long, String> b = new LinkedHashMap<>();
b.put(2L, "B");
b.put(1L, "A");

System.out.println(a.equals(b)); // true
```

Tính bằng nhau của khóa/giá trị bên trong vẫn dựa vào quy tắc tính bằng nhau của chính chúng. Chi tiết thiết kế `equals/hashCode` thuộc module **Quy ước của Object**; ở đây cần nhớ rằng thay đổi cách triển khai thứ tự không tự làm hai Map khác nhau nếu các ánh xạ vẫn giống nhau.
