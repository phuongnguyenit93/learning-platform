`Collections` là **lớp tiện ích**, không phải interface `Collection<E>`. Nó chứa nhiều thuật toán tĩnh làm việc trên collection/List đã có. Không cần học thuộc toàn bộ API; các thao tác đại diện giúp thấy vai trò của lớp tiện ích này:

```java
List<Integer> values = new ArrayList<>(List.of(30, 10, 20));

Collections.sort(values);          // [10, 20, 30]
Collections.reverse(values);       // [30, 20, 10]
Collections.shuffle(values);       // đổi thứ tự ngẫu nhiên

int min = Collections.min(values);
int max = Collections.max(values);
```

Với mã nguồn hiện đại, `list.sort(comparator)` thường trực tiếp hơn `Collections.sort(list, comparator)`, nhưng cả hai đều cho thấy cùng ý tưởng: **thuật toán có thể tách khỏi lớp triển khai List cụ thể**.

`binarySearch` có điều kiện tiên quyết quan trọng: List phải được sắp theo **cùng thứ tự** dùng để tìm kiếm.

```java
List<Integer> sorted = new ArrayList<>(List.of(10, 20, 30, 40));
int index = Collections.binarySearch(sorted, 30); // 2
```

Nếu List chưa được sắp xếp hoặc thứ tự dùng khi tìm kiếm không khớp thứ tự đã sắp, kết quả không có ý nghĩa. Khi không tìm thấy, phương thức trả một giá trị âm mã hóa vị trí chèn; bên gọi không nên hiểu mọi số âm đơn giản là “chỉ số -1”.

Các tiện ích như `reverse`, `shuffle`, `sort` thay đổi List nếu List hỗ trợ thay đổi dữ liệu. Với List không cho phép sửa như `List.of(...)`, tiện ích thay đổi dữ liệu có thể ném `UnsupportedOperationException`. Đây là lý do luôn phải đọc **cả quy ước của thuật toán lẫn quy ước về khả năng thay đổi của collection đầu vào**.
