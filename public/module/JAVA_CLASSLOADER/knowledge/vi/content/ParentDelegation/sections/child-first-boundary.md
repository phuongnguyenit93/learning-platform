Một số container, plugin framework hoặc application server cần plugin dùng dependency version riêng. Khi đó họ có thể xây chiến lược gần với child-first:

```text
yêu cầu nạp class
→ thử nguồn của child/plugin trước
→ nếu không có mới delegate parent
```

Mục đích thường là tách biệt:

```text
host dùng library v1
plugin A dùng library v2
plugin B dùng library v3
```

Nhưng child-first mở ra nhiều rủi ro:

- class identity bị nhân đôi;
- `ClassCastException` dù binary name giống nhau;
- library singleton/static state bị nhân đôi;
- SPI/provider discovery thấy type từ loader khác;
- một dependency tưởng là dùng chung nhưng thực tế bị plugin che khuất;
- hành vi khác nhau theo thứ tự lookup của loader.

Một chiến lược tùy chỉnh thường cần ranh giới rõ:

```text
parent-first bắt buộc
→ java.*
→ Plugin API dùng chung
→ logging facade / contract muốn chia sẻ

child-first có chọn lọc
→ implementation dependency riêng của plugin
```

Không nên override `loadClass` chỉ để “thử cho biết”. Nếu parent-first đáp ứng yêu cầu, `findClass` là điểm mở rộng đơn giản và ít lỗi hơn.
