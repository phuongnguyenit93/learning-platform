Java Cryptography Architecture (JCA) cung cấp một lớp API chung cho các dịch vụ bảo mật và mật mã. Ứng dụng thường làm việc với các **engine class** như MessageDigest, Signature, SecureRandom, KeyStore; JCE mở rộng cùng mô hình cho Cipher, Mac, KeyAgreement, KeyGenerator, SecretKeyFactory và các dịch vụ crypto khác.

Thay vì ứng dụng tự `new` một cách triển khai cụ thể, mã thường yêu cầu một dịch vụ bằng tên thuật toán:

~~~java
MessageDigest digest = MessageDigest.getInstance("SHA-256");
~~~

JCA sau đó tìm cách triển khai qua các security `Provider` đã đăng ký. Nhờ vậy mã ứng dụng có thể phụ thuộc vào **hợp đồng dịch vụ + tên thuật toán** thay vì phụ thuộc trực tiếp vào một cách triển khai của nhà cung cấp cụ thể.

Đây là lý do provider model thuộc module này: nó quyết định Java biến một yêu cầu mật mã trừu tượng thành phần triển khai thực tế lúc chạy.
