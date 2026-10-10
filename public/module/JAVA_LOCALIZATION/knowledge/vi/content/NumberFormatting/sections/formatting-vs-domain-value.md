Quy tắc nền tảng:

```text
BigDecimal / giá trị số nghiệp vụ
        ↓
tính toán, kiểm tra dữ liệu, lưu trữ
        ↓
chỉ khi đi ra ranh giới trình bày
        ↓
NumberFormat(locale)
        ↓
String cho người dùng
```

Không nên làm ngược:

```java
String formatted = format.format(total);
// rồi lưu chuỗi đã định dạng vào DB như giá trị số chính
```

String đã định dạng có thể mất độ chính xác hiển thị, thay cách nhóm chữ số hoặc không còn phù hợp để hệ thống khác phân tích tự động.

Trao đổi dữ liệu giữa các hệ thống cần một hợp đồng định dạng riêng, thường độc lập với Locale. Chỉ phần trình bày cho con người mới dùng bộ định dạng phụ thuộc Locale.

Chương tiếp theo thêm một chiều rất dễ bị nhầm với Locale: **tiền tệ (`Currency`)**. Locale có thể gợi ý cách hiển thị và loại tiền thường dùng tại một khu vực, nhưng tiền tệ của giao dịch phải là dữ liệu nghiệp vụ riêng.
