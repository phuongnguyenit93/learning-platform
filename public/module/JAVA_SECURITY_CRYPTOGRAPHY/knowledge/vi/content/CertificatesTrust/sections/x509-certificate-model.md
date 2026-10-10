X.509 certificate gắn **public key** với một subject/identity claim và metadata như issuer, validity period, extensions. Certificate được issuer ký để verifier có thể kiểm tra binding đó theo trust model.

Certificate không chứa private key. Private key thường nằm ở PrivateKeyEntry riêng; certificate có thể phân phối công khai.

Trong Java, X509Certificate cung cấp API đọc subject/issuer, validity, public key, key usage, SAN và extensions.

Điểm quan trọng: “certificate parse được” không có nghĩa “certificate trusted”. Parsing chỉ tạo object; trust cần certification-path validation với trust anchors và chính sách.
