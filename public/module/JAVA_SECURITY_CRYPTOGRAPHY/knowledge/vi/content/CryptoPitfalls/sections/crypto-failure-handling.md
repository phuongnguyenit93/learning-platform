Lỗi bảo mật không nên được biến thành fallback làm yếu bảo đảm.

Ví dụ cần reject khi:

- AEAD tag fail;
- signature/MAC verify false;
- certificate path hoặc endpoint identity fail;
- algorithm/key bị security constraint chặn;
- required provider/service không tồn tại.

Không retry bằng “NoPadding”, trust-all manager, disabled hostname verification hoặc legacy protocol chỉ để phép toán thành công.

Logging cũng cần thận trọng: log context, algorithm, alias, certificate subject/fingerprint khi phù hợp; không log plaintext secret, raw key, password hoặc full token.

Fail closed không có nghĩa crash vô tổ chức. Hãy chuyển lỗi thành domain/security error rõ ràng và quan sát được.
