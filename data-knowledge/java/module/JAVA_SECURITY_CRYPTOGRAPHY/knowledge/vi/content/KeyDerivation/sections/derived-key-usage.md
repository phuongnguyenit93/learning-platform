Khóa đã dẫn xuất nên có **mục đích rõ ràng**. Dùng cùng key bytes cho nhiều primitive/context có thể tạo liên kết không mong muốn giữa các giả định của protocol.

Nếu protocol cần nhiều key, nên dùng thiết kế derivation/key separation mà specification đã xác định thay vì tự cắt hoặc hash bytes tùy ý.

Salt và KDF parameters phải đi cùng dữ liệu để mã trong tương lai biết cách dẫn xuất lại. Password thì không được lưu cạnh ciphertext dưới dạng plaintext.

Cuối cùng, password-based derivation không biến password yếu thành secret có entropy cao. Nó chỉ làm việc đoán offline trở nên tốn kém hơn. Chất lượng password, rate limiting, MFA và chính sách thông tin xác thực nằm ngoài primitive này nhưng vẫn ảnh hưởng bảo mật toàn hệ thống.
Key được generate hoặc derive cuối cùng vẫn cần được nạp, lưu và bảo vệ theo vòng đời; đó là vai trò của KeyStore.
