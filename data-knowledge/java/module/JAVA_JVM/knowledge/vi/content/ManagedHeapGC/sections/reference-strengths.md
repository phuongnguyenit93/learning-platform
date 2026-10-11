Ngoài strong reference thông thường, Java cung cấp `SoftReference`, `WeakReference` và `PhantomReference` để ứng dụng phối hợp với reachability/GC ở các use case chuyên biệt.

- **Strong**: giữ object strongly reachable theo graph thông thường.
- **Soft**: collector có thể clear khi memory pressure; thường được mô tả cho memory-sensitive cache nhưng không nên dùng như cache policy chính xác.
- **Weak**: không giữ referent sống chỉ vì weak reference tồn tại; hữu ích cho canonicalizing mapping/association có ownership yếu.
- **Phantom**: dùng để quan sát post-mortem cleanup/lifecycle; `get()` luôn trả `null`.

Các reference object được implementation phối hợp chặt với GC. Đây là công cụ nâng cao; nếu chỉ cần ownership rõ ràng, strong reference + lifecycle tường minh thường đơn giản hơn.
