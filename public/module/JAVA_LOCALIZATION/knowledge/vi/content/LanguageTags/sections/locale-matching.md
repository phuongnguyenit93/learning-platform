Trong thực tế, một máy khách có thể không nói “chỉ dùng đúng `vi-VN`”. Nó có thể gửi một danh sách lựa chọn theo thứ tự ưu tiên, ví dụ tư duy như:

```text
ưu tiên 1 → vi-VN
ưu tiên 2 → vi
ưu tiên 3 → en-US
```

Ứng dụng lúc đó cần **đối chiếu Locale (locale matching)**: so danh sách máy khách mong muốn với danh sách Locale mà sản phẩm thật sự hỗ trợ rồi chọn kết quả phù hợp nhất.

Java Core cung cấp `Locale.LanguageRange` cùng các API `Locale.lookup(...)` / `Locale.filter(...)` cho bài toán đối chiếu theo dải ngôn ngữ (language ranges):

```java
List<Locale.LanguageRange> ranges = Locale.LanguageRange.parse(
        "vi-VN,vi;q=0.9,en-US;q=0.8"
);

List<Locale> supported = List.of(
        Locale.forLanguageTag("vi-VN"),
        Locale.US
);

Locale matched = Locale.lookup(ranges, supported);
```

Mô hình tư duy cần giữ là:

```text
thẻ ngôn ngữ
→ biểu diễn một Locale/lựa chọn

danh sách ưu tiên ngôn ngữ
→ nhiều lựa chọn có độ ưu tiên

đối chiếu Locale
→ chọn Locale được hỗ trợ phù hợp nhất
```

Khung làm việc (framework) web có thể thực hiện bước này thay ứng dụng, nhưng hiểu khái niệm giúp lập trình viên biết Locale đang dùng **đến từ quá trình lựa chọn**, không phải lúc nào cũng là một tag duy nhất do người dùng truyền thẳng vào.
