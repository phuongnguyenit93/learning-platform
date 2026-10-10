Cách ghi nhớ:

```text
nguồn entropy
    ↓
seed / trạng thái nội bộ khó đoán
    ↓
PRNG dùng cho mật mã
    ↓
đầu ra khó dự đoán
```

### Quy tắc mặc định cho ứng dụng

Trong mã ứng dụng thông thường:

```java
SecureRandom secureRandom = new SecureRandom();
```

rồi để nền tảng/nhà cung cấp bảo mật (provider) quản lý việc khởi tạo seed thường an toàn hơn tự tạo seed.

### Lỗi thường gặp: tự cấp seed yếu

```java
SecureRandom secureRandom = new SecureRandom();
secureRandom.setSeed(System.currentTimeMillis()); // đừng dùng timestamp như nguồn entropy chính
```

Điểm quan trọng: `setSeed` **bổ sung** vào seed/trạng thái đã có, nên gọi lặp lại không tự làm giảm tính ngẫu nhiên của một đối tượng đã được khởi tạo seed tốt. Nhưng với PRNG `SecureRandom` mới tạo, nếu gọi `setSeed` **trước lần `nextBytes`/`reseed` đầu tiên**, phần triển khai sẽ không thực hiện tự khởi tạo seed; lúc đó bên gọi phải bảo đảm seed cung cấp đủ entropy.

Vì vậy mốc thời gian hoặc đầu ra từ `Random` thông thường không nên được dùng làm nguồn entropy chính để khởi tạo bộ sinh dùng cho mục đích nhạy cảm về bảo mật.

Không nên suy luận:

```text
lớp SecureRandom
→ mọi seed đều tự động an toàn
```

Thuộc tính bảo mật phụ thuộc vào toàn bộ vòng đời entropy/trạng thái, không chỉ tên lớp.

### `getInstanceStrong` không phải mặc định bắt buộc

`SecureRandom.getInstanceStrong()` có thể chọn thuật toán/nhà cung cấp bảo mật (provider) với các đặc tính mạnh hơn tùy nền tảng, nhưng có thể có độ trễ, khả năng chặn hoặc đặc tính vận hành khác.

Quy tắc thực tế:

```text
SecureRandom mặc định
→ thường đủ cho trường hợp sử dụng của ứng dụng

getInstanceStrong()
→ chỉ dùng khi yêu cầu cụ thể cần đặc tính đó
```
