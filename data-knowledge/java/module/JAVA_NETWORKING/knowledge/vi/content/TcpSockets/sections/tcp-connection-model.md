TCP cung cấp một **kết nối hai chiều theo luồng byte** giữa hai endpoint. Trong Java, `Socket` biểu diễn một đầu của kết nối đó; phía server dùng `ServerSocket` để chờ kết nối mới. Khi một client kết nối thành công, server không đọc/ghi trực tiếp trên `ServerSocket`: `accept()` trả về một `Socket` mới dành riêng cho kết nối với client đó.

Có thể hình dung quan hệ như sau:

```text
Socket phía client  <====== kết nối TCP ======>  Socket đã được accept
                                                      ^
                                                      |
                                                ServerSocket
                                             bind + chờ trong accept()
```

Điểm quan trọng là TCP nhìn dữ liệu như một chuỗi byte có thứ tự. API `Socket` đưa chuỗi byte này ra dưới dạng `InputStream` và `OutputStream`, nhưng TCP không biết đâu là "request", "record" hay "message" của ứng dụng. Ranh giới dữ liệu phải do protocol ở tầng ứng dụng quy định.

Một kết nối đã được thiết lập có hai endpoint đầy đủ: địa chỉ/cổng local và địa chỉ/cổng remote. Vì vậy một server có thể dùng cùng một cổng lắng nghe để phục vụ nhiều client, trong khi mỗi `Socket` được chấp nhận vẫn đại diện cho một kết nối riêng biệt.
