Vòng đời đơn giản:

```text
1. JVM gặp invokedynamic instruction chưa được link
        ↓
2. Resolve bootstrap method + bootstrap arguments
        ↓
3. Invoke bootstrap
        ↓
4. Bootstrap trả CallSite
        ↓
5. JVM kiểm tra CallSite type
        ↓
6. Instruction được link với CallSite
        ↓
7. Invocation dispatch qua target hiện tại của CallSite
```

Bootstrap có thể được JVM thực thi lazily khi instruction lần đầu cần link. Đây là lý do “bootstrap chạy mỗi lần invoke” là sai.

Nếu nhiều thread cùng chạm tới một call site chưa link, bootstrap **có thể được gọi đồng thời nhiều lần**. JVM chỉ cài đặt một kết quả; các lần gọi bootstrap còn lại có thể hoàn tất nhưng kết quả của chúng bị bỏ qua. Vì vậy bootstrap có đọc/ghi trạng thái dùng chung vẫn phải an toàn thread.

Sau linkage, nếu CallSite mutable đổi target, instruction vẫn giữ CallSite đã link; chỉ target được dispatch thay đổi. Mỗi `invokedynamic` instruction chỉ chuyển từ unlinked sang linked tối đa một lần, dù bootstrap có thể chủ động trả cùng một `CallSite` object cho nhiều instruction khác nhau.
