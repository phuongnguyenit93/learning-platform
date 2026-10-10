Chuyển tag thành `Locale`:

```java
Locale viVN = Locale.forLanguageTag("vi-VN");
```

Chuyển ngược lại:

```java
String tag = viVN.toLanguageTag();
System.out.println(tag); // vi-VN
```

Đây thường là dạng biểu diễn tốt hơn cho cấu hình/API so với tự nối:

```java
locale.getLanguage() + "_" + locale.getCountry()
```

BCP 47 dùng dấu `-`, còn một số tên gói tài nguyên/tệp lịch sử của Java dùng `_`; không nên nhầm hai quy ước.

```text
thẻ ngôn ngữ
→ vi-VN

hậu tố ResourceBundle truyền thống
→ Messages_vi_VN.properties
```
