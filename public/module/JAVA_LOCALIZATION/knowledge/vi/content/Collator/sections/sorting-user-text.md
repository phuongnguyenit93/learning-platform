Khi sắp xếp một đối tượng theo tên đã bản địa hóa:

```java
record Product(String code, String displayName) {}

Collator collator = Collator.getInstance(locale);

products.sort(
        Comparator.comparing(Product::displayName, collator)
);
```

Cần lưu ý ba ranh giới:

1. **Locale của người dùng** quyết định thứ tự sắp xếp khi hiển thị, không nhất thiết Locale của máy chủ.
2. Nếu phân trang/sắp xếp diễn ra trong cơ sở dữ liệu, collation của DB mới là thứ thực thi. `Collator` phía Java không thể tự động làm DB sắp xếp giống hệt.
3. Nếu khóa sắp xếp được lưu vào bộ nhớ đệm/lưu bền, phải biết nó được tạo theo Locale/phiên bản quy tắc nào; không nên coi kết quả collation là định danh chuẩn.

Với khối lượng sắp xếp lớn, `CollationKey` có thể được dùng để chuẩn bị khóa so sánh nhiều lần:

```java
CollationKey key = collator.getCollationKey(text);
```

Nhưng đó là tối ưu sau khi ngữ nghĩa đã đúng; không nên bắt đầu bằng khóa bộ nhớ đệm phức tạp khi chỉ sắp xếp một danh sách nhỏ.

Chương tiếp theo quay lại ví dụ đơn hàng và xử lý ngày giờ: `Locale` quyết định **quy ước trình bày/phân tích**, còn `ZoneId` vẫn quyết định **thời gian địa phương tương ứng với một instant**.
