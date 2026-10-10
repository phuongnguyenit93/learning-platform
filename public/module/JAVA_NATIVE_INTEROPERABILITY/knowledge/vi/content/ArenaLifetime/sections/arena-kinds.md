Java 21 cung cấp bốn kiểu arena với trade-off lifetime/thread khác nhau.

| Arena | Lifetime | Close thủ công | Truy cập nhiều luồng |
| --- | --- | --- | --- |
| Arena.global() | không giới hạn | không | có |
| Arena.ofAuto() | GC quản lý | không | có |
| Arena.ofConfined() | có giới hạn | có | không |
| Arena.ofShared() | có giới hạn | có | có |

**Global arena** phù hợp với tài nguyên thực sự sống suốt process, nhưng rất dễ biến thành leak nếu dùng chỉ vì tiện.

**Automatic arena** để runtime quyết định thời điểm giải phóng sau khi arena/segment không còn reachable; nó không phù hợp khi cần giải phóng đúng thời điểm xác định.

**Confined arena** là lựa chọn tốt mặc định cho tác vụ một luồng vì ownership và thời điểm close rõ. **Shared arena** dùng khi nhiều luồng thực sự cần truy cập cùng segment và ứng dụng đã có chiến lược đồng bộ hóa.
