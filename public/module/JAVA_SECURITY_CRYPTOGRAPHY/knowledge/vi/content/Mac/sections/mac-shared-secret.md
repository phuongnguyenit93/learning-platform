Shared secret là nền tảng trust của MAC. Hai service A và B có cùng HMAC key thì A có thể verify message từ B, nhưng A cũng có thể tự tạo một message/tag trông như đến từ B.

Điều này phù hợp khi trust domain đã chấp nhận shared authority, ví dụ hai internal components cùng giữ integration key. Nó không phù hợp khi verifier phải **không có khả năng giả mạo signer**; khi đó asymmetric signature thường hợp lý hơn.

Key phải có entropy và size phù hợp với MAC algorithm. Không nên dùng trực tiếp password người dùng làm HMAC key; nếu source là password, derive key trước bằng cơ chế password-based phù hợp.
