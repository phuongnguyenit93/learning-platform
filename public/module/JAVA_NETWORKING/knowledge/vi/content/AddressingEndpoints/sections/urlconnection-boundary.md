URLConnection là abstraction tổng quát lâu đời để truy cập tài nguyên thông qua protocol handler của URL. HttpURLConnection mở rộng mô hình đó với hành vi riêng cho HTTP.

Ví dụ:

~~~java
URLConnection connection =
        URI.create("https://example.com")
           .toURL()
           .openConnection();

connection.setConnectTimeout(3_000);
connection.setReadTimeout(3_000);
~~~

Hai timeout này thuộc **thao tác URLConnection**, không phải một DNS timeout toàn cục. Với HttpURLConnection, một đối tượng đại diện cho một request, trong khi kết nối transport phía dưới có thể được cách triển khai tái sử dụng.

Trong Java hiện đại, mã HTTP mới thường dễ mô hình hóa hơn với java.net.http.HttpClient vì API đó tách rõ cấu hình client có thể tái sử dụng, request, xử lý response body, hoàn tất đồng bộ/bất đồng bộ và tích hợp WebSocket.

Phần này giữ URLConnection vì nó vẫn là một phần của mô hình networking trong JDK và còn xuất hiện trong mã cũ/library APIs. Cơ chế HTTP hiện đại được học ở chương HttpClient.
