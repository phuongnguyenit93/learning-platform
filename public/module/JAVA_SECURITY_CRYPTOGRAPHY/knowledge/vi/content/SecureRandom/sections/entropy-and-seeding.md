PRNG thường mở rộng một **seed** có entropy thành chuỗi đầu ra dài. Nếu seed đoán được, đầu ra có thể mất tính khó dự đoán dù thuật toán PRNG tốt.

Vì vậy không nên tự seed SecureRandom bằng timestamp, user id hoặc constant:

~~~java
// Không dùng cho bảo mật ở môi trường thực tế.
SecureRandom bad = new SecureRandom();
bad.setSeed(123456789L);
~~~

Với `SecureRandom` dựa trên PRNG, lần sinh đầu ra đầu tiên thường buộc object tự seed từ nguồn entropy của phần triển khai. Nhưng có một chi tiết quan trọng: nếu gọi `setSeed(...)` **trước** `nextBytes(...)` hoặc `reseed(...)`, PRNG không còn tự seed theo bước đó; bên gọi phải bảo đảm seed tự cung cấp có đủ entropy. Sau khi object đã được seed, `setSeed(...)` bổ sung seed material thay vì làm giảm độ ngẫu nhiên hiện có.

Vì vậy không nên “chủ động seed cho chắc” bằng timestamp, user id hay constant. Với code ứng dụng thông thường, để JDK/provider quản lý seeding an toàn hơn việc tự tạo seed dự đoán được.

Trong test cần reproducibility, hãy tách test seam khỏi luồng bảo mật ở môi trường thực tế thay vì làm RNG ở môi trường thực tế trở nên deterministic.
