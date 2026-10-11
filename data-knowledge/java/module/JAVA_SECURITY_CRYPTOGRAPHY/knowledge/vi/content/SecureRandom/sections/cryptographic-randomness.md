Nhiều primitive chỉ an toàn khi một số giá trị **khó dự đoán**: key mới, salt, nonce ngẫu nhiên trong những mode yêu cầu random nonce, challenge hoặc token bảo mật.

java.util.Random có thể phù hợp cho simulation hoặc test data nhưng không cung cấp security contract đó. SecureRandom được thiết kế như cryptographically strong RNG.

Điểm cần nhớ không phải “số nhìn có vẻ ngẫu nhiên”, mà là kẻ tấn công không thể thực tế dự đoán đầu ra tiếp theo từ những gì đã quan sát.

~~~java
SecureRandom random = new SecureRandom();
byte[] bytes = new byte[32];
random.nextBytes(bytes);
~~~

Khi một Java crypto API nhận `SecureRandom` trong thao tác khởi tạo hoặc sinh dữ liệu, hãy để provider sử dụng nguồn ngẫu nhiên an toàn phù hợp trừ khi protocol yêu cầu truyền instance cụ thể.
