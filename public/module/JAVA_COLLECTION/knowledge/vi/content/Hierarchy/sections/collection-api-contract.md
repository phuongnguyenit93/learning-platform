Phần lớn lớp triển khai của `Collection<E>` chia sẻ một tập thao tác cơ bản. Học một lần ở đây giúp không phải học lại cùng một nhóm phương thức cho từng `List`, `Set` hay `Queue`:

| Ý định | thao tác chung |
| --- | --- |
| số phần tử | `size()` |
| collection có rỗng không | `isEmpty()` |
| có chứa giá trị không | `contains(value)` |
| lấy giao thức duyệt | `iterator()` |
| thêm một phần tử | `add(value)` |
| xóa một phần tử khớp | `remove(value)` |
| xóa các phần tử thỏa điều kiện | `removeIf(predicate)` |
| xóa toàn bộ | `clear()` |
| có chứa toàn bộ phần tử của collection khác | `containsAll(other)` |
| thêm toàn bộ | `addAll(other)` |
| xóa những phần tử cũng có trong collection khác | `removeAll(other)` |
| chỉ giữ phần giao | `retainAll(other)` |

```java
Collection<Order> selected = new ArrayList<>();
selected.add(orderA);
selected.add(orderB);

boolean hasOrderA = selected.contains(orderA);
boolean hasAll = selected.containsAll(List.of(orderA, orderB));

selected.remove(orderA);
selected.addAll(List.of(orderC, orderD));
```

Các phương thức thay đổi dữ liệu trong `Collection` là **các thao tác tùy chọn (optional operations)**. Interface công bố thao tác tồn tại, nhưng một collection cụ thể có thể cố ý không hỗ trợ thay đổi dữ liệu và ném `UnsupportedOperationException`. Ví dụ `List.of(...)` vẫn trả về một `List`, nhưng `add/remove/clear` trên nó không được hỗ trợ.

Khi API bên ngoài yêu cầu mảng, `toArray` là ranh giới chuyển đổi chuẩn:

```java
Order[] orderArray = selected.toArray(new Order[0]);
Object[] objectArray = selected.toArray();
```

`toArray()` không tham số trả `Object[]`; `toArray(new Order[0])` yêu cầu kết quả có kiểu thành phần lúc chạy là `Order[]`. Đây là phép chuyển dạng biểu diễn tại thời điểm gọi, không biến mảng và collection thành cùng một cấu trúc có thể thay đổi. Một phiên bản nạp chồng dùng hàm tạo sẽ được nhắc ngay sau khi cú pháp tham chiếu phương thức được giới thiệu.
