Hybrid encryption kết hợp asymmetric và symmetric crypto:

~~~text
generate random content-encryption key
        ↓
encrypt payload bằng symmetric AEAD
        ↓
protect/establish content key bằng public-key mechanism
        ↓
package protected key + nonce + ciphertext + metadata
~~~

Receiver dùng phép toán private-key để lấy hoặc derive content key, rồi symmetric key decrypt payload.

Mô hình này tránh dùng phép toán public-key tốn kém cho toàn bộ dữ liệu và cho phép AEAD bảo vệ payload hiệu quả.

Không nên tự thiết kế format hybrid nếu một standard protocol/container đã tồn tại. Những chi tiết như key wrapping, context binding, algorithm identifiers và versioning ảnh hưởng đến security và interoperability.
Hybrid encryption giải quyết hiệu năng và key transport, nhưng confidentiality vẫn chưa tự bảo đảm tamper detection; bước kế tiếp là authenticated encryption/AEAD.
