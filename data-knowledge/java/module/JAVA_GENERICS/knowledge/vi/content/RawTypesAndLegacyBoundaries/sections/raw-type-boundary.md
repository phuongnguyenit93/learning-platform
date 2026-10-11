Nếu phải tích hợp legacy API:

```java
static List<String> legacyNames() {
    List raw = LegacyApi.loadNames();
    List<String> result = new ArrayList<>();

    for (Object value : raw) {
        if (!(value instanceof String)) {
            throw new IllegalStateException("Unexpected value: " + value);
        }
        result.add((String) value);
    }

    return result;
}
```

Cách này kiểm tra từng phần tử rồi **sao chép sang một `List<String>` mới**. Nhờ đó phần còn lại của ứng dụng không còn giữ một tham chiếu tới chính danh sách thô và không phụ thuộc vào việc mã cũ có tiếp tục chèn sai kiểu sau lần kiểm tra hay không.

Nếu vì hiệu năng hoặc yêu cầu giữ nguyên **danh tính đối tượng** mà bắt buộc phải dùng chính danh sách cũ:

```java
return (List<String>) raw;
```

thì phép ép kiểu đó vẫn là unchecked. Khi đó **ranh giới tích hợp** phải bảo đảm một điều kiện bất biến mạnh hơn: không chỉ dữ liệu hiện tại đúng kiểu, mà **không còn tham chiếu raw nào có thể thay đổi danh sách bằng giá trị sai kiểu về sau**. Nếu không bảo đảm được điều đó, sao chép/chuyển đổi là lựa chọn an toàn hơn.

Mẫu xử lý tốt:

```text
nguồn legacy/raw
        ↓
ranh giới nhỏ
        ↓
kiểm tra / chuyển đổi
        ↓
mã có kiểu rõ ràng phía trong ứng dụng
```

Nếu sau này cần bỏ qua cảnh báo có chủ đích (suppress warning), hãy đặt suppression ở phạm vi nhỏ nhất và giải thích rõ điều kiện bất biến nào khiến thao tác unchecked đó an toàn.

Raw type cho thấy phần lớn bảo vệ của Generics diễn ra khi biên dịch. Chương tiếp theo giải thích cơ chế nền giúp khả năng tương thích này tồn tại: **type erasure**.
