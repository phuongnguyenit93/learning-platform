`LinkedHashMap` giữ ánh xạ như HashMap nhưng đồng thời duy trì thứ tự duyệt. Có hai chế độ quan trọng.

### thứ tự chèn

Constructor thông thường giữ thứ tự khóa được chèn lần đầu:

```java
Map<Long, Order> orders = new LinkedHashMap<>();
orders.put(30L, order30);
orders.put(10L, order10);
orders.put(20L, order20);

System.out.println(orders.keySet()); // [30, 10, 20]
```

`put` lại giá trị cho một khóa đã có không tự động biến nó thành khóa mới ở cuối theo ngữ nghĩa thứ tự chèn thông thường.

### thứ tự truy cập

Constructor có tham số `accessOrder = true` dùng thứ tự truy cập thay vì thứ tự chèn:

```java
Map<Long, Order> recent = new LinkedHashMap<>(16, 0.75f, true);
recent.put(1L, order1);
recent.put(2L, order2);
recent.put(3L, order3);

recent.get(1L);
System.out.println(recent.keySet()); // [2, 3, 1]
```

Chế độ này là nền tảng hữu ích cho một số mẫu cache/LRU, nhưng cache dùng trong hệ thống thực tế còn có chính sách loại bỏ, xử lý đồng thời và bộ nhớ riêng; `LinkedHashMap` chỉ cung cấp cơ chế thứ tự nền.

Trong Java 21, `LinkedHashMap` triển khai `SequencedMap`. API có thể truy cập entry đầu/cuối, định vị rõ ràng và khung nhìn đảo thứ tự mà không cần tự chuyển qua List khóa. Điều này làm thứ tự duyệt trở thành một khả năng rõ ràng trong hệ thống kiểu.
