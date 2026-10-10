Version negotiation xảy ra khi host và plugin cần xác định chúng có thể làm việc cùng nhau ở mức capability nào.

Một contract đơn giản có thể expose version:

```java
interface PluginDescriptor {
    int apiMajor();
    int apiMinor();
}
```

Host có thể áp dụng chính sách:

```text
major khác
→ reject

major giống, minor thấp hơn
→ cho phép nếu capability bắt buộc vẫn có
```

Nhưng version number tự nó không đủ. Hai plugin cùng `2.1` vẫn có thể khác capability hoặc yêu cầu cấu hình.

Vì vậy negotiation thường tốt hơn khi kết hợp:

```text
contract version
+ capability set
+ environment constraint
+ chính sách của host
```

Validation nên diễn ra trước activation để tránh plugin chỉ fail khi request đầu tiên đi vào.

Cách biểu diễn version (SemVer hay scheme riêng) là quyết định của ứng dụng; Java platform không cung cấp một chính sách host-plugin negotiation dùng chung cho mọi hệ thống.
