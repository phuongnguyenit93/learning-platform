Ba loại entry quan trọng:

- **PrivateKeyEntry**: private key kèm certificate chain tương ứng;
- **SecretKeyEntry**: symmetric secret key;
- **TrustedCertificateEntry**: certificate được lưu như trust material, không kèm private key.

Phân biệt entry type giúp tránh lỗi “có alias nên chắc lấy được private key”. Cùng KeyStore có thể chứa nhiều role khác nhau.

~~~java
KeyStore.Entry entry = keyStore.getEntry(
        alias,
        new KeyStore.PasswordProtection(entryPassword)
);
~~~

Code nên kiểm tra expected entry type và fail rõ nếu triển khai cung cấp alias sai. Không cast mù rồi biến misconfiguration thành ClassCastException khó hiểu.
