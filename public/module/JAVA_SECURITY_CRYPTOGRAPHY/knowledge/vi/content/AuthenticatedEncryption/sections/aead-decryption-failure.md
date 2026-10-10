Khi tag không hợp lệ, decryption phải được xem là **lỗi xác thực**, không phải “dữ liệu hơi lỗi”.

Java có thể báo AEADBadTagException từ doFinal khi verification fail. Ứng dụng không nên:

- trả partial plaintext cho business logic trước khi authentication hoàn tất;
- retry với algorithm/key yếu hơn;
- log secret key/plaintext để debug;
- phân biệt quá chi tiết lỗi ra untrusted caller nếu điều đó tạo oracle.

~~~java
try {
    byte[] plaintext = decryptor.doFinal(ciphertextAndTag);
    // chỉ dùng plaintext sau khi doFinal thành công
} catch (AEADBadTagException ex) {
    // reject record/message
}
~~~

Ngữ nghĩa của trạng thái lỗi là một phần của thiết kế bảo mật, không chỉ là xử lý ngoại lệ.
AEAD giả định hai phía đã có symmetric key phù hợp; câu hỏi tiếp theo là làm thế nào các bên thiết lập shared secret đó một cách có cấu trúc.
