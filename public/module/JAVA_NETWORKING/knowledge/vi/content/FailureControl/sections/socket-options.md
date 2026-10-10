Socket options là các điều khiển hoặc gợi ý mà Java chuyển xuống networking stack của hệ điều hành. Chúng ảnh hưởng hành vi của socket nhưng không nên được chỉnh chỉ vì “mã production thường có”.

Một số option quen thuộc:

- TCP_NODELAY: ảnh hưởng việc trì hoãn/coalesce packet nhỏ của TCP;
- SO_KEEPALIVE: yêu cầu TCP keepalive ở mức transport;
- SO_SNDBUF / SO_RCVBUF: gợi ý cho kích thước buffer;
- SO_REUSEADDR: ảnh hưởng khả năng tái sử dụng địa chỉ local trong các tình huống phụ thuộc platform;
- SO_LINGER: thay đổi hành vi của close đối với dữ liệu TCP chưa gửi hết;
- SO_BROADCAST: cho phép UDP broadcast.

NetworkChannel hiện đại còn có API type-safe:

~~~java
channel.setOption(StandardSocketOptions.SO_KEEPALIVE, true);
~~~

Một option có thể chỉ là **gợi ý**, hoặc có ngữ nghĩa khác nhau đôi chút giữa các hệ điều hành. Hãy đo và hiểu vấn đề trước khi tuning. Socket option không thay thế timeout, retry hay health-check ở tầng ứng dụng.
