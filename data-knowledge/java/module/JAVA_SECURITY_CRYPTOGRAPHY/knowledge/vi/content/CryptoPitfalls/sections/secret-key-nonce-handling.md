Nhiều lỗi bảo mật không đến từ primitive mà từ **vòng đời của vật liệu bảo mật**:

- secret hard-code trong source/config public;
- key được log hoặc serialize;
- password nằm trong immutable String quá lâu;
- nonce reuse dưới cùng AEAD key;
- fixed salt cho mọi credential;
- một key dùng lại cho nhiều mục đích mà protocol không cho phép.

Hãy phân loại dữ liệu:

~~~text
secret: private key, symmetric key, password
non-secret nhưng security-relevant: certificate, salt, IV/nonce
public protocol metadata: algorithm/version identifiers
~~~

“Public” không nghĩa “không quan trọng”: nonce/salt vẫn phải đúng uniqueness/randomness contract dù không cần confidentiality.
