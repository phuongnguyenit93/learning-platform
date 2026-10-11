Giải mã/mã hóa không phải lúc nào cũng thành công hoàn hảo.

- **đầu vào sai định dạng (malformed input)**: chuỗi đầu vào không hợp lệ về cấu trúc đối với thao tác mã hóa/giải mã đang thực hiện, ví dụ byte UTF-8 sai cấu trúc khi giải mã hoặc surrogate đứng riêng khi mã hóa;
- **ký tự không thể ánh xạ (unmappable character)**: ký tự không thể biểu diễn trong Charset đích.

`CharsetDecoder`/`CharsetEncoder` cho phép chọn chính sách như `REPORT`, `REPLACE` hoặc `IGNORE`. Với dữ liệu quan trọng, thay thế âm thầm có thể che mất lỗi dữ liệu; chính sách nên được chọn có chủ ý.

### Sai định dạng khác với không thể ánh xạ

```text
đầu vào sai định dạng
→ cấu trúc đầu vào không hợp lệ cho bộ giải mã/bộ mã hóa
→ ví dụ byte UTF-8 sai cấu trúc hoặc surrogate UTF-16 đứng riêng

ký tự không thể ánh xạ
→ ký tự đầu vào hợp lệ nhưng Charset đích không biểu diễn được
```

Bộ giải mã UTF-8 có thể gặp dãy byte sai định dạng. Bộ mã hóa có thể gặp một surrogate đứng riêng và coi đó là đầu vào sai định dạng. Ngược lại, ký tự `é` là Unicode hợp lệ nhưng khi mã hóa sang US-ASCII lại là trường hợp **không thể ánh xạ**, vì ASCII không biểu diễn được ký tự đó.

### API tiện dụng và kiểm tra nghiêm ngặt

`getBytes(Charset)` và `new String(bytes, charset)` phù hợp với nhiều trường hợp sử dụng, nhưng hợp đồng của hai phiên bản phương thức tiện dụng này là **thay thế (REPLACE)** đầu vào sai định dạng (malformed) hoặc không thể ánh xạ (unmappable) bằng giá trị thay thế của Charset thay vì báo lỗi cho bên gọi. Vì vậy, nếu cần phát hiện dữ liệu không hợp lệ, chọn `IGNORE`, hoặc tùy chỉnh chính sách xử lý, hãy dùng `CharsetEncoder` / `CharsetDecoder` với `CodingErrorAction.REPORT`, `REPLACE` hoặc `IGNORE` có chủ ý.

```text
tính toàn vẹn dữ liệu quan trọng
→ REPORT thường giúp báo lỗi ngay

hiển thị theo khả năng tốt nhất
→ REPLACE có thể phù hợp

IGNORE
→ dễ làm mất dữ liệu âm thầm, cần lý do rõ
```

Sau khi hiểu ranh giới văn bản ↔ byte, chương tiếp theo chuyển sang **biểu thức chính quy (Regex)** để mô tả, tìm kiếm và kiểm tra các mẫu văn bản.
