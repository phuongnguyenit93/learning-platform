Một UI đôi khi không muốn hiển thị đầy đủ `1,200,000`, mà muốn dạng ngắn dễ đọc như “1.2M” hoặc dạng dài tương đương theo Locale.

Java 21 hỗ trợ **định dạng số rút gọn (compact number formatting)** thông qua `NumberFormat.getCompactNumberInstance(...)`.

```java
NumberFormat shortFormat = NumberFormat.getCompactNumberInstance(
        Locale.US,
        NumberFormat.Style.SHORT
);

NumberFormat longFormat = NumberFormat.getCompactNumberInstance(
        Locale.US,
        NumberFormat.Style.LONG
);

System.out.println(shortFormat.format(1_200_000));
System.out.println(longFormat.format(1_200_000));
```

Mô hình tư duy:

```text
giá trị số
→ 1_200_000

Locale + kiểu rút gọn
→ SHORT / LONG

CompactNumberFormat
→ cách biểu diễn rút gọn cho người dùng
```

`SHORT` và `LONG` không có nghĩa ứng dụng tự nối `K`, `M`, `B`. Mẫu rút gọn đến từ dữ liệu Locale, vì cách viết số rút gọn có thể khác giữa các ngôn ngữ.

Đây vẫn chỉ là **cách trình bày**. Giá trị nghiệp vụ phải tiếp tục giữ `1_200_000`, không lưu chuỗi rút gọn như giá trị số chính.

Định dạng rút gọn phù hợp cho bảng điều khiển, thẻ thống kê hoặc UI có không gian hẹp. Với hóa đơn, kế toán hoặc nơi độ chính xác phải nhìn thấy rõ, dạng đầy đủ thường phù hợp hơn.
