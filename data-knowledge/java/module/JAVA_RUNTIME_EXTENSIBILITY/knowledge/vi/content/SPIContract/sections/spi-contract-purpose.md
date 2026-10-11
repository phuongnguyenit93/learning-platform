SPI (Service Provider Interface) là contract mà host công bố để các provider triển khai capability có thể cắm vào hệ thống.

Điểm quan trọng không nằm ở tên “SPI”, mà ở dependency direction:

```text
host ────────┐
             ↓
        service contract
             ↑
provider ────┘
```

Host và provider cùng phụ thuộc vào contract; host không phụ thuộc trực tiếp vào implementation.

Không có contract ổn định, “plugin” chỉ là một class được load động nhưng vẫn coupling mạnh vào chi tiết implementation. Contract tạo ra vocabulary chung để hai phía phát triển độc lập.

Một SPI tốt nên nói rõ:

- capability nào provider cung cấp;
- input/output nào là ổn định;
- error semantics nào host phải xử lý;
- provider có state/lifecycle hay không;
- host được phép giả định điều gì về thread safety, resource ownership và compatibility.

Do đó SPI là **architecture boundary**, không chỉ là một interface để `ServiceLoader` có thứ để load.
