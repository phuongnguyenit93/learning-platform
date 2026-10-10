`Map.Entry<K, V>` đại diện cho **một ánh xạ riêng lẻ** bên trong Map: một khóa đi cùng giá trị hiện tại của nó.

```java
for (Map.Entry<Long, Order> entry : orderById.entrySet()) {
    Long id = entry.getKey();
    Order order = entry.getValue();
    System.out.println(id + " -> " + order);
}
```

Khi thuật toán cần cả khóa lẫn giá trị, `entrySet()` cho đúng đơn vị dữ liệu cần duyệt và tránh mẫu “duyệt khóa rồi lại `get(key)`”. Một số entry dạng khung nhìn cho phép `setValue`, nhưng đây là thao tác tùy chọn và phụ thuộc quy ước của Map cụ thể; mã nguồn không nên giả định mọi `Map.Entry` đều sửa được.

Ba khung nhìn dạng Collection giúp duyệt Map theo các góc khác nhau:

```java
Set<Long> keys = orderById.keySet();
Collection<Order> values = orderById.values();
Set<Map.Entry<Long, Order>> entries = orderById.entrySet();
```

Khi cần cả khóa và giá trị, duyệt `entrySet()` thường rõ ràng hơn gọi `get(key)` sau khi duyệt khóa:

```java
for (Map.Entry<Long, Order> entry : orderById.entrySet()) {
    System.out.println(entry.getKey() + " -> " + entry.getValue());
}
```

Chính sách `null` và thứ tự phụ thuộc cách triển khai. `HashMap` cho phép một khóa `null` và nhiều giá trị `null`; `Map.of(...)` từ chối cả hai. Không nên dùng `get(key) == null` để phân biệt “không có ánh xạ” với “ánh xạ tới null” nếu cách triển khai cho phép giá trị `null`; khi cần phân biệt, dùng `containsKey`.

`Map` cơ bản không hứa một thứ tự duyệt chung. Từ Java 21, `SequencedMap` **chuẩn hóa** nhóm thao tác `first`/`last`/`reversed` cho những Map tham gia mô hình trừu tượng này. Tuy nhiên “có thứ tự xác định” không đồng nghĩa “phải là `SequencedMap`”: `EnumMap`, chẳng hạn, duyệt theo thứ tự khai báo enum nhưng không triển khai `SequencedMap`.
