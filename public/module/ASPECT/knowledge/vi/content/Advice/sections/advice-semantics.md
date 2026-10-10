```text
@Before
→ chạy trước target invocation

@AfterReturning
→ chỉ chạy khi target return bình thường

@AfterThrowing
→ chỉ chạy khi target thoát ra bằng exception phù hợp

@After
→ finally-like semantics, chạy khi invocation kết thúc dù success hay exception
```

Không nên hiểu `@After` là "chỉ chạy sau khi thành công".

Mỗi advice type cũng có mức quyền kiểm soát khác nhau:

```text
@Before
→ chạy trước invocation; không có proceed() để chủ động skip target
→ nhưng nếu chính advice throw exception thì chain dừng

@AfterReturning
→ quan sát return value của success path
→ không thay thế return value như @Around

@AfterThrowing
→ quan sát exception thoát ra
→ không phải recovery/control-flow API mạnh như @Around

@Around
→ có proceed() và có thể kiểm soát invocation chain
```

Nên chọn **advice yếu nhất nhưng đủ đáp ứng requirement**. Dùng `@Around` cho mọi concern sẽ trao nhiều quyền điều khiển hơn mức cần thiết và làm flow khó đọc hơn.
