Với phần lớn ứng dụng, new SecureRandom() là điểm bắt đầu hợp lý vì JCA chọn phần triển khai từ provider preference. Khi chính sách bắt buộc một algorithm/provider cụ thể, có thể dùng SecureRandom.getInstance(...).

SecureRandom.getInstanceStrong() yêu cầu một phần triển khai được cấu hình là “strong” cho platform, nhưng “strong” không đồng nghĩa luôn phù hợp hơn cho mọi request path. Một phần triển khai có thể có hành vi về entropy acquisition hoặc latency khác, nên không nên gọi nó theo thói quen trong hot path.

Nguyên tắc thực tế:

- dùng SecureRandom, không dùng Random cho secret;
- reuse instance khi phù hợp thay vì tạo mới liên tục chỉ để “ngẫu nhiên hơn”;
- để provider/JDK quản lý seeding trừ khi protocol có yêu cầu riêng;
- benchmark và quan sát nếu workload tạo lượng lớn random bytes.
