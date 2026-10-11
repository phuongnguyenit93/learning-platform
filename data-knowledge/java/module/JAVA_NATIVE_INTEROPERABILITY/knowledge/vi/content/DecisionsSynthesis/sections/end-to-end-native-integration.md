Một native integration end-to-end nên được thiết kế theo chuỗi contract thay vì bắt đầu ngay từ một call API.

~~~text
1. Xác định khả năng native cần dùng
        ↓
2. Chọn JNI hoặc FFM
        ↓
3. Chốt library + platform + ABI
        ↓
4. Chốt data layout / signature
        ↓
5. Thiết kế ownership + lifetime
        ↓
6. Thiết kế call/callback + thread boundary
        ↓
7. Chuyển đổi lỗi
        ↓
8. Đóng gói, kiểm thử và giải phóng tài nguyên
~~~

Mỗi bước nên có bằng chứng kiểm thử. Ví dụ: xác minh symbol tồn tại, assert layout size/offset, test callback sau nhiều lần đăng ký/hủy, test shutdown và test trên từng architecture được hỗ trợ.

Khi một integration khó gỡ lỗi, quay lại chuỗi trên giúp xác định lỗi thuộc loading, ABI, data, lifetime hay concurrency thay vì xem toàn bộ native side như một “hộp đen”.
