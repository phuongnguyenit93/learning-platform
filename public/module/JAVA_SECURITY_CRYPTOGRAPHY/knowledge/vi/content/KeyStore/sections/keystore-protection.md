KeyStore có hai lớp password concept thường bị nhầm:

- **store password** dùng khi load/store một số store format;
- **entry protection** có thể bảo vệ private/secret key entry riêng.

Không nên mặc định chúng luôn giống nhau hoặc luôn tồn tại theo cùng semantics ở mọi provider.

Khi ghi store ra file, bảo vệ file permissions, backup và triển khai secret vẫn là trách nhiệm hệ thống. Password hard-code trong source code chỉ chuyển secret từ “keystore” sang một nơi yếu hơn.

Với môi trường thực tế, KeyStore API có thể là boundary để kết nối PKCS#11/HSM provider, nơi private key không nhất thiết export ra ứng dụng memory.
