**Keystore** và **truststore** thường là tên theo **vai trò sử dụng**, không phải hai Java type hoặc hai format bắt buộc khác nhau.

- local identity store thường chứa PrivateKeyEntry + certificate chain;
- trust store thường chứa TrustedCertificateEntry đại diện trust anchors/accepted issuers.

Cả hai có thể cùng là PKCS12 KeyStore instance. JSSE KeyManager đọc local credentials; TrustManager đọc trust material.

Tách file/store riêng thường giúp operations và least privilege rõ hơn, nhưng đó là triển khai design. Đừng suy từ extension file rằng content chắc chắn có role nào; hãy inspect entry types và configuration.
KeyStore cho biết material được lưu ở đâu và theo entry role nào; để quyết định một public key/certificate có đáng tin hay không, cần chuyển sang certificate path và trust validation.
