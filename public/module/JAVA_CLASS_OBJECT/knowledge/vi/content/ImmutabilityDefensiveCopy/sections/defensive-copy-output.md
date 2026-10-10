Phương thức getter không nên trả trực tiếp tham chiếu tới trạng thái nội bộ có thể thay đổi nếu bên gọi không được phép sửa trạng thái đó.

Có thể dùng:

- giá trị bất biến hoặc khung nhìn không cho sửa phù hợp;
- `List.copyOf(...)`;
- bản sao mới tùy hợp đồng.

Trong `BankAccountSnapshot` ở trên, `List.copyOf(tags)` trả về kết quả không cho phép sửa thay vì làm lộ danh sách nội bộ:

```java
snapshot.tags().add("VIP"); // UnsupportedOperationException
```

Phân biệt khung nhìn không cho sửa với tính bất biến sâu: khung nhìn có thể cấm bên gọi sửa dữ liệu qua nó nhưng dữ liệu bên dưới vẫn có thể thay đổi ở nơi khác.
