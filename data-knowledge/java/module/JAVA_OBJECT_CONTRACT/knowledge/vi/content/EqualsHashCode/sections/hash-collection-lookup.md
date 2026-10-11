Ở mức mô hình tư duy, có thể hiểu quá trình tra cứu với **khóa khác `null`** như sau:

```text
khóa cần tra cứu
    ↓
key.hashCode()
    ↓
cấu trúc dữ liệu dùng mã băm để thu hẹp nhóm ứng viên
    ↓
duyệt các ứng viên phù hợp
    ↓
equals(...)
    ↓
khớp / không khớp
```

Đây là **mô hình ở mức ranh giới hành vi**, không phải mô tả đầy đủ mọi chi tiết triển khai nội bộ của một phiên bản `HashMap`. Java có thể tối ưu cách xử lý va chạm và cấu trúc bên trong; đối tượng của bạn chỉ cần tuân thủ quy ước mà cấu trúc dữ liệu dựa vào.

`HashMap` còn hỗ trợ khóa `null` bằng cách xử lý riêng ở mức triển khai, nên không nên đọc sơ đồ trên thành “Java luôn gọi `hashCode()` trên mọi khóa có thể có”.

### MINH CHỨNG VỚI `HashSet`

```java
Set<UserId> ids = new HashSet<>();
ids.add(new UserId("U-100"));

System.out.println(ids.contains(new UserId("U-100")));
```

Để kết quả là `true`, hai đối tượng có định danh khác nhau phải:

```text
bằng nhau về mặt logic
        +
mã băm nhất quán
```

`HashSet` không cần đúng chính tham chiếu ban đầu để đoạn mã sử dụng tìm lại một giá trị tương đương về mặt logic.

### `HashMap` CŨNG DỰA TRÊN CÙNG QUY ƯỚC

```java
Map<UserId, String> names = new HashMap<>();
names.put(new UserId("U-100"), "An");

String name = names.get(new UserId("U-100"));
```

Đoạn mã sử dụng thường kỳ vọng `name` là `"An"`. Điều đó chỉ hợp lý khi lớp dùng làm khóa định nghĩa `equals` và `hashCode` nhất quán.
