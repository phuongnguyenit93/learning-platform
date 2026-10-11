KeyStore là abstraction của Java để lưu/truy xuất **key entry và certificate entry** qua một store type/provider. Nó không chỉ đồng nghĩa với một file .jks.

~~~java
KeyStore keyStore = KeyStore.getInstance("PKCS12");
try (InputStream in = Files.newInputStream(path)) {
    keyStore.load(in, storePassword);
}
~~~

Store có thể là file-based hoặc được provider ánh xạ tới nguồn khác. Ứng dụng nên phụ thuộc vào KeyStore contract và triển khai configuration hơn là giả định mọi môi trường dùng cùng format.

KeyStore giúp gom key/certificate material vào một API quản lý, nhưng không tự giải quyết chính sách xoay vòng khóa, kiểm soát truy cập của filesystem/HSM hay việc phân phối secret.
