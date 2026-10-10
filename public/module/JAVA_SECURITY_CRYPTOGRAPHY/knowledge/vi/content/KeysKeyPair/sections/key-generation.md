**Generator tạo key material mới**, khác với factory dựng object từ material đã có.

Với symmetric key, KeyGenerator là abstraction chính:

~~~java
KeyGenerator generator = KeyGenerator.getInstance("AES");
generator.init(256);
SecretKey key = generator.generateKey();
~~~

Với asymmetric key pair, dùng KeyPairGenerator:

~~~java
KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
generator.initialize(2048);
KeyPair pair = generator.generateKeyPair();
~~~

Các con số/algorithm ở ví dụ chỉ minh họa API shape; môi trường thực tế phải theo chính sách bảo mật hiện hành và protocol requirement.

Generator thường dùng SecureRandom từ provider hoặc instance được truyền vào. Vì vậy randomness chapter đứng trước key generation: key algorithm mạnh vẫn mất ý nghĩa nếu key material có thể đoán được.
