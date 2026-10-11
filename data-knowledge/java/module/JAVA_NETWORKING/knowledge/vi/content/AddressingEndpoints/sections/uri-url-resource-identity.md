URI và URL nằm gần networking APIs nhưng bài toán chính của chúng là **định danh tài nguyên**, không phải socket addressing.

Một URI có thể có dạng:

~~~text
scheme://authority/path?query#fragment
~~~

Ví dụ:

~~~java
URI uri =
        URI.create("https://api.example.com/orders/42?detail=true");
~~~

Trong URI này, authority có thể dẫn tới network endpoint, còn path/query biểu diễn định danh và ngữ nghĩa ở tầng protocol/ứng dụng.

URL gắn với việc truy cập tài nguyên thông qua protocol handler và có thể mở URLConnection. URI phù hợp hơn cho việc biểu diễn, kiểm tra và thao tác identifier. Các API hiện đại như HttpRequest nhận URI làm request target.

Quy tắc thực tế:

- cần biểu diễn identifier → ưu tiên URI;
- cần socket endpoint → SocketAddress / InetSocketAddress;
- cần HTTP client hiện đại → HttpClient + HttpRequest với URI.

Đừng parse URL bằng cách cắt chuỗi thủ công; abstraction chuẩn giúp xử lý encoding, authority, IPv6 literal và ngữ nghĩa của relative reference đúng hơn.
