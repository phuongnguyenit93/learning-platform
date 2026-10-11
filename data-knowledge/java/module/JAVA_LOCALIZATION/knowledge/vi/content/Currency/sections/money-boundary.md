Mô-đun Bản địa hóa (Localization) chịu trách nhiệm **trình bày**, không thay thế một mô hình tiền tệ hoàn chỉnh.

Các câu hỏi nghiệp vụ như:

```text
có cho cộng USD với EUR không?
tỷ giá lấy ở thời điểm nào?
làm tròn khi tính thuế?
số chữ số thập phân khi lưu DB?
phân bổ phần dư khi chia tiền?
```

không thể giải quyết chỉ bằng `Currency` hoặc `NumberFormat`.

Một đối tượng giá trị tối thiểu có thể có dạng:

```java
record Money(BigDecimal amount, Currency currency) {}
```

Sau khi tầng nghiệp vụ đã cho ra `Money`, tầng bản địa hóa mới định dạng. Ví dụ sau **cố ý dùng số chữ số thập phân mặc định của `Currency` như một chính sách hiển thị**, không phải như quy tắc làm tròn nghiệp vụ:

```java
String displayUsingCurrencyDefaultDigits(Money money, Locale locale) {
    NumberFormat format = NumberFormat.getCurrencyInstance(locale);
    format.setCurrency(money.currency());

    int fractionDigits = money.currency().getDefaultFractionDigits();
    if (fractionDigits >= 0) {
        format.setMinimumFractionDigits(fractionDigits);
        format.setMaximumFractionDigits(fractionDigits);
    }

    return format.format(money.amount());
}
```

Ứng dụng thực tế có thể chọn chính sách hiển thị khác. Điều quan trọng là không giả định `setCurrency(...)` tự đồng bộ số chữ số thập phân, và không để `NumberFormat` quyết định thay quy tắc làm tròn/số chữ số của nghiệp vụ.

Đây chính là ranh giới đã học ở chương Mô hình tư duy: **nghiệp vụ giữ ý nghĩa; Locale quyết định cách trình bày**.

Chương tiếp theo chuyển sang một vấn đề ít rõ ràng hơn nhưng cùng bản chất: thứ tự chữ cái mà người dùng mong đợi không nhất thiết giống thứ tự code unit của `String`. Để sắp xếp văn bản cho con người, Java có `Collator`.
