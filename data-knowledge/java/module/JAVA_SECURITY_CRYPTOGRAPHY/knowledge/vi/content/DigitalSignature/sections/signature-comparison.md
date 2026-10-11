Signature không phải “encryption bằng private key”. Đây là hai phép toán bảo mật khác nhau dù một số hệ mật mã dùng cùng họ key.

- **signature**: private key tạo proof, public key verify; mục tiêu authenticity/integrity;
- **asymmetric encryption**: thường public key bảo vệ secret/data để private key holder decrypt; mục tiêu confidentiality;
- **MAC**: shared secret vừa tạo vừa verify.

Cách nói “encrypt with private key” dễ dẫn đến protocol design sai và bỏ qua encoding/padding/signature-scheme semantics thực sự.

Nếu cần vừa bí mật vừa có signer identity, hãy dùng protocol kết hợp các primitive theo chuẩn, không thay signature bằng một thao tác Cipher đảo chiều tùy ý.
Signature giải quyết authenticity nhưng không che nội dung; từ đây module chuyển sang confidentiality, bắt đầu bằng symmetric encryption.
