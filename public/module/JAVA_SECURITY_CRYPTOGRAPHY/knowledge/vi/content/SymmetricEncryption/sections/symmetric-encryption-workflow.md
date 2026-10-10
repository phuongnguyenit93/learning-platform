Luồng xử lý tổng quát của Cipher:

~~~java
Cipher cipher = Cipher.getInstance(transformation);
cipher.init(Cipher.ENCRYPT_MODE, key, parameters);
byte[] ciphertext = cipher.doFinal(plaintext);

Cipher decryptor = Cipher.getInstance(transformation);
decryptor.init(Cipher.DECRYPT_MODE, key, parameters);
byte[] recovered = decryptor.doFinal(ciphertext);
~~~

Không hard-code ví dụ này thành công thức cho môi trường thực tế nếu transformation/parameters chưa được protocol quy định.

Cipher có state và init mode cụ thể. Một instance đã init cho encryption không phải immutable service để share tùy ý giữa threads.

Quan trọng hơn, decrypt thành công không luôn đồng nghĩa ciphertext đáng tin. Với unauthenticated encryption, dữ liệu có thể bị biến đổi. Chapter AEAD sẽ thêm authentication tag để biến việc chỉnh sửa thành **lỗi xác minh**.
Symmetric encryption hiệu quả cho payload nhưng đặt ra bài toán phân phối/bảo vệ shared key; asymmetric encryption bổ sung một mô hình key khác để giải quyết các flow phù hợp.
