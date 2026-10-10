Ba lớp khái niệm cần tách rõ:

- **engine class** là API mà ứng dụng gọi, ví dụ Signature hoặc Cipher;
- **SPI** là hợp đồng dành cho cách triển khai của provider, ví dụ SignatureSpi hoặc CipherSpi;
- **Provider** đăng ký các cách triển khai dịch vụ mà runtime có thể lựa chọn.

~~~text
ứng dụng
    ↓
engine class
    ↓
JCA service lookup
    ↓
Provider
    ↓
phần triển khai SPI
~~~

Ứng dụng thông thường không tự triển khai SPI. Việc viết custom provider là một bài toán extensibility chuyên biệt và chỉ cần khi tích hợp cách triển khai, phần cứng hoặc dịch vụ đặc thù.

Tách engine khỏi SPI giúp mã ứng dụng giữ ổn định trong khi provider có thể thay đổi theo JDK, hệ điều hành hoặc chính sách triển khai.
