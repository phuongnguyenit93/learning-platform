CertPathValidator thực hiện validation của certification path theo algorithm như PKIX.

~~~java
CertPathValidator validator = CertPathValidator.getInstance("PKIX");
PKIXParameters params = new PKIXParameters(trustAnchors);
params.setRevocationEnabled(true);

CertPathValidatorResult result =
        validator.validate(certPath, params);
~~~

Validation trả lời câu hỏi “path này có dẫn tới trust anchor được cấu hình và thỏa chính sách không?”. `TrustAnchor` là input riêng trong `PKIXParameters`; kết quả PKIX cũng trả trust anchor riêng với `CertPath`. Validation này không tự trả lời “hostname api.example.com có khớp certificate này không?”; endpoint identity là bước riêng.

Trust anchor là đầu vào chính sách cục bộ. Nếu kẻ tấn công có thể thay truststore và thêm CA của họ, cryptographic validation vẫn có thể pass theo chính sách đã bị thay đổi.
