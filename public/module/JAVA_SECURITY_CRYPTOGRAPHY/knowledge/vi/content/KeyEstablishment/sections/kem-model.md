Java 21 có KEM API cho Key Encapsulation Mechanism. Mental model khác KeyAgreement:

~~~text
receiver có public/private key pair

sender:
public key
  ↓ encapsulate
secret key + encapsulation message

receiver:
private key + encapsulation message
  ↓ decapsulate
same secret key
~~~

Encapsulation message có thể truyền công khai; private key cho phép receiver recover secret. Flow Java 21 có hình dạng trực tiếp:

~~~java
KEM kem = KEM.getInstance("DHKEM");

KEM.Encapsulated encapsulated =
        kem.newEncapsulator(receiverPublicKey).encapsulate();

SecretKey senderSecret = encapsulated.key();
byte[] message = encapsulated.encapsulation();

SecretKey receiverSecret =
        kem.newDecapsulator(receiverPrivateKey).decapsulate(message);
~~~

`encapsulate()` mặc định trả một `SecretKey` mang algorithm name `Generic`; secret này thường được đưa tiếp vào KDF/key schedule của protocol. Concrete KEM algorithm và provider support vẫn phải theo protocol bạn triển khai.

KEM đặc biệt hữu ích khi protocol được thiết kế quanh cơ chế encapsulation thay vì interactive agreement. Nếu không khóa provider ở `KEM.getInstance(...)`, Java 21 còn cho phép provider được lựa chọn khi tạo encapsulator/decapsulator dựa trên key và parameter tương ứng; không nên giả định chỉ việc tạo `KEM` object đã cố định provider cho mọi phép toán.
