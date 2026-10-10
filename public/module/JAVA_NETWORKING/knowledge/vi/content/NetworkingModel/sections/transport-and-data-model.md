Transport quyết định **dạng giao tiếp cơ bản mà ứng dụng nhìn thấy**.

Với TCP, ứng dụng nhận một **luồng byte có thứ tự**. TCP không giữ ranh giới thông điệp của ứng dụng. Nếu client gọi write hai lần, server không được giả định sẽ đọc đúng hai lần tương ứng. Ứng dụng phải tự có cơ chế đóng khung (framing) như newline, length-prefix hoặc protocol có cấu trúc.

Với UDP, ứng dụng làm việc với **datagram**. Mỗi datagram giữ ranh giới riêng, nhưng UDP không cung cấp cùng mức bảo đảm như TCP về giao nhận (delivery) hay thứ tự (ordering). Nếu cần độ tin cậy cao hơn, ứng dụng/protocol phải tự thiết kế phần đó.

Các API mức cao thêm ngữ nghĩa mới:

~~~text
TCP byte stream
    ↑
HTTP request / response

TCP connection
    ↑
WebSocket messages
~~~

Vì vậy “gửi dữ liệu qua mạng” không phải lúc nào cũng là cùng một thao tác. Trước khi chọn API, hãy xác định ứng dụng cần **byte stream, datagram, request/response hay hội thoại hướng thông điệp**. Chọn sai mô hình dữ liệu thường khiến framing, retry và vòng đời phức tạp hơn cần thiết.
