Runtime Diagnostics chỉ đi đủ sâu để xác định rằng failure liên quan ranh giới Java ↔ native. Khi bằng chứng bắt đầu yêu cầu kiến thức về JNI contract, native library loading, ABI, vòng đời pointer/memory hoặc FFM, hãy chuyển sang module **Native Interoperability**.

Dấu hiệu nên chuyển module thường gặp:

- fatal error log chỉ vào frame trong thư viện native của ứng dụng;
- crash xảy ra trong JNI call hoặc callback;
- core dump cho thấy native stack hoặc memory corruption;
- RSS tăng nhưng Java heap và JVM-internal NMT không giải thích được;
- lỗi phụ thuộc architecture, native symbol hoặc phiên bản thư viện.

Runtime Diagnostics vẫn cung cấp “bằng chứng đầu vào”: PID, timestamp, hs_err, core, stack, JFR và danh sách thư viện. Native Interoperability chịu trách nhiệm giải thích ngữ nghĩa của JNI/FFM/native memory.

Không chuyển module chỉ vì stack có một native frame. Nhiều thao tác JDK hợp lệ đi qua native code; cần đối chiếu với ngữ cảnh failure trước.
