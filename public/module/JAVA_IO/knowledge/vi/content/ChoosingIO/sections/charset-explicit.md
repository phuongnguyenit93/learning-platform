Khi văn bản đi qua một **ranh giới dựa trên byte** như tệp hoặc luồng byte, bước mã hóa/giải mã tạo thành cầu nối:

~~~text
bytes
↔ Charset mã hóa/giải mã
↔ ký tự / String
~~~

Với định dạng văn bản được lưu/truyền bằng byte, charset là một phần của quy ước dữ liệu. Nguồn ký tự thuần trong bộ nhớ như `StringReader` không thực hiện bước chuyển đổi byte/charset. Với định dạng tệp đã thống nhất UTF-8, hãy viết rõ:

~~~java
String text =
        Files.readString(path, StandardCharsets.UTF_8);

Files.writeString(
        target,
        text,
        StandardCharsets.UTF_8
);
~~~

Với cầu nối từ byte stream:

~~~java
try (
        InputStream in = Files.newInputStream(path);
        Reader reader =
                new InputStreamReader(in, StandardCharsets.UTF_8)
) {
    // đọc ký tự theo UTF-8
}
~~~

Từ JDK 18, bộ mã ký tự mặc định của các API Java chuẩn là UTF-8, trừ trường hợp phần triển khai được cấu hình theo cơ chế được hỗ trợ để dùng bộ mã khác. Tuy vậy, khi tệp hoặc giao thức đã định nghĩa một bộ mã cụ thể, mã vẫn nên truyền `Charset` đó rõ ràng: đây là quy ước của dữ liệu chứ không phải quyết định nên phụ thuộc vào giá trị mặc định của môi trường chạy.

Charset cũng giải thích tại sao không nên chuyển dữ liệu nhị phân tùy ý thành `String`:

~~~java
byte[] png = Files.readAllBytes(imagePath);
// new String(png, UTF_8) không biến PNG thành văn bản hợp lệ
~~~

Nếu dữ liệu là nhị phân, giữ nó ở dạng byte. Chỉ dùng Reader/Writer/String khi dữ liệu thực sự là văn bản có bộ mã xác định.
