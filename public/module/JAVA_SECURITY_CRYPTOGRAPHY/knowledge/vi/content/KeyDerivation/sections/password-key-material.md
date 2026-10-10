Password là **đầu vào do con người chọn**, không phải cryptographic key đã sẵn sàng.

Java `PBEKeySpec` dùng `char[]` thay vì `String` để ứng dụng có cơ hội ghi đè password sau khi dùng. Constructor tạo bản sao nội bộ của password; `clearPassword()` xóa bản sao đó, còn mảng gốc vẫn do bên gọi quản lý.

~~~java
char[] password = ...;
PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, keyLength);
try {
    // derive key
} finally {
    spec.clearPassword();
    Arrays.fill(password, '\0');
}
~~~

Việc xóa dữ liệu nhạy cảm là thói quen tốt nhưng không bảo đảm rằng chưa từng có bản sao nào tồn tại trong stack, provider hoặc runtime. Mục tiêu là giảm thời gian dữ liệu tồn tại không cần thiết, không hứa “xóa tuyệt đối khỏi memory”.
