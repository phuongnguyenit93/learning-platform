Trong JCA/JCE, password-based derivation thường đi qua **SecretKeyFactory + PBEKeySpec**:

~~~java
SecretKeyFactory factory =
        SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

PBEKeySpec spec =
        new PBEKeySpec(password, salt, iterations, 256);

byte[] derived;
try {
    derived = factory.generateSecret(spec).getEncoded();
} finally {
    spec.clearPassword();
}
~~~

Tên thuật toán trong ví dụ là một lựa chọn provider phổ biến, không phải lời khuyên cố định cho mọi chính sách. Hệ thống phải chọn KDF và parameters theo threat model, yêu cầu compliance và mục tiêu hiệu năng hiện tại.

Nếu derived bytes được dùng làm AES key, có thể cần chuyển chúng thành cách biểu diễn khóa phù hợp. Cần ghi rõ encoding, độ dài và mục đích để các bên không dẫn xuất ra vật liệu khác nhau.
