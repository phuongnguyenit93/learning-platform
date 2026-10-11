Ba tên gần giống nhau nhưng vai trò khác hẳn:

- `Collection<E>` là interface gốc cho các **nhóm phần tử** như `List`, `Set`, `Queue`;
- `Collections` là lớp tiện ích chứa các thuật toán/hàm hỗ trợ tĩnh như `sort`, `reverse`, `binarySearch` và các phương thức tạo lớp bọc;
- **Java Collections Framework (JCF)** là toàn bộ hệ thống gồm interface, lớp triển khai và các thuật toán/tiện ích liên quan.

`Map<K, V>` thuộc Java Collections Framework nhưng không kế thừa `Collection<E>`; phần tiếp theo sẽ giải thích tại sao.

Sau khi hiểu **vì sao cần một collection**, hệ phân cấp mới có ý nghĩa: nó trả lời câu hỏi **“nhóm dữ liệu này cần hành vi nào?”**.

Lộ trình cấp cao của module là:

```text
Vì sao Collections Framework tồn tại?
        ↓
Những mô hình dữ liệu cốt lõi giải quyết các nhu cầu nào?
List / Set / Map / Queue / Deque
        ↓
Làm sao duyệt chúng qua một giao thức chung?
Iterator / ListIterator / ranh giới Spliterator
        ↓
Thứ tự, so sánh và điều hướng hoạt động ra sao?
        ↓
Tính bằng nhau và hash ảnh hưởng tra cứu thế nào?
        ↓
Ai sở hữu quyền thay đổi dữ liệu, khung nhìn và fail-fast ảnh hưởng ra sao?
        ↓
Chọn lớp triển khai hoặc cấu trúc chuyên biệt như thế nào?
```

Bốn chương tiếp theo sẽ mở rộng chặng học thứ hai thành `List`, `Set`, `Map` và `Queue`/`Deque`. Các chương sau đó nhìn lại những mô hình này qua góc độ duyệt dữ liệu, thứ tự, tính bằng nhau/hash, quyền thay đổi và lựa chọn lớp triển khai. Ở cuối module, mục tiêu là nhìn vào **hành vi cần có** rồi chọn interface và lớp triển khai phù hợp, thay vì chọn `ArrayList` hoặc `HashMap` theo thói quen.
