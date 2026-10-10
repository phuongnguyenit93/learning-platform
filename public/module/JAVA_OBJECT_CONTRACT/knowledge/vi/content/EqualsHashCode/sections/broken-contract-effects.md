Một lỗi kinh điển là ghi đè `equals` nhưng giữ `hashCode` mặc định:

```java
final class BrokenUserId {
    private final String value;

    BrokenUserId(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object other) {
        return other instanceof BrokenUserId that
                && Objects.equals(value, that.value);
    }

    // cố ý KHÔNG ghi đè hashCode
}
```

Hai đối tượng có thể:

```text
a.equals(b) == true

nhưng

a.hashCode() != b.hashCode()
```

Khi đó ta có thể quan sát:

- `HashSet` trông như chứa hai giá trị logic bị trùng;
- `HashMap.get(equalKey)` không tìm thấy phần tử đã đưa vào;
- `contains` trả `false` dù một đối tượng bằng nhau về mặt logic đang tồn tại.

### TRƯỜNG HỢP LỖI KHÔNG CÓ NGHĨA CẤU TRÚC DỮ LIỆU BỊ HỎNG

Cấu trúc dữ liệu đang vận hành với giả định rằng khóa tuân thủ quy ước. Nếu đối tượng phá vỡ quy ước, thư viện không thể tự sửa lại ngữ nghĩa nghiệp vụ cho bạn.
