Text Block vẫn xử lý chuỗi ký tự thoát theo quy tắc của Java và có ngữ nghĩa riêng cho ký tự kết thúc dòng/dấu đóng.

Không phải mọi `\` đều biến mất, và Text Block không có nghĩa là “chuỗi thô (raw string)”. Nếu cần chính xác hành vi của dấu gạch chéo ngược hoặc ký tự xuống dòng, hãy kiểm tra giá trị String cuối cùng.

### `\s` giữ một khoảng trắng có chủ ý

```java
String value = """
        red  \s
        green\s
        """;
```

`\s` được chuyển thành một khoảng trắng sau bước xử lý thụt lề phát sinh, nên hữu ích khi khoảng trắng cuối dòng là dữ liệu thật.

### Nối dòng trong mã nguồn

Dấu gạch chéo ngược (backslash) ở cuối dòng vật lý có thể loại bỏ ký tự kết thúc dòng đó:

```java
String sentence = """
        hello \
        world
        """;
```

Đây là ngữ nghĩa ký tự thoát của mã nguồn, không phải thao tác sửa String khi chạy.

### Thứ tự xử lý quan trọng

Ở mức mô hình tư duy:

```text
chuẩn hóa ký tự kết thúc dòng
→ loại khoảng trắng phát sinh
→ xử lý chuỗi ký tự thoát
→ giá trị String
```

Điều này giải thích vì sao `\s` có thể bảo toàn khoảng trắng mà khoảng trắng trình bày trong mã nguồn thông thường có thể bị loại.

### translateEscapes

`translateEscapes()` hữu ích khi **String lúc chương trình đang chạy** chứa ký hiệu ký tự thoát và ứng dụng có chủ ý muốn diễn giải chúng:

```java
String escaped = "line1\\nline2";
String translated = escaped.translateEscapes();

System.out.println(translated);
```

```text
văn bản khi chạy "\\n"
→ translateEscapes()
→ ký tự xuống dòng
```

Điều này khác với xử lý ký tự thoát của literal trong mã nguồn Java: ký tự thoát trong mã nguồn được trình biên dịch xử lý khi biên dịch, còn `translateEscapes()` là một thao tác String khi chương trình chạy. Đặc biệt, nó **không diễn giải Unicode escape dạng `\\uXXXX`**; chuỗi như `"\\u0041"` không biến thành `"A"` qua `translateEscapes()` mà là đầu vào escape không hợp lệ cho API này.

Không chạy `translateEscapes()` trên đầu vào người dùng tùy ý chỉ vì thấy dấu gạch chéo ngược; việc diễn giải ký hiệu ký tự thoát phải là một phần rõ ràng của hợp đồng đầu vào.
