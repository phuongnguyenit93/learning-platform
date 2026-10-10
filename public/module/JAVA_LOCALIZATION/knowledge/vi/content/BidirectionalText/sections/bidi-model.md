**Văn bản hai chiều (bidirectional/bidi text)** là văn bản chứa hoặc có thể chứa các đoạn có hướng viết khác nhau.

Hai khái niệm quan trọng:

```text
thứ tự logic (logical order)
→ thứ tự ký tự được lưu trong String / thứ tự nội dung logic

thứ tự hiển thị (visual order)
→ thứ tự/vị trí mà hình dạng ký tự (glyph) được trình bày trên màn hình sau khi áp dụng quy tắc bidi
```

Ta cần phân biệt chúng vì văn bản Unicode nên giữ **thứ tự logic** để xử lý dữ liệu nhất quán, còn bộ dựng hiển thị áp dụng Unicode Bidirectional Algorithm để quyết định cách hiển thị.

Nếu lập trình viên tự đảo ngược chuỗi để “hỗ trợ tiếng Ả Rập”, dữ liệu rất dễ hỏng — đặc biệt khi văn bản chứa số, dấu câu hoặc đoạn tiếng Anh nằm giữa tiếng Ả Rập/tiếng Do Thái.
