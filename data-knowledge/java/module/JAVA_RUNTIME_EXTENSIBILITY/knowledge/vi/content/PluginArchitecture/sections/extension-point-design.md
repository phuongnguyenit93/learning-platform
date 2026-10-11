Extension point là vị trí có chủ đích nơi host cho phép behavior bên ngoài tham gia.

Ví dụ `ReportExporter` là extension point nếu host cho phép provider mới bổ sung format export mà không sửa host.

Một extension point tốt cần rõ:

- capability nào được mở rộng;
- khi nào host gọi plugin;
- input/output contract;
- error semantics;
- concurrency/lifecycle expectation;
- resource ownership;
- compatibility/version expectation.

Không nên biến mọi interface thành extension point. Interface nội bộ phục vụ implementation decomposition khác với public plugin boundary.

Nếu contract quá rộng, provider phải hiểu quá nhiều host internals. Nếu quá nhỏ, host phải dùng cast/reflection hoặc side channel để lấy capability thật.

Thiết kế extension point là cân bằng giữa **ổn định boundary** và **đủ expressiveness** cho provider thực tế.
